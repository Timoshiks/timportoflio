"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ShoppingBag, Plus, Check, ArrowRight, ChevronLeft, 
  User, RotateCcw, Shirt, Footprints, Crown 
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  icon: React.ComponentType<{ className?: string }>;
  gradClass: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Стильный худи",
    price: 4500,
    icon: Shirt,
    gradClass: "grad-ig"
  },
  {
    id: 2,
    name: "Кроссовки Urban",
    price: 6200,
    icon: Footprints,
    gradClass: "grad-tg"
  },
  {
    id: 3,
    name: "Кепка",
    price: 1900,
    icon: Crown,
    gradClass: "bg-gradient-to-br from-ig-orange to-ig-pink"
  }
];

export default function Simulator() {
  const [cart, setCart] = useState<{ id: number; name: string; price: number }[]>([]);
  const [view, setView] = useState<"catalog" | "chat">("catalog");
  const [chatStatus, setChatStatus] = useState<"в сети" | "печатает…">("в сети");
  const [showTyping, setShowTyping] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const replyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
    };
  }, []);

  const handleAddToCart = (id: number, name: string, price: number) => {
    if (cart.some(item => item.id === id)) return;
    setCart([...cart, { id, name, price }]);
  };

  const getCartPluralText = (count: number) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return `${count} товаров`;
    if (lastDigit === 1) return `${count} товар`;
    if (lastDigit >= 2 && lastDigit <= 4) return `${count} товара`;
    return `${count} товаров`;
  };

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setView("chat");
    setChatStatus("в сети");
    setShowTyping(false);
    setShowReply(false);

    // Cancel existing timers if any
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (replyTimerRef.current) clearTimeout(replyTimerRef.current);

    // Show typing status after 900ms
    typingTimerRef.current = setTimeout(() => {
      setChatStatus("печатает…");
      setShowTyping(true);
    }, 900);

    // Hide typing status and show reply after 2200ms
    replyTimerRef.current = setTimeout(() => {
      setShowTyping(false);
      setShowReply(true);
      setChatStatus("в сети");
    }, 2500);
  };

  const handleBackToCatalog = () => {
    setView("catalog");
  };

  const handleReset = () => {
    setCart([]);
    setView("catalog");
    setShowTyping(false);
    setShowReply(false);
    setChatStatus("в сети");
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
  };

  return (
    <section id="simulator" className="relative py-24 px-6 max-w-7xl mx-auto border-t border-slate-200/80">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="font-mono text-xs text-tg uppercase tracking-widest mb-3">Живой пример</p>
        <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4 text-text-primary">
          Попробуйте сами — как клиент
        </h2>
        <p className="text-text-secondary leading-relaxed">
          Добавьте товары в корзину и нажмите «Оформить заказ». Мы покажем, как заявка мгновенно превращается в готовое сообщение менеджеру в мессенджере.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-14 lg:gap-24">
        
        {/* Smartphone Simulator */}
        <div className="relative shrink-0">
          <div className="absolute -inset-10 bg-tg/5 blur-[80px] rounded-full -z-10"></div>
          
          {/* Phone Border */}
          <div className="w-[310px] h-[640px] xs:w-[320px] xs:h-[660px] rounded-[44px] bg-[#0c101b] border-[6px] border-[#222a3f] shadow-2xl relative overflow-hidden flex flex-col">
            
            {/* Notch */}
            <div className="absolute top-0 left-50% -translate-x-[50%] w-32 h-6 bg-[#0c101b] rounded-b-2xl z-30 flex items-center justify-center">
              <span className="w-10 h-1 bg-[#1e293b] rounded-full absolute bottom-1.5"></span>
            </div>

            {/* Screen Content Wrapper */}
            <div className="relative flex-1 bg-white flex flex-col text-slate-900 font-sans">
              
              {/* VIEW 1: CATALOG */}
              <div 
                className={`absolute inset-0 flex flex-col transition-all duration-500 ease-out-quint ${
                  view === "catalog" 
                    ? "opacity-100 translate-x-0 pointer-events-auto" 
                    : "opacity-0 -translate-x-full pointer-events-none"
                }`}
              >
                {/* Simulated App Header */}
                <div className="grad-tg pt-8 pb-4 px-5 flex items-center gap-3 shrink-0">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <ShoppingBag className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm leading-tight">Urban Store</p>
                    <p className="text-white/70 text-[11px] leading-tight">Mini App · онлайн</p>
                  </div>
                </div>

                {/* Catalog Scrollable Items */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 phone-scrollbar">
                  {PRODUCTS.map((product) => {
                    const isAdded = cart.some(item => item.id === product.id);
                    const IconComponent = product.icon;
                    return (
                      <div 
                        key={product.id}
                        className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex gap-3.5 items-center transition-colors duration-200 hover:border-ig-violet/40 hover:bg-white shadow-sm"
                      >
                        <div className={`w-14 h-14 rounded-xl shrink-0 flex items-center justify-center ${product.gradClass}`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500 mb-2 font-mono">{product.price.toLocaleString("ru-RU")} ₽</p>
                          <button
                            onClick={() => handleAddToCart(product.id, product.name, product.price)}
                            disabled={isAdded}
                            className={`w-full text-[11px] font-semibold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer ${
                              isAdded 
                                ? "bg-emerald-600 text-white cursor-default" 
                                : "bg-tg/10 text-tg hover:bg-tg hover:text-white"
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3 h-3" />
                                Добавлено
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                Добавить в корзину
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Shopping Cart Bar inside Simulator */}
                <div 
                  className={`px-4 py-4 border-t border-slate-100 bg-white/95 shadow-md transition-all duration-300 ${
                    cart.length > 0 ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-slate-500">{getCartPluralText(cart.length)}</span>
                    <span className="font-mono text-slate-900 font-semibold">{cartTotal.toLocaleString("ru-RU")} ₽</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full btn-primary-glow text-white text-xs font-semibold py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Оформить заказ
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* VIEW 2: CHAT */}
              <div 
                className={`absolute inset-0 flex flex-col transition-all duration-500 ease-out-quint ${
                  view === "chat" 
                    ? "opacity-100 translate-x-0 pointer-events-auto" 
                    : "opacity-0 translate-x-full pointer-events-none"
                }`}
              >
                {/* Simulated Chat Header */}
                <div className="grad-ig pt-8 pb-4 px-4 flex items-center gap-2 shrink-0">
                  <button 
                    onClick={handleBackToCatalog}
                    className="text-white/80 hover:text-white mr-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm leading-tight">Менеджер Анна</p>
                    <p className="text-white/70 text-[11px] leading-tight font-mono">{chatStatus}</p>
                  </div>
                </div>

                {/* Chat Message Stream */}
                <div className="flex-1 px-4 py-4 flex flex-col justify-end gap-3 bg-slate-100 overflow-y-auto">
                  
                  {/* Automated Outgoing Order Message */}
                  <div className="self-end max-w-[85%] bg-tg text-white text-[13px] leading-snug rounded-2xl rounded-br-sm px-3.5 py-2.5 animate-fade-up">
                    <p className="font-medium mb-1">Здравствуйте! Я хочу заказать:</p>
                    <div className="text-white/90 text-xs list-disc pl-1 space-y-0.5">
                      {cart.map((item, idx) => (
                        <div key={idx}>• {item.name} (1 шт)</div>
                      ))}
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-white/20 font-bold text-right text-xs">
                      Итого: {cartTotal.toLocaleString("ru-RU")} руб.
                    </div>
                  </div>

                  {/* Typing dot animation */}
                  {showTyping && (
                    <div className="self-start bg-white border border-slate-200/80 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center shadow-sm animate-fade-up">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-blink"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-blink [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-blink [animation-delay:0.4s]"></span>
                    </div>
                  )}

                  {/* Incoming Reply Message */}
                  {showReply && (
                    <div className="self-start max-w-[85%] bg-white border border-slate-200/80 text-slate-800 text-[13px] leading-snug rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm animate-fade-up">
                      Приняла заказ 🙌 Уточните адрес доставки, и уже сегодня отправим!
                    </div>
                  )}
                </div>

                {/* Bottom simulated input area */}
                <div className="px-4 py-3 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0">
                  <div className="flex-1 bg-slate-50 rounded-full px-4 py-2.5 text-[10px] text-slate-400 select-none">
                    Сообщение отправлено автоматически
                  </div>
                  <div className="w-9 h-9 rounded-full grad-tg flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Steps and Explanation beside Simulator */}
        <div className="max-w-md space-y-6">
          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-full bg-tg/10 flex items-center justify-center shrink-0 font-mono text-xs text-tg font-bold">
              1
            </div>
            <div>
              <p className="font-semibold text-text-primary mb-1">Клиент выбирает товары</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Каталог открывается мгновенно внутри чата — без перехода в сторонние браузеры, загрузок и лишних вкладок.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-full bg-ig-violet/10 flex items-center justify-center shrink-0 font-mono text-xs text-ig-violet font-bold">
              2
            </div>
            <div>
              <p className="font-semibold text-text-primary mb-1">Корзина сама формирует заявку</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Ничего писать вручную не нужно — состав заказа и сумма подставляются в текст автоматически в один клик.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-full bg-ig-pink/10 flex items-center justify-center shrink-0 font-mono text-xs text-ig-pink font-bold">
              3
            </div>
            <div>
              <p className="font-semibold text-text-primary mb-1">Менеджер получает готовое сообщение</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Остается только уточнить доставку и оплату. Сделка закрывается за минуты, а не часы переписок.
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-white/5">
            <button 
              onClick={handleReset}
              className="text-xs text-text-muted hover:text-text-primary transition-colors duration-200 inline-flex items-center gap-1.5 cursor-pointer py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> 
              Сбросить симулятор
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
