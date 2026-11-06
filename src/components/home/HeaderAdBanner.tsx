import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface AdBannerItem {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  onClick: () => void;
}

interface HeaderAdBannerProps {
  onOpenNewbieGuide: () => void;
  onOpenTeam: () => void;
  onOpenLuckyWheel: () => void;
}

export const HeaderAdBanner: React.FC<HeaderAdBannerProps> = ({
  onOpenNewbieGuide,
  onOpenTeam,
  onOpenLuckyWheel,
}) => {
  const banners: AdBannerItem[] = [
    {
      id: 'newbie-guide',
      image: '/assets/aistudio/banner_new-e1aff2b1_e1aff2b1.png',
      title: 'A must read for newbies - How to make more profits',
      onClick: onOpenNewbieGuide,
    },
    {
      id: 'invite-rewards',
      image: '/assets/aistudio/banner_invite-489f3621_489f3621.png',
      title: 'Invite user rewards - Earn team commissions',
      onClick: onOpenTeam,
    },
    {
      id: 'lucky-wheel',
      image: '/assets/aistudio/banner_lucky_wheel_v2-0b5d9a3b_0b5d9a3b.png',
      title: 'Lucky Wheel - Spin & Win ₹100,000!',
      onClick: onOpenLuckyWheel,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-slide every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, banners.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX;
      if (diff > 40) {
        // swipe left -> next
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      } else if (diff < -40) {
        // swipe right -> prev
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
      }
      touchStartX.current = null;
    }
    setIsPaused(false);
  };

  const activeBanner = banners[currentIndex];

  return (
    <div
      className="relative w-full aspect-[2.52/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-zinc-200/80 bg-zinc-950 group select-none cursor-pointer"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={activeBanner.onClick}
      role="button"
      tabIndex={0}
      aria-label={activeBanner.title}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          activeBanner.onClick();
        }
      }}
    >
      {/* Sliding Images Container */}
      <div
        className="w-full h-full flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((item, idx) => (
          <div key={item.id} className="w-full h-full flex-shrink-0 relative">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Subtle Navigation Chevrons on Hover */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
        aria-label="Previous banner"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
        aria-label="Next banner"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Carousel Pagination Dots */}
      <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-auto">
        {banners.map((item, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                isActive
                  ? 'w-6 bg-white shadow-xs'
                  : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};
