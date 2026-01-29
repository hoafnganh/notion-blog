import { useState } from 'react'

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 
                    text-stone-800 dark:text-gray-200">
        Filter by Category
      </h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onSelectCategory('All')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300
                     ${selectedCategory === 'All'
                       ? 'bg-yellow-400 dark:bg-purple-500 text-white shadow-lg scale-105'
                       : 'bg-white dark:bg-[#242424] text-stone-700 dark:text-gray-300 border-2 border-yellow-200 dark:border-purple-500/50 hover:border-yellow-400 dark:hover:border-purple-400'
                     }`}
        >
          All ({categories.All || 0})
        </button>
        
        {Object.entries(categories)
          .filter(([cat]) => cat !== 'All')
          .sort(([, a], [, b]) => b - a) // Sắp xếp theo số lượng
          .map(([category, count]) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300
                         ${selectedCategory === category
                           ? 'bg-yellow-400 dark:bg-purple-500 text-white shadow-lg scale-105'
                           : 'bg-white dark:bg-[#242424] text-stone-700 dark:text-gray-300 border-2 border-yellow-200 dark:border-purple-500/50 hover:border-yellow-400 dark:hover:border-purple-400'
                         }`}
            >
              {category} ({count})
            </button>
          ))}
      </div>
    </div>
  )
}