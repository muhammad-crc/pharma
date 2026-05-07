import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import { useAuth } from "../auth/AuthContext";
import { db } from "../../lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { formatCurrency } from "../../lib/utils";
import { CheckCircle2, ChevronRight, MapPin, CreditCard, Clock } from "lucide-react";
import { motion } from "motion/react";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    street: "123 Healthcare Ave",
    city: "Karachi",
    phone: user?.phoneNumber || "0300-1234567"
  });

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        userId: user?.uid,
        items,
        total,
        status: "pending",
        address,
        paymentMethod: "COD",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      setStep(3);
      clearCart();
    } catch (error) {
      console.error("Order error", error);
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[70vh] space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"
        >
          <CheckCircle2 size={64} />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-bold">Order Confirmed!</h2>
          <p className="text-neutral-500">Your medicine will be with you in 60-90 minutes.</p>
        </div>
        <button 
          onClick={() => navigate("/")}
          className="btn-primary w-full max-w-xs"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 space-y-10">
       <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold underline decoration-primary-300 underline-offset-8">Checkout</h2>
          <div className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full uppercase tracking-widest">
            Step {step} of 2
          </div>
       </div>

       {step === 1 ? (
         <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="space-y-6"
         >
           <section className="space-y-4">
             <h3 className="font-bold flex items-center gap-2">
               <MapPin size={18} className="text-primary-600" />
               Delivery Address
             </h3>
             <div className="card-medical p-6 space-y-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Street Address</label>
                 <input 
                   className="input-medical" 
                   value={address.street} 
                   onChange={e => setAddress({...address, street: e.target.value})}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Phone Number</label>
                 <input 
                   className="input-medical" 
                   value={address.phone} 
                   onChange={e => setAddress({...address, phone: e.target.value})}
                 />
               </div>
             </div>
           </section>

           <button onClick={() => setStep(2)} className="btn-primary w-full flex items-center justify-center gap-2">
             Continue to Payment
             <ChevronRight size={20} />
           </button>
         </motion.div>
       ) : (
         <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="space-y-8"
         >
           <section className="space-y-4">
             <h3 className="font-bold flex items-center gap-2">
               <CreditCard size={18} className="text-primary-600" />
               Payment Method
             </h3>
             <div className="card-medical p-6 border-primary-500 bg-primary-50/50 flex items-center justify-between ring-2 ring-primary-500">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                   <Clock size={24} className="text-primary-600" />
                 </div>
                 <div>
                    <h4 className="font-bold text-sm">Cash on Delivery</h4>
                    <p className="text-[10px] text-primary-700 font-bold uppercase tracking-wider">Fastest Option</p>
                 </div>
               </div>
               <CheckCircle2 className="text-primary-600" size={24} />
             </div>
           </section>

           <div className="card-medical space-y-4 shadow-xl shadow-primary-50">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-neutral-500 tracking-tight">Order Total</span>
                <span className="text-neutral-900 font-bold">{formatCurrency(total + 150)}</span>
              </div>
              <p className="text-[10px] text-neutral-400 leading-relaxed text-center">
                By clicking "Place Order", you agree to our Terms of Service and Pharmacy Safety Guidelines.
              </p>
              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? "Processing..." : `Place Order · ${formatCurrency(total + 150)}`}
              </button>
              <button 
                onClick={() => setStep(1)}
                className="w-full text-center text-xs font-bold text-neutral-400 py-2"
              >
                Go Back
              </button>
           </div>
         </motion.div>
       )}
    </div>
  );
}
