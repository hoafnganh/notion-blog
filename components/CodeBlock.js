import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

export default function CodeBlock({ language, children, ...props }) {
  const [copied, setCopied] = useState(false)
  const codeString = String(children).replace(/\n$/, "")

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="relative group my-6">
      {/* Header with language and copy button */}
      <div className="flex items-center justify-between
                      bg-[#282c34] border-2 border-purple-500/30
                      rounded-t-lg px-4 py-2">
        {/* Language Label */}
        <span className="text-xs font-semibold uppercase
                         text-yellow-400 dark:text-purple-400">
          {language || 'code'}
        </span>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="px-3 py-1 rounded-md
                     bg-yellow-400 dark:bg-purple-500
                     hover:bg-yellow-500 dark:hover:bg-purple-600
                     text-white text-xs font-semibold
                     transition-all duration-200
                     active:scale-95"
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <span className="flex items-center gap-1">
              <span>✓</span> Copied
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span>📋</span> Copy
            </span>
          )}
        </button>
      </div>

      {/* Code Block */}
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          borderRadius: '0 0 0.75rem 0.75rem', // Chỉ bo góc dưới
          borderTop: 'none',
          padding: '1.5rem',
          fontSize: '0.9rem',
          border: '2px solid',
          borderColor: 'rgb(168 85 247 / 0.3)',
          margin: 0,
          marginTop: '-2px', // Để border liền mạch
        }}
        wrapLongLines={true}
        showLineNumbers={false} // Có thể bật nếu muốn
        {...props}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  )
}