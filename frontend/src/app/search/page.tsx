"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import api from '@/lib/api'
import PostCard from '@/components/posts/PostCard'
import { FaSpinner, FaHashtag } from 'react-icons/fa'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Post {
    id: number
    title: string
    content?: string
    created_at: string
    author: { username: string }
    subreddit: { name: string }
    upvotes: number
    downvotes: number
    user_vote?: number | null
}

interface Subreddit {
    id: number
    name: string
    title: string
}

function SearchContent() {
    const searchParams = useSearchParams()
    const q = searchParams.get('q') || ''
    const [posts, setPosts] = useState<Post[]>([])
    const [subreddits, setSubreddits] = useState<Subreddit[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'posts' | 'communities'>('posts')

    useEffect(() => {
        const fetchResults = async () => {
            if (!q) return
            try {
                setLoading(true)
                const [postsRes, subsRes] = await Promise.all([
                    api.get(`/search/posts?q=${q}`),
                    api.get(`/search/subreddits?q=${q}`)
                ])
                setPosts(postsRes.data)
                setSubreddits(subsRes.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchResults()
    }, [q])

    if (!q) return <div className="py-10 text-center">Please enter a search query</div>

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200">
                <h1 className="text-xl font-bold mb-4">Search results for "{q}"</h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={cn(
                            "pb-2 px-1 text-sm font-bold border-b-2 transition-colors",
                            activeTab === 'posts' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"
                        )}
                    >
                        Posts
                    </button>
                    <button
                        onClick={() => setActiveTab('communities')}
                        className={cn(
                            "pb-2 px-1 text-sm font-bold border-b-2 transition-colors",
                            activeTab === 'communities' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"
                        )}
                    >
                        Communities
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-10 text-center"><FaSpinner className="animate-spin text-blue-600 inline text-3xl" /></div>
            ) : (
                <div className="space-y-4">
                    {activeTab === 'posts' ? (
                        <>
                            {posts.map(post => <PostCard key={post.id} post={post} />)}
                            {posts.length === 0 && <p className="text-center text-gray-500 py-10">No posts found matching that query</p>}
                        </>
                    ) : (
                        <div className="bg-white border border-gray-300 rounded divide-y divide-gray-100">
                            {subreddits.map(sub => (
                                <Link key={sub.id} href={`/r/${sub.name}`} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <FaHashtag className="text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">r/{sub.name}</p>
                                        <p className="text-xs text-gray-500">{sub.title}</p>
                                    </div>
                                </Link>
                            ))}
                            {subreddits.length === 0 && <p className="text-center text-gray-500 py-10">No communities found matching that query</p>}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="py-10 text-center"><FaSpinner className="animate-spin text-blue-600 inline text-3xl" /></div>}>
            <SearchContent />
        </Suspense>
    )
}
