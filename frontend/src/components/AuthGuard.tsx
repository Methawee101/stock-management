'use client'

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export default function AuthGuard({children}:{children : React.ReactNode}) {
    const router = useRouter()
    const [ checking, setChecking] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(!token) {
            router.push('/login')
        } else {
            setChecking(false)
        }
    },[])

    if(checking) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-gray-400 text-sm">กำลังตรวจสอบ...</div>
        </div>
    )

    return <>{children}</>
}