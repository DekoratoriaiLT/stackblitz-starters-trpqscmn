"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import styles from "./DesktopProductCard.module.css";

import { getExistingImagePaths } from "@/app/components/Produktai/ImagePath/getImagePath";
import { MeasurementOverlay } from "../MeasurementOverlay/MeasurementOverlay";
import type { ProductDimensions } from "@/app/components/Produktai/Types/types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ImageCarouselProps {
  productTitle: string;
  productCategory: string;
  onView3D: () => void;
  details?: ProductDimensions;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  productTitle,
  productCategory,
  onView3D,
  details,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const [images, setImages] = useState<string[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      setLoading(true);

      const paths = await getExistingImagePaths(
        productTitle,
        productCategory,
        undefined,
        5,
        true
      );

      if (isMounted) {
        setImages(paths);
        setLoading(false);
        if (paths.length > 0) {
          setImagesLoaded(true);
        }
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [productTitle, productCategory]);

  const handleImageError = (index: number) => {
    console.warn(
      `[ImageCarousel] Image failed to load: ${images[index]}`
    );
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageLoad = () => {
    setImagesLoaded(true);
  };

  // Helper function to check if image has .40 suffix
  const hasWhiteBackground = (imagePath: string) => {
    return imagePath.includes('.40.');
  };

  // Check if current image should show measurements
  const shouldShowMeasurements = (imagePath: string) => {
    return hasWhiteBackground(imagePath) && 
           details && 
           (details.Plotis || details.Aukštis || details.Aukstis);
  };

  const currentImage = images[currentImageIndex];
  const isCurrentImageWhite = currentImage && hasWhiteBackground(currentImage);

  return (
    <div className={styles.imageContainer}>
      {(loading || !imagesLoaded) && (
        <div className={styles.imageLoader} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10
        }}>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
        </div>
      )}

      {images.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            if (typeof swiper.params.navigation !== "boolean") {
              swiper.params.navigation!.prevEl = prevRef.current;
              swiper.params.navigation!.nextEl = nextRef.current;
            }
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          loop={images.length > 1}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setCurrentImageIndex(swiper.realIndex)}
          className={styles.swiper}
        >
          {images.map((image, index) => (
            <SwiperSlide key={image}>
              <div 
                className={styles.slideWrapper}
                style={hasWhiteBackground(image) ? { 
                  backgroundColor: '#ffffff',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                } : {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src={image}
                    alt={`${productTitle} – Image ${index + 1}`}
                    fill
                    className={styles.image}
                    style={{
                      objectFit: 'contain'
                    }}
                    priority={index === 0}
                    onLoad={handleImageLoad}
                    onError={() => handleImageError(index)}
                    unoptimized
                  />
                  
                  {/* Measurement overlay for .40 images */}
                  {shouldShowMeasurements(image) && (
                    <MeasurementOverlay
                      plotis={details?.Plotis}
                      aukstis={details?.Aukštis || details?.Aukstis}
                      show={true}
                    />
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {images.length > 1 && (
        <>
          <button
            ref={prevRef}
            className={styles.arrowLeft}
            style={isCurrentImageWhite ? { color: '#000' } : {}}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            ref={nextRef}
            className={styles.arrowRight}
            style={isCurrentImageWhite ? { color: '#000' } : {}}
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}

      <button className={styles.view3DButton} onClick={onView3D}>
        Žiūrėti 3D
      </button>
    </div>
  );
};

export default ImageCarousel;