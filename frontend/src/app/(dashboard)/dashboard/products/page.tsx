'use client'

import {useEffect, useState} from "react";
import {productService} from "@/services/productService";


interface Category {
    id: string
    name: string
    slug: string
}

interface Product {
    id: string
    name: string
    description: string
    categoryId: string
    categoryName: string
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories,setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [editProduct,setEditProduct] = useState<Product | null>(null)
    const [form,setForm] = useState({
        name : '',
        description: '',
        categoryId: ''
    })

    useEffect(() => {
        fetchData()
    },[])

    const fetchData = async () => {
        try{
            const  [productsData,categoriesData] = await Promise.all([
                productService.getAllProduct(),
                productService.getAllCategories()
            ])
            setProducts(productsData)
            setCategories(categoriesData)
        }catch (e) {
            console.error(e)
        }finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        try{
            if(editProduct) {
                await productService.updateProduct(editProduct.id,form)
            } else {
                await productService.createProduct(form)
            }
            setModal(false)
            setEditProduct(null)
            setForm({name: '', description: '',categoryId: ''})
            fetchData()
        }catch (e){
            console.error(e)
        }
    }

    const handleEdit = (product:Product) => {
        setEditProduct(product)
        setForm({
            name: product.name,
            description: product.description,
            categoryId: product.categoryId
        })
        setModal(true)
    }

    const handleDelete = async (id:string) => {
        if(!confirm('Confirm to delete this product')) return
        try{
            await productService.deleteProduct(id)
            fetchData()
        }catch (e){
            console.error(e)
        }
    }

    if(loading) return <div className="text-gray-500">Loading...</div>

    return(
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">สินค้า</h1>
                <button
                    onClick={() => setModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                    + เพิ่มสินค้า
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="text-left px-4 py-3 text-gray-600 font-medium">ชื่อสินค้า</th>
                        <th className="text-left px-4 py-3 text-gray-600 font-medium">หมวดหมู่</th>
                        <th className="text-left px-4 py-3 text-gray-600 font-medium">รายละเอียด</th>
                        <th className="text-right px-4 py-3 text-gray-600 font-medium">จัดการ</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center py-8 text-gray-400">
                                ยังไม่มีสินค้า
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-800 font-medium">{product.name}</td>
                                <td className="px-4 py-3 text-gray-600">{product.categoryName}</td>
                                <td className="px-4 py-3 text-gray-500">{product.description || '-'}</td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="text-blue-600 hover:underline text-xs"
                                    >
                                        แก้ไข
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-500 hover:underline text-xs"
                                    >
                                        ลบ
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

             {/*Modal*/}
            {modal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            {editProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'}
                        </h2>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">ชื่อสินค้า</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="ชื่อสินค้า"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">หมวดหมู่</label>
                                <select
                                    value={form.categoryId}
                                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">เลือกหมวดหมู่</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">รายละเอียด</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="รายละเอียดสินค้า"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => {
                                    setModal(false)
                                    setEditProduct(null)
                                    setForm({ name: '', description: '', categoryId: '' })
                                }}
                                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
                            >
                                {editProduct ? 'บันทึก' : 'เพิ่ม'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}