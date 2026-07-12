"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ShoppingBag, Plus, Check, ArrowRight, ChevronLeft, 
  User, RotateCcw, Shirt, Crown, 
  Search, MoreVertical, X, Sparkles, CornerUpRight,
  MessageCircle, LifeBuoy, Heart, Smile, Paperclip, Send
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
    icon: Sparkles,
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

interface Post {
  id: number;
  title: string;
  text: string;
  views: string;
  time: string;
  reactions: {
    star: { count: number; active: boolean };
    heart: { count: number; active: boolean };
    fire: { count: number; active: boolean };
  };
  hasCatalogLink?: boolean;
  isPinned?: boolean;
}

export default function Simulator() {
  const [view, setView] = useState<"channel" | "comments" | "chat">("channel");
  const [webAppOpen, setWebAppOpen] = useState(false);
  const [cart, setCart] = useState<{ id: number; name: string; price: number; size: string }[]>([]);
  const [sizeSelectorProduct, setSizeSelectorProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  
  // Mute & Toast States
  const [isMuted, setIsMuted] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Ad State
  const [adVisible, setAdVisible] = useState(true);

  // Search States
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Channel Posts State
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 101,
      title: "📌 Гайд по выбору размера одежды",
      text: "Чтобы заказать худи, кроссовки или кепку, используйте нашу размерную сетку:\n\n• Худи: XS (44), S (46), M (48), L (50), XL (52).\n• Кроссовки: 40 (26см), 41 (26.5см), 42 (27см), 43 (28см), 44 (28.5см).\n• Кепка: регулируемый размер.",
      views: "10.4K",
      time: "12:05",
      reactions: {
        star: { count: 12, active: false },
        heart: { count: 45, active: false },
        fire: { count: 8, active: false }
      },
      isPinned: true
    },
    {
      id: 102,
      title: "🔥 Скидка 10% на первый заказ!",
      text: "Дарим приветственную скидку на ваш первый заказ в нашем мини-приложении! Перейдите в каталог по ссылке ниже, выберите товары, и скидка START10 применится в корзине автоматически.",
      views: "15.2K",
      time: "14:20",
      reactions: {
        star: { count: 4, active: false },
        heart: { count: 122, active: false },
        fire: { count: 89, active: false }
      }
    },
    {
      id: 103,
      title: "Почему Mini App?",
      text: "Покупка в 3 клика без перехода во внешние браузеры. Каждый лишний переход — это потеря клиента. Внутри Telegram конверсия возрастает в 3 раза!\n\nЧто делать?\nЗапустить каталог, который открывается мгновенно.\n\nЛови 👉 Открыть каталог 🛍",
      views: "27.8K",
      time: "19:48",
      reactions: {
        star: { count: 58, active: false },
        heart: { count: 407, active: false },
        fire: { count: 24, active: false }
      },
      hasCatalogLink: true
    }
  ]);

  const [chatStatus, setChatStatus] = useState<"в сети" | "печатает…">("в сети");
  const [showTyping, setShowTyping] = useState(false);
  const [showReply, setShowReply] = useState(false);

  const feedRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const replyTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 1800);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    showToast(isMuted ? "Звук включен" : "Звук выключен");
  };

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

  const handleToggleReaction = (postId: number, type: "star" | "heart" | "fire") => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id !== postId) return post;
        const currentReaction = post.reactions[type];
        return {
          ...post,
          reactions: {
            ...post.reactions,
            [type]: {
              count: currentReaction.active ? currentReaction.count - 1 : currentReaction.count + 1,
              active: !currentReaction.active
            }
          }
        };
      })
    );
  };

  const handlePinnedClick = () => {
    // Scrolls to the pinned post (ID 101) inside the scroll viewport
    const pinnedPostEl = document.getElementById("post-101");
    if (pinnedPostEl) {
      pinnedPostEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      showToast("Переход к закрепленному сообщению");
    }
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
    
    setWebAppOpen(false);
    setView("chat");
    setChatStatus("в сети");
    setShowTyping(false);
    setShowReply(false);

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (replyTimerRef.current) clearTimeout(replyTimerRef.current);

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
    setAdVisible(true);
    setSearchOpen(false);
    setSearchQuery("");
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="simulator" className="relative py-24 px-6 max-w-7xl mx-auto border-t border-slate-200/80">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="font-mono text-xs text-tg uppercase tracking-widest mb-3">Живой пример</p>
        <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4 text-text-primary">
          Попробуйте сами — как клиент
        </h2>
        <p className="text-text-secondary leading-relaxed">
          Протестируйте нативный переход: кликните на ссылку в посте или на закрепленное сообщение, зайдите в ветку комментариев и запустите светлую Mini App шторку каталога!
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
                <div className="bg-white border-b border-slate-100 py-2 px-4 flex items-center justify-between shrink-0 select-none">
                  <div className="flex items-center gap-2.5">
                    <ChevronLeft className="w-5 h-5 text-tg cursor-pointer" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-tg to-tg-dark flex items-center justify-center text-white font-bold text-sm">
                      U
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-xs leading-tight text-slate-900 flex items-center gap-1">
                        Urban Store 
                        <span className="w-2.5 h-2.5 bg-tg rounded-full inline-flex items-center justify-center"><Check className="w-1.5 h-1.5 text-white" /></span>
                      </p>
                      <p className="text-[10px] text-slate-400 leading-tight font-mono">14.2K подписчиков</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <Search onClick={() => setSearchOpen(!searchOpen)} className="w-4 h-4 cursor-pointer hover:text-tg" />
                    <MoreVertical className="w-4 h-4" />
                  </div>
                </div>

                {/* Optional Search Bar input */}
                {searchOpen && (
                  <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200/60 shrink-0 flex items-center gap-2 animate-fade-up">
                    <input 
                      type="text" 
                      placeholder="Поиск по каналу..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] text-slate-800 focus:outline-none focus:border-tg placeholder:text-slate-400"
                    />
                    <button onClick={() => { setSearchQuery(""); setSearchOpen(false); }} className="text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Pinned Message Bar */}
                <div 
                  onClick={handlePinnedClick}
                  className="bg-white px-3.5 py-1.5 border-b border-slate-200/80 flex items-center justify-between shrink-0 select-none cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2 border-l-2 border-tg pl-2 min-w-0">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-tg font-bold leading-tight">Закрепленное сообщение</span>
                      <span className="text-[8px] text-slate-500 truncate max-w-[190px] leading-tight font-medium">
                        📌 Гайд по выбору размера одежды
                      </span>
                    </div>
                  </div>
                  <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 shrink-0" />
                </div>

                {/* Feed (aligned to bottom, no empty bottom spacing!) */}
                <div 
                  ref={feedRef}
                  className="flex-1 bg-tg-wallpaper p-3 overflow-y-auto phone-scrollbar flex flex-col justify-start space-y-4"
                >
                  {/* Day Separator */}
                  <div className="text-center my-1.5">
                    <span className="bg-slate-900/10 text-slate-600 text-[9px] font-bold px-2.5 py-0.5 rounded-full select-none">
                      Thursday
                    </span>
                  </div>

                  {/* Render Posts List */}
                  {filteredPosts.map((post) => (
                    <div 
                      key={post.id}
                      id={`post-${post.id}`}
                      className="flex items-end gap-1.5 max-w-full"
                    >
                      <div className="bg-white rounded-2xl rounded-tr-none border border-slate-200/80 shadow-xs flex-grow overflow-hidden text-left">
                        <div className="p-3">
                          <h4 className="font-bold text-[10px] text-slate-800 mb-1">{post.title}</h4>
                          <p className="text-[9.5px] text-slate-600 leading-normal whitespace-pre-wrap">
                            {post.text.split("Открыть каталог 🛍")[0]}
                            {post.hasCatalogLink && (
                              <span onClick={handleOpenCatalog} className="text-tg font-bold underline hover:text-tg-dark cursor-pointer inline-flex items-center gap-0.5">Открыть каталог 🛍</span>
                            )}
                          </p>

                          {/* Bottom Info & Views */}
                          <div className="flex items-center justify-between text-[8px] text-slate-400 font-medium select-none mt-3.5 border-t border-slate-100/50 pt-2">
                            <span className="flex items-center gap-1">
                              <span>{post.views} views</span>
                              <span>·</span>
                              <span>Urban Store</span>
                            </span>
                            <span>{post.time}</span>
                          </div>

                          {/* Reactions Block */}
                          <div className="flex items-center gap-1.5 mt-2.5 select-none">
                            <button 
                              onClick={() => handleToggleReaction(post.id, "star")}
                              className={`px-2 py-1 rounded-full text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-all duration-200 ${
                                post.reactions.star.active 
                                  ? "bg-amber-100 text-amber-700 border border-amber-300" 
                                  : "bg-slate-50 text-slate-500 border border-slate-200/60"
                              }`}
                            >
                              <span>⭐️</span>
                              <span>{post.reactions.star.count}</span>
                            </button>
                            <button 
                              onClick={() => handleToggleReaction(post.id, "heart")}
                              className={`px-2 py-1 rounded-full text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-all duration-200 ${
                                post.reactions.heart.active 
                                  ? "bg-red-100 text-red-700 border border-red-300" 
                                  : "bg-slate-50 text-slate-500 border border-slate-200/60"
                              }`}
                            >
                              <span>❤️</span>
                              <span>{post.reactions.heart.count}</span>
                            </button>
                            <button 
                              onClick={() => handleToggleReaction(post.id, "fire")}
                              className={`px-2 py-1 rounded-full text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-all duration-200 ${
                                post.reactions.fire.active 
                                  ? "bg-orange-100 text-orange-700 border border-orange-300" 
                                  : "bg-slate-50 text-slate-500 border border-slate-200/60"
                              }`}
                            >
                              <span>🔥</span>
                              <span>{post.reactions.fire.count}</span>
                            </button>
                          </div>
                        </div>

                        {/* Comments Strip (goes to comments view!) */}
                        <div 
                          onClick={() => setView("comments")}
                          className="border-t border-slate-100 px-3.5 py-2.5 flex items-center justify-between hover:bg-slate-100 transition-colors duration-200 cursor-pointer"
                        >
                          <div className="flex items-center gap-2 text-tg font-semibold">
                            <MessageCircle className="w-4 h-4 text-tg" />
                            <span className="text-[10px] text-tg">Прокомментировать</span>
                          </div>
                          <ChevronLeft className="w-3.5 h-3.5 text-tg rotate-180" />
                        </div>
                      </div>

                      {/* Floating Share Button */}
                      <button className="w-8 h-8 rounded-full bg-[#75B079] hover:bg-[#649c68] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-sm select-none">
                        <CornerUpRight className="w-3.5 h-3.5 translate-x-[1px]" />
                      </button>
                    </div>
                  ))}

                  {/* Subscribed Label Info */}
                  <div className="text-center my-1 select-none">
                    <span className="bg-slate-900/30 text-white text-[8px] font-medium px-3.5 py-1 rounded-full">
                      Вы подписались на этот канал
                    </span>
                  </div>

                  {/* Closeable Sponsored Advertisement Card (Matching screenshot) */}
                  {adVisible && (
                    <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3 shadow-3xs relative text-left select-none mb-1 animate-fade-up">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] font-bold text-[#24A1DE] uppercase tracking-wider">Реклама</span>
                        <button onClick={() => setAdVisible(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[9.5px] font-bold text-slate-800 mb-0.5">🔥 Увеличьте ваши продажи на 300%</p>
                      <p className="text-[8px] text-slate-500 leading-normal mb-2.5">
                        Закажите разработку Telegram Mini App каталога сегодня и получите скидку 15% на первый месяц поддержки.
                      </p>
                      <button onClick={handleOpenCatalog} className="w-full bg-[#24A1DE] hover:bg-[#1a85b9] text-white py-1.5 rounded-lg text-[9px] font-bold text-center transition-colors cursor-pointer uppercase">
                        Открыть каталог
                      </button>
                    </div>
                  )}
                </div>

                {/* Channel Bottom Mute Bar */}
                <div 
                  onClick={handleMuteToggle}
                  className="h-11 border-t border-slate-200/80 bg-white px-4 flex items-center justify-between shrink-0 select-none cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-semibold text-tg">
                    {isMuted ? "Включить звук" : "Выключить звук"}
                  </span>
                  <div className="w-5 h-5 flex items-center justify-center text-slate-400 text-xs">🎁</div>
                </div>
              </div>

              {/* ===== VIEW 1.5: HIGH FIDELITY TELEGRAM COMMENT THREAD ===== */}
              <div 
                className={`absolute inset-0 flex flex-col transition-all duration-300 ${
                  view === "comments" 
                    ? "opacity-100 scale-100 pointer-events-auto" 
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                {/* Comments Header */}
                <div className="bg-white border-b border-slate-100 py-2 px-4 flex items-center justify-between shrink-0 select-none">
                  <div className="flex items-center gap-2.5">
                    <ChevronLeft onClick={() => setView("channel")} className="w-5 h-5 text-tg cursor-pointer" />
                    <div className="text-left">
                      <p className="font-semibold text-xs leading-tight text-slate-900">Комментарии</p>
                      <p className="text-[9px] text-slate-400 leading-tight">15 обсуждений</p>
                    </div>
                  </div>
                  <MoreVertical className="w-4 h-4 text-slate-500" />
                </div>

                {/* Comments Scroll Area */}
                <div className="flex-grow bg-tg-wallpaper p-3 overflow-y-auto phone-scrollbar flex flex-col justify-end space-y-3">
                  
                  {/* Pinned post snippet on top of comments */}
                  <div className="bg-slate-50/90 border border-slate-200/60 rounded-xl p-2.5 text-left mb-2 text-[9px] text-slate-500 select-none">
                    <span className="font-bold text-slate-700 block mb-0.5">Ветка комментариев к посту</span>
                    «Почему Mini App? Покупка в 3 клика без перехода в браузер...»
                  </div>

                  {/* Comment 1: Daniil */}
                  <div className="flex items-start gap-2 max-w-[85%] self-start">
                    <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0 shadow-2xs">Д</div>
                    <div className="bg-white rounded-2xl rounded-tl-none border border-slate-200/60 p-2.5 shadow-2xs text-left relative">
                      <p className="text-[8.5px] font-extrabold text-blue-600 mb-0.5 leading-none">Даниил</p>
                      <p className="text-[10px] text-slate-700 leading-snug">Слушайте, а размеры соответствуют европейской таблице?</p>
                      <p className="text-[7px] text-slate-400 text-right mt-1.5 leading-none">17:34</p>
                    </div>
                  </div>

                  {/* Comment 2: Manager Anna */}
                  <div className="flex items-start gap-2 max-w-[85%] self-start">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ig-violet to-ig-pink flex items-center justify-center text-white text-[9px] font-bold shrink-0 shadow-2xs">А</div>
                    <div className="bg-white rounded-2xl rounded-tl-none border border-slate-200/60 p-2.5 shadow-2xs text-left relative">
                      <p className="text-[8.5px] font-extrabold text-ig-violet mb-0.5 leading-none flex items-center gap-1">
                        Менеджер Анна 
                        <span className="bg-tg/10 text-tg text-[6px] px-1 rounded-sm font-bold">admin</span>
                      </p>
                      <p className="text-[10px] text-slate-700 leading-snug">Да, Даниил! Размеры стандартные. Полную размерную сетку можно посмотреть в каталоге при выборе размера.</p>
                      <p className="text-[7px] text-slate-400 text-right mt-1.5 leading-none">17:35</p>
                    </div>
                  </div>

                  {/* Comment 3: Kirill */}
                  <div className="flex items-start gap-2 max-w-[85%] self-start">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0 shadow-2xs">К</div>
                    <div className="bg-white rounded-2xl rounded-tl-none border border-slate-200/60 p-2.5 shadow-2xs text-left relative">
                      <p className="text-[8.5px] font-extrabold text-emerald-600 mb-0.5 leading-none">Кирилл</p>
                      <p className="text-[10px] text-slate-700 leading-snug">Очень удобно покупать прямо в чате! Нажал, выбрал размер и готово 🙌</p>
                      <p className="text-[7px] text-slate-400 text-right mt-1.5 leading-none">17:36</p>
                    </div>
                  </div>

                </div>

                {/* Comments Input Bar (Replicating Telegram input bar layout) */}
                <div className="px-3 py-2 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0 select-none">
                  <Paperclip className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Прокомментировать...</span>
                    <Smile className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-tg flex items-center justify-center shrink-0 text-white cursor-pointer hover:bg-tg-dark">
                    <Send className="w-3 h-3 translate-x-[0.5px]" />
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
                    <User className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-semibold text-xs leading-tight">Менеджер Анна</p>
                    <p className="text-slate-400 text-[10px] leading-tight font-mono">{chatStatus}</p>
                  </div>
                </div>

                {/* Chat Message Stream */}
                <div className="flex-1 px-3 py-4 flex flex-col justify-end gap-3 bg-tg-wallpaper overflow-y-auto phone-scrollbar">
                  
                  {/* Automated Outgoing Order Message */}
                  <div className="self-end max-w-[85%] bg-[#effdde] text-slate-800 text-[12px] leading-snug rounded-xl rounded-br-none px-3.5 py-2.5 shadow-sm border border-emerald-200/40 animate-fade-up">
                    <p className="font-semibold mb-1 text-[11px] text-slate-900">Здравствуйте! Я хочу заказать:</p>
                    <div className="text-slate-700 text-[11px] space-y-0.5">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4">
                          <span>• {item.name} ({item.size})</span>
                          <span className="font-mono">1 шт</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-slate-200/60 font-bold text-right text-[11px] text-slate-900">
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
                  <div className="flex-1 bg-slate-50 rounded-full px-4 py-2.5 text-[9px] text-slate-400 select-none font-sans">
                    Сообщение отправлено автоматически
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#24A1DE] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>

              {/* ===== LIGHT-THEMED TELEGRAM WEB APP SHEET OVERLAY (MATCHING SCREENSHOT) ===== */}
              <div 
                className={`absolute inset-x-0 bottom-0 top-[0px] bg-slate-50 shadow-2xl z-45 flex flex-col overflow-hidden transition-transform duration-500 ease-out-quint ${
                  webAppOpen ? "translate-y-0" : "translate-y-full"
                }`}
              >
                {/* Sheet Handle */}
                <div className="w-8 h-1 bg-slate-200 rounded-full mx-auto my-2 shrink-0"></div>

                {/* Web App Header Block */}
                <div className="bg-white border-b border-slate-100 pb-2.5 pt-1 px-4 flex items-center justify-between shrink-0 select-none">
                  <button 
                    onClick={handleCloseCatalog}
                    className="text-tg hover:text-tg-dark text-xs font-semibold cursor-pointer"
                  >
                    Закрыть
                  </button>
                  <div className="text-center">
                    <p className="font-bold text-xs text-slate-900 leading-tight">URBAN STORE</p>
                    <p className="text-[8px] text-slate-400 leading-tight">мини-приложение</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Catalog scroll content */}
                <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4 phone-scrollbar">
                  
                  {/* Brand Row */}
                  <div className="flex items-center justify-between select-none">
                    <span className="font-display font-extrabold text-[11px] text-slate-800 tracking-wider">URBAN STORE</span>
                    
                    {/* Cart pill indicator */}
                    <div className="bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full px-3 py-1 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs">
                      <ShoppingBag className="w-3.5 h-3.5 text-slate-500" />
                      <span>{cartTotal.toLocaleString("ru-RU")} ₽</span>
                    </div>
                  </div>

                  {/* Large Hero Drop Banner Card */}
                  <div className="grad-tg rounded-2xl p-4 text-white text-left relative overflow-hidden select-none shadow-sm">
                    <div className="absolute right-[-10px] bottom-[-15px] opacity-15">
                      <ShoppingBag className="w-24 h-24 text-white" />
                    </div>
                    <p className="bg-white/20 text-white font-mono text-[8px] font-bold px-1.5 py-0.5 rounded-sm inline-block mb-2">ДРОП 2026</p>
                    <h4 className="font-display font-extrabold text-sm leading-tight mb-1 uppercase tracking-tight">Летний каталог одежды</h4>
                    <p className="text-[9px] text-white/80 leading-normal max-w-[70%]">
                      Свежие релизы худи, кроссовки и кепок в Telegram. Добавляйте в корзину и оформляйте заказ!
                    </p>
                  </div>

                  {/* Grid of Product Cards (Matching layout from screenshot) */}
                  <div className="grid grid-cols-2 gap-3">
                    {PRODUCTS.map((product) => {
                      const addedItem = cart.find(item => item.id === product.id);
                      const isAdded = !!addedItem;
                      const IconComponent = product.icon;
                      return (
                        <div 
                          key={product.id}
                          className="bg-white border border-slate-200/80 rounded-2xl p-3 flex flex-col items-center text-center shadow-2xs hover:border-tg/50 transition-colors"
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 ${product.gradClass}`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          
                          <p className="text-[10px] font-bold text-slate-800 truncate w-full mb-0.5">{product.name}</p>
                          <p className="text-[9px] text-slate-400 font-mono mb-2.5">{product.price.toLocaleString("ru-RU")} ₽</p>
                          
                          <button
                            onClick={() => triggerSizeSelector(product)}
                            disabled={isAdded}
                            className={`w-full rounded-full py-1.5 text-[9px] font-semibold transition-all duration-200 cursor-pointer ${
                              isAdded 
                                ? "bg-emerald-600 text-white cursor-default" 
                                : "bg-tg text-white hover:bg-tg-dark"
                            }`}
                          >
                            {isAdded ? `Добавлено` : "Выбрать"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cart checkout section bar */}
                <div 
                  className={`px-4 py-4 border-t border-slate-100 bg-white transition-all duration-300 shrink-0 ${
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

                {/* Simulated Bottom Navigation Tab Bar (matching screenshot layout) */}
                <div className="h-12 border-t border-slate-100 bg-white px-8 flex items-center justify-between shrink-0 select-none">
                  <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <LifeBuoy className="w-4 h-4" />
                    <span className="text-[8px] font-medium leading-none mt-0.5">ПОМОЩЬ</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 text-tg cursor-default">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-[8px] font-bold leading-none mt-0.5">ГЛАВНАЯ</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[8px] font-medium leading-none mt-0.5">ЕЩЕ</span>
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
                    <h4 className="font-bold text-xs text-slate-800 mb-3 text-left">
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

            {/* Telegram Toast Message inside Phone Screen */}
            {toastMessage && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-slate-800/90 text-white text-[10px] px-3.5 py-2 rounded-xl z-55 shadow-md animate-fade-up select-none font-medium text-center max-w-[80%] whitespace-nowrap">
                {toastMessage}
              </div>
            )}

          </div>
        </div>

        {/* Steps and Explanation beside Simulator */}
        <div className="max-w-md space-y-6">
          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-full bg-tg/10 flex items-center justify-center shrink-0 font-mono text-xs text-tg font-bold">
              1
            </div>
            <div>
              <p className="font-semibold text-text-primary mb-1">Переход из Telegram-канала</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Кликните на синюю ссылку-переходник в сообщении или нажмите на закрепленное сообщение вверху, чтобы сфокусировать каталог.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-full bg-ig-violet/10 flex items-center justify-center shrink-0 font-mono text-xs text-ig-violet font-bold">
              2
            </div>
            <div>
              <p className="font-semibold text-text-primary mb-1">Вход в обсуждение</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Нажмите на кнопку комментариев внизу поста, чтобы открыть ветку обсуждения с ответами менеджера.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-full bg-ig-pink/10 flex items-center justify-center shrink-0 font-mono text-xs text-ig-pink font-bold">
              3
            </div>
            <div>
              <p className="font-semibold text-text-primary mb-1">Светлый нативный Mini App</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Каталог оформлен в чистом светлом стиле: содержит шапку с кнопкой «Закрыть», баланс-карту корзины, рекламный промо-баннер и плиточную сетку товаров.
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
