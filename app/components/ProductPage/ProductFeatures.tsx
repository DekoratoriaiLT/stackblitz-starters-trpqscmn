interface ProductFeaturesProps {
  flexibleAnalogExists: boolean;
  mountingInstructions: string;
}

export function ProductFeatures({ flexibleAnalogExists, mountingInstructions }: ProductFeaturesProps) {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Aukščiausia kokybė',
      description: 'Pagaminta iš aukštos kokybės poliuretano, užtikrinančio ilgaamžiškumą'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      title: 'Paprastas montavimas',
      description: 'Lengvai montuojama su detaliosiomis instrukcijomis'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      ),
      title: flexibleAnalogExists ? 'Lankstus dizainas' : 'Standus dizainas',
      description: flexibleAnalogExists ? 'Lenkiamas pritaikymui kreivuose paviršiuose' : 'Stabili konstrukcija tiesioginiam montavimui'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Greitas pristatymas',
      description: '2000mm standartinis ilgis, paruošta siuntimui'
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">Pagrindinės savybės</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700/50 hover:border-emerald-400/50 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10 group"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-3 flex items-center">
          <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Montavimo instrukcijos
        </h3>
        <p className="text-slate-300 leading-relaxed">
          {mountingInstructions}
        </p>
      </div>
    </div>
  );
}