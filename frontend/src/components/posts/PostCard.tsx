"use client"

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { FaArrowUp, FaArrowDown, FaCommentAlt, FaShare } from 'react-icons/fa'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import { Post } from '@/types'

interface PostCardProps {
    post: Post
}

export default function PostCard({ post: initialPost }: PostCardProps) {
    const { isAuthenticated } = useAuth()
    const [post, setPost] = useState(initialPost)
    const [userVote, setUserVote] = useState(initialPost.user_vote || 0)

    const handleVote = async (e: React.MouseEvent, value: number) => {
        e.preventDefault()
        e.stopPropagation()
        if (!isAuthenticated) return

        try {
            const newValue = userVote === value ? 0 : value
            const response = await api.post('/votes/', {
                post_id: post.id,
                value: newValue
            })

            setUserVote(newValue)
            setPost({
                ...post,
                upvotes: response.data.upvotes,
                downvotes: response.data.downvotes
            })
        } catch (error) {
            console.error("Voting failed", error)
        }
    }

    const score = post.upvotes - post.downvotes

    return (
        <div className="bg-white border border-gray-200 rounded-lg hover:border-gray-400 transition-all flex flex-col p-3 gap-2">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                    {post.subreddit.icon_url && (
                        <img
                            src={post.subreddit.icon_url}
                            alt={post.subreddit.name}
                            className="w-5 h-5 rounded-full"
                        />
                    )}
                    <Link href={`/r/${post.subreddit.name}`} className="font-bold text-gray-900 hover:underline">
                        r/{post.subreddit.name}
                    </Link>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">
                        {formatDistanceToNow(new Date(post.created_at))} ago
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">
                        Posted by u/{post.author.username}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="bg-[#0045AC] text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-opacity-90">
                        Join
                    </button>
                    <button className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
                        <HiOutlineDotsHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Title & Body */}
            <Link href={`/posts/${post.id}`} className="block group">
                <h2 className="text-lg font-semibold text-black mb-1 leading-snug group-hover:text-gray-700">
                    {post.title}
                </h2>
                {post.content && (
                    <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                        {post.content}
                    </p>
                )}
            </Link>

            {/* Actions Bar */}
            <div className="flex items-center gap-2 mt-1">
                {/* Horizontal Vote Buttons */}
                <div className="flex items-center bg-gray-100 rounded-full">
                    <button
                        onClick={(e) => handleVote(e, 1)}
                        className={cn(
                            "p-2 rounded-full transition-colors",
                            userVote === 1 ? "text-orange-600 bg-orange-100" : "text-gray-500 hover:bg-gray-200"
                        )}
                    >
                        <FaArrowUp className="w-4 h-4" />
                    </button>
                    <span className={cn(
                        "text-xs font-bold px-1 min-w-[20px] text-center",
                        userVote === 1 ? "text-orange-600" : userVote === -1 ? "text-blue-600" : "text-gray-900"
                    )}>
                        {score}
                    </span>
                    <button
                        onClick={(e) => handleVote(e, -1)}
                        className={cn(
                            "p-2 rounded-full transition-colors",
                            userVote === -1 ? "text-blue-600 bg-blue-100" : "text-gray-500 hover:bg-gray-200"
                        )}
                    >
                        <FaArrowDown className="w-4 h-4" />
                    </button>
                </div>

                {/* Comment Button */}
                <Link href={`/posts/${post.id}`} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full text-gray-700 transition-colors">
                    <FaCommentAlt className="w-4 h-4" />
                    <span className="text-xs font-bold">Comments</span>
                </Link>

                {/* Share Button */}
                <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full text-gray-700 transition-colors">
                    <FaShare className="w-4 h-4" />
                    <span className="text-xs font-bold">Share</span>
                </button>
            </div>
        </div>
    )
}
