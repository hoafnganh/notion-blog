import { useState } from 'react'

export default function MarkdownImage({ src, alt, ...props }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="rounded-lg my-6 w-full bg-yellow-100 dark:bg-purple-900/30 
                      border-2 border-yellow-300 dark:border-purple-500
                      p-8 text-center">
        <p className="text-stone-600 dark:text-gray-400">
          🖼️ Image failed to load
        </p>
        {alt && (
          <p className="text-sm mt-2 text-stone-500 dark:text-gray-500 font-mono text-xs break-all">
            {alt}
          </p>
        )}
        <p className="text-xs mt-2 text-stone-400 dark:text-gray-600 break-all">
          {src}
        </p>
      </div>
    )
  }

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className="rounded-lg my-6 w-full shadow-lg"
      loading="lazy"
    />
  )
}