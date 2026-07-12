"use client";

import React from "react";

export default function MarqueeStrip() {
  const niches = ["E-commerce", "Услуги", "Retail", "Доставка еды", "Beauty", "Онлайн-школы"];

  return (
    <section className="py-10 border-y border-slate-200/80 overflow-hidden bg-slate-100/50">
      <div className="relative flex w-full">
        {/* Marquee Track Container */}
        <div className="marquee-track flex whitespace-nowrap font-mono text-xs sm:text-sm text-text-secondary gap-16 select-none animate-marquee">
          {/* Loop niches multiple times for a seamless flow */}
          {[...Array(4)].map((_, loopIdx) => (
            <span key={loopIdx} className="flex items-center gap-16">
              {niches.map((niche, nicheIdx) => (
                <React.Fragment key={nicheIdx}>
                  <span>{niche}</span>
                  <span>·</span>
                </React.Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
