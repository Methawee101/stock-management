'use client'

import {useEffect, useState} from "react";
import {stockService} from "@/services/stockService";
import {productService} from "@/services/productService";

interface StockItem{
        id: string
        variantId: string
        variantName: string
        sku: string
        quantity: number
    }

    interface Variant {
        id: string
        name: string
        sku: string
        productName: string
    }
export default function StocksPage() {
    const [stocks, setStocks] = useState<StockItem[]>([])
    const [variants,setVariants] = useState<Variant[]>([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [modalType, setModalType] = useState<'in' | 'adjust'>('in')
    const [form,setForm] = useState({
        variantId: '',
        quantity: 0,
        note: ''
    })
    useEffect(() => {
        fetchData()
    },[])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [stockData, variantData] = await Promise.all([
                stockService.getAllStock(),
                productService.getAllVariants()
            ])
            setStocks(stockData)
            console.log('variantsData:', variantData)
            setVariants(variantData)
        }catch (e){
            console.error(e)
        }finally {
            setLoading(false)
        }

    }

    const handleSubmit = async () => {
        console.log('form:', form)
        console.log('modalType:', modalType)
        try{
            if(modalType === 'in') {
                await stockService.stockIn(form)
            }else {
                await stockService.adjust(form)
            }
            setModal(false)
            setForm({variantId: '',quantity: 0, note: ''})
            fetchData()
        }catch (e) {
            console.error(e)
        }
    }

    const openModal = (type : 'in' | 'adjust')=> {
        setModalType(type)
        setModal(true)
    }

    if (loading) return <div className="text-gray-500">Loading...</div>

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">สต็อกสินค้า</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => openModal('in')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                    >
                        + รับสินค้าเข้า
                    </button>
                    <button
                        onClick={() => openModal('adjust')}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition"
                    >
                        ปรับสต็อก
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="text-left px-4 py-3 text-gray-600 font-medium">SKU</th>
                        <th className="text-left px-4 py-3 text-gray-600 font-medium">ชื่อ Variant</th>
                        <th className="text-right px-4 py-3 text-gray-600 font-medium">จำนวนสต็อก</th>
                        <th className="text-right px-4 py-3 text-gray-600 font-medium">สถานะ</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stocks.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center py-8 text-gray-400">
                                ยังไม่มีข้อมูลสต็อก
                            </td>
                        </tr>
                    ) : (
                        stocks.map((stock) => (
                            <tr key={stock.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{stock.sku}</td>
                                    <td className="px-4 py-3 text-gray-800">{stock.variantName}</td>
                                <td className="px-4 py-3 text-right font-bold text-gray-800">
                                    {stock.quantity}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {stock.quantity <= 5 ? (
                                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                                                ใกล้หมด
                                            </span>
                                    ) : (
                                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                                                ปกติ
                                            </span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            {modalType === 'in' ? '📦 รับสินค้าเข้าคลัง' : '⚙️ ปรับสต็อก'}
                        </h2>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">เลือก Variant</label>
                                <select
                                    value={form.variantId}
                                    onChange={(e) => setForm({ ...form, variantId: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">เลือก variant</option>
                                    {variants.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.productName} — {v.name} ({v.sku})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    {modalType === 'in' ? 'จำนวนที่รับเข้า' : 'จำนวนที่ต้องการให้เป็น'}
                                </label>
                                <input
                                    type="number"
                                    value={form.quantity}
                                    onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min={0}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">หมายเหตุ</label>
                                <input
                                    type="text"
                                    value={form.note}
                                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="หมายเหตุ (optional)"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => {
                                    setModal(false)
                                    setForm({ variantId: '', quantity: 0, note: '' })
                                }}
                                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSubmit}
                                className={`flex-1 text-white py-2 rounded-lg text-sm transition
                                    ${modalType === 'in'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-yellow-500 hover:bg-yellow-600'
                                }`}
                            >
                                {modalType === 'in' ? 'รับเข้า' : 'ปรับสต็อก'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}