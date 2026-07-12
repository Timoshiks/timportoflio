"use client";

import React from "react";
import { Smartphone, MousePointerClick, MessageSquare, X, Check } from "lucide-react";

export default function Hero() {
  const scrollToSimulator = () => {
    document.getElementById("simulator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="absolute -left-20 top-20 w-[400px] h-[400px] bg-tg/5 blur-[120px] rounded-full -z-10"></div>
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 text-xs font-mono text-text-secondary mb-6 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Telegram Mini Apps · Instagram Web App
          </div>
          
          <h1 className="font-display font-extrabold text-[2.2rem] sm:text-5xl lg:text-[3.2rem] leading-[1.1] tracking-tight mb-6 text-text-primary">
            Продавайте прямо внутри <span className="text-grad-mix">Telegram</span> и <span className="text-grad-mix">Instagram</span> без потери клиентов
          </h1>
          
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-9 max-w-xl">
            Клиенты уходят, когда им приходится копировать ссылки, переходить в сторонний браузер или вручную писать менеджеру «Сколько стоит?». Дайте им бесшовный каталог, который открывается в 1 клик.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={scrollToSimulator}
              className="pulse btn-primary-glow text-white font-semibold px-7 py-4 rounded-2xl inline-flex items-center gap-2 cursor-pointer transition-all duration-300"
            >
              <Smartphone className="w-5 h-5" />
              Посмотреть демо-каталог
            </button>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <MousePointerClick className="w-4 h-4 text-tg" />
              Интерактивно, займёт 20 секунд
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 grad-ig opacity-10 blur-[100px] rounded-full"></div>
          <div className="relative card-premium rounded-3xl p-6 lg:p-8 border border-white/10">
            <div className="flex items-center gap-2 mb-6 text-xs font-mono text-text-secondary">
              <MessageSquare className="w-4 h-4 text-tg" />
              СРАВНЕНИЕ КОНВЕРСИИ
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-3 bg-red-500/5 p-4 rounded-2xl border border-red-500/10">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-red-400 mb-1">КАК У ВСЕХ (ПОТЕРИ)</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Клиент копирует ссылку → открывает браузер → долго грузится сайт → отвлекается на уведомления → уходит к конкурентам.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-emerald-400 mb-1">C MINI APP (МАКСИМУМ ПРОДАЖ)</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Клиент нажимает кнопку в чате → мгновенно видит каталог внутри соцсети → оформляет заказ за 3 клика, не выходя из переписки.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
