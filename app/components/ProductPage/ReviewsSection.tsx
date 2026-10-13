"use client";

import React, { useEffect, useState } from 'react';
import { Star, MessageCircle, ThumbsUp } from 'lucide-react';

interface Review {
  reviewId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
}

interface ReviewsSectionProps {
  productCode: string;
  category: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productCode,
  category,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState<
    'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'
  >('newest');

  /* ================= LOAD REVIEWS ================= */
  useEffect(() => {
    const loadReviews = async () => {
      if (!productCode || !category) {
        setLoading(false);
        return;
      }

      try {
        let productData;

        try {
          const module = await import(
            `@/app/data/${category}/${category}.json`
          );
          productData = module.default;
        } catch {
          const fallback = await import(`@/app/data/${category}.json`);
          productData = fallback.default;
        }

        const productsArray = productData.products || productData;

        if (!Array.isArray(productsArray)) {
          setReviews([]);
          setLoading(false);
          return;
        }

        const product = productsArray.find(
          (p: any) => p.code === productCode || p.id === productCode
        );

        if (product?.reviews && Array.isArray(product.reviews)) {
          setReviews(product.reviews);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error('[ReviewsSection] Load error:', err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [productCode, category]);

  /* ================= CALCULATIONS ================= */

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('lt-LT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  /* ================= STARS ================= */

  const renderStars = (rating: number, size = 18) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rating ? 'text-white' : 'text-[#55555b]'}
          fill={star <= rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <section className="bg-[#111111] py-24 text-center text-[#f5f5f7]">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-white" />
      </section>
    );
  }

  /* ================= EMPTY ================= */

  if (reviews.length === 0) {
    return (
      <section className="bg-[#111111] py-24 text-[#f5f5f7]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-light">
            Klientų atsiliepimai
          </h2>

          <p className="mb-8 text-[#a1a1a6]">
            Kol kas nėra atsiliepimų.
          </p>

          <button className="inline-flex items-center bg-[#f5f5f7] px-8 py-3 text-[#111111] transition-colors hover:bg-white">
            <MessageCircle size={18} className="mr-2" />
            Palikti atsiliepimą
          </button>
        </div>
      </section>
    );
  }

  /* ================= RENDER ================= */

  return (
    <section className="bg-[#111111] py-24 text-[#f5f5f7]">
      <div className="container mx-auto px-4">

        {/* HEADER */}

        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-light">
            Klientų atsiliepimai
          </h2>

          <div className="mb-8 flex items-center justify-center">
            <div className="mr-3 flex">
              {renderStars(Math.round(averageRating), 24)}
            </div>

            <span className="text-2xl font-light">
              {averageRating.toFixed(1)}
            </span>

            <span className="ml-2 text-[#8e8e93]">
              ({reviews.length} atsiliepimai)
            </span>
          </div>

          {/* SORT */}

          <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <label className="text-sm text-[#a1a1a6]">
              Rūšiuoti:
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded border border-white/15 bg-[#191919] px-3 py-2 text-sm text-[#f5f5f7] outline-none transition-colors hover:border-white/30 focus:border-white/50"
            >
              <option value="newest">Naujausi</option>
              <option value="oldest">Seniausi</option>
              <option value="highest">Aukščiausias</option>
              <option value="lowest">Žemiausias</option>
              <option value="helpful">Naudingiausi</option>
            </select>
          </div>

          <button className="inline-flex items-center bg-[#f5f5f7] px-8 py-3 text-[#111111] transition-colors hover:bg-white">
            <MessageCircle size={18} className="mr-2" />
            Rašyti atsiliepimą
          </button>
        </div>

        {/* REVIEWS */}

        <div className="mx-auto max-w-4xl space-y-6">
          {sortedReviews.map((review) => (
            <div
              key={review.reviewId}
              className="border border-white/[0.09] bg-[#191919] p-8 transition-colors hover:border-white/20"
            >
              <div className="mb-4 flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0">

                <div className="flex-1">
                  <div className="mb-2 flex items-center">
                    <span className="mr-3 text-lg font-medium text-[#f5f5f7]">
                      {review.customerName}
                    </span>

                    {review.verified && (
                      <span className="rounded border border-white/10 bg-white/[0.05] px-2 py-1 text-xs text-[#c7c7cc]">
                        Patvirtinta
                      </span>
                    )}
                  </div>

                  <span className="text-sm text-[#8e8e93]">
                    {formatDate(review.date)}
                  </span>
                </div>

                <div className="flex flex-col items-start md:items-end">
                  {renderStars(review.rating)}

                  <div className="mt-2 flex items-center">
                    <ThumbsUp size={14} className="mr-1 text-[#8e8e93]" />
                    <span className="text-sm text-[#a1a1a6]">
                      {review.helpful}
                    </span>
                  </div>
                </div>
              </div>

              <h4 className="mb-3 text-xl font-medium text-[#f5f5f7]">
                {review.title}
              </h4>

              <p className="leading-relaxed text-[#c1c1c7]">
                {review.comment}
              </p>

              <div className="mt-6 border-t border-white/[0.08] pt-4">
                <button className="flex items-center text-sm text-[#a1a1a6] transition-colors hover:text-white">
                  <ThumbsUp size={14} className="mr-2" />
                  Ar buvo naudinga?
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RATING BREAKDOWN */}

        <div className="mx-auto mt-16 max-w-4xl border border-white/[0.09] bg-[#191919] p-8">
          <h3 className="mb-6 text-center text-2xl font-light">
            Įvertinimų pasiskirstymas
          </h3>

          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter(
                (r) => r.rating === rating
              ).length;

              const percentage =
                reviews.length > 0
                  ? (count / reviews.length) * 100
                  : 0;

              return (
                <div key={rating} className="flex items-center">
                  <span className="w-8 text-sm text-[#a1a1a6]">
                    {rating}
                  </span>

                  <Star
                    size={16}
                    className="mx-2 text-white"
                    fill="currentColor"
                  />

                  <div className="mx-3 h-3 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-3 rounded-full bg-[#f5f5f7] transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-12 text-right text-sm text-[#a1a1a6]">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ReviewsSection;