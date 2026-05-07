import React, { useState } from "react";
import { Search, SlidersHorizontal, Grid, List as ListIcon, Plus } from "lucide-react";
import { MEDICINES_MOCK } from "../../constants";
import { formatCurrency } from "../../lib/utils";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useCart } from "../cart/CartContext";

import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Medicine } from "../../types";

export default function ProductList() {
  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>(MEDICINES_MOCK);
  const { addItem } = useCart();

  React.useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const q = query(collection(db, "medicines"), orderBy("name"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setMedicines(snap.docs.map(d => ({ id: d.id, ...d.data() } as Medicine)));
        }
      } catch (e) { console.error(e); }
    };
    fetchMedicines();
  }, []);

  const filtered = medicines.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.genericName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 py-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search medicines..."
            className="input-medical"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="p-3 bg-white rounded-2xl shadow-sm border border-neutral-100 text-neutral-600">
          <SlidersHorizontal size={20} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-xl">{filtered.length} Results</h2>
        <div className="flex bg-neutral-100 p-1 rounded-xl">
          <button className="p-1.5 bg-white shadow-sm rounded-lg text-primary-600">
            <Grid size={18} />
          </button>
          <button className="p-1.5 text-neutral-400">
            <ListIcon size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map((medicine, idx) => (
          <motion.div
            key={medicine.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="card-medical p-4 space-y-3 group flex flex-col"
          >
            <Link to={`/product/${medicine.id}`} className="block relative aspect-square rounded-2xl overflow-hidden bg-white border border-neutral-100 flex-shrink-0">
              <img 
                src={medicine.image} 
                alt={medicine.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
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
    </div>
  );
}
