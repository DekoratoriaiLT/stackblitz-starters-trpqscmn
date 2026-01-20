interface ProductInfoProps {
  name: string;
  category: string;
  details: Record<string, string>;
  url: string;
}

export function ProductInfo({ name, category, details, url }: ProductInfoProps) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-emerald-400 text-sm font-bold mb-3 uppercase tracking-wider">
          {category.replace(/-/g, ' ')}
        </p>
        <h1 className="text-5xl font-bold text-white mb-2 leading-tight">{name}</h1>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 border border-slate-700/50 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Techninės charakteristikos
        </h2>
        <dl className="space-y-4">
          {Object.entries(details).map(([key, value]) => (
            <div 
              key={key} 
              className="flex justify-between items-center py-3 border-b border-slate-700/50 last:border-0 hover:bg-slate-800/30 px-3 -mx-3 rounded-lg transition-colors duration-200"
            >
              <dt className="text-slate-400 font-semibold">{key}</dt>
              <dd className="text-white font-bold text-lg">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}