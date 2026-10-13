import styled from "styled-components";

export const Section = styled.section`
  padding: 3rem 1.5rem;
  width: 100%;
`;

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

export const Heading = styled.h2`
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  font-weight: 400;
  text-align: left;
  color: white;
  margin: 0 0 1.5rem;
  letter-spacing: -0.03em;
`;

export const CategorySection = styled.div`
  margin-bottom: 3.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const CarouselButton = styled.button<{
  $position: "left" | "right";
}>`
  position: absolute;
  top: 50%;
  ${({ $position }) =>
    $position === "left" ? "left: -1rem;" : "right: -1rem;"}
  transform: translateY(-50%);
  z-index: 5;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;
  padding: 0;

  color: white;
  background: rgba(20, 20, 20, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;

  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    background: #202020;
    border-color: #14b8a6;
  }

  &:focus-visible {
    outline: 2px solid #14b8a6;
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.25;
    cursor: default;
  }
`;

export const CarouselViewport = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  scroll-snap-type: x mandatory;
`;

export const CarouselTrack = styled.div`
  display: flex;
  align-items: stretch;
  gap: 1rem;
  width: 100%;
`;

export const CarouselItem = styled.article`
  flex: 0 0 27%;
  min-width: 0;
  scroll-snap-align: start;
`;

export const CardLink = styled.a`
  display: block;
  height: 100%;
  color: inherit;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid #14b8a6;
    outline-offset: 4px;
    border-radius: 1rem;
  }
`;

export const Card = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;

  background: #171717;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1rem;

  transition:
    border-color 0.25s ease,
    background 0.25s ease,
    transform 0.25s ease;

  ${CardLink}:hover & {
    background: #202020;
    border-color: #14b8a6;
    transform: translateY(-3px);
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2.1 / 1;
  overflow: hidden;
  background: #242424;
`;

export const CarouselImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;

  ${CardLink}:hover & {
    transform: scale(1.04);
  }
`;

export const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 45%,
    rgba(0, 0, 0, 0.25)
  );
  pointer-events: none;
`;

export const CardTitle = styled.h3`
  margin: 0;
  padding: 1rem 1.1rem;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
  text-align: left;
`;

export const AlphabetItem = styled.article`
  flex: 0 0 18%;
  min-width: 0;
  scroll-snap-align: start;
`;

export const AlphabetCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  min-height: 64px;
  height: 100%;
  padding: 1rem;

  color: #f5f5f5;
  background: #171717;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.75rem;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  ${CardLink}:hover & {
    background: #202020;
    border-color: #14b8a6;
    transform: translateY(-2px);
  }
`;

export const AlphabetTitle = styled.h3`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  font-weight: 400;
`;

export const ArrowIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  color: #14b8a6;
`;

export const SectionDescription = styled.p`
  margin: -0.75rem 0 1.5rem;
  color: #a3a3a3;
  font-size: 0.9rem;
  line-height: 1.5;
`;