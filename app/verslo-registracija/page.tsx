'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useBusinessAuth } from '../contexts/BusinessAuthContext';
import { Mail, Lock, Building2, AlertCircle, CheckCircle, Phone, Briefcase } from 'lucide-react';

export default function BusinessRegistrationPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup, login, user } = useAuth();
  const { setBusinessAccount, isBusinessUser } = useBusinessAuth();
  const router = useRouter();

  // Redirect if already logged in as business user
  useEffect(() => {
    if (user && isBusinessUser) {
      router.push('/verslo-paskyra');
    }
  }, [user, isBusinessUser, router]);

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Prašome užpildyti visus laukus');
      console.warn("Validation failed: missing email or password");
      return;
    }

    if (!isLogin && (!companyName || !phone || !companyCode)) {
      setError('Prašome užpildyti visus laukus');
      console.warn("Validation failed: missing company details");
      return;
    }

    // Validate UAB company code format (9 digits in Lithuania)
    if (!isLogin && !/^\d{9}$/.test(companyCode)) {
      setError('Įmonės kodas turi būti 9 skaitmenų');
      console.warn("Validation failed: invalid company code format");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Slaptažodžiai nesutampa');
      console.warn("Validation failed: passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError('Slaptažodis turi būti bent 6 simbolių');
      console.warn("Validation failed: password too short");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Login existing business user
        await login(email, password);
        
        // Load business account from localStorage
        const storedData = localStorage.getItem('businessAccount');
        if (storedData) {
          const businessData = JSON.parse(storedData);
          setBusinessAccount(businessData);
        }
        
        setSuccess('Sėkmingai prisijungėte!');
        
        // Redirect to business account page immediately
        router.push('/verslo-paskyra');
      } else {
        // Register new business user
        await signup(email, password);
        
        // Save company details
        const businessData = {
          email,
          companyName,
          companyCode,
          phone,
          registeredAt: new Date().toISOString()
        };
        
        setBusinessAccount(businessData);
        
        setSuccess('Verslo paskyra sėkmingai sukurta! Netrukus su jumis susisieksime.');
        
        // Redirect to business account page
        setTimeout(() => {
          router.push('/verslo-paskyra');
        }, 2000);
      }
      
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setCompanyName('');
      setCompanyCode('');
      setPhone('');
    } catch (err: any) {
      console.error("Authentication error:", err);

      if (err.code === 'auth/email-already-in-use') {
        setError('Šis el. paštas jau naudojamas');
      } else if (err.code === 'auth/invalid-email') {
        setError('Neteisingas el. pašto formatas');
      } else if (err.code === 'auth/user-not-found') {
        setError('Vartotojas nerastas');
      } else if (err.code === 'auth/wrong-password') {
        setError('Neteisingas slaptažodis');
      } else if (err.code === 'auth/weak-password') {
        setError('Slaptažodis per silpnas');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Neteisingi prisijungimo duomenys');
      } else {
        setError('Įvyko klaida. Bandykite dar kartą.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 overflow-hidden relative flex items-center justify-center p-6">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      <div className="relative max-w-5xl w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-[3rem] blur-3xl" />

        <div className="relative bg-white/10 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column - Benefits */}
<div className="space-y-6">
  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 mb-4">
    <Building2 className="w-10 h-10 text-white" />
  </div>

  <h1 className="text-4xl md:text-5xl font-light text-white mb-2">
    Verslo Paskyra
  </h1>

  <p className="text-white/80 text-lg leading-relaxed">
    Skirta klientams, kurie pateikia bent 1 užsakymą per mėnesį ir siekia ilgalaikio bendradarbiavimo.
  </p>

  <p className="text-white/60 text-sm leading-relaxed">
    Verslo paskyra skirta aktyviems klientams, norintiems gauti geresnes kainas, prioritetinį aptarnavimą ir individualias sąlygas.
  </p>

  <div className="space-y-4 pt-4">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-teal-400/20 flex items-center justify-center flex-shrink-0 mt-1">
        <CheckCircle className="w-5 h-5 text-teal-300" />
      </div>
      <div>
        <h3 className="text-white font-medium text-lg">5% nuolaida</h3>
        <p className="text-white/60 text-sm">
          Konkurencingos kainos visiems produktams
        </p>
      </div>
    </div>

    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-teal-400/20 flex items-center justify-center flex-shrink-0 mt-1">
        <CheckCircle className="w-5 h-5 text-teal-300" />
      </div>
      <div>
        <h3 className="text-white font-medium text-lg">
          Prioritetinis aptarnavimas
        </h3>
        <p className="text-white/60 text-sm">
          Greitas reagavimas į užklausas ir užsakymus
        </p>
      </div>
    </div>

    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-teal-400/20 flex items-center justify-center flex-shrink-0 mt-1">
        <CheckCircle className="w-5 h-5 text-teal-300" />
      </div>
      <div>
        <h3 className="text-white font-medium text-lg">
          Individualios sąlygos
        </h3>
        <p className="text-white/60 text-sm">
          Pritaikytos mokėjimo ir pristatymo galimybės
        </p>
      </div>
    </div>

    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-teal-400/20 flex items-center justify-center flex-shrink-0 mt-1">
        <CheckCircle className="w-5 h-5 text-teal-300" />
      </div>
      <div>
        <h3 className="text-white font-medium text-lg">
          Skirta aktyviems klientams
        </h3>
        <p className="text-white/60 text-sm">
          Mažiausiai 1 užsakymas per mėnesį
        </p>
      </div>
    </div>
  </div>
</div>


            {/* Right Column - Form */}
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-light text-white mb-2">
                  {isLogin ? 'Prisijungti' : 'Sukurti Paskyrą'}
                </h2>
                <p className="text-white/60 text-sm">
                  {isLogin ? 'Jau turite verslo paskyrą?' : 'Pradėkite taupyti šiandien'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-500/10 backdrop-blur-xl border border-green-500/20 rounded-2xl flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-green-200 text-sm">{success}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Company Name - Only for signup */}
                {!isLogin && (
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Įmonės pavadinimas (UAB)
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Briefcase className="w-5 h-5 text-white/40" />
                      </div>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
                        placeholder="UAB Jūsų Įmonė"
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {/* Company Code - Only for signup */}
                {!isLogin && (
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Įmonės kodas
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Building2 className="w-5 h-5 text-white/40" />
                      </div>
                      <input
                        type="text"
                        value={companyCode}
                        onChange={(e) => setCompanyCode(e.target.value.replace(/\D/g, '').slice(0, 9))}
                        className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
                        placeholder="123456789"
                        maxLength={9}
                        disabled={loading}
                      />
                    </div>
                    <p className="text-white/40 text-xs mt-1 ml-1">9 skaitmenų įmonės kodas</p>
                  </div>
                )}

                {/* Email Input */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    El. paštas
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Mail className="w-5 h-5 text-white/40" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
                      placeholder="kontaktai@jusuimone.lt"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Phone - Only for signup */}
                {!isLogin && (
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Telefono numeris
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Phone className="w-5 h-5 text-white/40" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
                        placeholder="+370 671 77164"
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {/* Password Input */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Slaptažodis
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Lock className="w-5 h-5 text-white/40" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
                      placeholder="••••••••"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Confirm Password Input */}
                {!isLogin && (
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Patvirtinkite slaptažodį
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Lock className="w-5 h-5 text-white/40" />
                      </div>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
                        placeholder="••••••••"
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-white/90 backdrop-blur-sm text-slate-900 py-4 rounded-2xl font-medium text-lg shadow-lg hover:bg-white hover:scale-105 transform transition-all duration-300 border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
                >
                  {loading ? 'Kraunama...' : isLogin ? 'Prisijungti' : 'Sukurti Verslo Paskyrą'}
                </button>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  {isLogin ? (
                    <>
                      Neturite verslo paskyros?{' '}
                      <span className="text-teal-300 font-medium">Registruokitės</span>
                    </>
                  ) : (
                    <>
                      Jau turite paskyrą?{' '}
                      <span className="text-teal-300 font-medium">Prisijunkite</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}