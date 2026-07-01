"use client";

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { CircularGallery, GalleryItem } from '@/components/ui/circular-gallery';

const galleryData: GalleryItem[] = [
	{
		common: 'Lion',
		binomial: 'Panthera leo',
		photo: {
			url: 'https://images.unsplash.com/photo-1583499871880-de841d1ace2a?w=900&auto=format&fit=crop&q=80',
			text: 'lion couple kissing on a brown rock',
			pos: '47% 35%',
			by: 'Clément Roy'
		}
	},
	{
		common: 'Asiatic elephant',
		binomial: 'Elephas maximus',
		photo: {
			url: 'https://images.unsplash.com/photo-1571406761758-9a3eed5338ef?w=900&auto=format&fit=crop&q=80',
			text: 'herd of Sri Lankan elephants walking away from a river',
			pos: '75% 65%',
			by: 'Alex Azabache'
		}
	},
	{
		common: 'Red-tailed black cockatoo',
		binomial: 'Calyptorhynchus banksii',
		photo: {
			url: 'https://images.unsplash.com/photo-1619664208054-41eefeab29e9?w=900&auto=format&fit=crop&q=80',
			text: 'close-up of a black cockatoo',
			pos: '53% 43%',
			by: 'David Clode'
		}
	},
	{
		common: 'Dromedary',
		binomial: 'Camelus dromedarius',
		photo: {
			url: 'https://images.unsplash.com/photo-1662841238473-f4b137e123cb?w=900&auto=format&fit=crop&q=80',
			text: 'camel and her new born calf walking in the Sahara desert',
			pos: '65% 65%',
			by: 'Moaz Tobok'
		}
	},
	{
		common: 'Polar bear',
		binomial: 'Ursus maritimus',
		photo: {
			url: 'https://images.unsplash.com/photo-1589648751789-c8ecb7a88bd5?w=900&auto=format&fit=crop&q=80',
			text: 'polar bear on the snow, by the water, raised on the hind legs, front paws together',
			pos: '50% 25%',
			by: 'Hans-Jurgen Mager'
		}
	},
	{
		common: 'Giant panda',
		binomial: 'Ailuropoda melanoleuca',
		photo: {
			url: 'https://images.unsplash.com/photo-1659540181281-1d89d6112832?w=900&auto=format&fit=crop&q=80',
			text: 'giant panda hanging from a tree branch',
			pos: '47%',
			by: 'Jiachen Lin'
		}
	},
	{
		common: 'Grévy\'s zebra',
		binomial: 'Equus grevyi',
		photo: {
			url: 'https://images.unsplash.com/photo-1526095179574-86e545346ae6?w=900&auto=format&fit=crop&q=80',
			text: 'zebra standing on wheat field, looking back towards the camera',
			pos: '65% 35%',
			by: 'Jeff Griffith'
		}
	},
	{
		common: 'Cheetah',
		binomial: 'Acinonyx jubatus',
		photo: {
			url: 'https://images.unsplash.com/photo-1541707519942-08fd2f6480ba?w=900&auto=format&fit=crop&q=80',
			text: 'cheetah sitting in the grass under a blue sky',
			by: 'Mike Bird'
		}
	},
	{
		common: 'King penguin',
		binomial: 'Aptenodytes patagonicus',
		photo: {
			url: 'https://images.unsplash.com/photo-1595792419466-23cec2476fa6?w=900&auto=format&fit=crop&q=80',
			text: 'king penguin with a fluffy brown chick on grey rocks',
			pos: '35%',
			by: 'Martin Wettstein'
		}
	},
	{
		common: 'Red panda',
		binomial: 'Ailurus fulgens',
		photo: {
			url: 'https://images.unsplash.com/photo-1689799513565-44d2bc09d75b?w=900&auto=format&fit=crop&q=80',
			text: 'a red panda in a tree',
			by: 'Niels Baars'
		}
	},
];

const CircularGalleryDemo = () => {
  // Live scroll progress (0 → 1), smoothed with a spring for the top progress bar.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    // This outer container provides the scrollable height.
    <div className="relative w-full bg-background text-foreground" style={{ height: '500vh' }}>
      {/* Top scroll-progress bar — animates as you scroll the gallery around. */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-30 h-1 origin-left bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400"
        style={{ scaleX: progress }}
      />

      {/* This inner container sticks to the top while scrolling. */}
      <div className="w-full h-screen sticky top-0 flex flex-col items-center justify-center overflow-hidden">
        {/* Cinematic radial glow behind the carousel. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, rgba(56,189,248,0.18), rgba(0,0,0,0) 55%)',
          }}
        />

        {/* Animated title block — fades and lifts in on mount. */}
        <motion.div
          className="text-center mb-8 absolute top-16 z-20 px-4"
          initial={{ opacity: 0, y: -24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Animal Gallery
          </h1>
          <p className="text-muted-foreground mt-2 md:text-lg">
            Scroll to rotate the gallery
          </p>
        </motion.div>

        {/* The 3D carousel — scales + fades up as it enters. */}
        <motion.div
          className="w-full h-full z-10"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <CircularGallery items={galleryData} />
        </motion.div>

        {/* Bouncing scroll hint. */}
        <motion.div
          className="absolute bottom-10 z-20 flex flex-col items-center text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CircularGalleryDemo;
