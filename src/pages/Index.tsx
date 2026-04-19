import { useState, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/a45d56ca-98a8-4ca2-ba50-28f77ea58e21/files/31928857-4e0b-4a47-99fd-67caec95702a.jpg";
const BEFORE_AFTER_IMG = "https://cdn.poehali.dev/projects/a45d56ca-98a8-4ca2-ba50-28f77ea58e21/files/f6abeaf2-a2e5-4daa-8eca-9f41bcab9aab.jpg";

const SERVICES = [
  { img: "https://cdn.poehali.dev/projects/a45d56ca-98a8-4ca2-ba50-28f77ea58e21/files/5a9bb698-6122-4029-8f56-03208332d24a.jpg", label: "Квартиры", price: "от 1 490 ₽", badge: "", popular: true, rating: "4.9" },
  { img: "https://cdn.poehali.dev/projects/a45d56ca-98a8-4ca2-ba50-28f77ea58e21/files/095b12fb-5d33-40b0-893d-a56641a22ad9.jpg", label: "Дома и коттеджи", price: "от 3 900 ₽", badge: "", popular: false, rating: "4.8" },
  { img: "https://cdn.poehali.dev/projects/a45d56ca-98a8-4ca2-ba50-28f77ea58e21/files/41be418f-729f-4c2f-a974-712ccd0008c3.jpg", label: "Офисы", price: "от 2 200 ₽", badge: "", popular: false, rating: "4.9" },
  { img: "https://cdn.poehali.dev/projects/a45d56ca-98a8-4ca2-ba50-28f77ea58e21/files/52f3bcf8-cb3c-470c-8cd3-c2fae5033f47.jpg", label: "После ремонта", price: "от 4 500 ₽", badge: "🔥 Популярно", popular: false, rating: "4.7" },
  { img: "https://cdn.poehali.dev/projects/a45d56ca-98a8-4ca2-ba50-28f77ea58e21/files/5a53ae75-541c-416f-ab0f-430ddb2501db.jpg", label: "Мойка окон", price: "от 890 ₽", badge: "", popular: false, rating: "5.0" },
  { img: "https://cdn.poehali.dev/projects/a45d56ca-98a8-4ca2-ba50-28f77ea58e21/files/8a41ef25-2586-4abd-a6a5-8c05e5932aaa.jpg", label: "Химчистка мебели", price: "от 1 200 ₽", badge: "", popular: false, rating: "4.8" },
];

const REVIEWS = [
  { name: "Анна К.", city: "Москва", text: "Команда приехала вовремя, работали 3 часа. Квартира сияет! Обязательно закажу снова.", stars: 5, avatar: "А" },
  { name: "Дмитрий П.", city: "Москва", text: "Заказывал уборку после ремонта. Всё убрали идеально, даже строительную пыль за батареями.", stars: 5, avatar: "Д" },
  { name: "Елена М.", city: "Подольск", text: "Рассчитала цену онлайн за минуту, никаких звонков. Цена совпала с расчётом — отлично!", stars: 5, avatar: "Е" },
  { name: "Сергей В.", city: "Химки", text: "Уже третий раз заказываю. Всегда чисто, всегда вовремя. Рекомендую без оговорок!", stars: 5, avatar: "С" },
];

const BRANCHES = [
  { name: "Центр", x: 50, y: 45 },
  { name: "Север", x: 52, y: 28 },
  { name: "Юг", x: 48, y: 62 },
  { name: "Запад", x: 30, y: 50 },
  { name: "Восток", x: 68, y: 48 },
];

type CleaningType = "standard" | "deep" | "after_repair" | "office";

const CALC_TYPES: { id: CleaningType; label: string; basePrice: number }[] = [
  { id: "standard", label: "Стандартная", basePrice: 18 },
  { id: "deep", label: "Генеральная", basePrice: 28 },
  { id: "after_repair", label: "После ремонта", basePrice: 45 },
  { id: "office", label: "Офис", basePrice: 22 },
];

const OPTIONS = [
  { id: "windows", label: "Мойка окон", price: 590 },
  { id: "fridge", label: "Холодильник внутри", price: 390 },
  { id: "oven", label: "Духовка", price: 290 },
  { id: "balcony", label: "Балкон", price: 490 },
];

export default function Index() {
  const [calcType, setCalcType] = useState<CleaningType>("standard");
  const [area, setArea] = useState(45);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const sliderRef = useRef<HTMLDivElement>(null);

  const calcPrice = () => {
    const base = CALC_TYPES.find(t => t.id === calcType)!.basePrice;
    const optionsTotal = OPTIONS.filter(o => selectedOptions.includes(o.id)).reduce((s, o) => s + o.price, 0);
    return Math.round(base * area + optionsTotal);
  };

  const toggleOption = (id: string) => {
    setSelectedOptions(prev =>
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  };

  const handleSliderMove = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pos = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 5), 95);
    setSliderPos(pos);
  }, []);

  const onMouseDown = () => setIsDragging(true);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e: React.MouseEvent) => { if (isDragging) handleSliderMove(e.clientX); };
  const onTouchMove = (e: React.TouchEvent) => handleSliderMove(e.touches[0].clientX);

  const price = calcPrice();

  return (
    <div className="font-golos bg-[#F8F9FA] text-[#0F1923] min-h-screen">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2DCA8C] flex items-center justify-center">
              <Icon name="Sparkles" size={16} className="text-white" />
            </div>
            <span className="font-montserrat font-extrabold text-lg text-[#0F1923]">ЧистоДом</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {[
              { id: "home", label: "Главная" },
              { id: "services", label: "Услуги" },
              { id: "reviews", label: "Отзывы" },
              { id: "about", label: "О нас" },
              { id: "blog", label: "Блог" },
              { id: "contacts", label: "Контакты" },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`text-sm font-medium transition-colors ${activeNav === item.id ? "text-[#2DCA8C]" : "text-[#6B7280] hover:text-[#0F1923]"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button className="bg-[#FF6B35] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#e85d2a] transition-all hover:scale-105 active:scale-95 shadow-md">
            Рассчитать цену
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-16 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Команда уборщиков" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F1923]/85 via-[#0F1923]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1923]/40 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-[#2DCA8C]/20 border border-[#2DCA8C]/40 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#2DCA8C] animate-pulse" />
              <span className="text-[#2DCA8C] text-sm font-medium">Работаем каждый день 7:00–22:00</span>
            </div>

            <h1 className="font-montserrat text-4xl lg:text-5xl font-black text-white leading-tight mb-5">
              Профессиональная уборка —<br />
              <span className="text-[#2DCA8C]">безупречная чистота</span>
            </h1>
            <p className="text-white/75 text-lg mb-8 max-w-lg leading-relaxed">
              Фиксированная цена. Онлайн-расчёт за 30 секунд. Застрахованная команда.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {["✅ Застраховано", "✅ Безопасные средства", "✅ 1 000+ отзывов"].map(tag => (
                <span key={tag} className="bg-white/15 border border-white/25 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="bg-[#FF6B35] text-white font-bold px-8 py-4 rounded-2xl text-lg hover:bg-[#e85d2a] transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2">
                Рассчитать стоимость
                <Icon name="ArrowRight" size={20} />
              </button>
              <button className="bg-white/15 border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-white/25 transition-all backdrop-blur-sm">
                Смотреть примеры
              </button>
            </div>
          </div>

          {/* Right: Calculator */}
          <div className="glass-card rounded-3xl p-7 animate-fade-up delay-300">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#2DCA8C] flex items-center justify-center">
                <Icon name="Calculator" size={16} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#0F1923]">Онлайн-калькулятор</p>
                <p className="text-xs text-[#6B7280]">Расчёт мгновенно, без звонка</p>
              </div>
            </div>

            {/* Step 1 */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Шаг 1 — Тип уборки</p>
              <div className="grid grid-cols-2 gap-2">
                {CALC_TYPES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setCalcType(t.id)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all border ${calcType === t.id ? "bg-[#2DCA8C] text-white border-[#2DCA8C] shadow-md" : "bg-white text-[#0F1923] border-gray-200 hover:border-[#2DCA8C] hover:text-[#2DCA8C]"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Шаг 2 — Площадь</p>
                <span className="text-[#2DCA8C] font-bold text-sm">{area} м²</span>
              </div>
              <input
                type="range" min={20} max={300} value={area}
                onChange={e => setArea(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #2DCA8C ${((area - 20) / 280) * 100}%, #E5E7EB ${((area - 20) / 280) * 100}%)` }}
              />
              <div className="flex justify-between text-xs text-[#6B7280] mt-1">
                <span>20 м²</span><span>300 м²</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Шаг 3 — Доп. опции</p>
              <div className="grid grid-cols-2 gap-2">
                {OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => toggleOption(opt.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium transition-all border flex justify-between items-center ${selectedOptions.includes(opt.id) ? "bg-[#E8FAF3] text-[#1fa870] border-[#2DCA8C]" : "bg-white text-[#6B7280] border-gray-200 hover:border-[#2DCA8C]"}`}
                  >
                    <span>{opt.label}</span>
                    <span className="font-bold">{selectedOptions.includes(opt.id) ? "✓" : `+${opt.price}₽`}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Result */}
            <div className="bg-gradient-to-r from-[#0F1923] to-[#1a2d3d] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs mb-1">Итоговая стоимость</p>
                <p className="text-white font-montserrat font-black text-3xl">
                  {price.toLocaleString("ru")} ₽
                </p>
                <p className="text-[#2DCA8C] text-xs mt-1">фиксированная цена · без скрытых платежей</p>
              </div>
              <button className="bg-[#FF6B35] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#e85d2a] transition-all hover:scale-105 active:scale-95 text-sm flex items-center gap-1 shadow-lg">
                Заказать
                <Icon name="ArrowRight" size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="bg-white border-y border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-6">Нас рекомендуют</p>
          <div className="flex flex-wrap justify-center items-center gap-10">
            {["Яндекс.Услуги", "Профи.ру", "Авито", "2ГИС", "Zoon"].map(p => (
              <span key={p} className="text-[#6B7280] font-semibold text-lg opacity-50 hover:opacity-100 transition-opacity cursor-default">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE/AFTER SLIDER */}
      <section className="section-pad">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-montserrat text-4xl font-black text-[#0F1923] mb-3">
              Разница <span className="text-[#2DCA8C]">очевидна</span>
            </h2>
            <p className="text-[#6B7280] text-lg">Перетащите разделитель, чтобы увидеть результат</p>
          </div>

          <div
            ref={sliderRef}
            className="relative rounded-3xl overflow-hidden cursor-ew-resize select-none shadow-2xl mx-auto max-w-4xl"
            style={{ aspectRatio: "16/7" }}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onMouseMove={onMouseMove}
            onTouchMove={onTouchMove}
            onTouchEnd={onMouseUp}
          >
            <img src={BEFORE_AFTER_IMG} alt="После" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute top-4 right-4 bg-[#2DCA8C] text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
              После ✨
            </div>

            <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
              <img
                src={BEFORE_AFTER_IMG}
                alt="До"
                className="absolute inset-0 h-full object-cover"
                style={{ width: `${100 / (sliderPos / 100)}%`, maxWidth: "none", filter: "saturate(0.25) brightness(0.65)" }}
              />
              <div className="absolute top-4 left-4 bg-[#0F1923]/80 text-white text-sm font-bold px-4 py-2 rounded-full">
                До 💧
              </div>
            </div>

            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
              style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-[#2DCA8C]">
                <Icon name="ChevronsLeftRight" size={20} className="text-[#2DCA8C]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="section-pad bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-montserrat text-4xl font-black text-[#0F1923] mb-3">Наши услуги</h2>
            <p className="text-[#6B7280] text-lg">Уберём всё — от студии до загородного дома</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <div
                key={s.label}
                className={`relative bg-white rounded-2xl overflow-hidden border transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-xl ${s.popular ? "border-[#2DCA8C] shadow-lg" : "border-gray-100 shadow-sm"}`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {s.popular && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-[#2DCA8C] text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap shadow-md">
                    ⭐ {s.rating} · Топ выбор
                  </div>
                )}
                {s.badge && !s.popular && (
                  <div className="absolute top-3 left-3 z-10 bg-[#FF6B35] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {s.badge}
                  </div>
                )}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[#0F1923] text-lg mb-1">{s.label}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-[#2DCA8C] font-bold text-base">{s.price}</p>
                    <p className="text-[#6B7280] text-xs">★ {s.rating}</p>
                  </div>
                  <button className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${s.popular ? "bg-[#2DCA8C] text-white hover:bg-[#1fa870]" : "bg-[#F8F9FA] text-[#0F1923] hover:bg-[#E8FAF3] hover:text-[#2DCA8C]"}`}>
                    Рассчитать →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="section-pad bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-montserrat text-4xl font-black text-[#0F1923] mb-3">
              Мы vs <span className="text-[#6B7280]">Остальные</span>
            </h2>
            <p className="text-[#6B7280] text-lg">Почему клиенты выбирают нас и не возвращаются к другим</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl p-7 border-2 border-[#2DCA8C] shadow-xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2DCA8C] text-white font-bold text-sm px-6 py-2 rounded-full shadow-lg whitespace-nowrap">
                ✨ ЧистоДом
              </div>
              <div className="mt-2 space-y-4">
                {[
                  "Фиксированная цена онлайн",
                  "Рассчитай без звонка за 30 сек",
                  "Фотоотчёт после уборки",
                  "Онлайн-бронирование 24/7",
                  "Застрахованная команда",
                  "Уберём — или вернём деньги",
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#E8FAF3] flex items-center justify-center flex-shrink-0">
                      <Icon name="Check" size={14} className="text-[#2DCA8C]" />
                    </div>
                    <span className="text-[#0F1923] font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-gray-200 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#6B7280] text-white font-bold text-sm px-6 py-2 rounded-full shadow-md whitespace-nowrap">
                😤 Типичный клининг
              </div>
              <div className="mt-2 space-y-4">
                {[
                  "Цена «от...» — позвоните узнать",
                  "Только по звонку в рабочее время",
                  "Нет фотоотчёта — верьте на слово",
                  "Запись через звонок или WhatsApp",
                  "Нет страховки, нет гарантий",
                  "Претензии? «Это не мы сделали»",
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                      <Icon name="X" size={14} className="text-red-400" />
                    </div>
                    <span className="text-[#6B7280] text-sm line-through decoration-red-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="section-pad bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-montserrat text-4xl font-black text-[#0F1923] mb-4">
                Работаем по всей <span className="text-[#2DCA8C]">Москве</span><br />и Подмосковью
              </h2>
              <p className="text-[#6B7280] text-lg mb-8 leading-relaxed">
                5 филиалов, более 80 уборщиков в команде. Добираемся до любого района за 60–90 минут.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "Филиалов", value: "5" },
                  { label: "Районов покрытия", value: "120+" },
                  { label: "Уборщиков в команде", value: "80+" },
                  { label: "Выезжаем за", value: "60 мин" },
                ].map(s => (
                  <div key={s.label} className="bg-[#F8F9FA] rounded-2xl p-4">
                    <p className="font-montserrat font-black text-2xl text-[#2DCA8C]">{s.value}</p>
                    <p className="text-[#6B7280] text-sm mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <button className="bg-[#FF6B35] text-white font-bold px-8 py-4 rounded-2xl hover:bg-[#e85d2a] transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2">
                <Icon name="MapPin" size={18} />
                Проверить мой район
              </button>
            </div>

            <div className="relative bg-[#F0F4F8] rounded-3xl overflow-hidden shadow-xl" style={{ aspectRatio: "1/1" }}>
              <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94A3B8" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              <div className="absolute inset-8 rounded-full border-4 border-dashed border-[#2DCA8C]/30 bg-[#2DCA8C]/5" />
              <div className="absolute inset-16 rounded-full bg-[#2DCA8C]/10 border-2 border-[#2DCA8C]/30" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-[#2DCA8C] z-10 relative shadow-lg" />
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-[#2DCA8C] animate-ping opacity-30" />
                </div>
              </div>

              {BRANCHES.map(b => (
                <div
                  key={b.name}
                  className="absolute group cursor-pointer"
                  style={{ left: `${b.x}%`, top: `${b.y}%`, transform: "translate(-50%, -50%)" }}
                >
                  <div className="w-9 h-9 rounded-full bg-white shadow-lg border-2 border-[#2DCA8C] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name="MapPin" size={16} className="text-[#2DCA8C]" />
                  </div>
                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-[#0F1923] text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    Филиал · {b.name}
                  </div>
                </div>
              ))}

              <div className="absolute bottom-4 left-4 glass-card rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-[#2DCA8C]" />
                  <span className="text-[#0F1923] font-medium">Зона обслуживания</span>
                </div>
                <div className="flex items-center gap-2 text-xs mt-1.5">
                  <div className="w-3 h-3 rounded-full bg-white border-2 border-[#2DCA8C]" />
                  <span className="text-[#6B7280]">Филиал</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="section-pad bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-montserrat text-4xl font-black text-[#0F1923] mb-3">
              Что говорят <span className="text-[#2DCA8C]">клиенты</span>
            </h2>
            <div className="flex items-center justify-center gap-2 text-[#6B7280]">
              <span className="text-yellow-400 text-xl">★★★★★</span>
              <span className="font-bold text-[#0F1923]">4.97</span>
              <span>из 5 · на основе 1 024 отзывов</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.map((r) => (
              <div
                key={r.name}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all cursor-default"
              >
                <div className="flex text-yellow-400 text-sm mb-4">{"★".repeat(r.stars)}</div>
                <p className="text-[#0F1923] text-sm leading-relaxed mb-5">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2DCA8C] flex items-center justify-center text-white font-bold text-sm">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0F1923] text-sm">{r.name}</p>
                    <p className="text-[#6B7280] text-xs">{r.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#0F1923] to-[#1a3347]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-montserrat text-4xl font-black text-white mb-4">
            Готовы к <span className="text-[#2DCA8C]">идеальной чистоте</span>?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Рассчитайте стоимость онлайн — это займёт 30 секунд и не требует звонка
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-[#FF6B35] text-white font-bold px-10 py-4 rounded-2xl text-lg hover:bg-[#e85d2a] transition-all hover:scale-105 active:scale-95 shadow-xl">
              Рассчитать стоимость →
            </button>
            <button className="bg-white/15 border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-white/25 transition-all flex items-center gap-2">
              <Icon name="Phone" size={18} />
              +7 (495) 123-45-67
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0F1923] text-white/50 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2DCA8C] flex items-center justify-center">
              <Icon name="Sparkles" size={14} className="text-white" />
            </div>
            <span className="font-montserrat font-bold text-white">ЧистоДом</span>
          </div>
          <div className="flex gap-8 text-sm">
            {["Услуги", "О нас", "Блог", "Контакты", "Политика конфиденциальности"].map(l => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-sm">© 2024 ЧистоДом. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}