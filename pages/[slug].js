'use client'
import { useRouter } from "next/router"
import { Client } from "@notionhq/client"
import { useEffect, useState } from "react"
import { NotionToMarkdown } from "notion-to-md"
import ReactMarkdown from 'react-markdown'
import getDataFromObject from "@/utils/getObject"
import Image from "next/image"
import Head from "next/head"  // ← ĐẢM BẢO CÓ DÒNG NÀY
import remarkGfm from 'remark-gfm'
import dynamic from "next/dynamic"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { getCategoryColor } from '@/utils/categoryColors'

const NOTION_BLOG_ID = process.env.NEXT_PUBLIC_NOTION_BLOG_ID
const NOTION_KEY = process.env.NEXT_PUBLIC_NOTION_KEY
const notionClient = new Client({auth: NOTION_KEY})


export async function getStaticPaths(){
    const allPosts = await notionClient.databases.query({
      database_id: NOTION_BLOG_ID,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
    })
    const paths = allPosts?.results?.map((post) => {
      return {
        params: {
          slug: post.id,
        },
      };
    });
    return { paths, fallback: 'blocking' }  // ← Đổi từ false thành 'blocking'
}

export async function getStaticProps({params}){
    const n2m = new NotionToMarkdown({ notionClient: notionClient });
    const {slug} = params
    const pages = await notionClient.pages.retrieve({page_id: slug});
    const metaData = getDataFromObject(pages)
    const response = await notionClient.blocks.children.list({
      block_id: slug,
    });
    const pageData = response.results[0]
    const mdblocks = await n2m.pageToMarkdown(slug);
    const mdString = n2m.toMarkdownString(mdblocks);

    return {
        props: {
            pageData:mdString,
            metaData: metaData,
        },
        revalidate: 60, // ← Thêm revalidate
    };
}

export default function BlogContent({pageData,metaData}){
    const convertDate = (inputDate) =>{
        const date = new Date(inputDate);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
        return formattedDate;
    }

    return (
      <main className="min-h-screen w-full 
                       bg-[#fff6ed] dark:bg-[#1a1a1a] 
                       flex items-center justify-center font-customfont
                       transition-colors duration-300">
        <Head>
          <title>{metaData?.title || 'Blog Post'}</title>
          <meta property="og:title" content={metaData?.title} />
          <meta property="og:image" content={metaData?.heroImage} />
          <meta property="og:url" content={metaData?.url} />
          <meta property="og:type" content="article" />
          <meta name="twitter:title" content={metaData?.title} />
          <meta name="twitter:image" content={metaData?.heroImage} />
          <meta name="twitter:card" content="summary_large_image" />
          <link rel="canonical" href={metaData?.url} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <section className="py-8 px-4 md:px-8 
                           text-stone-700 dark:text-gray-200 
                           w-full md:w-4/5 max-w-4xl">
          <Image
            width={1080}
            height={600}
            priority
            src={metaData?.heroImage}
            alt={metaData?.slug || metaData?.title}
            className="rounded-xl w-full h-auto
                     border-2 border-yellow-400 dark:border-purple-500"
          />
          <div className="my-6 flex flex-col space-y-3 border-b pb-4 
                         border-yellow-500 dark:border-purple-500">
            <h1 className="font-bold text-2xl md:text-3xl 
                          text-stone-800 dark:text-gray-100">
              {metaData?.title}
            </h1>
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <p className="font-semibold 
                           text-stone-600 dark:text-gray-400">
                📅 {convertDate(metaData?.date)}
              </p>
              {/* Category Badge */}
              {metaData?.category && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                                 text-white shadow-lg
                                 ${getCategoryColor(metaData.category)}`}>
                  {metaData.category}
                </span>
              )}
            </div>
          </div>
          
          <ReactMarkdown
            className="my-6 leading-relaxed prose prose-lg max-w-none
                      text-stone-700 dark:text-gray-300"
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");

                return !inline && match ? (
                  <SyntaxHighlighter
                    PreTag="div"
                    language={match[1]}
                    style={oneDark}
                    customStyle={{
                      borderRadius: '0.75rem',
                      padding: '1.5rem',
                      fontSize: '0.9rem',
                      border: '2px solid',
                      borderColor: 'rgb(168 85 247 / 0.3)',
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-yellow-100 dark:bg-purple-900/30 
                                  text-yellow-800 dark:text-purple-300 
                                  px-2 py-0.5 rounded font-mono text-sm" 
                        {...props}>
                    {children}
                  </code>
                );
              },

              h1: ({ node, ...props }) => (
                <h1 {...props} className="font-bold text-2xl mt-8 mb-4 
                                         text-stone-800 dark:text-gray-100 
                                         border-b-2 border-yellow-400 dark:border-purple-500 pb-2" />
              ),
              h2: ({ node, ...props }) => (
                <h2 {...props} className="font-bold text-xl mt-6 mb-3 
                                         text-stone-800 dark:text-gray-100" />
              ),
              h3: ({ node, ...props }) => (
                <h3 {...props} className="font-bold text-lg mt-4 mb-2 
                                         text-stone-700 dark:text-gray-200" />
              ),
              p: ({ node, ...props }) => (
                <p {...props} className="my-4 leading-relaxed
                                       text-stone-700 dark:text-gray-300" />
              ),
              a: ({ node, ...props }) => (
                <a {...props} className="text-yellow-500 dark:text-purple-400 
                                       hover:underline font-medium" />
              ),
              ul: ({ node, ...props }) => (
                <ul {...props} className="list-disc list-inside my-4 space-y-2
                                        text-stone-700 dark:text-gray-300 ml-4" />
              ),
              ol: ({ node, ...props }) => (
                <ol {...props} className="list-decimal list-inside my-4 space-y-2
                                        text-stone-700 dark:text-gray-300 ml-4" />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote {...props} className="border-l-4 
                                                 border-yellow-400 dark:border-purple-500 
                                                 bg-yellow-50 dark:bg-purple-900/10
                                                 pl-4 py-2 italic my-4 
                                                 text-stone-600 dark:text-gray-400 
                                                 rounded-r-lg" />
              ),
              img: ({ node, ...props }) => (
                <img {...props} className="rounded-lg my-6 w-full shadow-lg" />
              ),
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-6">
                  <table {...props} className="min-w-full border-collapse 
                                              border border-yellow-300 dark:border-purple-500" />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th {...props} className="border border-yellow-300 dark:border-purple-500 
                                        bg-yellow-100 dark:bg-purple-900/30 
                                        px-4 py-2 text-left font-semibold" />
              ),
              td: ({ node, ...props }) => (
                <td {...props} className="border border-yellow-300 dark:border-purple-500 
                                        px-4 py-2" />
              ),
            }}
          >
            {pageData?.parent}
          </ReactMarkdown>
        </section>
      </main>
    );
}