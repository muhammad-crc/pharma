import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MEDICINES_MOCK } from "../../constants";
import { formatCurrency } from "../../lib/utils";
import { ShieldCheck, Info, Package, Truck, Minus, Plus, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { useCart } from "../cart/CartContext";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Medicine } from "../../types";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, items, updateQuantity } = useCart();
  const [medicine, setMedicine] = React.useState<Medicine | null>(
    MEDICINES_MOCK.find(m => m.id === id) || null
  );

  React.useEffect(() => {
    if (!id) return;
    const fetchMedicine = async () => {
      try {
        const snap = await getDoc(doc(db, "medicines", id));
        if (snap.exists()) {
          setMedicine({ id: snap.id, ...snap.data() } as Medicine);
        }
      } catch (e) { console.error(e); }
    };
    fetchMedicine();
  }, [id]);

  if (!medicine) return <div className="p-10 text-center">Medicine not found</div>;

  const cartItem = items.find(item => item.id === medicine.id);

  return (
    <div className="space-y-0">
      {/* Product Image */}
      <div className="relative h-[350px] bg-white pt-6">
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          src={medicine.image}
          alt={medicine.name}
          className="w-full h-full object-contain px-10 drop-shadow-2xl"
          referrerPolicy="no-referrer"
        />
        {medicine.prescriptionRequired && (
          <div className="absolute top-6 right-6 bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
            <AlertCircle size={12} />
            PRESCRIPTION REQUIRED
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="bg-white rounded-t-[40px] px-8 py-10 space-y-8 shadow-[0_-20px_40px_rgba(0,0,0,0.02)] translate-y-[-40px]">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-2xl tracking-tight leading-tight">{medicine.name}</h2>
              <span className="text-2xl font-bold text-primary-700">{formatCurrency(medicine.price)}</span>
            </div>
            <p className="text-neutral-500 font-medium">{medicine.genericName}</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-neutral-500">
             <div className="flex items-center gap-1.5 px-3 py-2 bg-neutral-50 rounded-xl">
               <Package size={14} className="text-primary-500" />
               <span>In Stock</span>
             </div>
             <div className="flex items-center gap-1.5 px-3 py-2 bg-neutral-50 rounded-xl">
               <Truck size={14} className="text-medical-blue" />
               <span>60 min Delivery</span>
             </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-neutral-100 rounded-2xl p-1">
            <button 
              onClick={() => updateQuantity(medicine.id, -1)}
              className="p-3 text-neutral-500 hover:text-primary-600"
            >
              <Minus size={20} />
            </button>
            <span className="w-10 text-center font-bold">{cartItem?.quantity || 0}</span>
            <button 
              onClick={() => addItem(medicine)}
              className="p-3 text-neutral-500 hover:text-primary-600"
            >
              <Plus size={20} />
            </button>
          </div>
          <button 
            onClick={() => {
              if (!cartItem) addItem(medicine);
              navigate("/cart");
            }}
            className="btn-primary flex-1 shadow-lg shadow-primary-200"
          >
            Add to Cart
          </button>
        </div>

        {/* Tabs / Info Sections */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-display font-bold flex items-center gap-2">
              <Info size={18} className="text-primary-600" />
              Description
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {medicine.description} This medicine is manufactured by {medicine.manufacturer} following international safety standards.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-bold flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary-600" />
              Dosage & Usage
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed italic">
              {medicine.dosageInfo} Consult your pharmacist or physician before starting any medication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
