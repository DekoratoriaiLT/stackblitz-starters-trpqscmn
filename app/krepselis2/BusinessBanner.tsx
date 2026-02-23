"use client";

import { Building2, TrendingDown } from "lucide-react";

export default function BusinessBanner({ businessAccount, discountRate }: any) {
  return (
    <div className="mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-teal-800 text-white rounded-3xl p-6">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 flex items-center justify-center">
          <Building2 className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-xl font-medium">Verslo paskyra</h3>
          <p className="text-white/60">{businessAccount.companyName}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-teal-400/20 backdrop-blur-xl rounded-xl px-4 py-3 border border-teal-400/30">
        <TrendingDown className="w-5 h-5 text-teal-300" />
        <span className="text-sm">
          Pritaikyta <span className="font-semibold">{discountRate}% verslo nuolaida</span> visiems produktams
        </span>
      </div>
    </div>
  );
}
