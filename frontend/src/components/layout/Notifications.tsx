"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { FaBell, FaTimes } from 'react-icons/fa'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Notification {
    id: string
    type: string
    post_id: number
    post_title: string
    commenter: string
}

export default function Notifications() {
    const { user, isAuthenticated } = useAuth()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [showDrawer, setShowDrawer] = useState(false)

    useEffect(() => {
        if (!isAuthenticated || !user) return

        const token = localStorage.getItem('token')
        const wsUrl = `ws://localhost:8000/api/v1/ws/${token}`
        const socket = new WebSocket(wsUrl)

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (data.type === 'new_comment') {
                const newNotif = {
                    ...data,
                    id: Math.random().toString(36).substr(2, 9)
                }
                setNotifications(prev => [newNotif, ...prev])
            }
        }

        return () => socket.close()
    }, [isAuthenticated, user])

    if (!isAuthenticated) return null

    return (
        <div className="relative">
            <button
                onClick={() => setShowDrawer(!showDrawer)}
                className="p-2 hover:bg-gray-100 rounded-full relative text-gray-600"
            >
                <FaBell className="text-xl" />
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {notifications.length}
                    </span>
                )}
            </button>

            {showDrawer && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-xl rounded-lg z-[100] overflow-hidden">
                    <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-sm">Notifications</h3>
                        <button onClick={() => setNotifications([])} className="text-xs text-blue-600 hover:underline">Clear all</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="p-8 text-center text-gray-500 text-sm italic">No new notifications</p>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} className="p-3 hover:bg-gray-50 border-b border-gray-50 relative group">
                                    <Link href={`/posts/${n.post_id}`} onClick={() => setShowDrawer(false)}>
                                        <p className="text-sm">
                                            <span className="font-bold">{n.commenter}</span> commented on your post:
                                            <span className="text-gray-600 block truncate mt-1">"{n.post_title}"</span>
                                        </p>
                                    </Link>
                                    <button
                                        onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))}
                                        className="absolute top-2 right-2 text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FaTimes size={10} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
