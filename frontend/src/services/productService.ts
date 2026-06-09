import api from "@/lib/api";

export const productService = {
    getAllCategories: async () => {
        const res = await api.get('/api/categories')
        return res.data
    },

    createCategory: async (data: { name: string; slug: string }) => {
        const res = await api.post('/api/categories', data)
        return res.data
    },

    getAllProduct: async () => {
        const res = await api.get('/api/products')
        return res.data
    },

    getAllVariants: async() => {
        const res = await api.get('/api/variants')
        return res.data
    },

    getProductById: async(id: string) => {
        const res =await api.get(`/api/products/${id}`)
        return res.data
    },

    createProduct: async(data:{name:string; description: string; categoryId: string})=>{
        const res  = await api.post('/api/products',data)
    },

    updateProduct: async(id:string,data: {name:string; description: string; categoryId: string}) =>{
        const res = await api.put(`api/products/${id}`,data)
        return res.data
    },

    deleteProduct: async(id: string) => {
        await api.delete(`/api/products/${id}`)
    },

    getVariantsByProduct: async (productId : string) => {
        const res = await api.get(`/api/variants/product/${productId}`)
        return res.data
    },

    createVariant: async(data: {
        productId: string
        sku: string
        name: string
        price: number
        lowStockAlert : number
    }) => {
        const res = await api.post('/api/variants',data)
        return res.data
    },

    updateVariant: async(id: string, data: {
        productId: string
        sku: string
        name: string
        price: number
        lowStockAlert: number
    })=> {
        const res = await  api.put(`/api/variants/${id}`,data)
        return res.data
    },

    deleteVariant: async(id:string) => {
        await api.delete(`/api/variants/${id}`)
    }
}