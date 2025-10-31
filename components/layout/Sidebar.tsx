// Sidebar.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import {
  HomeIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ArrowsRightLeftIcon,
  UserGroupIcon,
  UserIcon,
  UserCircleIcon,
  BanknotesIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { label: "Receipts", href: "/transactions/receipts/receipts", icon: ArrowDownTrayIcon },
  { label: "Payments", href: "/transactions/payments/payments", icon: ArrowUpTrayIcon },
  { label: "Journal Entry", href: "/transactions/journal", icon: ArrowsRightLeftIcon },
  { label: "Agents", href: "/agents", icon: UserGroupIcon },
  { label: "Recipients", href: "/recipients", icon: UserIcon },
  { label: "Employees", href: "/employees", icon: UserCircleIcon },
  { label: "Accounts", href: "/accounts", icon: BanknotesIcon },
  // { label: "Reports", href: "/reports/report", icon: ChartBarIcon },
  { label: "Reports", href: "/under-construction", icon: ChartBarIcon },
  { label: "Settings", href: "/under-construction", icon: Cog6ToothIcon },
  { label: "Help", href: "/help", icon: QuestionMarkCircleIcon },
]

export default function Sidebar({ isOpen = true, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const router = useRouter()

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    if (onClose) {
      router.events.on('routeChangeComplete', onClose)
      return () => {
        router.events.off('routeChangeComplete', onClose)
      }
    }
  }, [router, onClose])

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isOpen && window.innerWidth < 768) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${isOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 fixed md:static inset-y-0 left-0 z-30 w-64 bg-[#000022] text-white h-full flex flex-col transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-5 text-xl font-bold tracking-wide border-b border-white/20">
          <span>Cash Desk</span>

          {/* Close button (mobile only) */}
          {onClose && (
            <button
              className="md:hidden p-1 rounded-full hover:bg-white/10"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = router.pathname === href

            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded 
                  hover:bg-white/10 transition
                  ${isActive ? 'bg-white/10 font-semibold' : ''}
                `}
              >
                <Icon className="w-5 h-5 text-white/70" />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 text-xs text-white/50 border-t border-white/20">
          v1.0 <span className="hidden sm:inline">Desktop</span>
        </div>
      </aside>
    </>
  )
}