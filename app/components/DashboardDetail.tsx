"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface DashboardCard {
  id: string;
  title: string;
  icon: string;
  color: string;
  items: {
    name: string;
    href: string;
    icon: string;
  }[];
}

const dashboards: DashboardCard[] = [
  {
    id: "library",
    title: "Library",
    icon: "📚",
    color: "bg-purple-500",
    items: [
      { name: "Documents", href: "#", icon: "📄" },
      { name: "Resources", href: "#", icon: "📁" },
    ],
  },
  {
    id: "internal-dashboard",
    title: "Internal Dashboard",
    icon: "📊",
    color: "bg-green-500",
    items: [
      { name: "Analytics", href: "#", icon: "📈" },
      { name: "Reports", href: "#", icon: "📋" },
    ],
  },
  {
    id: "hrms",
    title: "HRMS",
    icon: "👥",
    color: "bg-blue-500",
    items: [
      { name: "Employee Dashboard", href: "/dashboard-employee-management", icon: "📊" },
      { name: "Manpower Planning", href: "/manpower-schedule", icon: "🗂️" },
      { name: "Claims", href: "/claims", icon: "💰" },
    ],
  },
  {
    id: "cms",
    title: "CMS",
    icon: "📰",
    color: "bg-yellow-500",
    items: [
      { name: "Content Manager", href: "#", icon: "✏️" },
      { name: "Media", href: "#", icon: "🖼️" },
    ],
  },
  {
    id: "sms",
    title: "SMS",
    icon: "💬",
    color: "bg-indigo-500",
    items: [
      { name: "Messages", href: "#", icon: "💌" },
      { name: "Templates", href: "#", icon: "📧" },
    ],
  },
  {
    id: "inventory",
    title: "Inventory",
    icon: "📦",
    color: "bg-pink-500",
    items: [
      { name: "Stock Management", href: "#", icon: "📊" },
      { name: "Warehouse", href: "#", icon: "🏭" },
    ],
  },
  {
    id: "academy",
    title: "Academy",
    icon: "🎓",
    color: "bg-indigo-600",
    items: [
      { name: "Event Management", href: "/academy", icon: "📅" },
      { name: "Courses", href: "#", icon: "📖" },
    ],
  },
];

interface DashboardDetailProps {
  id: string;
}

export default function DashboardDetail({ id }: DashboardDetailProps) {
  const router = useRouter();
  const dashboard = dashboards.find((d) => d.id === id);

  if (!dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard Not Found</h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            ← Back
          </button>
          <div className={`${dashboard.color} text-white p-6 rounded-lg flex items-center gap-3`}>
            <span className="text-4xl">{dashboard.icon}</span>
            <h1 className="text-3xl font-bold">{dashboard.title}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboard.items.map((item) => (
            <Link key={item.name} href={item.href}>
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-8 h-full flex flex-col items-center justify-center text-center">
                <span className="text-5xl mb-4">{item.icon}</span>
                <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
