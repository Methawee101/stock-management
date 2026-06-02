'use client'

import {useEffect, useState} from "react";
import {orderService} from "@/services/orderService";
import {platformService} from "@/services/platformService";
import {productService} from "@/services/productService";

interface OrderItem {
    id: string
    variantName: string
    sku: string
    quantity: number
    unitPrice: number
}

interface Order {
    id: string
    platformName: string
    platformOrderId: string
    status: string
    totalAmount: number
    customerName: string
    customerAddress: string
    orderedAt: string
    items: OrderItem[]
}

interface Platform {
    id: string
    name: string
    slug: string
    isMock: boolean
}

interface Variant {
    id: string
    name: string
    sku: string
    productName: string
}

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

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [platforms, setPlatforms] = useState<Platform[]>([])
    const [variants, setVariants] = useState<Variant[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [showMockModal, setShowMockModal] = useState(false)
    const [mockForm, setMockForm] = useState({
        platformSlug: '',
        platformOrderId: '',
        customerName: '',
        customerAddress: '',
        platformSku: '',
        quantity: 1,
        unitPrice: 0
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [ordersData, platformsData, variantsData] = await Promise.all([
                orderService.getAll(),
                platformService.getAll(),
                productService.getAllVariants()
            ])
            setOrders(ordersData)
            setPlatforms(platformsData)
            setVariants(variantsData)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await orderService.updateStatus(id, status)
            fetchData()
            setSelectedOrder(null)
        } catch (err) {
            console.error(err)
        }
    }

    const handleMockWebhook = async () => {
        try {
            await orderService.mockWebhook(mockForm.platformSlug, {
                platformOrderId: mockForm.platformOrderId,
                customerName: mockForm.customerName,
                customerAddress: mockForm.customerAddress,
                items: [{
                    platformSku: mockForm.platformSku,
                    quantity: mockForm.quantity,
                    unitPrice: mockForm.unitPrice
                }]
            })
            setShowMockModal(false)
            setMockForm({
                platformSlug: '',
                platformOrderId: '',
                customerName: '',
                customerAddress: '',
                platformSku: '',
                quantity: 1,
                unitPrice: 0
            })
            fetchData()
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return <div className="text-gray-500">กำลังโหลด...</div>

    return (
        <div>
            {/* Header */}
        <div className="flex items-center justify-between mb-6">
    <h1 className="text-2xl font-bold text-gray-800">ออเดอร์</h1>
        <button
    onClick={() => setShowMockModal(true)}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
                    🧪 Mock Webhook
    </button>
    </div>

    {/* Table */}
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <table className="w-full text-sm">
    <thead className="bg-gray-50 border-b border-gray-200">
    <tr>
        <th className="text-left px-4 py-3 text-gray-600 font-medium">Order ID</th>
    <th className="text-left px-4 py-3 text-gray-600 font-medium">Platform</th>
        <th className="text-left px-4 py-3 text-gray-600 font-medium">ลูกค้า</th>
        <th className="text-right px-4 py-3 text-gray-600 font-medium">ยอดรวม</th>
        <th className="text-center px-4 py-3 text-gray-600 font-medium">สถานะ</th>
        <th className="text-right px-4 py-3 text-gray-600 font-medium">จัดการ</th>
        </tr>
        </thead>
        <tbody>
        {orders.length === 0 ? (
                <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">
                ยังไม่มีออเดอร์
                </td>
                </tr>
) : (
        orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
    <td className="px-4 py-3 font-mono text-xs text-gray-600">
        {order.platformOrderId}
        </td>
        <td className="px-4 py-3 text-gray-800">{order.platformName}</td>
        <td className="px-4 py-3 text-gray-600">{order.customerName}</td>
        <td className="px-4 py-3 text-right font-bold text-gray-800">
        ฿{order.totalAmount.toLocaleString()}
    </td>
    <td className="px-4 py-3 text-center">
    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.status]}`}>
    {statusLabels[order.status]}
    </span>
    </td>
    <td className="px-4 py-3 text-right">
    <button
        onClick={() => setSelectedOrder(order)}
    className="text-blue-600 hover:underline text-xs"
        >
        ดูรายละเอียด
        </button>
        </td>
        </tr>
))
)}
    </tbody>
    </table>
    </div>

    {/* Order Detail Modal */}
    {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
            รายละเอียดออเดอร์
            </h2>

            <div className="space-y-2 text-sm mb-4">
    <div className="flex justify-between">
    <span className="text-gray-500">Order ID:</span>
    <span className="font-mono">{selectedOrder.platformOrderId}</span>
        </div>
        <div className="flex justify-between">
    <span className="text-gray-500">Platform:</span>
    <span>{selectedOrder.platformName}</span>
    </div>
    <div className="flex justify-between">
    <span className="text-gray-500">ลูกค้า:</span>
    <span>{selectedOrder.customerName}</span>
    </div>
    <div className="flex justify-between">
    <span className="text-gray-500">ที่อยู่:</span>
    <span>{selectedOrder.customerAddress}</span>
    </div>
    <div className="flex justify-between">
    <span className="text-gray-500">ยอดรวม:</span>
    <span className="font-bold">฿{selectedOrder.totalAmount.toLocaleString()}</span>
    </div>
    </div>

        {/* Items */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <table className="w-full text-xs">
        <thead className="bg-gray-50">
        <tr>
            <th className="text-left px-3 py-2 text-gray-600">สินค้า</th>
            <th className="text-right px-3 py-2 text-gray-600">จำนวน</th>
        <th className="text-right px-3 py-2 text-gray-600">ราคา</th>
        </tr>
        </thead>
        <tbody>
        {selectedOrder.items.map((item) => (
                <tr key={item.id} className="border-t border-gray-100">
            <td className="px-3 py-2">
                <div>{item.variantName}</div>
                <div className="text-gray-400 font-mono">{item.sku}</div>
                </td>
                <td className="px-3 py-2 text-right">{item.quantity}</td>
                <td className="px-3 py-2 text-right">฿{item.unitPrice}</td>
    </tr>
    ))}
        </tbody>
        </table>
        </div>

        {/* Update Status */}
        <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">อัปเดตสถานะ</label>
            <div className="flex gap-2 flex-wrap">
        {['PENDING', 'PROCESSING', 'SHIPPED', 'DONE'].map((status) => (
        <button
            key={status}
        onClick={() => handleUpdateStatus(selectedOrder.id, status)}
        className={`px-3 py-1 rounded-full text-xs border transition
                                            ${selectedOrder.status === status
            ? 'bg-blue-600 text-white border-blue-600'
            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
        }`}
    >
        {statusLabels[status]}
        </button>
    ))}
        </div>
        </div>

        <button
        onClick={() => setSelectedOrder(null)}
        className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
            ปิด
            </button>
            </div>
            </div>
    )}

    {/* Mock Webhook Modal */}
    {showMockModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            🧪 Mock Webhook
    </h2>

    <div className="space-y-3">
    <div>
        <label className="block text-sm text-gray-600 mb-1">Platform</label>
        <select
        value={mockForm.platformSlug}
        onChange={(e) => setMockForm({ ...mockForm, platformSlug: e.target.value })}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <option value="">เลือก platform</option>
        {platforms.filter(p => p.isMock).map((p) => (
            <option key={p.id} value={p.slug}>{p.name}</option>
        ))}
        </select>
        </div>

        <div>
        <label className="block text-sm text-gray-600 mb-1">Platform Order ID</label>
    <input
        type="text"
        value={mockForm.platformOrderId}
        onChange={(e) => setMockForm({ ...mockForm, platformOrderId: e.target.value })}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="SP-001"
        />
        </div>

        <div>
        <label className="block text-sm text-gray-600 mb-1">ชื่อลูกค้า</label>
            <input
        type="text"
        value={mockForm.customerName}
        onChange={(e) => setMockForm({ ...mockForm, customerName: e.target.value })}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="ชื่อลูกค้า"
        />
        </div>

        <div>
        <label className="block text-sm text-gray-600 mb-1">ที่อยู่</label>
            <input
        type="text"
        value={mockForm.customerAddress}
        onChange={(e) => setMockForm({ ...mockForm, customerAddress: e.target.value })}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="ที่อยู่จัดส่ง"
        />
        </div>

        <div>
        <label className="block text-sm text-gray-600 mb-1">Platform SKU</label>
    <input
        type="text"
        value={mockForm.platformSku}
        onChange={(e) => setMockForm({ ...mockForm, platformSku: e.target.value })}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="SP-SHIRT-WHT-M"
            />
            </div>

            <div className="flex gap-2">
    <div className="flex-1">
    <label className="block text-sm text-gray-600 mb-1">จำนวน</label>
        <input
        type="number"
        value={mockForm.quantity}
        onChange={(e) => setMockForm({ ...mockForm, quantity: Number(e.target.value) })}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        min={1}
        />
        </div>
        <div className="flex-1">
    <label className="block text-sm text-gray-600 mb-1">ราคาต่อชิ้น</label>
        <input
        type="number"
        value={mockForm.unitPrice}
        onChange={(e) => setMockForm({ ...mockForm, unitPrice: Number(e.target.value) })}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        min={0}
        />
        </div>
        </div>
        </div>

        <div className="flex gap-2 mt-4">
    <button
        onClick={() => setShowMockModal(false)}
        className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
            ยกเลิก
            </button>
            <button
        onClick={handleMockWebhook}
        className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
            >
            ส่ง Webhook
    </button>
    </div>
    </div>
    </div>
    )}
    </div>
)
}