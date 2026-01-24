"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "./Hero/Hero";
import CategoryCarousel from "./CategoryCarousel/CategoryCarousel";
import VersloKlijentai from "./VersloKlijentai/VersloKlijentai";
import ProfessionalInstallation from "./ProfesonalusInstaliavimas/profesonalus-instaliavimas";
import SpecialOffersCarousel from "./SpecialusPasiulymai/SpecialusPasiulymai";
import FAQSection from "./DUK/DUK";
import Suintimas from "./Suintimas/Suintimas";
import Quote from "./Quote/Quote";

// Sections
const sections = [
  { id: "hero", component: <Hero /> },
  { id: "quote", component: <Quote /> },
  { id: "category", component: <CategoryCarousel /> },
  { id: "verslo", component: <VersloKlijentai /> },
  { id: "installation", component: <ProfessionalInstallation /> },
  { id: "offers", component: <SpecialOffersCarousel /> },
  { id: "faq", component: <FAQSection /> },
  { id: "suintimas", component: <Suintimas /> },
];

export default function LandingClient() {
  const [showSplash, setShowSplash] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Check if user has seen the animation in this session
    const hasSeenAnimation = sessionStorage.getItem('hasSeenSplash');
    
    if (hasSeenAnimation) {
      setShowSplash(false);
      setAnimationComplete(true);
    }
  }, []);

  const handleAnimationComplete = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setAnimationComplete(true);
    // Delay hiding the splash to allow the lift animation to complete
    setTimeout(() => {
      setShowSplash(false);
    }, 800);
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
            initial={{ y: 0 }}
            animate={animationComplete ? { y: "-100%" } : { y: 0 }}
            exit={{ y: "-100%" }}
            transition={{
              duration: 0.8,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
          >
            {/* Logo Animation */}
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                duration: 1,
                ease: [0.43, 0.13, 0.23, 0.96],
                delay: 0.2,
              }}
              onAnimationComplete={() => {
                // Wait a moment before starting the lift animation
                setTimeout(() => {
                  handleAnimationComplete();
                }, 800);
              }}
              className="relative"
            >
              <motion.img
                src="/images/logo/small-logo.png"
                alt="Logo"
                className="w-64 h-64 md:w-80 md:h-80 object-contain"
                initial={{ filter: "brightness(0.7)" }}
                animate={{ filter: "brightness(1)" }}
                transition={{
                  duration: 0.6,
                  delay: 0.5,
                }}
              />
              
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 blur-3xl opacity-50"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0.3 }}
                transition={{
                  duration: 1,
                  delay: 0.6,
                }}
                style={{
                  background: "radial-gradient(circle, rgba(94, 234, 212, 0.4) 0%, transparent 70%)",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {sections.map((section) => (
          <div
            key={section.id}
            className="min-h-screen flex justify-center items-center"
          >
            {section.component}
          </div>
        ))}
      </motion.div>
    </>
  );
}