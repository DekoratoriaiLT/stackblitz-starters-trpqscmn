'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getExistingImagePaths } from '@/app/components/Produktai/ImagePath/getImagePath';
import { MeasurementOverlay } from '../Produktai/MeasurementOverlay/MeasurementOverlay';
import type { ProductDimensions } from '@/app/components/Produktai/Types/types';

interface ProductGalleryProps {
  productName: string;
  category: string;
  details?: ProductDimensions;
}

export function ProductGallery({ productName, category, details }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImages() {
      setLoading(true);
      const paths = await getExistingImagePaths(
        productName,
        category,
        ["100", "20", "30", "40", "600"],
        10,
        false
      );
      setImagePaths(paths);
      setLoading(false);
    }
    
    loadImages();
  }, [productName, category]);

  const uniqueImages = imagePaths.filter(
    (path, index, self) => self.indexOf(path) === index
  );

  const hasWhiteBackground = (imagePath: string) => {
    return imagePath.includes('.40.');
  };

  const shouldShowMeasurements = (imagePath: string) => {
    return hasWhiteBackground(imagePath) && 
           details && 
           (details.Plotis || details.Aukštis || details.Aukstis);
  };

  return (
    <div className="space-y-6">
      <div className={`relative aspect-square rounded-xl overflow-visible border shadow-2xl ${
        uniqueImages.length > 0 && hasWhiteBackground(uniqueImages[selectedImage])
          ? 'bg-white border-slate-300'
          : 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50'
      }`}>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : uniqueImages.length > 0 ? (
          <div className="relative w-full h-full">
            <Image
              src={uniqueImages[selectedImage]}
              alt={`${productName} - Vaizdas ${selectedImage + 1}`}
              fill
              className="object-contain p-8 transition-opacity duration-300"
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
            <svg className="w-20 h-20 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-slate-400 font-medium">Vaizdų nėra</p>
          </div>
        )}
      </div>

      {uniqueImages.length > 1 && (
        <div className="pl-2 pt-2 flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
          {uniqueImages.map((path, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                selectedImage === idx
                  ? hasWhiteBackground(path)
                    ? 'border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105 bg-white'
                    : 'border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105'
                  : hasWhiteBackground(path)
                    ? 'border-slate-300 hover:border-slate-400 bg-white'
                    : 'border-slate-700 hover:border-slate-500'
              }`}
            >
              <Image
                src={path}
                alt={`Miniatiūra ${idx + 1}`}
                fill
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}