'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type GalleryImage = {
  title: string;
  url: string;
};

const images: GalleryImage[] = [
  {
    title: 'Joshua Earle',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600&h=1000&fit=crop',
  },
  {
    title: 'Sunlit Pines',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600&h=1000&fit=crop',
  },
  {
    title: 'Alpine Mirror',
    url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?q=80&w=600&h=1000&fit=crop',
  },
  {
    title: 'Greg Rakozy',
    url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=600&h=1000&fit=crop',
  },
  {
    title: 'Valley River',
    url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=600&h=1000&fit=crop',
  },
];

const FLIP_SPEED = 750;
const flipTiming: KeyframeAnimationOptions = {
  duration: FLIP_SPEED,
  iterations: 1,
};

// flip down
const flipAnimationTop: Keyframe[] = [
  { transform: 'rotateX(0)' },
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(-90deg)' },
];
const flipAnimationBottom: Keyframe[] = [
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(0)' },
];

// flip up
const flipAnimationTopReverse: Keyframe[] = [
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(0)' },
];
const flipAnimationBottomReverse: Keyframe[] = [
  { transform: 'rotateX(0)' },
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(90deg)' },
];

export default function FlipGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniteRef = useRef<NodeListOf<HTMLElement> | HTMLElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // initialise first image once
  useEffect(() => {
    if (!containerRef.current) return;
    uniteRef.current =
      containerRef.current.querySelectorAll<HTMLElement>('.unite');
    defineFirstImg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defineFirstImg = () => {
    uniteRef.current.forEach((el) => setActiveImage(el, currentIndex));
    setImageTitle(currentIndex);
  };

  // Index is passed explicitly (not read from the render closure) because these
  // run inside setTimeouts scheduled before React re-renders — reading
  // `currentIndex` here would always be one step stale.
  const setActiveImage = (el: HTMLElement, index: number) => {
    el.style.backgroundImage = `url('${images[index].url}')`;
  };

  const setImageTitle = (index: number) => {
    const gallery = containerRef.current;
    if (!gallery) return;
    gallery.setAttribute('data-title', images[index].title);
    gallery.style.setProperty('--title-y', '0');
    gallery.style.setProperty('--title-opacity', '1');
  };

  const updateGallery = (nextIndex: number, isReverse = false) => {
    const gallery = containerRef.current;
    if (!gallery) return;

    // determine direction animation arrays
    const topAnim = isReverse ? flipAnimationTopReverse : flipAnimationTop;
    const bottomAnim = isReverse
      ? flipAnimationBottomReverse
      : flipAnimationBottom;

    gallery.querySelector('.overlay-top')?.animate(topAnim, flipTiming);
    gallery.querySelector('.overlay-bottom')?.animate(bottomAnim, flipTiming);

    // hide title
    gallery.style.setProperty('--title-y', '-1rem');
    gallery.style.setProperty('--title-opacity', '0');
    gallery.setAttribute('data-title', '');

    // update images with slight delay so animation looks continuous
    uniteRef.current.forEach((el, idx) => {
      const delay =
        (isReverse && idx !== 1 && idx !== 2) ||
        (!isReverse && (idx === 1 || idx === 2))
          ? FLIP_SPEED - 200
          : 0;

      setTimeout(() => setActiveImage(el, nextIndex), delay);
    });

    // reveal new title roughly half-way through animation
    setTimeout(() => setImageTitle(nextIndex), FLIP_SPEED * 0.5);
  };

  const updateIndex = (increment: number) => {
    const inc = Number(increment);
    const newIndex = (currentIndex + inc + images.length) % images.length;
    const isReverse = inc < 0;
    setCurrentIndex(newIndex);
    updateGallery(newIndex, isReverse);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black font-sans">
      <div
        className="relative bg-white/10 border border-white/25 p-2"
        style={
          { '--gallery-bg-color': 'rgba(255 255 255 / 0.075)' } as React.CSSProperties
        }
      >
        {/* flip gallery */}
        <div
          id="flip-gallery"
          ref={containerRef}
          className="relative w-[240px] h-[400px] md:w-[300px] md:h-[500px] text-center"
          style={{ perspective: '800px' }}
        >
          <div className="top unite bg-cover bg-no-repeat"></div>
          <div className="bottom unite bg-cover bg-no-repeat"></div>
          <div className="overlay-top unite bg-cover bg-no-repeat"></div>
          <div className="overlay-bottom unite bg-cover bg-no-repeat"></div>
        </div>

        {/* navigation */}
        <div className="absolute top-full right-0 mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => updateIndex(-1)}
            title="Previous"
            className="text-white opacity-75 hover:opacity-100 hover:scale-125 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => updateIndex(1)}
            title="Next"
            className="text-white opacity-75 hover:opacity-100 hover:scale-125 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* component-scoped styles that Tailwind cannot express */}
      <style>{`
        #flip-gallery::after {
          content: '';
          position: absolute;
          background-color: black;
          width: 100%;
          height: 4px;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }

        #flip-gallery::before {
          content: attr(data-title);
          color: rgba(255 255 255 / 0.75);
          font-size: 0.75rem;
          left: -0.5rem;
          position: absolute;
          top: calc(100% + 1rem);
          line-height: 2;
          opacity: var(--title-opacity, 0);
          transform: translateY(var(--title-y, 0));
          transition: opacity 500ms ease-in-out, transform 500ms ease-in-out;
        }

        #flip-gallery > * {
          position: absolute;
          width: 100%;
          height: 50%;
          overflow: hidden;
          background-size: 240px 400px;
        }

        @media (min-width: 600px) {
          #flip-gallery > * {
            background-size: 300px 500px;
          }
        }

        .top,
        .overlay-top {
          top: 0;
          transform-origin: bottom;
          background-position: top;
        }

        .bottom,
        .overlay-bottom {
          bottom: 0;
          transform-origin: top;
          background-position: bottom;
        }
      `}</style>
    </div>
  );
}
