import React, { useState } from "react";
import { Camera, FileText, Upload, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { db } from "../../lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useAuth } from "../auth/AuthContext";

export default function PrescriptionUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    setLoading(true);
    try {
      // In a real app we'd upload to Firebase Storage
      // Here we simulate and store metadata
      await addDoc(collection(db, "prescriptions"), {
        userId: user.uid,
        imageUrl: preview, // Storing base64 for MVP demo
        status: "pending",
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
    } catch (error) {
      console.error("Upload error", error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[70vh] space-y-6">
        <motion.div
           initial={{ scale: 0 }} animate={{ scale: 1 }}
           className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"
        >
          <CheckCircle2 size={64} />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold">Prescription Uploaded</h2>
          <p className="text-neutral-500 text-sm">Our pharmacists will verify it shortly. You can proceed with your order.</p>
        </div>
        <button onClick={() => navigate("/")} className="btn-primary w-full max-w-xs">Return Home</button>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-display font-bold tracking-tight">Prescription Upload</h2>
        <p className="text-neutral-500 text-sm font-medium">Please upload a clear photo or PDF of your doctor's prescription.</p>
      </div>

      {!file ? (
        <label className="block">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="border-2 border-dashed border-neutral-200 rounded-[32px] p-12 flex flex-col items-center justify-center space-y-4 bg-white cursor-pointer hover:border-primary-400 hover:bg-primary-50/20 transition-all duration-300"
          >
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center">
              <Camera size={32} />
            </div>
            <div className="text-center space-y-1">
              <p className="font-bold text-neutral-800">Choose File or Take Photo</p>
              <p className="text-xs text-neutral-400 font-medium tracking-wide">Supported: JPG, PNG, PDF (Max 5MB)</p>
            </div>
            <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange} />
          </motion.div>
        </label>
      ) : (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="card-medical p-4 relative overflow-hidden aspect-video bg-neutral-100">
              {preview && <img src={preview} alt="preview" className="w-full h-full object-contain rounded-xl" />}
              <button 
                onClick={() => {setFile(null); setPreview(null);}}
                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
              <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
              <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                Ensure the doctor's name, patient name, and clinic stamp are clearly visible to avoid rejection.
              </p>
            </div>

            <button 
              onClick={handleUpload}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? "Uploading..." : <><Upload size={20} /> Confirm & Upload</>}
            </button>
          </motion.div>
        </AnimatePresence>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="card-medical flex items-center gap-3 p-4 bg-neutral-100/50 border-none">
          <FileText className="text-primary-600" size={24} />
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">Status</p>
            <p className="text-xs font-bold text-neutral-800">Verified Securely</p>
          </div>
        </div>
        <div className="card-medical flex items-center gap-3 p-4 bg-neutral-100/50 border-none">
          <Clock className="text-primary-600" size={24} />
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">Avg Time</p>
            <p className="text-xs font-bold text-neutral-800">5-10 Minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Clock } from "lucide-react";
