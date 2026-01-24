'use client';
import { useState } from 'react';
import { ChevronDown, Truck, Award, Shield, CreditCard, Package, Clock, CheckCircle, MapPin } from 'lucide-react';

// ========================================
// EDITABLE FAQ CONFIGURATION
// ========================================
const FAQ_ITEMS = [
  {
    icon: 'Truck',
    question: 'Pristatymo sąlygos ir terminai',
    answer: '• Standartinis pristatymas: 1-4 savaitės\n• Nemokamas pristatymas užsakymams virš 1000€\n• Atsiėmimas sandėlyje Alytuje\n• Siuntinių sekimas realiuoju laiku\n• Pristatymas darbo dienomis 9:00-18:00'
  },
  {
    icon: 'Shield',
    question: 'Garantija ir grąžinimas',
    answer: 'Kokybės garantija\n• Nemokamas keitimas brakuotoms prekėms\n• 100% pinigų grąžinimas (atėmus pristatymą)\n• Garantija apima gamybos defektus\n• Netaikoma mechaniniams pažeidimams\n'
  },
  {
    icon: 'CreditCard',
    question: 'Mokėjimo būdai ir saugumas',
    answer: '• Banko kortelės: Visa, Mastercard, Maestro\n• Bankiniai pavedimai\n• PayPal mokėjimai\n• 256-bit SSL šifravimas\n• PCI DSS saugumo standartai'
  },
  {
    icon: 'Clock',
    question: 'Klientų aptarnavimas ir konsultacijos',
    answer: '• Darbo laikas: kasdien 8:00-20:00\n• Telefonas: +370 671 77164\n• El. paštas: info@dekoratoriai.lt\n• Atsakymas per 2 valandas\n• Individualūs projektai\n• Susitikimai salone Alytuje\n• Produktų pavyzdžių apžiūra'
  },
  {
    icon: 'MapPin',
    question: 'Montavimo ir įrengimo paslaugos',
    answer: '• Profesionalus montavimas visoje Lietuvoje\n• Kaina nuo 100€\n• Nemokamas matavimų vizitas\n• Sertifikuoti specialistai\n• Profesionali įranga\n• 12 mėnesių montavimo garantija\n• Darbo vietos valymas po montavimo\n• Pakuočių išgabenimas\n• Skubus montavimas per 24-48h'
  },
  {
    icon: 'CheckCircle',
    question: 'Užsakymo sekimas ir pakeitimas',
    answer: '• Patvirtinimas per 1 darbo dieną\n• Unikalus sekimo numeris\n• SMS ir el. pašto informacija\n• Būsenos tikrinimas paskyroje'
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const iconMap = {
    Truck,
    Award,
    Shield,
    CreditCard,
    Package,
    Clock,
    MapPin,
    CheckCircle
  };

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 w-full px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light text-white text-center mb-4">
          Dažnai Užduodami <span className="text-teal-300">Klausimai</span>
        </h2>
        
        <p className="text-center text-white/60 text-lg mb-12 max-w-2xl mx-auto">
          Surinkome atsakymus į dažniausiai užduodamus klausimus. Neradote ko ieškote? Susisiekite su mumis!
        </p>

        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, idx) => {
            const Icon = iconMap[faq.icon as keyof typeof iconMap];
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl" />

                <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center border border-teal-400/30">
                        <Icon className="w-6 h-6 text-teal-300" />
                      </div>
                      <span className="text-lg font-medium text-white">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 text-white/60 transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 pt-0">
                      <div className="pl-16 pr-4">
                        <p className="text-white/80 leading-relaxed text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;