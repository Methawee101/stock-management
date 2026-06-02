'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menus = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'สินค้า', href: '/dashboard/products', icon: '📦' },
    { label: 'สต็อก', href: '/dashboard/stocks', icon: '🏭' },
    { label: 'ออเดอร์', href: '/dashboard/orders', icon: '🛒' },
    { label: 'Platform', href: '/dashboard/platforms', icon: '🔗' },
    {label: 'ประวัติสต็อก', href: '/dashboard/stocks/movements', icon: '📋'}
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-60 min-h-screen bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-gray-200">
                <h1 className="text-lg font-bold text-gray-800">Stock Manager</h1>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {menus.map((menu) => {
                    const isActive = pathname === menu.href
                    return (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                                ${isActive
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <span>{menu.icon}</span>
                            <span>{menu.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-gray-200">
                <button
                    onClick={() => {
                        localStorage.removeItem('token')
                        window.location.href = '/login'
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 w-full transition"
                >
                    <span>🚪</span>
                    <span>ออกจากระบบ</span>
                </button>
            </div>
        </aside>
    )
}