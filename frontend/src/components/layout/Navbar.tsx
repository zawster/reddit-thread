"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { FaReddit, FaSearch, FaPlus, FaBell } from 'react-icons/fa'
import { useState } from 'react'
import Notifications from './Notifications'

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    return (
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
                <FaReddit className="text-orange-600 text-3xl" />
                <span className="text-xl font-bold hidden md:block">reddit</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400 group-focus-within:text-gray-600" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search Reddit"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="block w-full pl-10 pr-3 py-1.5 bg-gray-100 border border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                {isAuthenticated ? (
                    <>
                        <Link href="/submit">
                            <Button variant="ghost" size="sm" className="hidden sm:flex">
                                <FaPlus className="mr-1" /> Create
                            </Button>
                        </Link>
                        <div className="h-8 w-px bg-gray-200 mx-1"></div>
                        <Notifications />
                        <Link href={`/u/${user?.username}`} className="text-sm font-medium mr-2 hidden md:block ml-2 hover:underline">
                            {user?.username}
                        </Link>
                        <Button variant="outline" size="sm" onClick={logout}>
                            Log Out
                        </Button>
                    </>
                ) : (
                    <>
                        <Link href="/login">
                            <Button variant="outline" size="sm">Log In</Button>
                        </Link>
                        <Link href="/register">
                            <Button size="sm">Sign Up</Button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}
