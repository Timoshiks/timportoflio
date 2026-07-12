"use client";

import React from "react";
import { Zap, ArrowUpRight } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-white/75 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg grad-tg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-slate-900">
            miniShop
          </span>
        </div>
        <a
          href="#cta"
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-slate-200 hover:border-ig-violet/50 hover:text-ig-violet text-slate-700 transition-colors"
        >
          Обсудить проект
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
}
