import Link from 'next/link'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import {
  HomeIcon,
  // ReceiptRefundIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  // CurrencyDollarIcon,
  UserGroupIcon,
  UserIcon,
  UserCircleIcon,
  BanknotesIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { label: "Receipts", href: "/transactions/receipts", icon: ArrowDownTrayIcon},
  { label: "Payments", href: "/transactions/payments", icon: ArrowUpTrayIcon },
  { label: "Agents", href: "/agents", icon: UserGroupIcon },
  { label: "Recipients", href: "/recipients", icon: UserIcon },
  { label: "Employees", href: "/employees", icon: UserCircleIcon },
  { label: "Accounts", href: "/accounts", icon: BanknotesIcon },
  { label: "Reports", href: "/reports", icon: ChartBarIcon },
  { label: "Settings", href: "/settings", icon: Cog6ToothIcon },
  { label: "Help", href: "/help", icon: QuestionMarkCircleIcon },
]

export default function Sidebar() {
  const router = useRouter()

  return (
    <aside className="w-64 bg-[#000022] text-white h-full flex flex-col">
      <div className="p-5 text-xl font-bold tracking-wide border-b border-white/20">
        Cash Desk
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={classNames(
              "flex items-center gap-3 px-4 py-2 rounded hover:bg-white/10 transition",
              router.pathname === href && "bg-white/10 font-semibold"
            )}
          >
            <Icon className="w-5 h-5 text-white/70" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 text-xs text-white/50 border-t border-white/20">
        v1.0 Desktop
      </div>
    </aside>
  )
}
