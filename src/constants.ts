export const APP_NAME = "PharmaCare Pro";

export const CATEGORIES = [
  { id: "1", name: "Fever & Pain", icon: "Thermometer", color: "bg-red-50 text-red-600" },
  { id: "2", name: "Cough & Cold", icon: "Wind", color: "bg-blue-50 text-blue-600" },
  { id: "3", name: "Supplements", icon: "Zap", color: "bg-amber-50 text-amber-600" },
  { id: "4", name: "Personal Care", icon: "Sparkles", color: "bg-emerald-50 text-emerald-600" },
  { id: "5", name: "Diabetes", icon: "Activity", color: "bg-purple-50 text-purple-600" },
  { id: "6", name: "Baby Care", icon: "Baby", color: "bg-pink-50 text-pink-600" }
];

export const MEDICINES_MOCK = [
  {
    id: "m1",
    name: "Panadol Advance 500mg",
    genericName: "Paracetamol",
    category: "Fever & Pain",
    price: 350,
    description: "Effective relief for pain and fever. Gentle on stomach.",
    dosageInfo: "One to two tablets every 4 to 6 hours as needed.",
    manufacturer: "GSK",
    stock: 120,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    prescriptionRequired: false,
    tags: ["fever", "headache", "pain"]
  },
  {
    id: "m2",
    name: "Augmentin 625mg",
    genericName: "Amoxicillin + Clavulanic Acid",
    category: "Antibiotics",
    price: 1200,
    description: "Powerful antibiotic for bacterial infections.",
    dosageInfo: "Take exactly as prescribed by your doctor.",
    manufacturer: "GSK",
    stock: 45,
    image: "https://images.unsplash.com/photo-1471864190281-ad5f9f81ce44?auto=format&fit=crop&q=80&w=800",
    prescriptionRequired: true,
    tags: ["antibiotic", "infection"]
  },
  {
    id: "m3",
    name: "Centrum Adult",
    genericName: "Multivitamins",
    category: "Supplements",
    price: 4500,
    description: "A complete multivitamin for adults with high levels of Vitamin D.",
    dosageInfo: "Take one tablet daily with food.",
    manufacturer: "Haleon",
    stock: 30,
    image: "https://images.unsplash.com/photo-1550572017-ed30ec2f0bc0?auto=format&fit=crop&q=80&w=800",
    prescriptionRequired: false,
    tags: ["vitamin", "health", "daily"]
  },
  {
    id: "m4",
    name: "Vicks VapoRub",
    genericName: "Menthol + Camphor",
    category: "Cough & Cold",
    price: 450,
    description: "Topical ointment for nasal congestion and cough relief.",
    dosageInfo: "Apply to chest and throat for relief.",
    manufacturer: "P&G",
    stock: 80,
    image: "https://images.unsplash.com/photo-1559839734-2b71f1e3c770?auto=format&fit=crop&q=80&w=800",
    prescriptionRequired: false,
    tags: ["cough", "cold", "relief"]
  }
];
