'use client';

import React from 'react';
import Image from 'next/image';

const FooterSection: React.FC = () => (
  <footer className="bg-black text-white py-12" role="contentinfo">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
        {/* Logo Section */}
        <div className="text-center sm:text-left">
          <Image
            src="/images/logo/logo.png"
             alt="Logo"
             width={200}      // <-- sets width to ~200px
             height={0}       // <-- lets Next.js auto-adjust height
             style={{ height: 'auto' }}  // <-- keeps aspect ratio
            />

        </div>

        {/* Links Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Nuorodos</h3>
          <nav aria-label="Footer navigation">
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="/apie-mus" 
                  className="text-gray-400 hover:text-emerald-400 focus:text-emerald-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded"
                >
                  Apie Mus
                </a>
              </li>
              <li>
                <a 
                  href="/produktai" 
                  className="text-gray-400 hover:text-emerald-400 focus:text-emerald-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded"
                >
                  Produktai
                </a>
              </li>
              <li>
                <a 
                  href="/kontaktai" 
                  className="text-gray-400 hover:text-emerald-400 focus:text-emerald-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded"
                >
                  Kontaktai
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Susisiekite</h3>
          <address className="not-italic">
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-bold">Telefonas:</span>{' '}
                <a
                  href="tel:+37067177164"
                  className="text-gray-400 hover:text-emerald-400 focus:text-emerald-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded"
                  aria-label="Skambinkite +370 671 77164"
                >
                  +370 671 77164
                </a>
              </li>
              <li>
                <span className="font-bold">El. paštas:</span>{' '}
                <a
                  href="mailto:info@dekoratoriai.lt"
                  className="text-gray-400 hover:text-emerald-400 focus:text-emerald-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded break-all"
                  aria-label="Rašykite mums info@dekoratoriai.lt"
                >
                  info@dekoratoriai.lt
                </a>
              </li>
            </ul>
          </address>
        </div>

        {/* Social Media Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Sekite Mus</h3>
          <nav aria-label="Social media links">
            <div className="flex space-x-4 justify-center sm:justify-start">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/dekoratoriai.lt/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-400 focus:text-emerald-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded p-1"
                aria-label="Sekite mus Instagram (atsidaro naujame lange)"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <title>Instagram</title>
                  <path d="M8.333 12.007a3.667 3.667 0 1 1 7.334-.013 3.667 3.667 0 0 1-7.334.013Zm-1.981.004a5.648 5.648 0 1 0 11.296-.023 5.648 5.648 0 0 0-11.296.023ZM16.54 6.12a1.32 1.32 0 1 0 2.64-.006 1.32 1.32 0 0 0-2.64.006ZM7.573 20.961c-1.073-.046-1.655-.224-2.043-.374a3.427 3.427 0 0 1-1.267-.82 3.419 3.419 0 0 1-.825-1.263c-.15-.389-.332-.97-.382-2.043-.055-1.159-.067-1.507-.073-4.444-.005-2.936.005-3.284.056-4.445.046-1.071.225-1.654.374-2.042.199-.515.437-.88.82-1.267.385-.386.75-.624 1.264-.825.388-.151.97-.331 2.041-.382 1.16-.055 1.508-.067 4.444-.073 2.937-.005 3.285.005 4.446.056 1.071.047 1.654.224 2.042.374.514.199.88.436 1.267.82.385.385.624.75.825 1.264.151.387.331.97.382 2.041.055 1.16.068 1.508.073 4.444.006 2.938-.005 3.286-.056 4.445-.046 1.073-.224 1.655-.374 2.044-.199.514-.437.88-.82 1.266-.385.385-.75.625-1.264.825-.387.151-.97.332-2.041.383-1.16.054-1.508.067-4.445.072-2.936.006-3.284-.005-4.444-.055ZM7.444 1.076c-1.17.055-1.97.243-2.668.517A5.38 5.38 0 0 0 2.83 2.865a5.39 5.39 0 0 0-1.265 1.95c-.271.7-.455 1.5-.506 2.671C1.007 8.66.996 9.034 1 12.021c.006 2.987.02 3.362.075 4.535.056 1.17.243 1.97.517 2.668a5.38 5.38 0 0 0 1.272 1.946c.612.61 1.227.985 1.95 1.265.7.27 1.5.455 2.671.506 1.174.052 1.548.063 4.535.058 2.987-.006 3.362-.02 4.535-.075 1.17-.056 1.97-.243 2.668-.516a5.39 5.39 0 0 0 1.946-1.273 5.394 5.394 0 0 0 1.265-1.95c.27-.7.455-1.5.506-2.67.051-1.174.063-1.55.058-4.536-.006-2.987-.02-3.361-.075-4.534-.056-1.171-.243-1.97-.517-2.67a5.396 5.396 0 0 0-1.271-1.945 5.383 5.383 0 0 0-1.951-1.265c-.7-.27-1.5-.455-2.671-.506-1.173-.052-1.548-.063-4.535-.058-2.987.006-3.361.019-4.535.075Z"></path>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://www.facebook.com/dekoratoriai.lt/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-400 focus:text-emerald-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded p-1"
                aria-label="Sekite mus Facebook (atsidaro naujame lange)"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <title>Facebook</title>
                  <path d="M12 1c6.075 0 11 4.943 11 11.04 0 5.645-4.22 10.3-9.668 10.96v-7.586h2.976l.618-3.374h-3.593v-1.193c0-1.783.697-2.468 2.5-2.468h.104c.512.001.924.015 1.167.04V5.362c-.492-.137-1.694-.274-2.391-.274-3.676 0-5.37 1.742-5.37 5.5v1.453H7.074v3.374h2.269v7.342A11.037 11.037 0 0 1 1 12.04C1 5.943 5.925 1 12 1Z"></path>
                </svg>
              </a>
            </div>
          </nav>
        </div>
      </div>
      
      {/* Copyright notice */}
      <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} Dekoratoriai.lt. Visos teisės saugomos.</p>
      </div>
    </div>
  </footer>
);

export default FooterSection;