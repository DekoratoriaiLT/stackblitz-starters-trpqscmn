'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { database } from '@/app/firebase';
import { ref, push } from 'firebase/database';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  preferredTime: string;
  date: string;
}

export default function Kontaktai() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    preferredTime: '',
    date: '',
  });
  const [email, setEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [newsMessage, setNewsMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [openTimeIndex, setOpenTimeIndex] = useState<number | null>(null);

  // Date handling
  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  // Time slots
  const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContactSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.message) {
      setFormMessage('Prašome užpildyti visus privalomas laukus (vardas, pavardė, telefonas, žinutė)');
      return;
    }

    setIsSubmitting(true);
    setFormMessage('');

    try {
      await push(ref(database, 'callRequests'), {
        ...formData,
        timestamp: new Date().toISOString(),
      });

      const res = await fetch('/api/appointment-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await res.json();

      if (result.success) {
        setFormMessage('Skambutis užregistruotas! Paskambinsime jums artimiausiu metu.');
      } else {
        setFormMessage('Skambutis užregistruotas, bet kilo problemų siunčiant patvirtinimą. Paskambinsime netrukus.');
      }

      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '', preferredTime: '', date: '' });
    } catch (error) {
      console.error('Error:', error);
      setFormMessage('Nepavyko užregistruoti skambučio. Bandykite dar kartą arba skambinkite tiesiogiai.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewsletterSubmit = async () => {
    if (!email) return;
    try {
      await push(ref(database, 'subscribers'), {
        email,
        timestamp: new Date().toISOString(),
      });
      setNewsMessage('Sėkmingai prenumeruota!');
      setEmail('');
    } catch (error) {
      console.error('Newsletter error:', error);
      setNewsMessage('Prenumerata nepavyko. Bandykite dar kartą.');
    }
  };

  const selectDateTime = (date: Date, time: string): void => {
    setFormData({ ...formData, date: `${date.toDateString()} ${time}` });
    setShowCalendar(false);
    setOpenTimeIndex(null);
  };

  const toggleTimeSlots = (idx: number): void => {
    setOpenTimeIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full min-h-[60vh] flex items-center justify-center px-6 py-20">
        <div className="max-w-7xl w-full text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6 tracking-tight">
            Kontaktai
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/80">
            susisiekime ir aptarkime jūsų projektą
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-12 leading-tight">
              Susisiekite{' '}
              <span className="text-teal-300">su mumis</span>
            </h2>

            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-start space-x-4">
                  <Phone className="w-8 h-8 text-teal-300 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-light text-xl text-white mb-2">Skambinkite</h3>
                    <p className="text-white/70 text-lg">+370 671 77164</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-start space-x-4">
                  <Mail className="w-8 h-8 text-teal-300 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-light text-xl text-white mb-2">Rašykite</h3>
                    <p className="text-white/70 text-lg">info@dekoratoriai.lt</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-8 h-8 text-teal-300 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-light text-xl text-white mb-2">Aplankykite</h3>
                    <p className="text-white/70 text-lg">Alytus, Lietuva</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call-back Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-3xl blur-3xl" />

            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              {/* Form header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-teal-500/20 rounded-xl border border-teal-500/30">
                  <Phone className="w-5 h-5 text-teal-300" />
                </div>
                <div>
                  <h3 className="text-white font-light text-lg">Paprašyti skambučio</h3>
                  <p className="text-white/50 text-sm">Užpildykite formą – paskambinsime jums</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Vardas *"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent backdrop-blur-sm"
                    disabled={isSubmitting}
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Pavardė *"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent backdrop-blur-sm"
                    disabled={isSubmitting}
                  />
                </div>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Telefono numeris *"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent backdrop-blur-sm"
                  disabled={isSubmitting}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="El. paštas (neprivaloma)"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent backdrop-blur-sm"
                  disabled={isSubmitting}
                />

                {/* Preferred Time Selector */}
                <div>
                  <label className="block text-sm text-white/80 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-300" />
                    Pageidaujamas skambučio laikas (neprivaloma)
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent backdrop-blur-sm"
                    disabled={isSubmitting}
                  >
                    <option value="" className="bg-slate-800">Pasirinkite laiką</option>
                    <option value="morning" className="bg-slate-800">Rytą (9:00 – 12:00)</option>
                    <option value="midday" className="bg-slate-800">Pietų metu (12:00 – 15:00)</option>
                    <option value="afternoon" className="bg-slate-800">Popietę (15:00 – 18:00)</option>
                    <option value="any" className="bg-slate-800">Bet kurį laiką</option>
                  </select>
                </div>

                {/* Calendar / specific time-slot picker */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2 text-white/80">
                      <Calendar className="w-5 h-5 text-teal-300" />
                      <span className="text-sm">Arba pasirinkite konkrečią datą ir laiką</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCalendar(!showCalendar);
                        setOpenTimeIndex(null);
                      }}
                      className="text-sm text-teal-300 hover:text-teal-200 transition-colors"
                      disabled={isSubmitting}
                    >
                      {showCalendar ? 'Paslėpti' : 'Rodyti kalendorių'}
                    </button>
                  </div>

                  {formData.date && (
                    <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl mb-3 text-sm text-white border border-white/20">
                      Pasirinkta: {formData.date}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, date: '' })}
                        className="ml-2 text-xs text-teal-300 hover:text-teal-200"
                        disabled={isSubmitting}
                      >
                        Išvalyti
                      </button>
                    </div>
                  )}

                  {showCalendar && (
                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/20 mb-4">
                      <div className="grid grid-cols-7 gap-2">
                        {dates.map((date, idx) => (
                          <div key={idx} className="text-center">
                            <div className="text-xs mb-2 text-white/60">
                              {date.toLocaleDateString('lt-LT', { weekday: 'short' })}
                            </div>
                            <button
                              type="button"
                              className="w-full py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                              onClick={() => toggleTimeSlots(idx)}
                              disabled={isSubmitting}
                            >
                              {date.getDate()}
                            </button>
                            {openTimeIndex === idx && (
                              <div className="mt-2 space-y-1">
                                {timeSlots.map(time => (
                                  <button
                                    key={time}
                                    type="button"
                                    className="w-full text-xs py-1.5 bg-white/10 hover:bg-teal-500 hover:text-white text-white/80 rounded-lg transition-colors border border-white/10"
                                    onClick={() => selectDateTime(date, time)}
                                    disabled={isSubmitting}
                                  >
                                    {time}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <textarea
                  rows={3}
                  name="message"
                  placeholder="Trumpas aprašymas apie jūsų poreikį *"
                  value={formData.message}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent backdrop-blur-sm resize-none"
                  disabled={isSubmitting}
                />

                <button
                  onClick={handleContactSubmit}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white px-6 py-4 rounded-xl transition-colors text-lg font-light disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  <Phone className="w-5 h-5" />
                  {isSubmitting ? 'Registruojama...' : 'Paprašyti skambučio'}
                </button>

                {formMessage && (
                  <p className={`text-center font-light text-sm ${formMessage.includes('Nepavyko') || formMessage.includes('problemų') ? 'text-orange-400' : 'text-teal-300'}`}>
                    {formMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            <div className="w-full h-[400px] bg-slate-800/50">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18448.5!2d24.0513!3d54.2263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46de0a4f1a7b1ef5%3A0x9b3c5a6c8d2e1a0!2sAlytus%2C%20Lithuania!5e0!3m2!1slt!2slt!4v1735000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="w-full py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-3xl blur-3xl" />
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-light text-white mb-3">
                    Naujienlaiškis
                  </h2>
                  <p className="text-white/70 font-light">
                    Gaukite naujienas ir specialius pasiūlymus tiesiai į savo el. paštą
                  </p>
                </div>
                <div>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      placeholder="Jūsų el. paštas"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleNewsletterSubmit()}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 backdrop-blur-sm"
                    />
                    <button
                      onClick={handleNewsletterSubmit}
                      className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-colors font-light"
                    >
                      Siųsti
                    </button>
                  </div>
                  {newsMessage && (
                    <p className={`text-sm mt-3 font-light ${newsMessage.includes('nepavyko') ? 'text-orange-400' : 'text-teal-300'}`}>
                      {newsMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}