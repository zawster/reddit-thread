"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaChartLine, FaGlobe, FaHashtag } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { cn } from '@/lib/utils'

interface Subreddit {
    id: number
    name: string
    icon_url?: string
}

export default function Sidebar() {
    const pathname = usePathname()
    const [subreddits, setSubreddits] = useState<Subreddit[]>([])

    useEffect(() => {
        const fetchSubreddits = async () => {
            try {
                const response = await api.get('/subreddits/')
                setSubreddits(response.data)
            } catch (error) {
                console.error("Failed to fetch subreddits", error)
            }
        }
        fetchSubreddits()
    }, [])

    const navItems = [
        { label: 'Home', href: '/', icon: FaHome },
        { label: 'Popular', href: '/popular', icon: FaChartLine },
        { label: 'All', href: '/all', icon: FaGlobe },
    ]

    return (
        <aside className="fixed left-0 top-14 w-60 h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200 overflow-y-auto hidden lg:block p-4">
            <div className="space-y-6">
                {/* Main Feed */}
                <section>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">FEEDS</h3>
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors",
                                        pathname === item.href ? "bg-gray-100 text-blue-600" : "text-gray-700"
                                    )}
                                >
                                    <item.icon className="text-lg" />
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Communities */}
                <section>
                    <div className="flex items-center justify-between mb-2 px-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">COMMUNITIES</h3>
                        <Link href="/subreddits" className="text-xs text-blue-600 hover:underline">See All</Link>
                    </div>
                    <ul className="space-y-1">
                        {subreddits.map((sub) => (
                            <li key={sub.id}>
                                <Link
                                    href={`/r/${sub.name}`}
                                    className={cn(
                                        "flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors",
                                        pathname === `/r/${sub.name}` ? "bg-gray-100 text-blue-600" : "text-gray-700"
                                    )}
                                >
                                    {sub.icon_url ? (
                                        <img src={sub.icon_url} alt={sub.name} className="w-5 h-5 rounded-full" />
                                    ) : (
                                        <FaHashtag className="text-gray-400" />
                                    )}
                                    r/{sub.name}
                                </Link>
                            </li>
                        ))}
                        {subreddits.length === 0 && (
                            <li className="text-xs text-gray-400 px-2 py-2 italic text-center">No communities found</li>
                        )}
                    </ul>
                </section>
            </div>
        </aside>
    )
}
