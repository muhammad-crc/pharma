import React, { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Order, Prescription } from "../../types";
import { LayoutDashboard, ShoppingCart, FilePlus, Users, Package, TrendingUp, Check, X, Clock, Pill } from "lucide-react";
import { cn, formatCurrency, formatDate } from "../../lib/utils";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "prescriptions" | "inventory">("orders");

  useEffect(() => {
    const qOrders = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(20));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
    });

    const qPrescripts = query(collection(db, "prescriptions"), orderBy("createdAt", "desc"), limit(20));
    const unsubPrescripts = onSnapshot(qPrescripts, (snapshot) => {
      setPrescriptions(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Prescription)));
    });

    return () => { unsubOrders(); unsubPrescripts(); };
  }, []);

  const updateOrderStatus = async (orderId: string, status: string) => {
    await updateDoc(doc(db, "orders", orderId), { status, updatedAt: new Date().toISOString() });
  };

  const updatePrescriptionStatus = async (presId: string, status: string) => {
    await updateDoc(doc(db, "prescriptions", presId), { status });
  };

  const seedMedicines = async () => {
    try {
      const { MEDICINES_MOCK } = await import("../../constants");
      const { setDoc } = await import("firebase/firestore");
      for (const m of MEDICINES_MOCK) {
        await setDoc(doc(db, "medicines", m.id), m);
      }
      alert("Medicines seeded!");
    } catch (e) { console.error(e); }
  };

  return (
    <div className="flex h-screen bg-neutral-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 p-6 flex flex-col gap-8 flex-shrink-0">
        <div className="flex items-center gap-2 px-2">
           <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
             <Pill size={20} />
           </div>
           <h1 className="font-display font-bold text-lg tracking-tight">Admin Console</h1>
        </div>

        <nav className="space-y-1">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={false} onClick={() => {}} />
          <SidebarItem icon={<ShoppingCart size={20} />} label="Orders" active={activeTab === "orders"} onClick={() => setActiveTab("orders")} />
          <SidebarItem icon={<FilePlus size={20} />} label="Prescriptions" active={activeTab === "prescriptions"} onClick={() => setActiveTab("prescriptions")} />
          <SidebarItem icon={<Package size={20} />} label="Products" active={activeTab === "inventory"} onClick={() => setActiveTab("inventory")} />
          <SidebarItem icon={<Users size={20} />} label="Customers" active={false} onClick={() => {}} />
        </nav>

        <div className="mt-auto space-y-4">
          <button 
            onClick={seedMedicines}
            className="w-full bg-neutral-100 text-[10px] font-bold text-neutral-500 py-2 rounded-lg border border-neutral-200 uppercase tracking-widest hover:bg-neutral-200 transition-colors"
          >
            Seed Demo Data
          </button>
          <Link to="/" className="block text-xs font-bold text-neutral-400 hover:text-primary-600 transition-colors uppercase tracking-widest pl-2">
            Back to User View
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 bg-neutral-50/50">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-display font-bold capitalize">{activeTab} Management</h2>
          <div className="flex items-center gap-4">
             <div className="text-right">
               <p className="text-sm font-bold">Admin User</p>
               <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Health Expert</p>
             </div>
             <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">A</div>
          </div>
        </header>

        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
               <SummaryCard label="Pending Orders" value={orders.filter(o => o.status === 'pending').length} color="text-amber-600" icon={<Clock />} />
               <SummaryCard label="Total Revenue" value={formatCurrency(orders.reduce((a,b) => a+b.total, 0))} color="text-emerald-600" icon={<TrendingUp />} />
               <SummaryCard label="Completed" value={orders.filter(o => o.status === 'delivered').length} color="text-primary-600" icon={<Check />} />
            </div>

            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                 <thead className="bg-neutral-50/50 border-b border-neutral-200">
                    <tr className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                       <th className="px-6 py-4">Order ID</th>
                       <th className="px-6 py-4">Items</th>
                       <th className="px-6 py-4">Total</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-neutral-100">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-xs">#{order.id.slice(-6)}</td>
                        <td className="px-6 py-4">
                           <div className="flex -space-x-2">
                             {order.items.slice(0, 3).map((item, i) => (
                               <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                                 <img src={item.image} className="w-full h-full object-cover" />
                               </div>
                             ))}
                             {order.items.length > 3 && <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-bold">+{order.items.length - 3}</div>}
                           </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-primary-700">{formatCurrency(order.total)}</td>
                        <td className="px-6 py-4">
                           <span className={cn(
                             "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                             order.status === 'delivered' ? "bg-emerald-100 text-emerald-700" :
                             order.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                           )}>
                             {order.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 flex items-center gap-2">
                           <select 
                             className="text-xs bg-neutral-100 border-none rounded-lg px-2 py-1 outline-none font-bold"
                             value={order.status}
                             onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                           >
                             <option value="pending">Pending</option>
                             <option value="confirmed">Confirm</option>
                             <option value="processing">Processing</option>
                             <option value="shipped">Shipped</option>
                             <option value="delivered">Delivered</option>
                             <option value="cancelled">Cancel</option>
                           </select>
                           <Link to={`/tracking/${order.id}`} className="text-primary-600 font-bold text-xs p-1">View</Link>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === "prescriptions" && (
          <div className="grid grid-cols-2 gap-6">
            {prescriptions.map(p => (
              <motion.div 
                layout
                key={p.id}
                className="card-medical p-6 bg-white flex gap-6 border-neutral-200"
              >
                <div className="w-32 h-44 bg-neutral-100 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                  <img src={p.imageUrl} alt="pres" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Patient #{p.userId.slice(-4)}</p>
                    <p className="text-xs font-bold text-neutral-500">Uploaded {formatDate(p.createdAt)}</p>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold w-fit",
                    p.status === 'verified' ? "bg-emerald-100 text-emerald-700" :
                    p.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                  )}>
                    {p.status.toUpperCase()}
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button 
                      onClick={() => updatePrescriptionStatus(p.id!, 'verified')}
                      className="bg-primary-600 text-white p-3 rounded-2xl flex-1 hover:bg-primary-700 shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Check size={18} /> Approve
                    </button>
                    <button 
                      onClick={() => updatePrescriptionStatus(p.id!, 'rejected')}
                      className="bg-red-50 text-red-600 p-3 rounded-2xl hover:bg-red-100 transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all",
        active ? "bg-primary-600 text-white shadow-lg shadow-primary-200 scale-[1.02]" : "text-neutral-400 hover:bg-neutral-50 hover:text-primary-600"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function SummaryCard({ label, value, color, icon }: { label: string; value: any; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
      <div className={cn("p-3 rounded-2xl w-fit", color.replace('text', 'bg').replace('600', '50'))}>
        {React.cloneElement(icon as React.ReactElement, { className: color, size: 24 })}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{label}</p>
        <p className={cn("text-2xl font-display font-bold", color)}>{value}</p>
      </div>
    </div>
  );
}
