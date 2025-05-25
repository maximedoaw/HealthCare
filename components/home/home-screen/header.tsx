"use client"

import { auth } from "@/firebase/config";
import { Search, Bell, MessageSquare, ChevronDown, Menu } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";

export function Header() {
  const [user] = useAuthState(auth)
  return (
    <header className="shadow-sm border-b">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center">
          <button className="md:hidden mr-2 text-gray-500 hover:text-gray-600">
            <Menu className="h-6 w-6" />
          </button>
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search patients, records..."
              className="block w-full pl-10 pr-3 py-2 border  rounded-md leading-5 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-1 text-gray-400 hover:text-gray-500">
            <Bell className="h-6 w-6" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-500">
            <MessageSquare className="h-6 w-6" />
          </button>
          
          <div className="flex items-center">
          {user?.photoURL && (
            <img className="h-8 w-8 rounded-full" src={user.photoURL} alt="User avatar" />
          )}
            <span className="ml-2 text-sm font-medium text-gray-700 hidden md:inline">{user?.displayName}</span>
            <ChevronDown className="ml-1 h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
}