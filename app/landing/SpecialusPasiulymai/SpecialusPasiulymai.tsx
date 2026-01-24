"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import styled from "styled-components";

// ========================================
// OFFERS CONFIGURATION
// ========================================
const SPECIAL_OFFERS = [
  {
    id: "1",
    title: "Lubu Apvadas 1.50.169",
    image: "https://pub-262c7ff9747743f0853580fc0debb426.r2.dev/lubu-apvadai/1.50.169.100.png",
    oldPrice: 75.0,
    newPrice: 56.45,
  },
  {
    id: "2",
    title: "Lubu Apvadas 1.50.125",
    image: "https://pub-262c7ff9747743f0853580fc0debb426.r2.dev/lubu-apvadai/1.50.125.100.png",
    oldPrice: 60.0,
    newPrice: 41.36,
  },
  {
    id: "3",
    title: "Lubu Apvadas 1.50.112",
    image: "https://pub-262c7ff9747743f0853580fc0debb426.r2.dev/lubu-apvadai/1.50.112.100.png",
    oldPrice: 40.0,
    newPrice: 27.96,
  },
];

// ---------- Styled Components ----------

const Section = styled.section`
  padding: 4rem 1.5rem;
  width: 100%;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const Heading = styled.h2`
  font-size: clamp(2.25rem, 5vw, 3rem);
  font-weight: 300;
  text-align: center;
  color: white;
  margin-bottom: 1rem;
`;

const SubHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 3rem;

  p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.125rem;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: #14b8a6;
  }
`;

const CarouselWrapper = styled.div`
  position: relative;
`;

const CarouselButton = styled.button<{ $position: "left" | "right" }>`
  position: absolute;
  top: 50%;
  ${(props) => (props.$position === "left" ? "left: 0;" : "right: 0;")}
  transform: translateY(-50%);
  z-index: 20;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 0.75rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const CarouselViewport = styled.div`
  overflow: hidden;
  margin: 0 4rem;

  @media (max-width: 1024px) {
    margin: 0 2rem;
  }

  @media (max-width: 640px) {
    margin: 0 1rem;
  }
`;

const CarouselTrack = styled.div<{
  $isTransitioning: boolean;
  $slide: number;
  $numVisible: number;
}>`
  display: flex;
  gap: 1.5rem;
  transition: ${(props) =>
    props.$isTransitioning ? "transform 0.5s ease-out" : "none"};
  transform: ${(props) => `translateX(-${props.$slide * (100 / props.$numVisible + 2)}%)`};
`;

const CarouselItem = styled.article<{ $numVisible: number }>`
  flex-shrink: 0;
  width: ${(props) => {
    switch (props.$numVisible) {
      case 1:
        return "100%";
      case 2:
        return "50%";
      case 3:
      default:
        return "33.3333%";
    }
  }};
`;

const CardLink = styled.a`
  display: block;
  text-decoration: none;
`;

const Card = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 2rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  transition: all 0.3s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35);
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  background: rgba(220, 38, 38, 0.9);
  backdrop-filter: blur(5px);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  span {
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 1/1;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  text-align: center;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  color: white;
  margin-bottom: 0.75rem;
  transition: color 0.3s;

  ${Card}:hover & {
    color: #14b8a6;
  }
`;

const PriceWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;

  span:first-child {
    text-decoration: line-through;
    color: #f87171;
    font-size: 1.125rem;
  }

  span:last-child {
    color: white;
    font-weight: 600;
    font-size: 1.5rem;
  }
`;

const DeliveryText = styled.p`
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

// ---------- Component ----------

const SpecialOffersCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [numVisible, setNumVisible] = useState(3);

  const displayOffers = [];
  for (let i = 0; i < SPECIAL_OFFERS.length * 3; i++) {
    const originalOffer = SPECIAL_OFFERS[i % SPECIAL_OFFERS.length];

    // Convert dots to dashes in code
    const codeSlug = originalOffer.title
      .split(" ")
      .pop()
      ?.replace(/\./g, "-");

    displayOffers.push({
      ...originalOffer,
      id: `${originalOffer.id}-${i}`,
      href: `/produktai/lubu-apvadai/${codeSlug}`,
    });
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setNumVisible(2);
      else setNumVisible(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);

    if (currentSlide >= displayOffers.length - numVisible - 1) {
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
      setCurrentSlide(displayOffers.length - numVisible - 1);

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
        <Heading>
          Specialūs <span style={{ color: "#14b8a6" }}>Pasiūlymai</span>
        </Heading>

        <SubHeading>
          <Tag />
          <p>Ribotas laikas</p>
        </SubHeading>

        <CarouselWrapper>
          <CarouselButton onClick={handlePrev} $position="left" aria-label="Previous offer">
            <ChevronLeft size={24} color="white" />
          </CarouselButton>

          <CarouselButton onClick={handleNext} $position="right" aria-label="Next offer">
            <ChevronRight size={24} color="white" />
          </CarouselButton>

          <CarouselViewport>
            <CarouselTrack $isTransitioning={isTransitioning} $slide={currentSlide} $numVisible={numVisible}>
              {displayOffers.map((offer) => (
                <CarouselItem key={offer.id} $numVisible={numVisible}>
                  <CardLink href={offer.href}>
                    <Card>
                      <Badge>
                        <span>Akcija</span>
                      </Badge>
                      <ImageWrapper>
                        <CarouselImage src={offer.image} alt={offer.title} />
                      </ImageWrapper>
                      <CardContent>
                        <CardTitle>{offer.title}</CardTitle>
                        <PriceWrapper>
                          <span>€{offer.oldPrice.toFixed(2)}</span>
                          <span>€{offer.newPrice.toFixed(2)}</span>
                        </PriceWrapper>
                        <DeliveryText>*3-10 d.d.</DeliveryText>
                      </CardContent>
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

export default SpecialOffersCarousel;