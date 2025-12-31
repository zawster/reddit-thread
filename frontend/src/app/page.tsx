"use client"

import Feed from "@/components/posts/Feed";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-6">
      {/* Create Post Entry (Simple version) */}
      {isAuthenticated && (
        <div className="bg-white border border-gray-300 rounded p-2 flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
          <Link href="/submit" className="flex-1">
            <input
              type="text"
              placeholder="Create Post"
              className="w-full bg-gray-100 border border-gray-200 rounded px-4 py-2 hover:bg-white hover:border-blue-500 transition-all cursor-pointer"
              readOnly
            />
          </Link>
        </div>
      )}

      {/* Feed Filter Headers (Optional) */}
      <div className="bg-white border border-gray-300 rounded p-3 flex items-center gap-4 text-sm font-bold text-gray-500">
        <span className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full cursor-pointer">Best</span>
        <span className="hover:bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer">Hot</span>
        <span className="hover:bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer">New</span>
        <span className="hover:bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer">Top</span>
      </div>

      <Feed />
    </div>
  );
}
