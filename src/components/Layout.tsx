import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Search, ShoppingBag, User, Pill, ArrowLeft, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { useCart } from "../features/cart/CartContext";
import { APP_NAME } from "../constants";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-neutral-50 shadow-2xl relative overflow-x-hidden">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 glass px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!isHome && (
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 -ml-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-600"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          {isHome ? (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
                <Pill size={24} />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">{APP_NAME}</span>
            </div>
          ) : (
            <span className="font-display font-bold text-lg capitalize">
              {location.pathname.split("/")[1]?.replace("-", " ") || "Details"}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <ShoppingBag size={24} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24 relative">
        <motion.div
           key={location.pathname}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md glass px-8 py-4 flex items-center justify-between rounded-t-[32px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-50">
        <NavItem to="/" icon={<Home size={24} />} label="Home" active={location.pathname === "/"} />
        <NavItem to="/shop" icon={<Search size={24} />} label="Search" active={location.pathname === "/shop"} />
        <NavItem to="/prescription" icon={<Pill size={24} />} label="Scan" active={location.pathname === "/prescription"} />
        <NavItem to="/profile" icon={<User size={24} />} label="Profile" active={location.pathname === "/profile"} />
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1 group">
      <div className={cn(
        "p-2 rounded-2xl transition-all duration-300",
        active ? "bg-primary-600 text-white shadow-lg shadow-primary-200" : "text-neutral-400 group-hover:text-primary-500"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-[10px] font-medium transition-colors",
        active ? "text-primary-600" : "text-neutral-400"
      )}>{label}</span>
    </Link>
  );
}

import { cn } from "../lib/utils";
