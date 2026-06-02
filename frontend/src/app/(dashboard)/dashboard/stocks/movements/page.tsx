'use client'

import {useEffect, useState} from "react";
import {stockService} from "@/services/stockService";

interface Movement {
    id: string
    variantId: string
    variantName: string
    type: string
    quantityChange: number
    note: string
    createdAt: string
}

const typeColors: Record<string, string> = {
    IN: 'bg-green-100 text-green-600',
    OUT: 'bg-red-100 text-red-600',
    ADJUST: 'bg-yellow-100 text-yellow-600',
}

const typeLabels: Record<string, string> = {
    IN: 'รับเข้า',
    OUT: 'ขายออก',
    ADJUST: 'ปรับสต็อก',
}


export default function StockMovementsPage() {
    const [movements, setMovements] = useState<Movement[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'ALL' | 'IN' | 'ADJUST'>('ALL')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const data = await stockService.getAllMovements()
            setMovements(data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const filtered = filter === 'ALL'
        ? movements : movements.filter(m => m.type === filter)

    if (loading) return <div className="text-gray-500">Loading...</div>

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font=bold text-gray-800">ประวัติสต็อก</h1>
            </div>

            <div className="flex gap-2 mb-4">
                {(['ALL', 'IN', 'ADJUST'] as const).map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-4 py-2 rounded-lg text-sm transition ${filter === type ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        {type === 'ALL' ? 'ทั้งหมด' : typeLabels[type]}
                    </button>
                ))}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="text-left px-4 py-3 text-gray-600 font-medium">วันที่</th>
                        <th className="text-left px-4 py-3 text-gray-600 font-medium">สินค้า</th>
                        <th className="text-center px-4 py-3 text-gray-600 font-medium">ประเภท</th>
                        <th className="text-right px-4 py-3 text-gray-600 font-medium">จำนวน</th>
                        <th className="text-left px-4 py-3 text-gray-600 font-medium">หมายเหตุ</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center py-8 text-gray-400">
                                ไม่มีข้อมูล
                            </td>
                        </tr>
                    ) : (
                        filtered.map((m) => (
                            <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-500 text-xs">
                                    {new Date(m.createdAt).toLocaleDateString('th-TH', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </td>
                                <td className="px-4 py-3 text-gray-800">{m.variantName}</td>
                                <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs ${typeColors[m.type]}`}>
                                            {typeLabels[m.type]}
                                        </span>
                                </td>
                                <td className={`px-4 py-3 text-right font-bold
                                        ${m.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange}
                                </td>
                                <td className="px-4 py-3 text-gray-500 text-xs">
                                    {m.note || '-'}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

        </div>
    )

}

