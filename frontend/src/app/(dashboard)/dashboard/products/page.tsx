'use client'

import {useEffect, useState} from "react";
import {productService} from "@/services/productService";
import {error} from "next/dist/build/output/log";


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


interface Variant {
    id: string
    productId: string
    productName: string
    sku: string
    name: string
    price: number
    lowStockAlert: number
}


export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories,setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [editProduct,setEditProduct] = useState<Product | null>(null)
    const [variants, setVariants] = useState<Variant[]>([])
    const [activeTab, setActiveTab] = useState<'products' | 'variants'>('products')
    const [form,setForm] = useState({
        name : '',
        description: '',
        categoryId: ''
    })
    const [showVariantModal, setShowVariantModal] = useState(false)
    const [editVariant, setEditVariant] = useState<Variant | null>(null)
    const [variantForm, setVariantForm] = useState({
        productId: '',
        sku: '',
        name: '',
        price: 0,
        lowStockAlert: 5
    })

    useEffect(() => {
        fetchData()
    },[])

    const fetchData = async () => {
        try{
            const  [productsData,categoriesData,variantsData] = await Promise.all([
                productService.getAllProduct(),
                productService.getAllCategories(),
                productService.getAllVariants()
            ])
            setProducts(productsData)
            setCategories(categoriesData)
            setVariants(variantsData)
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

    const handleVariantSubmit = async () => {
        try{
            if(editVariant) {
                await productService.updateVariant(editVariant.id, variantForm)
            } else {
                await productService.createVariant(variantForm)
            }
            setModal(false)
            setEditVariant(null)
            setVariantForm({productId: '', sku: '', name: '', price: 0, lowStockAlert: 5})
            fetchData()
        }catch (e){
            console.error(e)
        }


    }
        const handleEditVariant = (variant: Variant) => {
            setEditVariant(variant)
            setVariantForm({
                productId: variant.productId,
                sku: variant.sku,
                name: variant.name,
                price: variant.price,
                lowStockAlert: variant.lowStockAlert
            })
            setShowVariantModal(true)
        }

        const handleDeleteVariant = async (id: string) => {
            if (!confirm('ยืนยันการลบ variant นี้?')) return
            try {
                await productService.deleteVariant(id)
                fetchData()
            } catch (err) {
                console.error(err)
            }
        }

    if(loading) return <div className="text-gray-500">Loading...</div>

    return(
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">สินค้า</h1>
                <button
                    onClick={() => activeTab === 'products'
                        ? setModal(true)
                        : setShowVariantModal(true)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                    + {activeTab === 'products' ? 'เพิ่มสินค้า' : 'เพิ่ม Variant'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
                {(['products', 'variants'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm transition
                            ${activeTab === tab
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {tab === 'products' ? 'สินค้า' : 'Variants'}
                    </button>
                ))}
            </div>

            {/* Products Table */}
            {activeTab === 'products' && (
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
            )}

            {/* Variants Table */}
            {activeTab === 'variants' && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-4 py-3 text-gray-600 font-medium">สินค้า</th>
                            <th className="text-left px-4 py-3 text-gray-600 font-medium">SKU</th>
                            <th className="text-left px-4 py-3 text-gray-600 font-medium">ชื่อ Variant</th>
                            <th className="text-right px-4 py-3 text-gray-600 font-medium">ราคา</th>
                            <th className="text-right px-4 py-3 text-gray-600 font-medium">แจ้งเตือนที่</th>
                            <th className="text-right px-4 py-3 text-gray-600 font-medium">จัดการ</th>
                        </tr>
                        </thead>
                        <tbody>
                        {variants.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-400">
                                    ยังไม่มี variant
                                </td>
                            </tr>
                        ) : (
                            variants.map((variant) => (
                                <tr key={variant.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-600">{variant.productName}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{variant.sku}</td>
                                    <td className="px-4 py-3 text-gray-800">{variant.name}</td>
                                    <td className="px-4 py-3 text-right text-gray-800">฿{variant.price.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right text-gray-500">{variant.lowStockAlert}</td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <button
                                            onClick={() => handleEditVariant(variant)}
                                            className="text-blue-600 hover:underline text-xs"
                                        >
                                            แก้ไข
                                        </button>
                                        <button
                                            onClick={() => handleDeleteVariant(variant.id)}
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
            )}

            {/* Product Modal */}
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
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
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

            {/* Variant Modal */}
            {showVariantModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            {editVariant ? 'แก้ไข Variant' : 'เพิ่ม Variant'}
                        </h2>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">สินค้า</label>
                                <select
                                    value={variantForm.productId}
                                    onChange={(e) => setVariantForm({ ...variantForm, productId: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">เลือกสินค้า</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">SKU</label>
                                <input
                                    type="text"
                                    value={variantForm.sku}
                                    onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="SHIRT-WHT-M"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">ชื่อ Variant</label>
                                <input
                                    type="text"
                                    value={variantForm.name}
                                    onChange={(e) => setVariantForm({ ...variantForm, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="ขาว / M"
                                />
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">ราคา</label>
                                    <input
                                        type="number"
                                        value={variantForm.price}
                                        onChange={(e) => setVariantForm({ ...variantForm, price: Number(e.target.value) })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min={0}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">แจ้งเตือนที่</label>
                                    <input
                                        type="number"
                                        value={variantForm.lowStockAlert}
                                        onChange={(e) => setVariantForm({ ...variantForm, lowStockAlert: Number(e.target.value) })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min={0}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => {
                                    setShowVariantModal(false)
                                    setEditVariant(null)
                                    setVariantForm({ productId: '', sku: '', name: '', price: 0, lowStockAlert: 5 })
                                }}
                                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleVariantSubmit}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
                            >
                                {editVariant ? 'บันทึก' : 'เพิ่ม'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}