'use client'

import { useEffect, useState } from 'react'
import {dashboardService} from "@/services/dashboardService";

interface LowStockItem {
    variantName: string
    sku: string
    quantity: number
    lowStockAlert: number
}

interface TopSellingItem {
    variantName: string
    sku: string
    totalSold: number
}

interface DashboardData {
    totalProducts: number
    todayOrders: number
    lowStockCount: number
    todaySales: number
    lowStockItems: LowStockItem[]
    topSellingItems: TopSellingItem[]
}

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await dashboardService.getDashboard()
            setData(res)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const cards = [
        { label: 'สินค้าทั้งหมด', value: loading ? '...' : data?.totalProducts, icon: '📦', color: 'text-blue-600' },
        { label: 'ออเดอร์วันนี้', value: loading ? '...' : data?.todayOrders, icon: '🛒', color: 'text-green-600' },
        { label: 'สต็อกใกล้หมด', value: loading ? '...' : data?.lowStockCount, icon: '⚠️', color: 'text-yellow-600' },
        { label: 'ยอดขายวันนี้', value: loading ? '...' : `฿${data?.todaySales.toLocaleString()}`, icon: '💰', color: 'text-purple-600' },
    ]

    const statusColors: Record<string, string> = {
        IN: 'bg-green-100 text-green-600',
        OUT: 'bg-red-100 text-red-600',
        ADJUST: 'bg-yellow-100 text-yellow-600',
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {cards.map((card) => (
                    <div key={card.label} className="bg-white rounded-xl p-5 border border-gray-200">
                        <div className="text-2xl mb-2">{card.icon}</div>
                        <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                        <div className="text-sm text-gray-500 mt-1">{card.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Top Selling */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h2 className="text-base font-bold text-gray-800 mb-3">สินค้าขายดี</h2>
                    {!data?.topSellingItems.length ? (
                        <p className="text-gray-400 text-sm text-center py-4">ยังไม่มีข้อมูล</p>
                    ) : (
                        <div className="space-y-2">
                            {data.topSellingItems.map((item, index) => (
                                <div key={item.sku} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400 font-bold w-4">{index + 1}</span>
                                        <div>
                                            <div className="text-gray-800 font-medium">{item.variantName}</div>
                                            <div className="text-gray-400 font-mono text-xs">{item.sku}</div>
                                        </div>
                                    </div>
                                    <span className="font-bold text-blue-600">{item.totalSold} ชิ้น</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Low Stock */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h2 className="text-base font-bold text-gray-800 mb-3">สต็อกใกล้หมด</h2>
                    {!data?.lowStockItems.length ? (
                        <p className="text-gray-400 text-sm text-center py-4">สต็อกปกติทั้งหมด ✓</p>
                    ) : (
                        <div className="space-y-2">
                            {data.lowStockItems.map((item) => (
                                <div key={item.sku} className="flex items-center justify-between text-sm">
                                    <div>
                                        <div className="text-gray-800 font-medium">{item.variantName}</div>
                                        <div className="text-gray-400 font-mono text-xs">{item.sku}</div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`font-bold ${item.quantity === 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                                            {item.quantity} ชิ้น
                                        </span>
                                        <div className="text-gray-400 text-xs">แจ้งเตือนที่ {item.lowStockAlert}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}