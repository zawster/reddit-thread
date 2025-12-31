"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import PostCard from '@/components/posts/PostCard'
import { FaSpinner, FaUser } from 'react-icons/fa'
import { cn } from '@/lib/utils'

interface User {
    id: number
    username: string
    full_name?: string
    email: string
}

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

export default function ProfilePage() {
    const { username } = useParams()
    const [profileUser, setProfileUser] = useState<User | null>(null)
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'posts' | 'comments' | 'upvoted'>('posts')

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true)
                const [userRes, postsRes] = await Promise.all([
                    api.get(`/users/${username}`),
                    api.get(`/users/${username}/posts`)
                ])
                setProfileUser(userRes.data)
                setPosts(postsRes.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchProfileData()
    }, [username])

    if (loading) return <div className="py-10 text-center"><FaSpinner className="animate-spin text-blue-600 inline text-3xl" /></div>
    if (!profileUser) return <div className="py-10 text-center text-red-500">User not found</div>

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
                {/* Profile Tabs */}
                <div className="bg-white border border-gray-300 rounded overflow-hidden">
                    <div className="flex gap-4 p-3 border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={cn(
                                "text-xs font-bold uppercase tracking-wider pb-1 border-b-2 transition-colors",
                                activeTab === 'posts' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"
                            )}
                        >
                            POSTS
                        </button>
                        <button
                            disabled
                            className="text-xs font-bold text-gray-300 uppercase tracking-wider pb-1 cursor-not-allowed"
                        >
                            COMMENTS
                        </button>
                    </div>
                    <div className="p-2 space-y-4 bg-gray-50">
                        {posts.length === 0 ? (
                            <p className="text-center text-gray-500 py-10 italic">hmm... u/{profileUser.username} hasn't posted anything yet.</p>
                        ) : (
                            posts.map(post => <PostCard key={post.id} post={post} />)
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar Profile Info */}
            <div className="w-full md:w-80 space-y-4">
                <div className="bg-white border border-gray-300 rounded overflow-hidden">
                    <div className="h-20 bg-blue-500"></div>
                    <div className="px-4 pb-4">
                        <div className="w-20 h-20 rounded-lg bg-white border-4 border-white -mt-10 mb-4 overflow-hidden">
                            <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                                <FaUser className="text-blue-500 text-4xl" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold">u/{profileUser.username}</h2>
                        <p className="text-xs text-gray-500 mb-4">u/{profileUser.username} • 1y ago</p>

                        <div className="flex gap-8 mb-4">
                            <div>
                                <p className="text-sm font-bold">Karma</p>
                                <p className="text-xs text-gray-500">1</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold">Cake day</p>
                                <p className="text-xs text-gray-500">Dec 30, 2025</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button className="w-full bg-blue-600 text-white font-bold py-2 rounded-full hover:bg-blue-700 transition-colors">
                                Follow
                            </button>
                            <button className="w-full border border-blue-600 text-blue-600 font-bold py-2 rounded-full hover:bg-blue-50 transition-colors">
                                Chat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
