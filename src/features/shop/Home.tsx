import React from "react";
import { Search, Bell, MapPin, ChevronRight, Star, Plus } from "lucide-react";
import { motion } from "motion/react";
import { CATEGORIES, MEDICINES_MOCK } from "../../constants";
import { cn, formatCurrency } from "../../lib/utils";
import { Link } from "react-router-dom";
import { useCart } from "../cart/CartContext";

import { collection, query, limit, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Medicine } from "../../types";

export default function Home() {
  const { addItem } = useCart();
  const [medicines, setMedicines] = React.useState<Medicine[]>(MEDICINES_MOCK);

  React.useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const q = query(collection(db, "medicines"), limit(4));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setMedicines(snap.docs.map(d => ({ id: d.id, ...d.data() } as Medicine)));
        }
      } catch (e) { console.error(e); }
    };
    fetchMedicines();
  }, []);

  return (
    <div className="px-6 py-4 space-y-8">
      {/* Search & Location */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-500">
            <MapPin size={16} className="text-primary-600" />
            <span className="text-sm font-medium">Deliver to Home</span>
            <ChevronRight size={16} />
          </div>
          <button className="p-2 bg-white rounded-full shadow-sm border border-neutral-100">
            <Bell size={20} className="text-neutral-600" />
          </button>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search medicine, health products..."
            className="input-medical"
          />
        </div>
      </section>

      {/* Banner */}
      <section>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="relative h-44 rounded-[32px] overflow-hidden bg-gradient-to-br from-primary-600 to-medical-teal p-8 text-white shadow-xl shadow-primary-100"
        >
          <div className="relative z-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Flash Sale</span>
            <h2 className="text-2xl font-display font-bold leading-tight">30% Off on<br/>Wellness Care</h2>
            <button className="bg-white text-primary-700 px-4 py-2 rounded-xl text-xs font-bold mt-2">Shop Now</button>
          </div>
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mb-10 blur-2xl" />
        </motion.div>
      </section>

      {/* Categories */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg">Categories</h3>
          <Link to="/shop" className="text-primary-600 text-sm font-semibold">See All</Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center shadow-sm", cat.color)}>
                {/* Dynamically render Lucide Icon */}
                <IconPlaceholder name={cat.icon} />
              </div>
              <span className="text-[11px] font-semibold text-center leading-tight">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg">Featured Medicines</h3>
          <Link to="/shop" className="text-primary-600 text-sm font-semibold">See All</Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {medicines.map((medicine, idx) => (
            <motion.div
              key={medicine.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="card-medical p-4 space-y-3 group flex flex-col"
            >
              <Link to={`/product/${medicine.id}`} className="block relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-100 flex-shrink-0">
                <img 
                  src={medicine.image} 
                  alt={medicine.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {medicine.prescriptionRequired && (
                  <div className="absolute top-2 right-2 bg-amber-100 text-amber-700 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase border border-amber-200">
                    Rx
                  </div>
                )}
              </Link>
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-sm line-clamp-1">{medicine.name}</h4>
                <p className="text-[10px] text-neutral-400 font-semibold">{medicine.genericName}</p>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-primary-700 font-bold text-sm tracking-tight">{formatCurrency(medicine.price)}</span>
                <button 
                  onClick={() => addItem(medicine)}
                  className="w-9 h-9 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 active:scale-95 transition-all shadow-md shadow-primary-200"
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Health Tip Section */}
      <section className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex items-start gap-4">
        <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 flex-shrink-0">
          <Star size={24} fill="currentColor" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-amber-900 text-sm">Pharmy Health Tip</h4>
          <p className="text-xs text-amber-800/80 leading-relaxed">
            Stay hydrated! Drinking enough water helps your body absorb medicines more effectively and keeps your energy levels up.
          </p>
        </div>
      </section>
    </div>
  );
}

// Simple icon lookup since we can't easily dynamic import strings in this environment
import * as Icons from "lucide-react";

function IconPlaceholder({ name }: { name: string }) {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={24} />;
}
