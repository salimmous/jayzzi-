import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  Image,
  Library,
  PenTool,
  Search,
  Tag,
  Settings,
  X,
  BarChart,
  Calendar as CalendarIcon, // Rename the Calendar icon
} from 'lucide-react';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  section?: string;
}

const sidebarItems: SidebarItem[] = [
  { section: 'Create Content', icon: null, label: '', path: '' },
  { icon: <FileText size={20} />, label: 'Article Generator', path: '/' },
  { icon: <FileText size={20} />, label: 'Bulk Article Generator', path: '/bulk-generator' },
  { icon: <Image size={20} />, label: 'Image Generator', path: '/image-generator' },
  { icon: <Image size={20} />, label: 'Describe Image', path: '/describe-image' },
  { section: 'Libraries', icon: null, label: '', path: '' },
  { icon: <Library size={20} />, label: 'Article Library', path: '/library/articles' },
  { icon: <Library size={20} />, label: 'Image Library', path: '/library/images' },
  { section: 'Pinterest', icon: null, label: '', path: '' },
  { icon: <PenTool size={20} />, label: 'Pin Generator', path: '/pins/generator' },
  { icon: <PenTool size={20} />, label: 'Pin Data', path: '/pins/data' },
  { icon: <PenTool size={20} />, label: 'Top Pins', path: '/pins/top' },
  { section: 'Keywords', icon: null, label: '', path: '' },
  { icon: <Search size={20} />, label: 'Keyword Research', path: '/keywords/research' },
  { icon: <Tag size={20} />, label: 'Keyword Tracker', path: '/keywords/tracker' },
  { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  { icon: <BarChart size={20} />, label: 'Analytics', path: '/analytics' },
  { icon: <CalendarIcon size={20} />, label: 'Calendar', path: '/calendar' }, // Add Calendar link
];

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [user] = React.useState({ name: 'Musfiq', avatar: '👋' });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold">
            <span className="font-mono">Jizzy</span>
            <span className="font-bold">AI</span>
          </h1>
        </div>
        <nav className="px-4 space-y-1">
          {sidebarItems.map((item, index) => (
            item.section ? (
              <div key={index} className="pt-6 pb-2">
                <p className="px-3 text-sm font-medium text-gray-500">{item.section}</p>
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors
                  ${location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            )
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span>{user.avatar}</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Hello {user.name}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
