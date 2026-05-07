import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Order } from "../../types";
import { Package, Truck, CheckCircle2, MapPin, Clock, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { cn, formatDate, formatCurrency } from "../../lib/utils";

const STEPS = [
  { id: "pending", label: "Order Placed", icon: <Package size={20} />, color: "bg-amber-500" },
  { id: "confirmed", label: "Confirmed", icon: <CheckCircle2 size={20} />, color: "bg-emerald-500" },
  { id: "processing", label: "Preparing", icon: <Clock size={20} />, color: "bg-blue-500" },
  { id: "shipped", label: "Out for Delivery", icon: <Truck size={20} />, color: "bg-medical-teal" },
  { id: "delivered", label: "Delivered", icon: <CheckCircle2 size={20} />, color: "bg-primary-600" },
];

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;
    return onSnapshot(doc(db, "orders", id), (doc) => {
      if (doc.exists()) setOrder({ id: doc.id, ...doc.data() } as Order);
    });
  }, [id]);

  if (!order) return <div className="p-20 text-center">Loading order details...</div>;

  const currentStepIndex = STEPS.findIndex(s => s.id === order.status);

  return (
    <div className="px-6 py-8 space-y-10">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-bold">Track Order</h2>
        <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
           <span>Order #{order.id.slice(-6)}</span>
           <span>Placed {formatDate(order.createdAt)}</span>
        </div>
      </div>

      {/* Main Status */}
      <section className="card-medical p-8 bg-neutral-900 border-none shadow-2xl shadow-primary-100 overflow-hidden relative">
         <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-white font-display font-bold text-2xl tracking-tight">
                  {STEPS[currentStepIndex]?.label || "Processing"}
                </p>
                <div className="flex items-center gap-2 text-primary-400 text-xs font-bold">
                   <Clock size={14} />
                   <span>Arriving in approx. 45 mins</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-[20px] flex items-center justify-center text-white backdrop-blur-md border border-white/10">
                {STEPS[currentStepIndex]?.icon || <Package size={32} />}
              </div>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/30 rounded-full -mr-10 -mt-10 blur-3xl" />
      </section>

      {/* Timeline */}
      <section className="space-y-10 pl-4 py-4">
        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div key={step.id} className="relative flex gap-6">
              {/* Line */}
              {idx !== STEPS.length - 1 && (
                <div className={cn(
                  "absolute left-[13px] top-6 w-[2px] h-12 transition-colors duration-1000",
                  isCompleted ? "bg-primary-500" : "bg-neutral-100"
                )} />
              )}
              
              {/* Point */}
              <div className={cn(
                "relative z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500",
                isCompleted ? "bg-primary-600 shadow-lg shadow-primary-200" : "bg-white border-2 border-neutral-100"
              )}>
                {isCompleted && <CheckCircle2 className="text-white" size={14} />}
              </div>

              {/* Text */}
              <div className={cn("space-y-0.5", isCompleted ? "opacity-100" : "opacity-40")}>
                <h4 className={cn("text-sm font-bold", isCurrent ? "text-primary-700" : "text-neutral-900")}>
                  {step.label}
                </h4>
                <p className="text-[10px] text-neutral-400 font-medium">
                  {isCompleted ? "Completed" : "Waiting..."}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Delivery Info */}
      <section className="card-medical p-6 space-y-4">
        <h3 className="font-bold text-sm tracking-tight border-b border-neutral-100 pb-3">Delivery Details</h3>
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-600">
            <MapPin size={20} />
          </div>
          <div className="space-y-1">
             <p className="text-xs font-bold text-neutral-800">{order.address.street}</p>
             <p className="text-[10px] text-neutral-500 font-medium">{order.address.city}</p>
          </div>
        </div>
      </section>

      <Link to="/" className="btn-primary w-full flex items-center justify-center gap-2">
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>
    </div>
  );
}
