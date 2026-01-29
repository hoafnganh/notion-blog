import Link from "next/link";
import { Github } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar(){
    return (
      <div className="sticky top-0 z-50 
                h-10 flex flex-row justify-between items-center px-4 
                text-stone-800 dark:text-gray-200
                bg-[#fff6ed] dark:bg-[#1a1a1a]
                transition-colors duration-300
                backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
        {/* Phần bên trái - Links */}
        <div className="flex space-x-6">
          <h2 className="hover:cursor-pointer flex items-center">
            <Link href="/" className="text-md md:text-xl font-semibold 
                                     hover:text-yellow-500 dark:hover:text-purple-400 
                                     transition-colors">
              HoafngAnh
            </Link>
          </h2>
          <h2 className="hover:cursor-pointer flex space-x-1 text-sm md:text-lg">
            <Link href="https://www.facebook.com/nhakhoahocthattinh" 
                  className="flex items-center
                           hover:text-yellow-500 dark:hover:text-purple-400 
                           transition-colors"> 
              M3RC3N4RY
            </Link>
          </h2>
          <h2 className="hover:cursor-pointer flex space-x-1 text-sm md:text-lg">
            <Link href="https://ctftime.org/team/400816" 
                  className="flex items-center 
                           hover:text-yellow-500 dark:hover:text-purple-400 
                           transition-colors"> 
              InfosecPTIT
            </Link>
          </h2>
        </div>
        
        {/* Phần bên phải - Nút Toggle Dark Mode */}
        <ThemeToggle />
      </div>
    );
}