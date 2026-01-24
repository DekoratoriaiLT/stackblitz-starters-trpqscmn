"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Section,
  Container,
  Heading,
  CarouselWrapper,
  CarouselButton,
  CarouselViewport,
  CarouselTrack,
  CarouselItem,
  CardLink,
  Card,
  ImageWrapper,
  CarouselImage,
  ImageOverlay,
  CardTitle,
} from "./CategoryCarousel.styles";

const CategoryCarousel = () => {
  const categories = [
    { title: "Apvadų kampai", image: "/images/landing/apvadu-kampai.webp", href: "/produktai/apvadu-kampai" },
    { title: "Architravai", image: "/images/landing/architravai.webp", href: "/produktai/architravai" },
    { title: "Arkiniai elementai", image: "/images/landing/arkiniai-elementai.webp", href: "/produktai/arkiniai-elementai" },
    { title: "Arkiniai apvadai", image: "/images/landing/arkiniai-apvadai.webp", href: "/produktai/arkiniai-apvadai" },
    { title: "Balustrados pagrindai", image: "/images/landing/balustrados-pagrindai.webp", href: "/produktai/balustrados-pagrindai" },
    { title: "Balustrados porankiai", image: "/images/landing/balustrados-porankiai.webp", href: "/produktai/balustrados-porankiai" },
    { title: "Balustrai", image: "/images/landing/balustrai.webp", href: "/produktai/balustrai" },
    { title: "Rustikai", image: "/images/landing/rustikai.webp", href: "/produktai/rustikai" },
    { title: "Durų dekora", image: "/images/landing/duru-dekora.webp", href: "/produktai/duru-dekora" },
    { title: "Fasado ornamentai", image: "/images/landing/fasado-ornamentai.webp", href: "/produktai/fasado-ornamentai" },
    { title: "Fasado frontonai", image: "/images/landing/fasado-frontonai.webp", href: "/produktai/fasado-frontonai" },
    { title: "Fasado galiniai elementai", image: "/images/landing/fasado-galiniai-elementai.webp", href: "/produktai/fasado-galiniai-elementai" },
    { title: "Frizai", image: "/images/landing/frizai.webp", href: "/produktai/frizai" },
    { title: "Gembės", image: "/images/landing/gembes.webp", href: "/produktai/gembes" },
    { title: "Grindų apvadai", image: "/images/landing/grindu-apvadai.webp", href: "/produktai/grindjuostes" },
    { title: "Lango arkiniai rėmai", image: "/images/landing/lango-arkiniai-remai.webp", href: "/produktai/lango-arkiniai-remai" },
    { title: "Langų Angokras", image: "/images/landing/lango-soniniai-apvadai.webp", href: "/produktai/lango-soniniai-apvadai" },
    { title: "Lango angokrastai", image: "/images/landing/lango-angokrastai.webp", href: "/produktai/lango-angokrastai" },
    { title: "Lubų apvadai", image: "/images/landing/lubu-apvadai.webp", href: "/produktai/lubu-apvadai" },
    { title: "Lubų panelės", image: "/images/landing/lubu-paneles.webp", href: "/produktai/lubu-paneles" },
    { title: "Kolonos", image: "/images/landing/kolonos.webp", href: "/produktai/kolonos" },
    { title: "Kolonos liemuo", image: "/images/landing/kolonos-liemuo.webp", href: "/produktai/kolonos-liemuo" },
    { title: "Lauko palangės", image: "/images/landing/palanges.webp", href: "/produktai/lauko-palanges" },
    { title: "Nišos", image: "/images/landing/nisos.webp", href: "/produktai/nisos" },
    { title: "Pedimentai", image: "/images/landing/pedimentai.webp", href: "/produktai/pedimentai" },
    { title: "Pjedestalinės gembės", image: "/images/landing/pjedestalines-gembes.webp", href: "/produktai/pjedestalines-gembes" },
    { title: "Platbandai", image: "/images/landing/platbandai.webp", href: "/produktai/platbandai" },
    { title: "Stulpo Kepurės", image: "/images/landing/stulpo-kepures.webp", href: "/produktai/stulpo-kepures" },
    { title: "Rozetės", image: "/images/landing/rozetes.webp", href: "/produktai/rozetes" },
    { title: "Rustikai", image: "/images/landing/rustikai.webp", href: "/produktai/rustikai" },
    { title: "Sieninis dekoras", image: "/images/landing/sieninis-dekoras.webp", href: "/produktai/sieninis-dekoras" },
    { title: "Sienų apvadai", image: "/images/landing/sienu-apvadai.webp", href: "/produktai/sienu-apvadai" },
    { title: "Sienų plokštės", image: "/images/landing/sienu-paneles.webp", href: "/produktai/sienu-paneles" },
    { title: "Statulėlės", image: "/images/landing/statuleles.webp", href: "/produktai/statuleles" },
    { title: "Stulpo kepurė", image: "/images/landing/stulpo-kepure.webp", href: "/produktai/stulpo-kepure" },
    { title: "Židinio dekoracija", image: "/images/landing/zidinio-dekoracija.webp", href: "/produktai/zidinio-dekoracija" },
    { title: "Žiedai", image: "/images/landing/ziedai.webp", href: "/produktai/ziedai" },
    { title: "Ornamentai", image: "/images/landing/ornamentai.webp", href: "/produktai/ornamentai" },
    { title: "Puskolonos", image: "/images/landing/puskolonos.webp", href: "/produktai/puskolonos" },
    { title: "Papildomi elementai", image: "/images/landing/papildomi-elementai.webp", href: "/produktai/papildomi-elementai" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [numVisible, setNumVisible] = useState(3);

  const displayCategories: (typeof categories[number] & { id: number })[] = [];
  for (let i = 0; i < categories.length * 3; i++) {
    displayCategories.push({ ...categories[i % categories.length], id: i });
  }

  useEffect(() => {
    const updateNumVisible = () => {
      if (window.innerWidth < 640) setNumVisible(2);
      else if (window.innerWidth < 1024) setNumVisible(2);
      else setNumVisible(3);
    };

    updateNumVisible();
    window.addEventListener("resize", updateNumVisible);
    return () => window.removeEventListener("resize", updateNumVisible);
  }, []);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);

    if (currentSlide >= displayCategories.length - numVisible - 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(0);
      }, 0);
    }
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    if (currentSlide === 0) {
      setIsTransitioning(false);
      setCurrentSlide(displayCategories.length - numVisible - 1);
      setTimeout(() => {
        setIsTransitioning(true);
        setCurrentSlide((prev) => prev - 1);
      }, 50);
    } else {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 500);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, isTransitioning]);

  return (
    <Section>
      <Container>
        <Heading>Kategorijos</Heading>

        <CarouselWrapper>
          <CarouselButton onClick={handlePrev} $position="left" disabled={isTransitioning} aria-label="Previous categories">
            <ChevronLeft size={24} color="white" />
          </CarouselButton>

          <CarouselButton onClick={handleNext} $position="right" disabled={isTransitioning} aria-label="Next categories">
            <ChevronRight size={24} color="white" />
          </CarouselButton>

          <CarouselViewport>
            <CarouselTrack $isTransitioning={isTransitioning} $slide={currentSlide} $numVisible={numVisible}>
              {displayCategories.map((category, index) => (
                <CarouselItem key={`category-${category.id}-${index}`} $numVisible={numVisible}>
                  <CardLink href={category.href}>
                    <Card>
                      <ImageWrapper>
                        <CarouselImage src={category.image} alt={category.title} />
                        <ImageOverlay />
                      </ImageWrapper>
                      <CardTitle>{category.title}</CardTitle>
                    </Card>
                  </CardLink>
                </CarouselItem>
              ))}
            </CarouselTrack>
          </CarouselViewport>
        </CarouselWrapper>
      </Container>
    </Section>
  );
};

export default CategoryCarousel;