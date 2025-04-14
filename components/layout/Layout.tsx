// Layout.tsx with animated transitions
import { useState, useEffect } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // To prevent animation on initial load
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div 
        className={`
          flex flex-col flex-1 w-full
          transition-all duration-300 ease-in-out
          ${mounted ? (sidebarOpen ? 'md:ml-0' : 'ml-0') : ''}
        `}
      >
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
