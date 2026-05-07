import React from "react";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useCart } from "./CartContext";
import { formatCurrency } from "../../lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-6 text-center h-[70vh]">
        <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-300">
          <ShoppingBag size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-bold text-2xl">Your cart is empty</h2>
          <p className="text-neutral-500 text-sm">Looks like you haven't added any medicines yet.</p>
        </div>
        <Link to="/shop" className="btn-primary w-full max-w-xs">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 space-y-8">
      <h2 className="font-display font-bold text-2xl">Shopping Cart</h2>
      
      <div className="space-y-4">
        {items.map((item) => (
          <motion.div
            layout
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="card-medical flex gap-4 pr-2"
          >
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-neutral-50">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-1 py-1">
              <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
              <p className="text-xs text-neutral-400 font-medium">{item.category}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="font-bold text-primary-700">{formatCurrency(item.price)}</span>
                <div className="flex items-center bg-neutral-100 rounded-xl p-0.5">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 text-neutral-500"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 text-neutral-500"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
            <button 
              onClick={() => removeItem(item.id)}
              className="p-2 text-neutral-300 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="card-medical bg-neutral-900 text-white space-y-4 p-6 shadow-xl shadow-neutral-200">
        <div className="flex justify-between items-center opacity-70 text-sm">
          <span>Subtotal</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between items-center opacity-70 text-sm">
          <span>Delivery Fee</span>
          <span>{formatCurrency(150)}</span>
        </div>
        <div className="h-px bg-white/10" />
        <div className="flex justify-between items-center pt-2">
          <span className="font-display font-medium text-lg">Total Amount</span>
          <span className="font-display font-bold text-2xl text-primary-400">{formatCurrency(total + 150)}</span>
        </div>
        
        <Link 
          to="/checkout" 
          className="btn-primary w-full flex items-center justify-center gap-2 mt-4 shadow-none hover:bg-primary-500"
        >
          Go to Checkout
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
