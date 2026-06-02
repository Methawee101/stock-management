'use client'

import {useRouter} from "next/navigation";
import {useState} from "react";
import {authService} from "@/services/authService";

export default function LoginPage(){
    const router = useRouter();
    const[email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false) ;
    const [error, setError] = useState('');

    const handleLogin = async (e:React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const  res = await authService.login(email, password)
            localStorage.setItem('token',res.token)
            localStorage.setItem('role',res.role)
            router.push('/dashboard')
        }catch (err: any) {
            setError('Email หรือ Password ไม่ถูกต้อง')
        }finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-xl font-bold text-gray-800 mb-6">เข้าสู่ระบบ</h1>
            {error && (
                <div className="bg-red-50 tex-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className=" placeholder:text-gray-500 text-gray-900 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:rinf-blue-500"
                    placeholder = "example@email.com"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="placeholder:text-gray-500 text-gray-900 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:rinf-blue-500"
                        placeholder = "enter passwor"
                        required
                    />
                </div>

                <button
                type="submit"
                disabled={loading}
                className="w-full bg0blue-600 text-white py-2 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-700 hover:cursor-pointer disabled:opacity-50 transition">
                    {loading ? 'กำลังเข้าสู่ระบบ..' : 'เข้าสู่ระบบ'}
                </button>
            </form>
        </div>
        </div>
    )
}