import styled, { keyframes } from "styled-components";

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
`;

const HeroWrapper = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: black;
  display: flex;
  align-items: center;
  padding: 5rem 8.2%;
  overflow: hidden;

  @media (max-width: 768px) {
    min-height: 100vh;
    padding: 6rem 1.5rem 3rem;
  }
`;

const WaveBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: url("/images/hero/hero-bg.avif");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const TextSection = styled.div`
  position: relative;
  z-index: 2;
  width: 55%;
  text-align: left;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Title = styled.h1`
  font-size: clamp(3rem, 6vw, 4.5rem);
  font-weight: 300;
  color: white;
  margin: 0 0 1.5rem;
  letter-spacing: -0.02em;
  line-height: 1.05;

  @media (max-width: 480px) {
    font-size: clamp(2.5rem, 10vw, 3.5rem);
  }
`;

const Subtitle = styled.p`
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 1rem;
`;

const Arrow = styled.span`
  display: block;
  margin-top: 1.5rem;
  font-size: 2.5rem;
  color: white;
  animation: ${bounce} 1.5s infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const ProductImage = styled.img`
  position: absolute;
  z-index: 1;
  right: 7%;
  top: 50%;
  transform: translateY(-50%);
  width: 38%;
  height: 80vh;
  object-fit: contain;
  object-position: center;

  @media (max-width: 768px) {
    position: relative;
    top: auto;
    right: auto;
    transform: none;
    display: block;
    width: 75%;
    height: 38vh;
    margin: 2rem auto 0;
  }
`;

const HeroContent = styled.div`
  display: contents;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`;

export default function Hero({ imageHeight = 450 }) {
  return (
    <HeroWrapper>
      <WaveBackground />

      <HeroContent>
        <TextSection>
          <Title>Pirmoji Kokybė</Title>
          <Subtitle>jūsų namuose</Subtitle>
          <Arrow>↓</Arrow>
        </TextSection>

        <ProductImage
          src="/images/landing/hero2.png"
          alt="Pagrindinis produktas"
        />
      </HeroContent>
    </HeroWrapper>
  );
}
