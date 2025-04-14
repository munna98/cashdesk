// Header.tsx
import { useState } from "react"
import {
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon
} from "@heroicons/react/24/outline"

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [darkMode, setDarkMode] = useState(false)
  
  const toggleTheme = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
    console.log("dark mode");
  }
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow px-6 py-3 flex justify-between items-center">
      {/* Left: App Title */}
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Welcome back...
        </h1>
      </div>
      
      {/* Right: Theme Toggle + Logo */}
      <div className="flex items-center space-x-3 md:space-x-4">
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
        
        <img src="/logo.png" alt="App Logo" className="w-7 h-7 md:w-8 md:h-8" />
      </div>
    </header>
  )
}