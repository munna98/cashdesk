import Link from 'next/link'
import { useRouter } from 'next/router'
import classNames from 'classnames'

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Receipts", href: "/transactions/receipts" },
  { label: "Payments", href: "/transactions/payments" },
  { label: "Agents", href: "/agents" },
  { label: "Recipients", href: "/recipients" },
]

export default function Sidebar() {
  const router = useRouter()

  return (
    <aside className="w-64 bg-[#000022] text-white h-full flex flex-col">
      <div className="p-5 text-xl font-bold tracking-wide border-b border-white/20">CashFlow Desk</div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={classNames(
              "block px-4 py-2 rounded hover:bg-white/10 transition",
              router.pathname === item.href && "bg-white/10 font-semibold"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 text-xs text-white/50 border-t border-white/20">v1.0 Desktop</div>
    </aside>
  )
}
