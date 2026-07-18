"use client";

import React from "react";
import { Users, CheckCircle2, XCircle, Settings, ClipboardList } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const cards = [
    {
      title: "Pending Club Requests",
      description: "Review and approve new club applications.",
      icon: <ClipboardList className="w-8 h-8 text-amber-600" />,
      count: "12",
      color: "bg-amber-50 border-amber-200"
    },
    {
      title: "Approved Clubs",
      description: "Manage currently active clubs on the platform.",
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
      count: "45",
      color: "bg-emerald-50 border-emerald-200"
    },
    {
      title: "Rejected Requests",
      description: "History of declined club applications.",
      icon: <XCircle className="w-8 h-8 text-rose-600" />,
      count: "3",
      color: "bg-rose-50 border-rose-200"
    },
    {
      title: "User Management",
      description: "Suspend, ban, or review user activity.",
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      count: "8,432",
      color: "bg-indigo-50 border-indigo-200"
    },
    {
      title: "Settings",
      description: "Configure global platform parameters.",
      icon: <Settings className="w-8 h-8 text-neutral-600" />,
      count: "Sys",
      color: "bg-neutral-50 border-neutral-200"
    }
  ];

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[#faf9f6] text-[#0f0f10] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
        <div className="absolute -right-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-lg mb-4">
            i
          </div>
          <h1 className="text-4xl md:text-5xl font-dmserif font-bold tracking-tight text-[#0f0f10] mb-3">
            Welcome, Admin
          </h1>
          <p className="text-neutral-500 text-lg font-medium">
            Administrator Dashboard
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Card className={`border hover:shadow-md transition-shadow cursor-pointer h-full ${card.color}`}>
                <CardHeader className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                      {card.icon}
                    </div>
                    <span className="text-2xl font-bold font-mono text-black/60">
                      {card.count}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold tracking-tight text-[#0f0f10] mb-2">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-neutral-600 font-medium text-sm">
                    {card.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
