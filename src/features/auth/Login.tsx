import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Pill, Chrome } from "lucide-react";
import { motion } from "motion/react";
import { APP_NAME } from "../../constants";

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;
  if (user) return <Navigate to="/" />;

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden">
      <div className="flex-1 flex flex-col justify-center px-10 space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 text-center"
        >
          <div className="w-20 h-20 bg-primary-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-primary-100">
            <Pill size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-bold tracking-tight">{APP_NAME}</h1>
            <p className="text-neutral-500 font-medium leading-relaxed px-4">
              Your premium health companion. Get medicines delivered in 60 minutes.
            </p>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.3 }}
           className="space-y-4"
        >
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-neutral-200 text-neutral-700 py-4 rounded-[24px] font-bold shadow-sm hover:bg-neutral-50 transition-all active:scale-[0.98]"
          >
            <Chrome className="text-blue-500" />
            Continue with Google
          </button>
          
          <p className="text-center text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
            Secure · Fast · Verified
          </p>
        </motion.div>
      </div>

      <div className="p-10 flex flex-col gap-6 items-center">
        <div className="flex -space-x-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-neutral-50 overflow-hidden bg-neutral-200">
              <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
            </div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-neutral-50 bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-700">
            +5k
          </div>
        </div>
        <p className="text-xs font-semibold text-neutral-500">Joined by 10,000+ healthy users</p>
      </div>
    </div>
  );
}
