"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import api from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'

interface Subreddit {
    id: number
    name: string
    title: string
}

export default function CreatePostPage() {
    const router = useRouter()
    const { isAuthenticated, loading: authLoading } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [subreddits, setSubreddits] = useState<Subreddit[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login')
        }

        const fetchSubreddits = async () => {
            try {
                const response = await api.get('/subreddits/')
                setSubreddits(response.data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchSubreddits()
    }, [isAuthenticated, authLoading, router])

    const onSubmit = async (data: any) => {
        try {
            setLoading(true)
            setError('')
            const response = await api.post('/posts/', {
                title: data.title,
                content: data.content,
                subreddit_id: parseInt(data.subreddit_id)
            })
            router.push(`/posts/${response.data.id}`)
        } catch (err) {
            setError('Failed to create post. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (authLoading) return <div>Loading...</div>

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-xl font-bold mb-6 border-b border-gray-200 pb-4">Create a post</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-4 rounded border border-gray-300">
                <div>
                    <label className="block text-sm font-medium mb-1">Subreddit</label>
                    <select
                        {...register("subreddit_id", { required: true })}
                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">Choose a community</option>
                        {subreddits.map(sub => (
                            <option key={sub.id} value={sub.id}>r/{sub.name}</option>
                        ))}
                    </select>
                    {errors.subreddit_id && <span className="text-xs text-red-500">Pick a subreddit</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        {...register("title", { required: true, maxLength: 300 })}
                        placeholder="Title"
                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.title && <span className="text-xs text-red-500">Title is required (max 300 chars)</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Text (optional)</label>
                    <textarea
                        {...register("content")}
                        placeholder="Text"
                        rows={6}
                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                {error && <div className="text-sm text-red-500">{error}</div>}

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Posting...' : 'Post'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
