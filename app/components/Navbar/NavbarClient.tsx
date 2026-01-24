"use client";

import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaSearch, FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/contexts/CartContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { useBusinessAuth } from '@/app/contexts/BusinessAuthContext';

type NavLink = { href: string; label: string };
type NavbarClientProps = { navLinks: NavLink[] };

export default function NavbarClient({ navLinks }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartShake, setCartShake] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { isBusinessUser, businessAccount, clearBusinessAccount } = useBusinessAuth();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  const handleCheckout = () => {
    setCartShake(true);
    setTimeout(() => setCartShake(false), 800);
    router.push('/krepselis');
  };

  const handleLogout = async () => {
    try {
      if (isBusinessUser) {
        clearBusinessAccount();
      }
      await logout();
      setShowUserMenu(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navClass = mounted && scrolled ? 'bg-black shadow-lg' : 'bg-black';
  const userIconColor = isBusinessUser ? "text-red-500" : "text-emerald-400";
  const userHoverColor = isBusinessUser ? "hover:text-red-400" : "hover:text-emerald-400";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClass} text-white`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 py-4">
          <div className="flex items-center h-full space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Meniu"
              className="md:hidden p-2 text-white transition-transform duration-200 hover:scale-110"
            >
              {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
            
            {mounted && (
              <div className="hidden md:flex items-center h-full">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className={`flex items-center space-x-2 text-sm font-medium text-white ${userHoverColor} transition-colors duration-200 whitespace-nowrap h-full`}
                    >
                      <FaUser className={userIconColor} size={16} />
                      <span className="max-w-[150px] truncate">
                        {isBusinessUser && businessAccount ? businessAccount.companyName : user.email}
                      </span>
                      {isBusinessUser && (
                        <span className="ml-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                          Verslas
                        </span>
                      )}
                    </button>
                    
                    {showUserMenu && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-2 z-50">
                        {isBusinessUser && (
                          <Link
                            href="/verslo-paskyra"
                            onClick={() => setShowUserMenu(false)}
                            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-800 hover:text-red-400 transition-colors flex items-center space-x-2"
                          >
                            <FaUser size={14} />
                            <span>Verslo Paskyra</span>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className={`w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-800 ${isBusinessUser ? 'hover:text-red-400' : 'hover:text-emerald-400'} transition-colors flex items-center space-x-2`}
                        >
                          <FaSignOutAlt size={14} />
                          <span>Atsijungti</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/prisijungti"
                    className="flex items-center text-sm font-medium text-white hover:text-emerald-400 transition-colors duration-200 whitespace-nowrap h-full"
                  >
                    Užsiregistruoti / Prisijungti
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center flex-1 h-full">
            <Link href="/" className="flex items-center justify-center h-full">
              <Image
                src="/images/logo/logo.png"
                alt="Logo"
                width={300}
                height={120}
                className="h-auto cursor-pointer"
              />
            </Link>
          </div>

          <div className="flex items-center h-full space-x-4">
            <button aria-label="Paieška" className="p-2 transition-transform hover:scale-110">
              <FaSearch size={20} />
            </button>
            <button
              aria-label="Krepšelis"
              onClick={handleCheckout}
              className={`p-2 transition-transform relative ${cartShake ? 'animate-shake' : 'hover:scale-110'}`}
            >
              <FaShoppingCart size={20} />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:flex justify-center space-x-8 py-3 bg-black">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="relative group">
            <span
              className={`font-medium transition-colors duration-200 ${
                isActive(link.href)
                  ? 'text-emerald-400'
                  : 'text-white group-hover:text-emerald-400'
              }`}
            >
              {link.label}
            </span>
            <span
              className={`absolute -bottom-1 left-0 h-0.5 bg-emerald-400 transition-all duration-300 ${
                isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
              }`}
            ></span>
          </Link>
        ))}
      </div>

      {isOpen && (
        <div className="md:hidden bg-black shadow-lg">
          <div className="px-4 py-6">
            <div className="flex justify-center mb-6">
              <Link href="/">
                <Image
                  src="/images/logo/small-logo.jpg"
                  alt="Logo"
                  width={120}
                  height={48}
                  className="h-10 object-contain cursor-pointer"
                />
              </Link>
            </div>
            
            <div className="space-y-3">
              {navLinks.map((link) => (
                <div key={link.href} className="border-b border-gray-800 pb-3">
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive(link.href)
                        ? 'text-emerald-400'
                        : 'text-white hover:text-emerald-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
              
              {mounted && (
                <div className="border-b border-gray-800 pb-3 pt-2">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 py-2 text-sm">
                        <FaUser className={userIconColor} size={14} />
                        <span className={`truncate ${isBusinessUser ? "text-red-400" : "text-emerald-400"}`}>
                          {isBusinessUser && businessAccount ? businessAccount.companyName : user.email}
                        </span>
                        {isBusinessUser && (
                          <span className="ml-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                            Verslas
                          </span>
                        )}
                      </div>
                      {isBusinessUser && (
                        <Link
                          href="/verslo-paskyra"
                          onClick={() => setIsOpen(false)}
                          className={`w-full flex items-center space-x-2 py-2 text-sm font-medium text-white ${userHoverColor} transition-colors duration-200`}
                        >
                          <FaUser size={14} />
                          <span>Verslo Paskyra</span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2 py-2 text-sm font-medium text-white ${userHoverColor} transition-colors duration-200`}
                      >
                        <FaSignOutAlt size={14} />
                        <span>Atsijungti</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/prisijungti"
                      onClick={() => setIsOpen(false)}
                      className="block py-2 text-sm font-medium text-white hover:text-emerald-400 transition-colors duration-200"
                    >
                      Užsiregistruoti / Prisijungti
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}