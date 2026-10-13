"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

import {
  Section,
  Container,
  Heading,
  CategorySection,
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
  AlphabetItem,
  AlphabetCard,
  AlphabetTitle,
  ArrowIcon,
  SectionDescription,
} from "./CategoryCarousel.styles";

type Category = {
  title: string;
  image: string;
  href: string;
};

const categories: Category[] = [
  {
    title: "Apvadų kampai",
    image: "/images/landing/apvadu-kampai.webp",
    href: "/produktai/apvadu-kampai",
  },
  {
    title: "Architravai",
    image: "/images/landing/architravai.webp",
    href: "/produktai/architravai",
  },
  {
    title: "Arkiniai elementai",
    image: "/images/landing/arkiniai-elementai.webp",
    href: "/produktai/arkiniai-elementai",
  },
  {
    title: "Arkiniai apvadai",
    image: "/images/landing/arkiniai-apvadai.webp",
    href: "/produktai/arkiniai-apvadai",
  },
  {
    title: "Balustrados pagrindai",
    image: "/images/landing/balustrados-pagrindai.webp",
    href: "/produktai/balustrados-pagrindai",
  },
  {
    title: "Balustrados porankiai",
    image: "/images/landing/balustrados-porankiai.webp",
    href: "/produktai/balustrados-porankiai",
  },
  {
    title: "Balustrai",
    image: "/images/landing/balustrai.webp",
    href: "/produktai/balustrai",
  },
  {
    title: "Durų dekora",
    image: "/images/landing/duru-dekora.webp",
    href: "/produktai/duru-dekora",
  },
  {
    title: "Fasado frontonai",
    image: "/images/landing/fasado-frontonai.webp",
    href: "/produktai/fasado-frontonai",
  },
  {
    title: "Fasado galiniai elementai",
    image: "/images/landing/fasado-galiniai-elementai.webp",
    href: "/produktai/fasado-galiniai-elementai",
  },
  {
    title: "Fasado ornamentai",
    image: "/images/landing/fasado-ornamentai.webp",
    href: "/produktai/fasado-ornamentai",
  },
  {
    title: "Frizai",
    image: "/images/landing/frizai.webp",
    href: "/produktai/frizai",
  },
  {
    title: "Gembės",
    image: "/images/landing/gembes.webp",
    href: "/produktai/gembes",
  },
  {
    title: "Grindų apvadai",
    image: "/images/landing/grindu-apvadai.webp",
    href: "/produktai/grindjuostes",
  },
  {
    title: "Kolonos",
    image: "/images/landing/kolonos.webp",
    href: "/produktai/kolonos",
  },
  {
    title: "Kolonos liemuo",
    image: "/images/landing/kolonos-liemuo.webp",
    href: "/produktai/kolonos-liemuo",
  },
  {
    title: "Lango angokraščiai",
    image: "/images/landing/lango-angokrastai.webp",
    href: "/produktai/lango-angokrastai",
  },
  {
    title: "Lango arkiniai rėmai",
    image: "/images/landing/lango-arkiniai-remai.webp",
    href: "/produktai/lango-arkiniai-remai",
  },
  {
    title: "Langų angokraščiai",
    image: "/images/landing/lango-soniniai-apvadai.webp",
    href: "/produktai/lango-soniniai-apvadai",
  },
  {
    title: "Lauko palangės",
    image: "/images/landing/palanges.webp",
    href: "/produktai/lauko-palanges",
  },
  {
    title: "Lubų apvadai",
    image: "/images/landing/lubu-apvadai.webp",
    href: "/produktai/lubu-apvadai",
  },
  {
    title: "Lubų panelės",
    image: "/images/landing/lubu-paneles.webp",
    href: "/produktai/lubu-paneles",
  },
  {
    title: "Nišos",
    image: "/images/landing/nisos.webp",
    href: "/produktai/nisos",
  },
  {
    title: "Ornamentai",
    image: "/images/landing/ornamentai.webp",
    href: "/produktai/ornamentai",
  },
  {
    title: "Papildomi elementai",
    image: "/images/landing/papildomi-elementai.webp",
    href: "/produktai/papildomi-elementai",
  },
  {
    title: "Pedimentai",
    image: "/images/landing/pedimentai.webp",
    href: "/produktai/pedimentai",
  },
  {
    title: "Pjedestalinės gembės",
    image: "/images/landing/pjedestalines-gembes.webp",
    href: "/produktai/pjedestalines-gembes",
  },
  {
    title: "Platbandai",
    image: "/images/landing/platbandai.webp",
    href: "/produktai/platbandai",
  },
  {
    title: "Puskolonos",
    image: "/images/landing/puskolonos.webp",
    href: "/produktai/puskolonos",
  },
  {
    title: "Rozetės",
    image: "/images/landing/rozetes.webp",
    href: "/produktai/rozetes",
  },
  {
    title: "Rustikai",
    image: "/images/landing/rustikai.webp",
    href: "/produktai/rustikai",
  },
  {
    title: "Sieninis dekoras",
    image: "/images/landing/sieninis-dekoras.webp",
    href: "/produktai/sieninis-dekoras",
  },
  {
    title: "Sienų apvadai",
    image: "/images/landing/sienu-apvadai.webp",
    href: "/produktai/sienu-apvadai",
  },
  {
    title: "Sienų panelės",
    image: "/images/landing/sienu-paneles.webp",
    href: "/produktai/sienu-paneles",
  },
  {
    title: "Statulėlės",
    image: "/images/landing/statuleles.webp",
    href: "/produktai/statuleles",
  },
  {
    title: "Stulpo kepurės",
    image: "/images/landing/stulpo-kepures.webp",
    href: "/produktai/stulpo-kepures",
  },
  {
    title: "Židinio dekoracija",
    image: "/images/landing/zidinio-dekoracija.webp",
    href: "/produktai/zidinio-dekoracija",
  },
  {
    title: "Žiedai",
    image: "/images/landing/ziedai.webp",
    href: "/produktai/ziedai",
  },
];

const popularTitles = [
  "Lubų apvadai",
  "Sienų apvadai",
  "Grindų apvadai",
  "Sienų panelės",
  "Rozetės",
  "Kolonos",
];

const popularCategories = popularTitles
  .map((title) => categories.find((category) => category.title === title))
  .filter((category): category is Category => Boolean(category));

const alphabeticCategories = Array.from(
  new Map(categories.map((category) => [category.title, category])).values(),
).sort((a, b) => a.title.localeCompare(b.title, "lt"));

function CarouselControls({
  viewportRef,
}: {
  viewportRef: React.RefObject<HTMLDivElement | null>;
}) {
  const scroll = (direction: "left" | "right") => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.scrollBy({
      left:
        direction === "left"
          ? -viewport.clientWidth * 0.85
          : viewport.clientWidth * 0.85,
      behavior: "smooth",
    });
  };

  return (
    <>
      <CarouselButton
        type="button"
        $position="left"
        aria-label="Slinkti į kairę"
        onClick={() => scroll("left")}
      >
        <ChevronLeft size={22} />
      </CarouselButton>

      <CarouselButton
        type="button"
        $position="right"
        aria-label="Slinkti į dešinę"
        onClick={() => scroll("right")}
      >
        <ChevronRight size={22} />
      </CarouselButton>
    </>
  );
}

export default function CategoryCarousel() {
  const popularViewportRef = useRef<HTMLDivElement>(null);
  const alphabeticViewportRef = useRef<HTMLDivElement>(null);

  return (
    <Section>
      <Container>
        <CategorySection>
          <Heading>Populiariausios Kategorijos</Heading>

          <CarouselWrapper>
            <CarouselControls viewportRef={popularViewportRef} />

            <CarouselViewport
              ref={popularViewportRef}
              aria-label="Populiariausios kategorijos"
            >
              <CarouselTrack>
                {popularCategories.map((category) => (
                  <CarouselItem key={category.title}>
                    <CardLink href={category.href}>
                      <Card>
                        <ImageWrapper>
                          <CarouselImage
                            src={category.image}
                            alt={category.title}
                            loading="lazy"
                          />
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
        </CategorySection>

        <CategorySection>
          <Heading>Kategorijos A–Z</Heading>

          <SectionDescription>
            Peržiūrėkite visas dekoratyvinių elementų kategorijas.
          </SectionDescription>

          <CarouselWrapper>
            <CarouselControls viewportRef={alphabeticViewportRef} />

            <CarouselViewport
              ref={alphabeticViewportRef}
              aria-label="Visos kategorijos abėcėlės tvarka"
            >
              <CarouselTrack>
                {alphabeticCategories.map((category) => (
                  <AlphabetItem key={category.title}>
                    <CardLink href={category.href}>
                      <AlphabetCard>
                        <AlphabetTitle>{category.title}</AlphabetTitle>

                        <ArrowIcon>
                          <ArrowUpRight size={18} />
                        </ArrowIcon>
                      </AlphabetCard>
                    </CardLink>
                  </AlphabetItem>
                ))}
              </CarouselTrack>
            </CarouselViewport>
          </CarouselWrapper>
        </CategorySection>
      </Container>
    </Section>
  );
}