'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { database } from '../firebase';
import { ref, push } from 'firebase/database';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  date: string;
}

export default function Kontaktai() {
  // Form states
  const [formData, setFormData] = useState<FormData>({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '', 
    message: '', 
    date: '' 
  });
  const [email, setEmail] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [newsMessage, setNewsMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Date handling
  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  // Time slots
  const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContactSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      setFormMessage('Prašome užpildyti visus privalomas laukus');
      return;
    }
    
    setIsSubmitting(true);
    setFormMessage('');
    
    try {
      // Save to Firebase
      await push(ref(database, 'contacts'), {
        ...formData,
        timestamp: new Date().toISOString()
      });

      // If appointment date is selected, send emails
      if (formData.date) {
        const appointmentEmailResponse = await fetch('/api/appointment-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            appointmentDate: formData.date,
            timestamp: new Date().toISOString()
          }),
        });

        const emailResult = await appointmentEmailResponse.json();
        
        if (emailResult.success) {
          setFormMessage('Žinutė išsiųsta ir patvirtinimo laiškai išsiųsti!');
        } else {
          setFormMessage('Žinutė išsaugota, bet kilo problemų siunčiant patvirtinimo laiškus. Susisieksime su jumis netrukus.');
        }
      } else {
        setFormMessage('Žinutė sėkmingai išsiųsta!');
      }
      
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '', date: '' });
    } catch (error) {
      console.error('Error:', error);
      setFormMessage('Nepavyko išsiųsti žinutės. Bandykite dar kartą arba skambinkite tiesiogiai.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewsletterSubmit = async () => {
    if (!email) return;
    
    try {
      await push(ref(database, 'subscribers'), { 
        email,
        timestamp: new Date().toISOString()
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
  };

  const toggleTimeSlots = (idx: number): void => {
    const element = document.getElementById(`times-${idx}`);
    if (element) {
      const others = document.querySelectorAll<HTMLElement>('[id^="times-"]');
      others.forEach((el) => {
        if (el !== element) el.classList.add('hidden');
      });
      element.classList.toggle('hidden');
    }
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
                    <p className="text-white/70 text-lg">dekoratoriailt@gmail.com</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-8 h-8 text-teal-300 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-light text-xl text-white mb-2">Aplankykite</h3>
                    <p className="text-white/70 text-lg">
                      Gedimino pr. 1,<br />
                      Vilnius,<br />
                      LT-01103
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-3xl blur-3xl" />
            
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Vardas"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent backdrop-blur-sm"
                    disabled={isSubmitting}
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Pavardė"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent backdrop-blur-sm"
                    disabled={isSubmitting}
                  />
                </div>
                
                <input
                  type="email"
                  name="email"
                  placeholder="El. paštas"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent backdrop-blur-sm"
                  disabled={isSubmitting}
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Telefono numeris (neprivaloma)"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent backdrop-blur-sm"
                  disabled={isSubmitting}
                />

                {/* Appointment Selection */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2 text-white/80">
                      <Calendar className="w-5 h-5 text-teal-300" />
                      <span className="text-sm">Registruotis susitikimui (neprivaloma)</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowCalendar(!showCalendar)}
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
                        onClick={() => setFormData({...formData, date: ''})}
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
                            <div id={`times-${idx}`} className="hidden mt-2 space-y-1">
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
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <textarea
                  rows={4}
                  name="message"
                  placeholder="Jūsų žinutė"
                  value={formData.message}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent backdrop-blur-sm resize-none"
                  disabled={isSubmitting}
                ></textarea>
                
                <button
                  onClick={handleContactSubmit}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white px-6 py-4 rounded-xl transition-colors text-lg font-light disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Siunčiama...' : 'Siųsti žinutę'}
                </button>
                
                {formMessage && (
                  <p className={`text-center font-light ${formMessage.includes('Nepavyko') || formMessage.includes('problemų') ? 'text-orange-400' : 'text-teal-300'}`}>
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2305.7267891876937!2d25.2797389!3d54.6871555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dd9410f85e8df1%3A0x3d60a14e96d1d6e8!2sGedimino%20pr.%201%2C%20Vilnius!5e0!3m2!1slt!2slt!4v1234567890" 
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              ></iframe>
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