'use client'

import { useEffect, useState } from 'react'
import {platformService} from "@/services/platformService";
import {productService} from "@/services/productService";


interface Platform {
    id: string
    name: string
    slug: string
    isMock: boolean
    isActive: boolean
}

interface Listing {
    id: string
    variantId: string
    variantName: string
    sku: string
    platformId: string
    platformName: string
    platformSku: string
    isActive: boolean
}

interface Variant {
    id: string
    name: string
    sku: string
    productName: string
}

export default function PlatformsPage() {
    const [platforms, setPlatforms] = useState<Platform[]>([])
    const [listings, setListings] = useState<Listing[]>([])
    const [variants, setVariants] = useState<Variant[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'platforms' | 'listings'>('platforms')

    // Platform Modal
    const [showPlatformModal, setShowPlatformModal] = useState(false)
    const [editPlatform, setEditPlatform] = useState<Platform | null>(null)
    const [platformForm, setPlatformForm] = useState({
        name: '',
        slug: '',
        isMock: true,
        isActive: true
    })

    // Listing Modal
    const [showListingModal, setShowListingModal] = useState(false)
    const [listingForm, setListingForm] = useState({
        variantId: '',
        platformId: '',
        platformSku: '',
        isActive: true
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [platformsData, listingsData, variantsData] = await Promise.all([
                platformService.getAll(),
                platformService.getAllListings(),
                productService.getAllVariants()
            ])
            setPlatforms(platformsData)
            setListings(listingsData)
            setVariants(variantsData)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handlePlatformSubmit = async () => {
        try {
            if (editPlatform) {
                await platformService.update(editPlatform.id, platformForm)
            } else {
                await platformService.create(platformForm)
            }
            setShowPlatformModal(false)
            setEditPlatform(null)
            setPlatformForm({ name: '', slug: '', isMock: true, isActive: true })
            fetchData()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDeletePlatform = async (id: string) => {
        if (!confirm('ยืนยันการลบ platform นี้?')) return
        try {
            await platformService.delete(id)
            fetchData()
        } catch (err) {
            console.error(err)
        }
    }

    const handleListingSubmit = async () => {
        try {
            await platformService.createListing(listingForm)
            setShowListingModal(false)
            setListingForm({ variantId: '', platformId: '', platformSku: '', isActive: true })
            fetchData()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDeleteListing = async (id: string) => {
        if (!confirm('ยืนยันการลบ listing นี้?')) return
        try {
            await platformService.deleteListing(id)
            fetchData()
        } catch (err) {
            console.error(err)
        }
    }

    const handleEditPlatform = (platform: Platform) => {
        setEditPlatform(platform)
        setPlatformForm({
            name: platform.name,
            slug: platform.slug,
            isMock: platform.isMock,
            isActive: platform.isActive
        })
        setShowPlatformModal(true)
    }

    if (loading) return <div className="text-gray-500">กำลังโหลด...</div>

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Platform</h1>
                <button
                    onClick={() => activeTab === 'platforms'
                        ? setShowPlatformModal(true)
                        : setShowListingModal(true)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                    + {activeTab === 'platforms' ? 'เพิ่ม Platform' : 'เพิ่ม Listing'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
                {(['platforms', 'listings'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm transition
                            ${activeTab === tab
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {tab === 'platforms' ? 'Platforms' : 'Listings'}
                    </button>
                ))}
            </div>

            {/* Platforms Table */}
            {activeTab === 'platforms' && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-4 py-3 text-gray-600 font-medium">ชื่อ</th>
                            <th className="text-left px-4 py-3 text-gray-600 font-medium">Slug</th>
                            <th className="text-center px-4 py-3 text-gray-600 font-medium">Mock</th>
                            <th className="text-center px-4 py-3 text-gray-600 font-medium">สถานะ</th>
                            <th className="text-right px-4 py-3 text-gray-600 font-medium">จัดการ</th>
                        </tr>
                        </thead>
                        <tbody>
                        {platforms.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-400">
                                    ยังไม่มี platform
                                </td>
                            </tr>
                        ) : (
                            platforms.map((platform) => (
                                <tr key={platform.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-800">{platform.name}</td>
                                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{platform.slug}</td>
                                    <td className="px-4 py-3 text-center">
                                        {platform.isMock ? (
                                            <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs">Mock</span>
                                        ) : (
                                            <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">จริง</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {platform.isActive ? (
                                            <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">เปิด</span>
                                        ) : (
                                            <span className="bg-red-100 text-red-500 px-2 py-1 rounded-full text-xs">ปิด</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <button
                                            onClick={() => handleEditPlatform(platform)}
                                            className="text-blue-600 hover:underline text-xs"
                                        >
                                            แก้ไข
                                        </button>
                                        <button
                                            onClick={() => handleDeletePlatform(platform.id)}
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

            {/* Listings Table */}
            {activeTab === 'listings' && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-4 py-3 text-gray-600 font-medium">Variant</th>
                            <th className="text-left px-4 py-3 text-gray-600 font-medium">Platform</th>
                            <th className="text-left px-4 py-3 text-gray-600 font-medium">Platform SKU</th>
                            <th className="text-center px-4 py-3 text-gray-600 font-medium">สถานะ</th>
                            <th className="text-right px-4 py-3 text-gray-600 font-medium">จัดการ</th>
                        </tr>
                        </thead>
                        <tbody>
                        {listings.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-400">
                                    ยังไม่มี listing
                                </td>
                            </tr>
                        ) : (
                            listings.map((listing) => (
                                <tr key={listing.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="text-gray-800">{listing.variantName}</div>
                                        <div className="text-gray-400 font-mono text-xs">{listing.sku}</div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{listing.platformName}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{listing.platformSku}</td>
                                    <td className="px-4 py-3 text-center">
                                        {listing.isActive ? (
                                            <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">เปิด</span>
                                        ) : (
                                            <span className="bg-red-100 text-red-500 px-2 py-1 rounded-full text-xs">ปิด</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => handleDeleteListing(listing.id)}
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

            {/* Platform Modal */}
            {showPlatformModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            {editPlatform ? 'แก้ไข Platform' : 'เพิ่ม Platform'}
                        </h2>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">ชื่อ</label>
                                <input
                                    type="text"
                                    value={platformForm.name}
                                    onChange={(e) => setPlatformForm({ ...platformForm, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Shopee"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Slug</label>
                                <input
                                    type="text"
                                    value={platformForm.slug}
                                    onChange={(e) => setPlatformForm({ ...platformForm, slug: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="shopee"
                                />
                            </div>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={platformForm.isMock}
                                        onChange={(e) => setPlatformForm({ ...platformForm, isMock: e.target.checked })}
                                    />
                                    Mock
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={platformForm.isActive}
                                        onChange={(e) => setPlatformForm({ ...platformForm, isActive: e.target.checked })}
                                    />
                                    เปิดใช้งาน
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => {
                                    setShowPlatformModal(false)
                                    setEditPlatform(null)
                                    setPlatformForm({ name: '', slug: '', isMock: true, isActive: true })
                                }}
                                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handlePlatformSubmit}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
                            >
                                {editPlatform ? 'บันทึก' : 'เพิ่ม'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Listing Modal */}
            {showListingModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">เพิ่ม Listing</h2>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Variant</label>
                                <select
                                    value={listingForm.variantId}
                                    onChange={(e) => setListingForm({ ...listingForm, variantId: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">เลือก variant</option>
                                    {variants.map((v: any) => (
                                        <option key={v.id} value={v.id}>
                                            {v.productName} — {v.name} ({v.sku})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Platform</label>
                                <select
                                    value={listingForm.platformId}
                                    onChange={(e) => setListingForm({ ...listingForm, platformId: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">เลือก platform</option>
                                    {platforms.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Platform SKU</label>
                                <input
                                    type="text"
                                    value={listingForm.platformSku}
                                    onChange={(e) => setListingForm({ ...listingForm, platformSku: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="SP-SHIRT-WHT-M"
                                />
                            </div>
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={listingForm.isActive}
                                    onChange={(e) => setListingForm({ ...listingForm, isActive: e.target.checked })}
                                />
                                เปิดใช้งาน
                            </label>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => {
                                    setShowListingModal(false)
                                    setListingForm({ variantId: '', platformId: '', platformSku: '', isActive: true })
                                }}
                                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleListingSubmit}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
                            >
                                เพิ่ม
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}