'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaExchangeAlt,
} from 'react-icons/fa';

import { useCart } from '@/app/contexts/CartContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { useBusinessAuth } from '@/app/contexts/BusinessAuthContext';

type NavLink = {
  label: string;
  href: string;
};

type NavbarClientProps = {
  navLinks: NavLink[];
};

export default function NavbarClient({
  navLinks,
}: NavbarClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  const cartContext = useCart() as any;
  const authContext = useAuth() as any;
  const businessContext = useBusinessAuth() as any;

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartShake, setCartShake] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // 0 = dark logo fully visible; 1 = white logo fully visible.
  const [whiteLogoOpacity, setWhiteLogoOpacity] = useState(1);

  const cartItems =
    cartContext?.cartItems ??
    cartContext?.cart ??
    [];

  const cartCount = Array.isArray(cartItems)
    ? cartItems.reduce(
        (total: number, item: any) =>
          total + (Number(item.quantity) || 1),
        0,
      )
    : 0;

  const user =
    authContext?.user ??
    authContext?.currentUser ??
    null;

  const logout =
    authContext?.logout ??
    authContext?.signOut ??
    authContext?.logoutUser;

  const businessAccount =
    businessContext?.businessAccount ??
    businessContext?.account ??
    null;

  const businessLogout =
    businessContext?.logoutBusiness ??
    businessContext?.signOutBusiness ??
    businessContext?.logout;

  const [isBusiness, setIsBusiness] = useState(false);

  useEffect(() => {
    setMounted(true);

    let animationFrame = 0;

    const updateBackgroundBrightness = () => {
      const navbar = document.querySelector(
        '[data-navbar-glass]',
      );

      if (!navbar) return;

      const rect = navbar.getBoundingClientRect();

      // Sample several points behind the navbar instead of only one.
      const samplePoints = [
        [rect.left + rect.width * 0.15, rect.top + rect.height / 2],
        [rect.left + rect.width * 0.5, rect.top + rect.height / 2],
        [rect.left + rect.width * 0.85, rect.top + rect.height / 2],
      ];

      const brightnessValues: number[] = [];

      for (const [rawX, rawY] of samplePoints) {
        const x = Math.min(
          window.innerWidth - 1,
          Math.max(0, Math.round(rawX)),
        );

        const y = Math.min(
          window.innerHeight - 1,
          Math.max(0, Math.round(rawY)),
        );

        const elements = document.elementsFromPoint(x, y);

        const backgroundElement = elements.find(
          (element) => !element.closest('[data-navbar-glass]'),
        );

        let current: Element | null = backgroundElement ?? null;
        let detectedBrightness = 255;

        while (
          current &&
          current !== document.documentElement
        ) {
          const backgroundColor =
            window.getComputedStyle(current).backgroundColor;

          const match = backgroundColor.match(
            /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/,
          );

          if (match) {
            const alphaMatch = backgroundColor.match(
              /rgba?\([^)]*[,/]\s*([\d.]+)\s*\)/,
            );

            const alpha =
              backgroundColor.startsWith('rgba') && alphaMatch
                ? Number(alphaMatch[1])
                : 1;

            if (alpha > 0.05) {
              const red = Number(match[1]);
              const green = Number(match[2]);
              const blue = Number(match[3]);

              const brightness =
                (red * 299 + green * 587 + blue * 114) / 1000;

              // Blend translucent CSS backgrounds with the next
              // ancestor's background colour.
              detectedBrightness =
                brightness * alpha + 255 * (1 - alpha);

              break;
            }
          }

          current = current.parentElement;
        }

        brightnessValues.push(detectedBrightness);
      }

      if (brightnessValues.length === 0) return;

      const averageBrightness =
        brightnessValues.reduce((sum, value) => sum + value, 0) /
        brightnessValues.length;

      /*
       * Map background brightness continuously to logo opacity:
       * brightness <= 65  -> white logo
       * brightness >= 210 -> dark logo
       * between those     -> smooth blend
       */
      const minBrightness = 65;
      const maxBrightness = 210;

      const normalized =
        (averageBrightness - minBrightness) /
        (maxBrightness - minBrightness);

      const clamped = Math.max(0, Math.min(1, normalized));

      // Smoothstep curve gives a softer transition.
      const smooth = clamped * clamped * (3 - 2 * clamped);

      setWhiteLogoOpacity(1 - smooth);
    };

    const updateScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const updateAll = () => {
      updateScroll();
      updateBackgroundBrightness();
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateAll);
    };

    updateAll();

    window.addEventListener('scroll', scheduleUpdate, {
      passive: true,
    });
    window.addEventListener('resize', scheduleUpdate);

    const observer = new MutationObserver(scheduleUpdate);

    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['class', 'style'],
    });

    const refreshTimer = window.setTimeout(scheduleUpdate, 300);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      observer.disconnect();
      window.clearTimeout(refreshTimer);
    };
  }, []);

  useEffect(() => {
    if (!user || typeof window === 'undefined') {
      setIsBusiness(false);
      return;
    }

    setIsBusiness(
      localStorage.getItem(`userMode_${user.uid}`) === 'business',
    );
  }, [user]);

  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [pathname]);

  useEffect(() => {
    if (!cartShake) return;

    const timeout = window.setTimeout(() => {
      setCartShake(false);
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [cartShake]);

  useEffect(() => {
    if (cartCount > 0) {
      setCartShake(true);
    }
  }, [cartCount]);

  const handleLogout = async () => {
    try {
      if (isBusiness && typeof businessLogout === 'function') {
        await businessLogout();
      } else if (typeof logout === 'function') {
        await logout();
      }

      setShowUserMenu(false);
      setIsOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Nepavyko atsijungti:', error);
    }
  };

  const closeMenus = () => {
    setIsOpen(false);
    setShowUserMenu(false);
  };

  const linkIsActive = (href: string) => {
    if (href === '/') return pathname === '/';

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className="fixed inset-x-0 top-3 z-[9999] flex justify-center px-3 sm:top-4 sm:px-6"
      style={{ pointerEvents: 'none' }}
    >
      <nav
        data-navbar-glass
        aria-label="Pagrindinė navigacija"
        className={[
          'relative isolate flex w-full max-w-5xl items-center justify-between',
          'rounded-full border border-white/25',
          'bg-slate-950/65 text-white',
          'px-3 py-2 sm:px-5 sm:py-2.5',
          'shadow-[0_8px_32px_rgba(0,0,0,0.20)]',
          'backdrop-blur-2xl',
          'transition-shadow duration-300',
          scrolled
            ? 'shadow-[0_10px_38px_rgba(0,0,0,0.26)]'
            : '',
        ].join(' ')}
        style={{
          pointerEvents: 'auto',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        {/* Logo with continuous brightness-based crossfade */}
        <Link
          href="/"
          aria-label="Pradinis puslapis"
          onClick={closeMenus}
          className="relative flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10"
        >
          <Image
            src="/images/logo/small-logo.png"
            alt="DekoratoriaiLT"
            width={42}
            height={42}
            priority
            className="absolute inset-0 h-full w-full object-contain"
            style={{
              opacity: 1 - whiteLogoOpacity,
            }}
          />

          <Image
            src="/images/logo/small-logo-white 2.png"
            alt=""
            aria-hidden="true"
            width={42}
            height={42}
            priority
            className="absolute inset-0 h-full w-full object-contain"
            style={{
              opacity: whiteLogoOpacity,
            }}
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenus}
              className={[
                'whitespace-nowrap rounded-full px-3 py-2',
                'text-sm font-medium transition-colors duration-200',
                linkIsActive(link.href)
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:bg-white/15 hover:text-white',
              ].join(' ')}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 lg:ml-2">
          <button
            type="button"
            aria-label="Ieškoti produktų"
            onClick={() => {
              closeMenus();
              router.push('/produktai');
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition hover:bg-white/15 hover:text-white"
          >
            <FaSearch size={15} />
          </button>

          <Link
            href="/krepselis"
            aria-label={`Krepšelis, prekių kiekis: ${mounted ? cartCount : 0}`}
            onClick={closeMenus}
            className={[
              'relative flex h-9 w-9 items-center justify-center rounded-full',
              'text-white/90 transition hover:bg-white/15 hover:text-white',
              cartShake ? 'animate-[shake_0.4s_ease-in-out]' : '',
            ].join(' ')}
          >
            <FaShoppingCart size={17} />

            {mounted && cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border border-slate-950/50 bg-sky-400 px-1 text-[10px] font-bold leading-none text-slate-950">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {mounted && user ? (
            <div className="relative">
              <button
                type="button"
                aria-label="Vartotojo meniu"
                aria-expanded={showUserMenu}
                onClick={() =>
                  setShowUserMenu((current) => !current)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition hover:bg-white/15 hover:text-white"
              >
                <FaUser size={15} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-[calc(100%+12px)] z-[10000] w-56 overflow-hidden rounded-2xl border border-white/20 bg-slate-950/95 p-2 text-white shadow-2xl backdrop-blur-2xl">
                  <div className="border-b border-white/10 px-3 py-2">
                    <p className="truncate text-sm font-semibold">
                      {businessAccount?.companyName ||
                        user.displayName ||
                        user.email ||
                        'Mano paskyra'}
                    </p>

                    <p className="mt-1 text-xs text-white/60">
                      {isBusiness
                        ? 'Verslo paskyra'
                        : 'Asmeninė paskyra'}
                    </p>
                  </div>

                  <Link
                    href={
                      isBusiness
                        ? '/verslo-paskyra'
                        : '/mano-paskyra'
                    }
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/85 transition hover:bg-white/10 hover:text-white"
                  >
                    <FaUser size={14} />
                    Mano paskyra
                  </Link>

                  <Link
                    href={isBusiness ? '/' : '/verslo-paskyra'}
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/85 transition hover:bg-white/10 hover:text-white"
                  >
                    <FaExchangeAlt size={14} />
                    {isBusiness
                      ? 'Į pagrindinę svetainę'
                      : 'Verslo paskyra'}
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-300 transition hover:bg-red-500/15 hover:text-red-200"
                  >
                    <FaSignOutAlt size={14} />
                    Atsijungti
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/prisijungti"
              onClick={closeMenus}
              className="hidden whitespace-nowrap rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25 sm:inline-flex"
            >
              Prisijungti
            </Link>
          )}

          <button
            type="button"
            aria-label={
              isOpen ? 'Uždaryti meniu' : 'Atidaryti meniu'
            }
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/15 lg:hidden"
          >
            {isOpen ? (
              <FaTimes size={18} />
            ) : (
              <FaBars size={18} />
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-[10000] overflow-hidden rounded-3xl border border-white/20 bg-slate-950/95 p-3 text-white shadow-2xl backdrop-blur-2xl lg:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenus}
                  className={[
                    'rounded-2xl px-4 py-3 text-sm font-medium transition-colors',
                    linkIsActive(link.href)
                      ? 'bg-white/15 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              ))}

              {!user && (
                <Link
                  href="/prisijungti"
                  onClick={closeMenus}
                  className="mt-1 rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/25"
                >
                  Prisijungti
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-2px);
          }
          40%,
          80% {
            transform: translateX(2px);
          }
        }
      `}</style>
    </header>
  );
}