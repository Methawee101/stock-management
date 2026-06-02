import api from "@/lib/api";

export const stockService = {
    getAllStock: async() => {
        const res = await  api.get('/api/stocks')
        return res.data
    },

    getStockByVariant: async (variantId: string) => {
        const res = await api.get(`/api/stocks/${variantId}`)
        return res.data
    },

    stockIn: async (data: {variantId : string; quantity: number; note: string}) => {
        const res = await api.post('/api/stocks/in', data)
        return res.data
    },

    adjust : async (data: {variantId: string; quantity:number; note: string}) =>{
        const res = await api.post('/api/stocsk/adjust',data)
        return res.data
    },

    getAllMovements: async() => {
        const res = await api.get('/api/stocks/movements')
        return res.data
    }
}