import api from '@/lib/api'

export const platformService = {
    getAll: async () => {
        const res = await api.get('/api/platforms')
        return res.data
    },

    create: async (data: {
        name: string
        slug: string
        isMock: boolean
        isActive: boolean
    }) => {
        const res = await api.post('/api/platforms', data)
        return res.data
    },

    update: async (id: string, data: {
        name: string
        slug: string
        isMock: boolean
        isActive: boolean
    }) => {
        const res = await api.put(`/api/platforms/${id}`, data)
        return res.data
    },

    delete: async (id: string) => {
        await api.delete(`/api/platforms/${id}`)
    },

    // Listings
    getAllListings: async () => {
        const res = await api.get('/api/listings')
        return res.data
    },

    createListing: async (data: {
        variantId: string
        platformId: string
        platformSku: string
        isActive: boolean
    }) => {
        const res = await api.post('/api/listings', data)
        return res.data
    },

    deleteListing: async (id: string) => {
        await api.delete(`/api/listings/${id}`)
    }
}