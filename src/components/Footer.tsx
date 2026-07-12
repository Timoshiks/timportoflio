"use client";

import React, { useState } from "react";
import { Zap, ArrowRight } from "lucide-react";

export default function Footer() {
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    setSubmitted(true);
    setContact("");
  };

  return (
    <footer className="relative border-t border-slate-200 bg-white pt-28 pb-12 px-6">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] sm:w-[500px] h-[300px] bg-ig-violet/10 blur-[110px] rounded-full -z-10"></div>
      
      {/* CTA section */}
      <div id="cta" className="max-w-4xl mx-auto text-center mb-24">
        <p className="font-mono text-xs text-tg uppercase tracking-widest mb-4">Ваша очередь</p>
        <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-6 leading-tight text-text-primary">
          Хотите такой же каталог для своего бизнеса?
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto mb-10 text-sm sm:text-base leading-relaxed">
          Соберем Mini App под ваш ассортимент и подключим к Telegram или Instagram за несколько дней — без риска и без переплат за разработку сложного сайта.
        </p>

        {submitted ? (
          <div className="max-w-md mx-auto p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-sm animate-fade-up">
            Спасибо! Мы свяжемся с вами в ближайшее время.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              required
              type="text"
              placeholder="Ваш Telegram или e-mail"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:border-ig-violet/60 focus:outline-none transition-colors placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="btn-primary-glow text-white font-semibold px-6 py-3.5 rounded-xl inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer transition-all duration-300"
            >
              Обсудить проект
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Footer Branding & Legal */}
      <div className="max-w-7xl mx-auto border-t border-slate-200/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md grad-tg flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span>miniShop · Mini Apps для Telegram и Instagram</span>
        </div>
        <span>© 2026. Демонстрационная страница.</span>
      </div>
    </footer>
  );
}
