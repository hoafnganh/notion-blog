import { useState, useMemo } from 'react'
import HeroSection from "@/components/hero"
import CategoryFilter from "@/components/CategoryFilter"
import getDataFromObject from "@/utils/getObject"
import { Client } from "@notionhq/client"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { SITE_TITLE, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_AUTHOR, SITE_URL } from '@/utils/config'
import { getCategoryColor } from '@/utils/categoryColors'

const NOTION_BLOG_ID = process.env.NEXT_PUBLIC_NOTION_BLOG_ID
const NOTION_KEY = process.env.NEXT_PUBLIC_NOTION_KEY

const notionClient = new Client({auth: NOTION_KEY})

export async function getAllPosts(){
  const allPosts = await notionClient.databases.query({
    database_id: NOTION_BLOG_ID,
    filter: {
      property: 'Published',
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: 'date',
        direction: 'descending',
      },
    ],
  });
  const allData = allPosts?.results?.map((post) => {
      return getDataFromObject(post)
  })
  return allData;
}

export async function getStaticProps(){
  const posts = await getAllPosts();
  return {
    props: {
      posts: posts,
    },
    revalidate: 60, // Revalidate mỗi 60 giây
  };
}

export default function Home({posts}){
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  // Tính toán số lượng bài viết theo category
  const categoryCounts = useMemo(() => {
    const counts = { All: posts?.length || 0 }
    posts?.forEach(post => {
      const category = post.category || 'Uncategorized'
      counts[category] = (counts[category] || 0) + 1
    })
    return counts
  }, [posts])
  
  // Lọc bài viết theo category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return posts
    return posts?.filter(post => post.category === selectedCategory)
  }, [posts, selectedCategory])

  return (
    <main className="min-h-screen w-full px-4 font-customfont
                     bg-[#fff6ed] dark:bg-[#1a1a1a]
                     transition-colors duration-300">
      <Head>
        <title>{SITE_TITLE}</title>
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="article" />
        <meta name="twitter:title" content={SITE_TITLE} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={SITE_URL} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="flex justify-center items-center flex-col w-full">
        <HeroSection />
        <div className="flex flex-col w-full md:w-4/5 lg:w-3/4">
          <section>
            <div className="flex flex-col space-y-4 mb-8">
              <p className="indent-4 antialiase tracking-normal leading-relaxed
                           text-stone-600 dark:text-gray-400">
                Hi, I&apos;m Duong Hoang Anh, a third-year Information Security student at the Posts and Telecommunications Institute of Technology (PTIT). 
                I&apos;m also a member of the PTIT Information Security Team, where I actively compete in CTF contests, focusing on Cryptography and Forensics.
                This blog is where I document my journey in cybersecurity—sharing CTF writeups, technical insights, and practical knowledge I&apos;ve gained through competitions and self-study. 
                I hope these posts are useful for fellow learners and CTF enthusiasts who want to sharpen their skills and think more deeply about security challenges.
              </p>
            </div>
            
            {/* Category Filter */}
            <CategoryFilter 
              categories={categoryCounts}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            
            {/* Hiển thị số bài viết đang xem */}
            <div className="mb-4 text-stone-600 dark:text-gray-400">
              Showing <span className="font-semibold text-yellow-500 dark:text-purple-400">
                {filteredPosts?.length}
              </span> post{filteredPosts?.length !== 1 ? 's' : ''}
              {selectedCategory !== 'All' && (
                <span> in <span className="font-semibold">{selectedCategory}</span></span>
              )}
            </div>
            
            {/* Blog Posts Grid */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredPosts?.map((post, index) => {
                return (
                  <li key={post.id} className="flex flex-col">
                    <Link href="/[slug]" as={`/${post?.id}`} className="group">
                      <div className="overflow-hidden rounded-xl mb-3 relative">
                        <Image
                          width={480}
                          height={270}
                          priority={index < 6}
                          src={post?.heroImage}
                          alt={post?.slug || post?.title}
                          className="rounded-xl w-full h-auto object-cover aspect-video
                                   border-2 border-yellow-200 dark:border-purple-500/50
                                   group-hover:border-yellow-400 dark:group-hover:border-purple-400
                                   group-hover:scale-105
                                   transition-all duration-300"
                        />
                        
                        
                        <span className="absolute top-2 right-2 
                                       px-3 py-1 rounded-full text-xs font-semibold
                                       bg-yellow-400 dark:bg-purple-500 
                                       text-white shadow-lg">
                          {post.category}
                        </span>
                      </div>
                      <h2 className="text-center text-base md:text-lg font-semibold 
                                    text-stone-700 dark:text-gray-200
                                    group-hover:text-yellow-500 dark:group-hover:text-purple-400
                                    transition-colors line-clamp-2 px-2">
                        {post?.title}
                      </h2>
                    </Link>
                  </li>
                );
              })}
            </ul>
            
            {/* Không có bài viết */}
            {filteredPosts?.length === 0 && (
              <div className="text-center py-12 text-stone-500 dark:text-gray-500">
                <p className="text-lg">No posts found in this category.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}