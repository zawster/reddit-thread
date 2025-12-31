"use client"

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { FaArrowUp, FaArrowDown, FaCommentAlt } from 'react-icons/fa'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface Comment {
    id: number
    content: string
    created_at: string
    author: { username: string }
    replies: Comment[]
}

interface CommentItemProps {
    comment: Comment
    postId: number
    onReplyAdded: (newComment: Comment) => void
}

export default function CommentItem({ comment, postId, onReplyAdded }: CommentItemProps) {
    const { isAuthenticated } = useAuth()
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyContent, setReplyContent] = useState('')
    const [loading, setLoading] = useState(false)

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!replyContent.trim()) return

        try {
            setLoading(true)
            const response = await api.post('/comments/', {
                content: replyContent,
                post_id: postId,
                parent_id: comment.id
            })
            onReplyAdded(response.data)
            setReplyContent('')
            setShowReplyForm(false)
        } catch (error) {
            console.error("Failed to add reply", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex gap-2 mt-4">
            {/* Left line for nesting */}
            <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                    u/
                </div>
                <div className="flex-1 w-px bg-gray-200 mt-2 hover:bg-gray-400 transition-colors cursor-pointer"></div>
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-2 text-xs mb-1">
                    <span className="font-bold text-gray-900">{comment.author.username}</span>
                    <span className="text-gray-500">{formatDistanceToNow(new Date(comment.created_at))} ago</span>
                </div>

                <p className="text-sm text-gray-800 mb-2 leading-relaxed">
                    {comment.content}
                </p>

                <div className="flex items-center gap-4 text-gray-500 font-bold text-xs mb-2">
                    <div className="flex items-center gap-1">
                        <FaArrowUp className="cursor-pointer hover:text-orange-600" />
                        <span>0</span>
                        <FaArrowDown className="cursor-pointer hover:text-blue-600" />
                    </div>
                    <button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        className="flex items-center gap-1.5 hover:bg-gray-100 p-1 rounded"
                    >
                        <FaCommentAlt />
                        <span>Reply</span>
                    </button>
                </div>

                {showReplyForm && (
                    <form onSubmit={handleReplySubmit} className="mb-4">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="What are your thoughts?"
                            className="w-full bg-white border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-blue-500"
                            rows={3}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <Button type="button" variant="ghost" size="sm" onClick={() => setShowReplyForm(false)}>Cancel</Button>
                            <Button type="submit" size="sm" disabled={loading}>
                                {loading ? 'Posting...' : 'Reply'}
                            </Button>
                        </div>
                    </form>
                )}

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2">
                        {comment.replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                postId={postId}
                                onReplyAdded={onReplyAdded}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
