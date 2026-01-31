import { useState, useEffect, useRef } from 'react'

export default function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const scrollTimeoutRef = useRef(null)

  // Parse headings TỪ DOM
  useEffect(() => {
    const timer = setTimeout(() => {
      const headingElements = document.querySelectorAll('h1[id], h2[id], h3[id]')
      const parsedHeadings = []
      
      headingElements.forEach((element) => {
        const id = element.id
        const text = element.textContent.trim()
        const tagName = element.tagName.toLowerCase()
        const level = parseInt(tagName.substring(1))
        
        if (id && text) {
          parsedHeadings.push({ level, text, id })
        }
      })
      
      setHeadings(parsedHeadings)
    }, 100)

    return () => clearTimeout(timer)
  }, [content])

  // Detect active heading khi scroll
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -80% 0px' }
    )

    const headingElements = document.querySelectorAll('h1[id], h2[id], h3[id]')
    headingElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [headings])

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  if (headings.length === 0) return null

  const performScroll = (id) => {
    const element = document.getElementById(id)
    
    if (!element) {
      console.error('❌ Element NOT FOUND with ID:', id)
      return
    }
    
    const elementRect = element.getBoundingClientRect()
    const absoluteTop = elementRect.top + window.pageYOffset
    const targetPosition = absoluteTop - 100
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    })
    
    setTimeout(() => setActiveId(id), 150)
  }

  const scrollToHeading = (id, fromBox = false) => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    if (fromBox) {
      setIsOpen(false)
      scrollTimeoutRef.current = setTimeout(() => {
        performScroll(id)
      }, 400)
    } else {
      performScroll(id)
    }
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <>
      {/* Collapsible Box */}
      <div className="mb-8 border-2 border-yellow-300 dark:border-purple-500 
                      rounded-lg overflow-hidden bg-yellow-50 dark:bg-purple-900/20
                      transition-all duration-300 ease-in-out">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between
                     bg-yellow-100 dark:bg-purple-900/30 
                     hover:bg-yellow-200 dark:hover:bg-purple-900/50
                     transition-colors font-semibold
                     text-stone-800 dark:text-gray-100"
        >
          <span className="flex items-center gap-2">
            📑 Table of Contents
          </span>
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <nav className="p-4">
            <ul className="space-y-2">
              {headings.map((heading, index) => (
                <li
                  key={index}
                  style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToHeading(heading.id, true)
                    }}
                    title={heading.text}
                    className={`text-left w-full hover:text-yellow-600 dark:hover:text-purple-400 
                               transition-colors text-sm cursor-pointer
                               ${activeId === heading.id 
                                 ? 'text-yellow-600 dark:text-purple-400 font-semibold' 
                                 : 'text-stone-700 dark:text-gray-300'}`}
                  >
                    {truncateText(heading.text, 50)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Sticky Sidebar với VÙNG HOVER LỚN */}
      <div 
        className="hidden xl:block fixed right-0 top-32 z-10 
                   w-16 h-[calc(100vh-8rem)]
                   ↑                    ↑
              Vùng trigger rộng    Chiều cao trigger
              (chữ nhật đỏ)
                   
                   hover:w-96
                       ↑
              Khi hover, mở rộng ra thành 384px (w-96)
                   
                   transition-all duration-300 ease-in-out
                   pointer-events-auto
                   group"
      >
        {/* Visual indicator - Tab nhỏ ở giữa */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 
                        w-1 h-16
                        bg-yellow-400 dark:bg-purple-500 
                        rounded-l-lg shadow-lg
                        group-hover:opacity-0 transition-opacity duration-300">
        </div>

        {/* Sidebar Content - chỉ hiện khi hover */}
        <div className="absolute right-0 top-0 w-80
                        opacity-0 translate-x-full
                        group-hover:opacity-100 group-hover:translate-x-0
                        transition-all duration-300 ease-in-out
                        pointer-events-auto">
          <div className="sticky top-0">
            <div className="toc-sidebar border-2 border-yellow-300 dark:border-purple-500 
                            rounded-lg bg-yellow-50 dark:bg-purple-900/20
                            shadow-xl flex flex-col max-h-[calc(100vh-180px)]">
              
              <div className="px-4 pt-4 pb-3 border-b border-yellow-200 dark:border-purple-700
                              bg-yellow-50 dark:bg-purple-900/20 rounded-t-lg">
                <h3 className="font-semibold text-stone-800 dark:text-gray-100 text-sm">
                  📑 On This Page
                </h3>
              </div>
              
              <nav className="toc-nav overflow-y-auto flex-1 p-4">
                <ul className="space-y-2">
                  {headings.map((heading, index) => (
                    <li
                      key={index}
                      style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          scrollToHeading(heading.id, false)
                        }}
                        title={heading.text}
                        className={`text-left w-full hover:text-yellow-600 dark:hover:text-purple-400 
                                   transition-colors text-xs leading-relaxed py-1 cursor-pointer
                                   ${activeId === heading.id 
                                     ? 'text-yellow-600 dark:text-purple-400 font-semibold border-l-2 border-yellow-600 dark:border-purple-400 pl-2 -ml-2' 
                                     : 'text-stone-600 dark:text-gray-400'}`}
                      >
                        {truncateText(heading.text, 40)}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}