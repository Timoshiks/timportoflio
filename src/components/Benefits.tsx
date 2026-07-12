"use client";

import React from "react";
import { Zap, MessageSquare, Smartphone, ShoppingBag } from "lucide-react";

interface BenefitCard {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradClass: string;
}

const BENEFITS: BenefitCard[] = [
  {
    title: "Взрывная конверсия",
    description: "Покупка в 3 клика без перехода в сторонние браузеры. Каждый лишний переход — это потерянный клиент, а Mini App убирает все преграды.",
    icon: Zap,
    gradClass: "grad-tg"
  },
  {
    title: "Связь с менеджером в секунду",
    description: "Корзина автоматически превращается в готовое сообщение в чате. Клиенту не нужно писать состав заказа и адрес вручную.",
    icon: MessageSquare,
    gradClass: "grad-ig"
  },
  {
    title: "Идеально для мобильных",
    description: "Сайт открывается мгновенно, не лагает и выглядит как родное мобильное приложение — потому что технически им и является.",
    icon: Smartphone,
    gradClass: "bg-gradient-to-br from-ig-orange to-ig-pink"
  },
  {
    title: "Остаются в вашей экосистеме",
    description: "Клиент не отвлекается на другие вкладки в браузере и остается внутри вашего соцсетевого канала вплоть до оплаты.",
    icon: ShoppingBag,
    gradClass: "bg-gradient-to-br from-tg to-ig-violet"
  }
];

export default function Benefits() {
  return (
    <section className="relative py-24 px-6 max-w-7xl mx-auto border-t border-slate-200/80 bg-noise">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="font-mono text-xs text-ig-pink uppercase tracking-widest mb-3">Почему это работает</p>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
          Не просто сайт, а продолжение переписки
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
        {BENEFITS.map((benefit, idx) => {
          const IconComponent = benefit.icon;
          return (
            <div 
              key={idx}
              className="card-premium rounded-3xl p-8 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 ${benefit.gradClass}`}>
                <IconComponent className="w-5.5 h-5.5 text-white" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-3 text-text-primary">
                {benefit.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {benefit.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
