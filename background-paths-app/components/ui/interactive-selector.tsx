"use client";

import React, { useState, useEffect } from "react";
import { Droplets, Wrench, Search, ShowerHead, Bath } from "lucide-react";

type ServiceOption = {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
};

const InteractiveSelector = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);

  const options: ServiceOption[] = [
    {
      title: "Drain Cleaning",
      description: "Fast, no-mess clogged drain clearing",
      image:
        "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80",
      icon: <Droplets size={24} className="text-white" />,
    },
    {
      title: "Pipe Repair & Repiping",
      description: "Leak-free copper & PEX repipes",
      image:
        "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80",
      icon: <Wrench size={24} className="text-white" />,
    },
    {
      title: "Leak Detection",
      description: "Pinpoint hidden leaks, zero guesswork",
      image:
        "https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=800&q=80",
      icon: <Search size={24} className="text-white" />,
    },
    {
      title: "Fixture & Faucet Install",
      description: "Faucets, sinks & shower upgrades",
      image:
        "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80",
      icon: <ShowerHead size={24} className="text-white" />,
    },
    {
      title: "Bathroom Remodels",
      description: "Full bath plumbing, start to finish",
      image:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      icon: <Bath size={24} className="text-white" />,
    },
  ];

  const handleOptionClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    options.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions((prev) => [...prev, i]);
      }, 180 * i);
      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#222] font-sans text-white">
      {/* Header Section */}
      <div className="w-full max-w-2xl px-6 mt-8 mb-2 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg animate-fadeInTop delay-300">
          Our Plumbing Services
        </h1>
        <p className="text-lg md:text-xl text-gray-300 font-medium max-w-xl mx-auto animate-fadeInTop delay-600">
          Licensed, insured, and on call 24/7 — pick a service to see how we
          fix it.
        </p>
      </div>

      <div className="h-12"></div>

      {/* Options Container */}
      <div className="options flex w-full max-w-[900px] min-w-[600px] h-[400px] mx-0 items-stretch overflow-hidden relative">
        {options.map((option, index) => (
          <div
            key={index}
            className={`
              option relative flex flex-col justify-end overflow-hidden transition-all duration-700 ease-in-out
              ${activeIndex === index ? "active" : ""}
            `}
            style={{
              backgroundImage: `url('${option.image}')`,
              backgroundSize: activeIndex === index ? "auto 100%" : "auto 120%",
              backgroundPosition: "center",
              backfaceVisibility: "hidden",
              opacity: animatedOptions.includes(index) ? 1 : 0,
              transform: animatedOptions.includes(index)
                ? "translateX(0)"
                : "translateX(-60px)",
              minWidth: "60px",
              minHeight: "100px",
              margin: 0,
              borderRadius: 0,
              borderWidth: "2px",
              borderStyle: "solid",
              borderColor: activeIndex === index ? "#fff" : "#292929",
              cursor: "pointer",
              backgroundColor: "#18181b",
              boxShadow:
                activeIndex === index
                  ? "0 20px 60px rgba(0,0,0,0.50)"
                  : "0 10px 30px rgba(0,0,0,0.30)",
              flex: activeIndex === index ? "7 1 0%" : "1 1 0%",
              zIndex: activeIndex === index ? 10 : 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              position: "relative",
              overflow: "hidden",
              willChange:
                "flex-grow, box-shadow, background-size, background-position",
            }}
            onClick={() => handleOptionClick(index)}
          >
            {/* Shadow effect */}
            <div
              className="shadow absolute left-0 right-0 pointer-events-none transition-all duration-700 ease-in-out"
              style={{
                bottom: activeIndex === index ? "0" : "-40px",
                height: "120px",
                boxShadow:
                  activeIndex === index
                    ? "inset 0 -120px 120px -120px #000, inset 0 -120px 120px -80px #000"
                    : "inset 0 -120px 0px -120px #000, inset 0 -120px 0px -80px #000",
              }}
            ></div>

            {/* Label with icon and info */}
            <div className="label absolute left-0 right-0 bottom-5 flex items-center justify-start h-12 z-2 pointer-events-none px-4 gap-3 w-full">
              <div className="icon min-w-[44px] max-w-[44px] h-[44px] flex items-center justify-center rounded-full bg-[rgba(32,32,32,0.85)] backdrop-blur-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.18)] border-2 border-[#444] flex-shrink-0 flex-grow-0 transition-all duration-200">
                {option.icon}
              </div>
              <div className="info text-white whitespace-pre relative">
                <div
                  className="main font-bold text-lg transition-all duration-700 ease-in-out"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform:
                      activeIndex === index
                        ? "translateX(0)"
                        : "translateX(25px)",
                  }}
                >
                  {option.title}
                </div>
                <div
                  className="sub text-base text-gray-300 transition-all duration-700 ease-in-out"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform:
                      activeIndex === index
                        ? "translateX(0)"
                        : "translateX(25px)",
                  }}
                >
                  {option.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveSelector;
