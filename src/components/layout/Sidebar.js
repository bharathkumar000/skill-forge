"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, 
  FileText, 
  LayoutDashboard,
  Zap,
  ShieldCheck,
  Menu,
  X,
  Users,
  Settings,
  Activity,
  Trophy,
  History
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState("user");

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(c => c.trim().startsWith('mock_session='));
    if (sessionCookie) {
      setRole(sessionCookie.split('=')[1]);
    }
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    document.cookie = "mock_session=; path=/; max-age=0;";
    await supabase.auth.signOut();
    router.push("/login");
  };

  const isAdmin = role === "admin" || role === "evaluator";

  const adminItems = [
    { href: "/quiz/admin", label: "Control Center", icon: LayoutDashboard },
    { href: "/quiz/admin/quizzes", label: "Protocols", icon: FileText },
    { href: "/quiz/admin/users", label: "Node Registry", icon: Users },
    { href: "/quiz/admin/security", label: "Security Audit", icon: ShieldCheck },
    { href: "/dashboard/reports", label: "Intelligence", icon: Activity },
  ];

  const candidateItems = [
    { href: "/dashboard", label: "Command Center", icon: LayoutDashboard },
    { href: "/quiz/access", label: "Active Access", icon: Zap },
    { href: "/dashboard/reports", label: "My Logs", icon: History },
    { href: "/quiz/leaderboard", label: "Hall of Fame", icon: Trophy },
  ];

  const navItems = isAdmin ? adminItems : candidateItems;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-[70] lg:hidden p-4 bg-white rounded-2xl shadow-2xl shadow-blue-200 text-[#0F172A] border border-[#f1f5f9] active:scale-95 transition-all"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed left-0 top-0 bottom-0 w-[280px] bg-[#0F172A] text-white flex flex-col z-[65] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Decorative Gradient */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
           <div className="absolute -top-[10%] -left-[10%] w-[120%] h-[40%] bg-gradient-to-b from-blue-500/30 to-transparent blur-3xl saturate-150 rotate-12" />
        </div>

        {/* Logo Section */}
        <div className="px-10 h-28 flex items-center gap-4 relative z-10">
          <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] border border-blue-400/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-black text-2xl text-white tracking-tighter block leading-none">SKILL<span className="text-blue-500">FORGE</span></span>
            <span className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase mt-2 block">Enterprise v4</span>
          </div>
        </div>

        {/* Role Identity Chip */}
        <div className="px-8 mb-10 relative z-10">
           <div className={`p-5 rounded-[24px] border ${isAdmin ? "bg-blue-500/10 border-blue-500/20" : "bg-white/5 border-white/10"} flex items-center gap-4 group transition-all`}>
              <div className={`w-2.5 h-2.5 rounded-full ${isAdmin ? "bg-blue-400 animate-pulse shadow-[0_0_10px_#60A5FA]" : "bg-white/20"}`} />
              <div>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] block leading-none ${isAdmin ? "text-blue-400" : "text-white/40"}`}>
                  {isAdmin ? "Superuser Node" : "Standard Entity"}
                </span>
                <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1 block">Authentication Verified</span>
              </div>
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 space-y-2 relative z-10 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.label !== "Control Center" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-6 py-5 transition-all text-[11px] font-black uppercase tracking-[0.2em] rounded-[22px] group ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)]" 
                    : "text-white/40 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-5">
                  <item.icon size={18} className={isActive ? "text-white" : "text-white/20 group-hover:text-blue-400 transition-colors"} />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                   <motion.div layoutId="active-pill" className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Global Stats or Promo (Optional) */}
        <div className="px-10 py-8 relative z-10">
           <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-3xl p-6">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-3 leading-none">Resource Load</p>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: "42%" }} className="h-full bg-blue-500/50" />
              </div>
           </div>
        </div>

        {/* Footer/Logout */}
        <div className="p-8 border-t border-white/5 relative z-10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-5 px-6 py-5 text-[10px] font-black text-rose-500 hover:bg-rose-500/10 rounded-[22px] transition-all uppercase tracking-[0.3em] group"
          >
             <LogOut size={18} className="group-hover:-translate-x-1.5 transition-transform" />
             <span>Deactivate Sync</span>
          </button>
        </div>
      </aside>
    </>
  );
}
