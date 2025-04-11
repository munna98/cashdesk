import { useState } from "react"
import {
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  CalendarIcon
} from "@heroicons/react/24/outline"

export default function Header() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [darkMode, setDarkMode] = useState(false)
  
  const toggleTheme = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow px-6 py-3 flex justify-between items-center">
      {/* Left: App Title */}
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Wellcome back...
        </h1>
      </div>
      
      {/* Center: Search and Date Controls */}
      
      <div className="flex items-center space-x-4 flex-1 max-w-md mx-auto">
        {/* Search Bar */}

        {/* <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search agents..."
            className="w-full border rounded-lg pl-10 pr-4 py-2 text-sm dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2 text-gray-400" />
        </div> */}
        
        {/* Date Selector with Icon */}

        {/* <div className="relative">
          <div className="flex items-center border rounded-lg overflow-hidden dark:bg-gray-800">
            <span className="px-2 text-gray-500 dark:text-gray-400">
              <CalendarIcon className="h-5 w-5" />
            </span>
            <input
              type="date"
              className="py-2 pr-2 border-0 focus:ring-0 text-sm dark:bg-gray-800 dark:text-white"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div> */}
      </div>
      
      {/* Right: Theme Toggle + Logo */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5 text-yellow-400" />
          ) : (
            <MoonIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
        
        <img src="/logo.png" alt="App Logo" className="w-8 h-8" />
      </div>
    </header>
  )
}