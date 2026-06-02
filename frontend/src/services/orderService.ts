import api from "@/lib/api";

export const orderService = {
    getAll: async() => {
        const res = await api.get('api/orders')
        return res.data
    },

    getById: async(id: string) => {
        const res = await api.get('api/orders/${id}')
        return res.data
    },

    mockWebhook: async(platformSlug: string, data: {
        platformOrderId: string
        customerName: string
        customerAddress: string
        items: {
            platformSku: string
            quantity: number
            unitPrice: number
        }[]
    }) => {
        const res = await api.post(`api/orders/webhook/${platformSlug}`)
        return res.data
    },

    updateStatus : async(id: string, status: string) => {
        const res = await api.put(`api/orders/${id}/{status}`)
        return res.data
    }

}