"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useBusinessAuth } from "../contexts/BusinessAuthContext";
import MainContent from "@/app/components/Produktai/MainContent/MainContent";
import { Building2, Mail, TrendingDown, LogOut, Package } from "lucide-react";

interface Product {
  id: string | number;
  title: string;
  img: string;
  ilgis?: number;
  aukstis?: number | number[];
  stilius?: string;
  sudetis?: string;
  gylis?: number;
  pristatymo_terminas?: string;
  papildoma_informacija?: string;
  description?: string;
  old_price?: number;
  price?: number;
}

interface BusinessAccount {
  email: string;
  companyName: string;
  companyCode: string;
  phone: string;
  registeredAt: string;
}

// Available product categories
const CATEGORIES = [
  { value: "produktai", label: "Visi produktai", dataFile: "produktai.json" },
  { value: "kolonos", label: "Kolonos", dataFile: "kolonos/kolonos.json" },
  { value: "architravai", label: "Architravai", dataFile: "architravai/architravai.json" },
  { value: "balustrai", label: "Balustrai", dataFile: "balustrai/balustrai.json" },
  { value: "kapiteliai", label: "Kapiteliai", dataFile: "kapiteliai/kapiteliai.json" },
  { value: "rozetes", label: "Rozetės", dataFile: "rozetes/rozetes.json" },
  { value: "ornamentai", label: "Ornamentai", dataFile: "ornamentai/ornamentai.json" },
  { value: "sienu-paneles", label: "Sienų panelės", dataFile: "sienu-paneles/sienu-paneles.json" },
];

export default function BusinessAccountPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [businessAccount, setBusinessAccount] = useState<BusinessAccount | null>(null);
  const [discountRate, setDiscountRate] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

  useEffect(() => {
    if (!user) {
      router.push('/verslo-registracija');
      return;
    }

    const storedData = localStorage.getItem('businessAccount');
    if (storedData) {
      setBusinessAccount(JSON.parse(storedData));
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      // Clear business account from context
      setBusinessAccount(null);
      await logout();
      router.push('/verslo-registracija');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAddToCart = (product: Product) => {
    const discountedPrice = product.price ? product.price * (1 - discountRate / 100) : 0;
    
    const businessProduct = {
      ...product,
      originalPrice: product.price,
      price: discountedPrice,
      businessDiscount: discountRate
    };

    const cart = JSON.parse(localStorage.getItem("businessCart") || "[]");
    const existingItem = cart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...businessProduct, quantity: 1 });
    }
    
    localStorage.setItem("businessCart", JSON.stringify(cart));
  };

  if (!user) {
    return null;
  }

  const pageData = {
    title: selectedCategory.label,
    dataFile: selectedCategory.dataFile,
    imageSuffixes: ["_1", "_2", "_3", "_4", "_5"],
    maxImages: 5,
    baseUrl: "/produktai",
    R2FolderName: selectedCategory.value, // Add R2 folder name
    FilterPanelCategories: [], // Add empty array or populate with actual categories if needed
    customFilterConfig: {
      priceRange: [
        { value: "all", label: "Visos kainos" },
      ],
      material: [
        { value: "all", label: "Visos medžiagos" },
      ],
      style: [
        { value: "all", label: "Visi stiliai" },
      ],
    },
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Business Account Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-light">Verslo Paskyra</h1>
                <p className="text-white/60">Jūsų verslo valdymo centras</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Atsijungti
            </button>
          </div>

          {/* Business Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {businessAccount && (
              <>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-5 h-5 text-teal-300" />
                    <span className="text-sm text-white/60">Įmonė</span>
                  </div>
                  <p className="text-lg font-medium">{businessAccount.companyName}</p>
                  <p className="text-sm text-white/60">Kodas: {businessAccount.companyCode}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-teal-300" />
                    <span className="text-sm text-white/60">Kontaktai</span>
                  </div>
                  <p className="text-lg font-medium break-all">{businessAccount.email}</p>
                  <p className="text-sm text-white/60">{businessAccount.phone}</p>
                </div>
              </>
            )}

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="w-5 h-5 text-teal-300" />
                <span className="text-sm text-white/60">Jūsų nuolaida</span>
              </div>
              <p className="text-3xl font-light">{discountRate}%</p>
              <p className="text-sm text-white/60">Visiems produktams</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Selector */}
        <div className="mb-8 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-600" />
            <h2 className="text-2xl font-light text-gray-900">Produktų katalogas</h2>
          </div>
          <select
            value={selectedCategory.value}
            onChange={(e) => {
              const category = CATEGORIES.find(c => c.value === e.target.value);
              if (category) setSelectedCategory(category);
            }}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">Visų produktų kainos jau su {discountRate}% verslo nuolaida</p>
        </div>

        <MainContent PageData={pageData} />
      </div>
    </div>
  );
}