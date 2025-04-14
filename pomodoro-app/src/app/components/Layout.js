'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Layout({ children, title = 'Pomodoro App' }) {
  const pathname = usePathname();
  
  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50 transition-colors duration-300">
      <header className="border-b dark:border-gray-800 border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold dark:text-white text-gray-800">FocusFlow</h1>
          
          <div className="flex items-center space-x-6">
            <nav className="flex space-x-4">
              <Link 
                href="/"
                className={`px-2 py-1 rounded transition ${
                  pathname === '/' 
                    ? 'font-medium dark:text-white text-gray-900' 
                    : 'dark:text-gray-400 text-gray-600 hover:dark:text-gray-300 hover:text-gray-900'
                }`}
              >
                Timer
              </Link>
              <Link 
                href="/stats"
                className={`px-2 py-1 rounded transition ${
                  pathname === '/stats' 
                    ? 'font-medium dark:text-white text-gray-900' 
                    : 'dark:text-gray-400 text-gray-600 hover:dark:text-gray-300 hover:text-gray-900'
                }`}
              >
                Stats
              </Link>
            </nav>
            
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        {children}
      </main>
      
      <footer className="border-t dark:border-gray-800 border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm dark:text-gray-400 text-gray-600">
          FocusFlow &copy; {new Date().getFullYear()} - A minimal pomodoro timer app
        </div>
      </footer>
    </div>
  );
}