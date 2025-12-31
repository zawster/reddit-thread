"use client"

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import PostCard from './PostCard'
import { Button } from '@/components/ui/Button'
import { FaSpinner } from 'react-icons/fa'

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

interface FeedProps {
    subredditId?: number
}

export default function Feed({ subredditId }: FeedProps) {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)
                const params: any = {}
                if (subredditId) params.subreddit_id = subredditId

                const response = await api.get('/posts/', { params })
                setPosts(response.data)
            } catch (err) {
                setError('Failed to load posts')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [subredditId])

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <FaSpinner className="animate-spin text-blue-600 text-3xl" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md text-center">
                {error}
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="bg-white border border-gray-300 p-8 rounded-md text-center">
                <p className="text-gray-500 mb-4">No posts found yet.</p>
                <p className="text-sm text-gray-400">Be the first one to post!</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    )
}
