import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { auth, db } from "../../lib/firebase";
import { LogOut, Package, CreditCard, Bell, Shield, ChevronRight, Settings, Star, LayoutDashboard } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdminPromoted, setIsAdminPromoted] = useState(false);

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  const becomeAdmin = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, "admins", user.uid), { email: user.email });
      setIsAdminPromoted(true);
      alert("You are now an Admin! Refresh the page to access Admin Console.");
    } catch (e) {
      console.error(e);
      alert("Self-promotion failed. Ensure the rules allow bootstrapping.");
    }
  };

  if (!user) return null;

  return (
    <div className="px-6 py-10 space-y-10 pb-32">
      {/* Header */}
      <div className="flex flex-col items-center space-y-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="w-28 h-28 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl shadow-primary-100 ring-1 ring-neutral-100">
            <img src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`} alt="profile" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl border-4 border-neutral-50">
            <Shield size={16} />
          </div>
        </motion.div>
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-display font-bold">{user.displayName || "Healthy User"}</h2>
          <p className="text-neutral-400 text-xs font-medium tracking-wide">{user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard value="12" label="Orders" />
        <StatCard value="03" label="Prescriptions" />
        <StatCard value="450" label="Points" />
      </div>

      {/* Menu Sections */}
      <div className="space-y-8">
        <section className="space-y-3">
           <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] px-2 leading-none">Account Settings</h3>
           <div className="space-y-2">
             <MenuButton icon={<Package className="text-primary-600" />} label="My Orders" />
             <MenuButton icon={<CreditCard className="text-medical-blue" />} label="Payment Methods" />
             <MenuButton icon={<Bell className="text-amber-500" />} label="Notifications" />
           </div>
        </section>

        <section className="space-y-3">
           <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] px-2 leading-none">Preferences</h3>
           <div className="space-y-2">
             <MenuButton icon={<Settings className="text-neutral-600" />} label="Security & Privacy" />
             <MenuButton icon={<Shield className="text-emerald-600" />} label="Help & Support" />
             {user.role === 'admin' ? (
               <button 
                 onClick={() => navigate("/admin")}
                 className="w-full card-medical flex items-center justify-between border-primary-100 bg-primary-50/30 shadow-none"
               >
                 <div className="flex items-center gap-4 text-sm font-bold text-primary-700">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <LayoutDashboard className="text-primary-600" />
                    </div>
                    Admin Dashboard
                 </div>
                 <ChevronRight size={18} className="text-primary-300" />
               </button>
             ) : (
               <button 
                 onClick={becomeAdmin}
                 className="w-full card-medical flex items-center justify-between border-amber-100 bg-amber-50/30 shadow-none"
               >
                 <div className="flex items-center gap-4 text-sm font-bold text-amber-700">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Star className="text-amber-600" />
                    </div>
                    Become Admin (Demo Only)
                 </div>
                 <ChevronRight size={18} className="text-amber-300" />
               </button>
             )}
           </div>
        </section>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-5 bg-red-50 text-red-600 rounded-[24px] font-bold group transition-all hover:bg-red-100"
        >
          <div className="flex items-center gap-4">
             <LogOut size={24} />
             <span>Logout Session</span>
          </div>
          <ChevronRight size={20} className="opacity-40" />
        </button>
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="card-medical p-4 text-center border-none bg-white shadow-sm ring-1 ring-neutral-100">
      <p className="text-lg font-display font-bold text-primary-700 leading-none">{value}</p>
      <p className="text-[10px] text-neutral-400 font-bold mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function MenuButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full card-medical flex items-center justify-between shadow-none hover:shadow-sm hover:scale-[1.01] active:scale-[0.99] border-neutral-100">
       <div className="flex items-center gap-4 text-sm font-bold text-neutral-700">
          <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          {label}
       </div>
       <ChevronRight size={18} className="text-neutral-300" />
    </button>
  );
}
