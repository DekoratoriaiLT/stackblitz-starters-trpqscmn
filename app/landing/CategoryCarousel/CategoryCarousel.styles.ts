import styled from "styled-components";

export const Section = styled.section`
  padding: 4rem 1.5rem;
  width: 100%;
`;

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

export const Heading = styled.h2`
  font-size: clamp(2.25rem, 5vw, 3rem);
  font-weight: 300;
  text-align: center;
  color: white;
  margin-bottom: 3rem;
`;

export const CarouselWrapper = styled.div`
  position: relative;
`;

export const CarouselButton = styled.button<{ $position: "left" | "right" }>`
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

export const CarouselViewport = styled.div`
  margin: 0 4rem;

  @media (max-width: 1024px) {
    margin: 0 2rem;
  }

  @media (max-width: 640px) {
    margin: 0 1rem;
  }
`;

export const CarouselTrack = styled.div<{ $isTransitioning: boolean; $slide: number; $numVisible: number }>`
  display: flex;
  gap: 1.5rem;
  transition: ${(props) => (props.$isTransitioning ? "transform 0.5s ease-out" : "none")};
  transform: ${(props) => `translateX(-${(props.$slide * (100 / props.$numVisible + 2))}%)`};
`;

export const CarouselItem = styled.article<{ $numVisible: number }>`
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

export const CardLink = styled.a`
  display: block;
  text-decoration: none;
`;

export const Card = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 2rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  transition: all 0.3s;
  padding-bottom: 1.5rem;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35);
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
`;

export const CarouselImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;

  ${Card}:hover & {
    transform: scale(1.1);
  }
`;

export const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5));
  opacity: 0.7;
  transition: opacity 0.3s;

  ${Card}:hover & {
    opacity: 0.8;
  }
`;

export const CardTitle = styled.h3`
  text-align: center;
  font-size: 1.125rem;
  font-weight: 500;
  color: white;
  margin-top: 1rem;
  transition: color 0.3s;

  ${Card}:hover & {
    color: #14b8a6;
  }
`;