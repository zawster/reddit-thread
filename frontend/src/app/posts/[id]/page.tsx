"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import PostCard from '@/components/posts/PostCard'
import CommentItem from '@/components/comments/CommentItem'
import { FaSpinner } from 'react-icons/fa'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'

interface Comment {
    id: number
    content: string
    created_at: string
    author: { username: string }
    replies: Comment[]
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

export default function PostDetailPage() {
    const { id } = useParams()
    const { isAuthenticated, user } = useAuth()
    const [post, setPost] = useState<Post | null>(null)
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [commentContent, setCommentContent] = useState('')
    const [commentLoading, setCommentLoading] = useState(false)

    const fetchPostAndComments = async () => {
        try {
            const [postRes, commentsRes] = await Promise.all([
                api.get(`/posts/${id}`),
                api.get(`/comments/post/${id}`)
            ])
            setPost(postRes.data)
            setComments(commentsRes.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPostAndComments()
    }, [id])

    const handleTopLevelCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!commentContent.trim()) return

        try {
            setCommentLoading(true)
            await api.post('/comments/', {
                content: commentContent,
                post_id: parseInt(id as string),
                parent_id: null
            })
            setCommentContent('')
            // Refresh comments
            const commentsRes = await api.get(`/comments/post/${id}`)
            setComments(commentsRes.data)
        } catch (error) {
            console.error("Failed to add comment", error)
        } finally {
            setCommentLoading(false)
        }
    }

    if (loading) return <div className="py-10 text-center"><FaSpinner className="animate-spin text-blue-600 inline text-3xl" /></div>
    if (!post) return <div className="py-10 text-center text-red-500">Post not found</div>

    return (
        <div className="space-y-6">
            <PostCard post={post} />

            <div className="bg-white border border-gray-300 rounded p-4">
                {/* Comment Box */}
                {isAuthenticated ? (
                    <form onSubmit={handleTopLevelCommentSubmit} className="mb-8">
                        <p className="text-xs mb-1 text-gray-500">Comment as <span className="text-blue-600">{user?.username}</span></p>
                        <textarea
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder="What are your thoughts?"
                            className="w-full border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-blue-500"
                            rows={4}
                        />
                        <div className="flex justify-end mt-2 bg-gray-50 p-2 border-x border-b border-gray-200 -mt-2 rounded-b">
                            <Button type="submit" size="sm" disabled={commentLoading}>
                                {commentLoading ? 'Posting...' : 'Comment'}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="border border-gray-200 rounded p-4 mb-8 flex items-center justify-between bg-gray-50">
                        <p className="text-sm text-gray-500 font-medium">Log in or sign up to leave a comment</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">Log In</Button>
                            <Button size="sm">Sign Up</Button>
                        </div>
                    </div>
                )}

                {/* Comment List */}
                <div className="space-y-2">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            postId={post.id}
                            onReplyAdded={() => fetchPostAndComments()} // Simple refresh for now
                        />
                    ))}
                    {comments.length === 0 && (
                        <p className="text-center text-gray-400 py-10">No comments yet. Be the first to share what you think!</p>
                    )}
                </div>
            </div>
        </div>
    )
}
