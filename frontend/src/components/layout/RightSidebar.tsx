"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { Subreddit } from '@/types'

export default function RightSidebar() {
    const [subreddits, setSubreddits] = useState<Subreddit[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const response = await api.get<Subreddit[]>('/subreddits/')
                // For demo, just take the first 5 or so
                setSubreddits(response.data.slice(0, 5))
            } catch (error) {
                console.error("Failed to fetch popular subreddits", error)
            } finally {
                setLoading(false)
            }
        }

        fetchPopular()
    }, [])

    if (loading) return (
        <div className="hidden lg:block w-80 p-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                            <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                            <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <aside className="hidden lg:block w-80 p-4 sticky top-12 h-[calc(100vh-48px)] overflow-y-auto">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xs font-bold text-gray-500 tracking-wider">POPULAR COMMUNITIES</h2>
                </div>
                <div className="divide-y divide-gray-50">
                    {subreddits.map((sub, index) => (
                        <Link
                            key={sub.id}
                            href={`/r/${sub.name}`}
                            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors group"
                        >
                            <div className="relative">
                                {sub.icon_url ? (
                                    <img
                                        src={sub.icon_url}
                                        alt={sub.name}
                                        className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-400">
                                        r/
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                                    r/{sub.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {(Math.floor(Math.random() * 1000000) + 50000).toLocaleString()} members
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="p-4">
                    <button className="w-full text-center text-xs font-bold text-blue-600 hover:text-blue-700 py-2 rounded-full hover:bg-blue-50 transition-colors">
                        See more
                    </button>
                </div>
            </div>

            {/* Privacy & Policy Policy Footer */}
            <div className="mt-4 p-4 text-[10px] text-gray-500 border border-gray-200 rounded-lg bg-white">
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <p className="hover:underline cursor-pointer">User Agreement</p>
                    <p className="hover:underline cursor-pointer">Privacy Policy</p>
                    <p className="hover:underline cursor-pointer">Content Policy</p>
                    <p className="hover:underline cursor-pointer">Moderator Code of Conduct</p>
                </div>
                <p>© 2025 Reddit, Inc. All rights reserved.</p>
            </div>
        </aside>
    )
}
