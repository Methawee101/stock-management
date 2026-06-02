'use client'
import {useEffect, useState} from "react";
import {productService} from "@/services/productService";
import {stockService} from "@/services/stockService";
import {orderService} from "@/services/orderService";


interface StockItem {
    id: string
    variantName: string
    sku : string
    quantity : number
}

interface Order {
    id: string
    platformName: string
    totalAmount: number
    status: string
    orderedAt: string
}

export default function DashboardPage() {

    const [productCount, setProductCount] = useState(0)
    const [lowStockCount, setLowStockCount] = useState(0)
    const [todayOrderCount, setTodayOrderCount] = useState(0)
    const [todaySales, setTodaySales] = useState(0)
    const [lowStockItems, setLowStockItems] = useState<StockItem[]>([])
    const [recentOrders, setRecentOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [products, stocks, orders] = await Promise.all([
                productService.getAllProduct(),
                stockService.getAllStock(),
                orderService.getAll()
            ])

            setProductCount(products.length)

            // นับสต็อกที่ใกล้หมด
            const lowStock = stocks.filter((s: any) => s.quantity <= 5)
            setLowStockCount(lowStock.length)
            setLowStockItems(lowStock.slice(0,5))

            const today = new Date().toDateString()
            const todayOrders = orders.filter((o:any) =>
                new Date(o.orderedAt).toDateString() === today
            )
            setTodayOrderCount(todayOrders.length)

            const sales = todayOrders.reduce((sum:number, o : any) =>
                sum + o.totalAmount,0
            )

            setTodaySales(sales)

            setRecentOrders(orders.slice(0,5))
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const cards = [
        { label: 'สินค้าทั้งหมด', value: loading ? '...' : productCount, icon: '📦' },
        { label: 'ออเดอร์วันนี้', value: '0', icon: '🛒' },
        { label: 'สต็อกใกล้หมด', value: loading ? '...' : lowStockCount, icon: '⚠️' },
        { label: 'ยอดขายวันนี้', value: '฿0', icon: '💰' },
    ]

    const statusColors: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-600',
        PROCESSING: 'bg-blue-100 text-blue-600',
        SHIPPED: 'bg-purple-100 text-purple-600',
        DONE: 'bg-green-100 text-green-600',
    }

    const statusLabels: Record<string, string> = {
        PENDING: 'รอดำเนินการ',
        PROCESSING: 'กำลังดำเนินการ',
        SHIPPED: 'จัดส่งแล้ว',
        DONE: 'เสร็จสิ้น',
    }
    
    return (

        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

            <div className="grid grid-cols-4 gap-4 mb-6">
                {cards.map((card) => (
                    <div key={card.label} className="bg-white rounded-xl p-5 border border-gray-200">
                        <div className="text-2xl mb-2">{card.icon}</div>
                        <div className="text-2xl font-bold text-gray-800">{card.value}</div>
                        <div className="text-sm text-gray-500 mt-1">{card.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h2 className="text-base font-bold text-gray-800 mb-3">ออเดอร์ล่าสุด</h2>
                    {recentOrders.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-4">ยังไม่มีออเดอร์</p>
                    ) : (
                        <div className="space-y-2">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between text-sm">
                                    <div>
                                        <div className="text-gray-800 font-medium">{order.platformName}</div>
                                        <div className="text-gray-400 text-xs">
                                            {new Date(order.orderedAt).toLocaleDateString('th-TH')}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-gray-800 font-bold">
                                            ฿{order.totalAmount.toLocaleString()}
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[order.status]}`}>
                                            {statusLabels[order.status]}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Low Stock */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h2 className="text-base font-bold text-gray-800 mb-3">สต็อกใกล้หมด</h2>
                    {lowStockItems.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-4">สต็อกปกติทั้งหมด ✓</p>
                    ) : (
                        <div className="space-y-2">
                            {lowStockItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                    <div>
                                        <div className="text-gray-800 font-medium">{item.variantName}</div>
                                        <div className="text-gray-400 text-xs font-mono">{item.sku}</div>
                                    </div>
                                    <span className={`font-bold ${item.quantity === 0
                                        ? 'text-red-600'
                                        : 'text-yellow-600'
                                    }`}>
                                        {item.quantity} ชิ้น
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>




    )
}