'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { getExistingImagePaths } from '@/app/components/Produktai/ImagePath/getImagePath';
import { MeasurementOverlay } from '../Produktai/MeasurementOverlay/MeasurementOverlay';
import type { ProductDimensions } from '@/app/components/Produktai/Types/types';
import gsap from 'gsap';

interface ProductGalleryProps {
  productName: string;
  category: string;
  details?: ProductDimensions;
}

export function ProductGallery({ productName, category, details }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadImages() {
      setLoading(true);
      const paths = await getExistingImagePaths(productName, category, ['100', '20', '30', '40', '600'], 10, false);
      setImagePaths(paths);
      setLoading(false);
    }

    loadImages();
  }, [productName, category]);

  useEffect(() => {
    if (mainImageRef.current && !loading) {
      gsap.fromTo(
        mainImageRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [selectedImage, loading]);

  const uniqueImages = imagePaths.filter((path, index, self) => self.indexOf(path) === index);

  const hasWhiteBackground = (imagePath: string) => {
    return imagePath.includes('.40.');
  };

  const shouldShowMeasurements = (imagePath: string) => {
    return hasWhiteBackground(imagePath) && details && (details.Plotis || details.Aukštis || details.Aukstis);
  };

  const handleImageSelect = (idx: number) => {
    setSelectedImage(idx);
  };

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div
        className={`relative rounded-3xl overflow-hidden shadow-xl ${uniqueImages.length > 0 && hasWhiteBackground(uniqueImages[selectedImage])
            ? 'bg-white'
            : 'bg-gradient-to-br from-gray-50 to-gray-100'
          }`}
        style={{ aspectRatio: '1 / 1' }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
          </div>
        ) : uniqueImages.length > 0 ? (
          <div ref={mainImageRef} className="relative w-full h-full p-8">
            <Image
              src={uniqueImages[selectedImage]}
              alt={`${productName} - Vaizdas ${selectedImage + 1}`}
              fill
              className="object-contain"
              priority
            />

            {shouldShowMeasurements(uniqueImages[selectedImage]) && (
              <MeasurementOverlay
                plotis={details?.Plotis}
                aukstis={details?.Aukštis || details?.Aukstis}
                show={true}
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 font-medium">Vaizdų nėra</p>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {uniqueImages.length > 1 && (
        <div ref={thumbnailsRef} className="flex gap-3 justify-center overflow-x-auto pb-2 scrollbar-hide">
          {uniqueImages.map((path, idx) => (
            <button
              key={idx}
              onClick={() => handleImageSelect(idx)}
              className={`relative flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-300 ${selectedImage === idx
                  ? 'ring-3 ring-gray-800 scale-105 shadow-lg'
                  : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-gray-400'
                } ${hasWhiteBackground(path) ? 'bg-white' : 'bg-gray-50'}`}
              style={{ width: '100px', height: '100px' }}
            >
              <Image src={path} alt={`Miniatiūra ${idx + 1}`} fill className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}