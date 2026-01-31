'use client'
import { useRouter } from "next/router"
import { Client } from "@notionhq/client"
import { useEffect, useState, useRef } from "react"
import { NotionToMarkdown } from "notion-to-md"
import ReactMarkdown from 'react-markdown'
import getDataFromObject from "@/utils/getObject"
import Image from "next/image"
import Head from "next/head"
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import dynamic from "next/dynamic"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { getCategoryColor } from '@/utils/categoryColors'
import MarkdownImage from "@/components/MarkdownImage"
import CodeBlock from "@/components/CodeBlock"
import TableOfContents from "@/components/TableOfContents"
import ScrollToTop from "@/components/ScrollToTop"

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
    return { paths, fallback: 'blocking' }
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
        revalidate: 60,
    };
}

export default function BlogContent({pageData, metaData}){
    const usedIds = useRef({})

    const convertDate = (inputDate) => {
        if (!inputDate) return 'No date';
        try {
            const date = new Date(inputDate);
            if (isNaN(date.getTime())) return 'Invalid date';
            const formattedDate = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: '2-digit' 
            });
            return formattedDate;
        } catch (error) {
            return 'Invalid date';
        }
    }

    // Extract text từ children (có thể là array/object)
    const extractTextFromChildren = (children) => {
      if (!children) return ''
      
      if (typeof children === 'string') {
        return children
      }
      
      if (Array.isArray(children)) {
        return children.map(child => extractTextFromChildren(child)).join('')
      }
      
      if (typeof children === 'object' && children.props) {
        return extractTextFromChildren(children.props.children)
      }
      
      return String(children)
    }

    // Generate ID với xử lý trùng lặp
    const generateId = (children) => {
      const text = extractTextFromChildren(children)
      
      if (!text) return 'heading'
      
      // Loại bỏ markdown syntax
      const cleanText = text
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .replace(/~~(.+?)~~/g, '$1')
        .replace(/_(.+?)_/g, '$1')
        .replace(/__(.+?)__/g, '$1')
        .trim()
      
      // Tạo base ID
      let baseId = cleanText
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      
      if (!baseId || baseId.length === 0) {
        baseId = 'heading'
      }
      
      // Xử lý ID trùng lặp
      let id = baseId
      if (usedIds.current[baseId] !== undefined) {
        usedIds.current[baseId]++
        id = `${baseId}-${usedIds.current[baseId]}`
      } else {
        usedIds.current[baseId] = 0
      }
      
      return id
    }

    // Reset usedIds khi pageData thay đổi
    useEffect(() => {
      usedIds.current = {}
    }, [pageData])

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
              {metaData?.categories && metaData.categories.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {metaData.categories.map((cat, idx) => (
                    <span key={idx} className={`px-3 py-1 rounded-full text-xs font-semibold 
                                     text-white shadow-lg
                                     ${getCategoryColor(cat)}`}>
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <TableOfContents content={pageData?.parent} />
          
          <ReactMarkdown
            className="my-6 leading-relaxed prose prose-lg max-w-none
                      text-stone-700 dark:text-gray-300"
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const content = String(children);
                
                if (inline) {
                  if (!/[a-zA-Z0-9]/.test(content)) {
                    return <></>;
                  }
                  
                  return (
                    <code className="bg-yellow-100 dark:bg-purple-900/30 
                                    text-yellow-800 dark:text-purple-300 
                                    px-1.5 py-0.5 rounded font-mono text-sm
                                    break-words" 
                          {...props}>
                      {children}
                    </code>
                  );
                }

                if (match) {
                  return (
                    <CodeBlock language={match[1]} {...props}>
                      {children}
                    </CodeBlock>
                  );
                }

                return (
                  <code className="bg-yellow-100 dark:bg-purple-900/30 
                                  text-yellow-800 dark:text-purple-300 
                                  px-1.5 py-0.5 rounded font-mono text-sm
                                  break-words" 
                        {...props}>
                    {children}
                  </code>
                );
              },

              h1: ({ node, children, ...props }) => {
                const id = generateId(children)
                return (
                  <h1 id={id} {...props} className="font-bold text-2xl mt-8 mb-4 
                                           text-stone-800 dark:text-gray-100 
                                           border-b-2 border-yellow-400 dark:border-purple-500 pb-2
                                           break-words scroll-mt-24">
                    {children}
                  </h1>
                )
              },
              h2: ({ node, children, ...props }) => {
                const id = generateId(children)
                return (
                  <h2 id={id} {...props} className="font-bold text-xl mt-6 mb-3 
                                           text-stone-800 dark:text-gray-100
                                           break-words scroll-mt-24">
                    {children}
                  </h2>
                )
              },
              h3: ({ node, children, ...props }) => {
                const id = generateId(children)
                return (
                  <h3 id={id} {...props} className="font-bold text-lg mt-4 mb-2 
                                           text-stone-700 dark:text-gray-200
                                           break-words scroll-mt-24">
                    {children}
                  </h3>
                )
              },

              p: ({ node, ...props }) => (
                <p {...props} className="my-4 leading-relaxed
                                        text-stone-700 dark:text-gray-300
                                        break-words overflow-wrap-anywhere" />
              ),
              a: ({ node, ...props }) => (
                <a {...props} className="text-yellow-600 dark:text-purple-400 
                                        underline hover:text-yellow-700 dark:hover:text-purple-300
                                        break-words" />
              ),
              ul: ({ node, ...props }) => (
                <ul {...props} className="list-disc list-inside my-4 space-y-2
                                         text-stone-700 dark:text-gray-300" />
              ),
              ol: ({ node, ...props }) => (
                <ol {...props} className="list-decimal list-inside my-4 space-y-2
                                         text-stone-700 dark:text-gray-300" />
              ),
              li: ({ node, ...props }) => (
                <li {...props} className="my-1 text-stone-700 dark:text-gray-300
                                         break-words" />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote {...props} className="border-l-4 border-yellow-400 dark:border-purple-500 
                                                 pl-4 py-2 italic my-4 
                                                 text-stone-600 dark:text-gray-400 
                                                 rounded-r-lg
                                                 break-words overflow-wrap-anywhere
                                                 max-w-full overflow-x-auto" />
              ),
              img: ({ node, ...props }) => <MarkdownImage {...props} />,
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-6">
                  <table {...props} className="min-w-full border-collapse 
                                              border border-yellow-300 dark:border-purple-500" />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th {...props} className="border border-yellow-300 dark:border-purple-500 
                                        bg-yellow-100 dark:bg-purple-900/30 
                                        px-4 py-2 text-left font-semibold
                                        break-words" />
              ),
              td: ({ node, ...props }) => (
                <td {...props} className="border border-yellow-300 dark:border-purple-500 
                                        px-4 py-2
                                        break-words" />
              ),
              pre: ({ node, ...props }) => (
                <pre {...props} className="overflow-x-auto max-w-full" />
              ),
              details: ({ node, ...props }) => (
                <details {...props} className="my-4 border-2 border-yellow-300 dark:border-purple-500 
                                               rounded-lg overflow-hidden" />
              ),
              summary: ({ node, ...props }) => (
                <summary {...props} className="cursor-pointer px-4 py-3 
                                               bg-yellow-100 dark:bg-purple-900/30 
                                               text-stone-800 dark:text-gray-100
                                               font-semibold hover:bg-yellow-200 dark:hover:bg-purple-900/50
                                               transition-colors" />
              ),
            }}
          >
            {pageData?.parent}
          </ReactMarkdown>
        </section>
        <ScrollToTop />
      </main>
    );

    
}
