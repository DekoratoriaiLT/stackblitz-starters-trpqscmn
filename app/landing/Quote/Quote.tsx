'use client';

import { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const Section = styled.section`
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: sans-serif;
`;

const QuoteMark = styled.div`
  font-size: 150px;
  color: white;
  line-height: 1;
  margin-bottom: 0;
  font-family: serif;
`;

const Heading = styled.h2`
  color: white;
  font-weight: bold;
  line-height: 1.1;
  font-size: clamp(32px, 5vw, 60px);
  max-width: 900px;
  margin-top: -20px;
`;

const UnderlineWrapper = styled.span`
  position: relative;
  display: inline-block;
`;

const Svg = styled.svg`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;
  overflow: visible;

  @media (max-width: 768px) {
    bottom: -14px;
  }
`;

const draw = keyframes`
  from {
    stroke-dashoffset: 300;
  }

  to {
    stroke-dashoffset: 0;
  }
`;

const UnderlinePath = styled.path`
  stroke: white;
  stroke-width: 6px;
  fill: none;
  stroke-linecap: round;
  stroke-dasharray: 300;
  stroke-dashoffset: 300;

  &.animate-underline {
    animation: ${draw} 1s ease-out forwards;
  }
`;

export default function QuoteSection() {
  const underlineRef = useRef<HTMLSpanElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const element = underlineRef.current;
    const path = pathRef.current;

    if (!element || !path) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Play the animation when entering the viewport.
          if (!hasAnimatedRef.current) {
            hasAnimatedRef.current = true;

            path.classList.remove('animate-underline');
            path.style.strokeDashoffset = '300';

            // Force a reset before starting the animation.
            void path.getBoundingClientRect();

            path.style.strokeDashoffset = '';
            path.classList.add('animate-underline');
          }
        } else {
          // Reset only after the quote has completely left the viewport.
          hasAnimatedRef.current = false;
          path.classList.remove('animate-underline');
          path.style.strokeDashoffset = '300';
        }
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '0px',
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <Section>
      <QuoteMark>“</QuoteMark>

      <Heading>
        Gyvenk tame, ką{' '}
        <UnderlineWrapper ref={underlineRef}>
          myli.
          <Svg viewBox="0 0 200 20" preserveAspectRatio="none">
            <UnderlinePath
              ref={pathRef}
              d="M 5 15 Q 100 5, 195 15"
            />
          </Svg>
        </UnderlineWrapper>
      </Heading>
    </Section>
  );
}