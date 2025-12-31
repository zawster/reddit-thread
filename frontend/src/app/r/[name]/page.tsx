"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import Feed from '@/components/posts/Feed'
import { FaReddit } from 'react-icons/fa'

interface Subreddit {
    id: number
    name: string
    title: string
    description: string
    created_at: string
}

export default function SubredditPage() {
    const { name } = useParams()
    const [subreddit, setSubreddit] = useState<Subreddit | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSubreddit = async () => {
            try {
                const response = await api.get(`/subreddits/${name}`)
                setSubreddit(response.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchSubreddit()
    }, [name])

    if (loading) return <div className="py-10 text-center">Loading...</div>
    if (!subreddit) return <div className="py-10 text-center text-red-500">Subreddit not found</div>

    return (
        <div className="space-y-6">
            {/* Subreddit Header */}
            <div className="bg-white border border-gray-300 rounded overflow-hidden">
                <div className="h-20 bg-blue-400"></div>
                <div className="px-4 pb-4">
                    <div className="flex items-end gap-4 -mt-10 mb-4">
                        <div className="w-20 h-20 rounded-full bg-white border-4 border-white p-0.5">
                            <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center">
                                <FaReddit className="text-blue-500 text-5xl" />
                            </div>
                        </div>
                        <div className="mb-2">
                            <h1 className="text-2xl font-bold">{subreddit.title}</h1>
                            <p className="text-sm text-gray-500">r/{subreddit.name}</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700">{subreddit.description}</p>
                </div>
            </div>

            <Feed subredditId={subreddit.id} />
        </div>
    )
}
