export const getCategoryColor = (category) => {
  const colors = {
    'Cryptography': 'bg-blue-500',
    'Forensics': 'bg-green-500',
    'Web': 'bg-red-500',
    'Reverse Engineering': 'bg-purple-500',
    'Pwnable': 'bg-orange-500',
    'OSINT': 'bg-cyan-500',
    'Misc': 'bg-gray-500',
    'Tutorials': 'bg-yellow-500',
    'Tools': 'bg-indigo-500',
    'Knowsledge': 'bg-red-500'
  }
  return colors[category] || 'bg-yellow-400 dark:bg-purple-500'
}