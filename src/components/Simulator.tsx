"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ShoppingBag, Plus, Check, ArrowRight, ChevronLeft, 
  User, RotateCcw, Shirt, Footprints, Crown, 
  Search, MoreVertical, X, Sparkles, Send
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  icon: React.ComponentType<{ className?: string }>;
  gradClass: string;
  sizes: string[];
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Стильный худи",
    price: 4500,
    icon: Shirt,
    gradClass: "grad-ig",
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "Кроссовки Urban",
    price: 6200,
    icon: Footprints,
    gradClass: "grad-tg",
    sizes: ["40", "41", "42", "43", "44"]
  },
  {
    id: 3,
    name: "Кепка",
    price: 1900,
    icon: Crown,
    gradClass: "bg-gradient-to-br from-ig-orange to-ig-pink",
    sizes: ["One Size"]
  }
];

export default function Simulator() {
  const [view, setView] = useState<"channel" | "chat">("channel");
  const [webAppOpen, setWebAppOpen] = useState(false);
  const [cart, setCart] = useState<{ id: number; name: string; price: number; size: string }[]>([]);
  const [sizeSelectorProduct, setSizeSelectorProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  
  const [chatStatus, setChatStatus] = useState<"в сети" | "печатает…">("в сети");
  const [showTyping, setShowTyping] = useState(false);
  const [showReply, setShowReply] = useState(false);
  
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const replyTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
    };
  }, []);

  const handleOpenCatalog = () => {
    setWebAppOpen(true);
  };

  const handleCloseCatalog = () => {
    setWebAppOpen(false);
    setSizeSelectorProduct(null);
    setSelectedSize("");
  };

  const triggerSizeSelector = (product: Product) => {
    if (cart.some(item => item.id === product.id)) return;
    setSizeSelectorProduct(product);
    setSelectedSize("");
  };

  const confirmAdd = () => {
    if (!sizeSelectorProduct || !selectedSize) return;
    setCart([
      ...cart,
      {
        id: sizeSelectorProduct.id,
        name: sizeSelectorProduct.name,
        price: sizeSelectorProduct.price,
        size: selectedSize
      }
    ]);
    setSizeSelectorProduct(null);
    setSelectedSize("");
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
    
    // Close WebApp bottom sheet
    setWebAppOpen(false);
    
    // Change screen view to Manager Chat
    setView("chat");
    setChatStatus("в сети");
    setShowTyping(false);
    setShowReply(false);

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (replyTimerRef.current) clearTimeout(replyTimerRef.current);

    // Simulated reply trigger
    typingTimerRef.current = setTimeout(() => {
      setChatStatus("печатает…");
      setShowTyping(true);
    }, 900);

    replyTimerRef.current = setTimeout(() => {
      setShowTyping(false);
      setShowReply(true);
      setChatStatus("в сети");
    }, 2500);
  };

  const handleBackToChannel = () => {
    setView("channel");
    setWebAppOpen(false);
  };

  const handleReset = () => {
    setCart([]);
    setView("channel");
    setWebAppOpen(false);
    setSizeSelectorProduct(null);
    setSelectedSize("");
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
          Нажмите на кнопку открытия каталога в посте канала, выберите размеры товаров, добавьте их в корзину и оформите заказ. Посмотрите, как бесшовно Mini App работает внутри интерфейса Telegram!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-14 lg:gap-24">
        
        {/* Smartphone Simulator */}
        <div className="relative shrink-0">
          <div className="absolute -inset-10 bg-tg/5 blur-[80px] rounded-full -z-10"></div>
          
          {/* Phone Shell */}
          <div className="w-[310px] h-[640px] xs:w-[320px] xs:h-[660px] rounded-[44px] bg-[#0c101b] border-[6px] border-[#222a3f] shadow-2xl relative overflow-hidden flex flex-col">
            
            {/* Notch */}
            <div className="absolute top-0 left-[50%] -translate-x-[50%] w-32 h-6 bg-[#0c101b] rounded-b-2xl z-50 flex items-center justify-center">
              <span className="w-10 h-1 bg-[#1e293b] rounded-full absolute bottom-1.5"></span>
            </div>

            {/* Status Bar */}
            <div className="h-7 px-6 pt-1 flex items-center justify-between text-[9px] font-bold z-50 shrink-0 bg-white text-slate-800 border-b border-slate-100 select-none">
              <span>16:40</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 border border-current rounded-sm flex items-center p-0.5"><span className="bg-current w-1 h-0.5 rounded-[1px]"></span></span>
                <span>LTE</span>
              </div>
            </div>

            {/* Screen Content Wrapper */}
            <div className="relative flex-1 bg-white flex flex-col text-slate-900 font-sans overflow-hidden">
              
              {/* ===== VIEW 1: TELEGRAM CHANNEL ===== */}
              <div 
                className={`absolute inset-0 flex flex-col transition-all duration-300 ${
                  view === "channel" 
                    ? "opacity-100 scale-100 pointer-events-auto" 
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                {/* Channel App Header */}
                <div className="bg-white border-b border-slate-100 py-2.5 px-4 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5">
                    <ChevronLeft className="w-5 h-5 text-tg" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-tg to-tg-dark flex items-center justify-center text-white font-bold text-sm">
                      U
                    </div>
                    <div>
                      <p className="font-semibold text-xs leading-tight text-slate-900 flex items-center gap-1">
                        Urban Store 
                        <span className="w-2.5 h-2.5 bg-tg rounded-full inline-flex items-center justify-center"><Check className="w-1.5 h-1.5 text-white" /></span>
                      </p>
                      <p className="text-[10px] text-slate-400 leading-tight">14 200 подписчиков</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <Search className="w-4 h-4" />
                    <MoreVertical className="w-4 h-4" />
                  </div>
                </div>

                {/* Feed Feed */}
                <div className="flex-1 bg-slate-100 p-3 overflow-y-auto space-y-4">
                  
                  {/* Channel Post Card */}
                  <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-sm">
                    {/* CSS gradient media placeholder */}
                    <div className="bg-gradient-to-br from-tg/10 via-ig-violet/5 to-ig-pink/10 h-28 rounded-lg flex flex-col items-center justify-center font-display text-[10px] text-slate-400 font-bold mb-3 border border-slate-100 select-none">
                      <Sparkles className="w-5 h-5 text-ig-violet mb-1" />
                      NEW ARRIVALS 2026
                    </div>
                    
                    <h3 className="font-bold text-xs text-slate-800 mb-1.5">🔥 Свежий дроп Urban Wear!</h3>
                    <p className="text-[10px] text-slate-600 leading-normal">
                      Новые худи, кроссовки и кепки уже доступны к заказу. Оформляйте покупки прямо внутри Telegram без лишних вкладок и долгой загрузки сайтов.
                    </p>
                    
                    {/* Inline Button (Telegram Web App trigger) */}
                    <button 
                      onClick={handleOpenCatalog}
                      className="w-full mt-3 bg-[#24A1DE] hover:bg-[#1a85b9] text-white py-2.5 px-3 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      🛍 Открыть каталог
                    </button>
                  </div>

                </div>
              </div>

              {/* ===== VIEW 2: MANAGER CHAT VIEW ===== */}
              <div 
                className={`absolute inset-0 flex flex-col transition-all duration-300 ${
                  view === "chat" 
                    ? "opacity-100 scale-100 pointer-events-auto" 
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                {/* Chat Header */}
                <div className="bg-white border-b border-slate-100 py-2.5 px-4 flex items-center gap-2 shrink-0">
                  <button 
                    onClick={handleBackToChannel}
                    className="text-tg hover:text-tg-dark mr-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ig-violet to-ig-pink flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-semibold text-xs leading-tight">Менеджер Анна</p>
                    <p className="text-slate-400 text-[10px] leading-tight font-mono">{chatStatus}</p>
                  </div>
                </div>

                {/* Chat Message Stream */}
                <div className="flex-1 px-3 py-4 flex flex-col justify-end gap-3 bg-slate-100 overflow-y-auto">
                  
                  {/* Automated Outgoing Order Message */}
                  <div className="self-end max-w-[85%] bg-[#24A1DE] text-white text-[12px] leading-snug rounded-xl rounded-br-none px-3.5 py-2.5 shadow-sm animate-fade-up">
                    <p className="font-semibold mb-1 text-[11px]">Здравствуйте! Я хочу заказать:</p>
                    <div className="text-white/95 text-[11px] space-y-0.5">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4">
                          <span>• {item.name} ({item.size})</span>
                          <span className="font-mono">1 шт</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-white/20 font-bold text-right text-[11px]">
                      Итого: {cartTotal.toLocaleString("ru-RU")} руб.
                    </div>
                  </div>

                  {/* Typing dot animation */}
                  {showTyping && (
                    <div className="self-start bg-white border border-slate-200/80 rounded-xl rounded-bl-none px-4 py-3 flex gap-1.5 items-center shadow-xs animate-fade-up">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-blink"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-blink [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-blink [animation-delay:0.4s]"></span>
                    </div>
                  )}

                  {/* Incoming Reply Message */}
                  {showReply && (
                    <div className="self-start max-w-[85%] bg-white border border-slate-200/80 text-slate-800 text-[12px] leading-snug rounded-xl rounded-bl-none px-3.5 py-2.5 shadow-xs animate-fade-up">
                      Приняла заказ 🙌 Уточните адрес доставки, и уже сегодня отправим посылку!
                    </div>
                  )}
                </div>

                {/* Bottom simulated input area */}
                <div className="px-3 py-3 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0">
                  <div className="flex-1 bg-slate-50 rounded-full px-4 py-2.5 text-[9px] text-slate-400 select-none">
                    Сообщение отправлено автоматически
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#24A1DE] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>

              {/* ===== TELEGRAM WEB APP SHEET OVERLAY ===== */}
              <div 
                className={`absolute inset-x-0 bottom-0 top-[0px] bg-white rounded-t-2xl shadow-2xl z-40 flex flex-col overflow-hidden transition-transform duration-500 ease-out-quint ${
                  webAppOpen ? "translate-y-0" : "translate-y-full"
                }`}
              >
                {/* Sheet Handle */}
                <div className="w-8 h-1 bg-slate-200 rounded-full mx-auto my-2 shrink-0"></div>

                {/* Web App Header */}
                <div className="border-b border-slate-100 pb-2 px-4 flex items-center justify-between shrink-0">
                  <button 
                    onClick={handleCloseCatalog}
                    className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <p className="font-bold text-xs text-slate-800">Urban Store Catalog</p>
                  <button className="text-slate-400 hover:text-slate-600 p-1">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                {/* Catalog scroll content */}
                <div className="flex-grow overflow-y-auto px-4 py-4 space-y-3 phone-scrollbar bg-slate-50/50">
                  {PRODUCTS.map((product) => {
                    const addedItem = cart.find(item => item.id === product.id);
                    const isAdded = !!addedItem;
                    const IconComponent = product.icon;
                    return (
                      <div 
                        key={product.id}
                        className="bg-white border border-slate-100 rounded-2xl p-3.5 flex gap-3.5 items-center transition-colors duration-200 hover:border-ig-violet/40 shadow-xs"
                      >
                        <div className={`w-14 h-14 rounded-xl shrink-0 flex items-center justify-center ${product.gradClass}`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500 mb-2 font-mono">{product.price.toLocaleString("ru-RU")} ₽</p>
                          <button
                            onClick={() => triggerSizeSelector(product)}
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
                                Добавлено ({addedItem.size})
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                Выбрать и добавить
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Shopping Cart Bar inside Web App */}
                <div 
                  className={`px-4 py-4 border-t border-slate-100 bg-white transition-all duration-300 ${
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

                {/* Nested size selection drawer */}
                <div 
                  className={`absolute inset-0 bg-black/45 z-50 transition-opacity duration-300 flex flex-col justify-end ${
                    sizeSelectorProduct ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div 
                    className={`bg-white rounded-t-2xl p-5 w-full transition-transform duration-300 ease-out-quint ${
                      sizeSelectorProduct ? "translate-y-0" : "translate-y-full"
                    }`}
                  >
                    <div className="w-8 h-1 bg-slate-200 rounded-full mx-auto mb-4 shrink-0"></div>
                    <h4 className="font-bold text-xs text-slate-800 mb-3">
                      Выберите размер: {sizeSelectorProduct?.name}
                    </h4>
                    
                    <div className="flex gap-2 flex-wrap mb-5">
                      {sizeSelectorProduct?.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                            selectedSize === size
                              ? "bg-tg text-white border-tg"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setSizeSelectorProduct(null)}
                        className="flex-grow border border-slate-200 text-slate-500 rounded-xl py-3 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                      >
                        Отмена
                      </button>
                      <button
                        disabled={!selectedSize}
                        onClick={confirmAdd}
                        className="flex-grow bg-tg text-white rounded-xl py-3 text-xs font-semibold hover:bg-tg-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Добавить
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* Steps and Explanation beside Simulator */}
        <div className="max-w-md space-y-6">
          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-full bg-tg/10 flex items-center justify-center shrink-0 font-mono text-xs text-tg font-bold animate-pulse">
              1
            </div>
            <div>
              <p className="font-semibold text-text-primary mb-1">Переход из Telegram-канала</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Клиент видит рекламный пост в канале и нажимает кнопку открытия магазина. Нет переходов во внешние браузеры.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-full bg-ig-violet/10 flex items-center justify-center shrink-0 font-mono text-xs text-ig-violet font-bold">
              2
            </div>
            <div>
              <p className="font-semibold text-text-primary mb-1">Мгновенное открытие Mini App</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Каталог выезжает снизу как нативный элемент мессенджера. Пользователь выбирает конкретные размеры товаров и добавляет их в корзину.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-full bg-ig-pink/10 flex items-center justify-center shrink-0 font-mono text-xs text-ig-pink font-bold">
              3
            </div>
            <div>
              <p className="font-semibold text-text-primary mb-1">Заявка отправляется в чат</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                После оформления заказа Web App автоматически сворачивается, отправляя в личные сообщения менеджеру готовый список товаров с размерами.
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-200/80">
            <button 
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors duration-200 inline-flex items-center gap-1.5 cursor-pointer py-1"
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
