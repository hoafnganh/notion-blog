import { useState, useEffect } from 'react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Hiện button khi scroll xuống > 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  // Scroll về đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 z-50
                     bg-yellow-400 dark:bg-purple-500
                     hover:bg-yellow-500 dark:hover:bg-purple-600
                     text-stone-800 dark:text-gray-100
                     p-3 rounded-full shadow-lg
                     transition-all duration-300 ease-in-out
                     hover:scale-110 active:scale-95
                     group"
          title="Back to top"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6 transition-transform group-hover:-translate-y-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </>
  )
}