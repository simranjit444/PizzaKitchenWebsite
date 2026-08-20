import { useState } from "react";
import {
  ShoppingCart, Menu, X, Star, Flame, Check, Minus, Plus,
  Trash2, MapPin, Phone, Mail, Clock, Truck, Shield,
  Search, User, ChevronRight, ChevronDown, Heart, Tag, MessageCircle,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────

type Page = "home" | "menu" | "cart" | "checkout" | "confirmation" | "offers" | "about" | "contact";
type Size = "Regular" | "Medium" | "Large";
type Crust = "Classic" | "Thin Crust" | "Cheese Burst";

interface Pizza {
  id: number; name: string; category: string; veg: boolean;
  basePrice: number; rating: number; reviews: number;
  desc: string; ingredients: string[]; img: string;
}

interface CartItem {
  key: string; pizza: Pizza; size: Size; crust: Crust;
  toppings: string[]; qty: number; unit: number;
}

interface ModalState {
  pizza: Pizza; size: Size; crust: Crust; toppings: string[]; qty: number;
}

// ─── Data ──────────────────────────────────────────────────────────────────

const PIZZAS: Pizza[] = [
  { id: 1, name: "Margherita", category: "Classic Pizzas", veg: true, basePrice: 249, rating: 4.5, reviews: 1283, desc: "Fresh tomato sauce, creamy mozzarella, and garden-fresh basil on hand-stretched dough.", ingredients: ["Tomato Sauce", "Fresh Mozzarella", "Basil", "Olive Oil", "Sea Salt"], img: "photo-1513104890138-7c749659a591" },
  { id: 2, name: "Farmhouse", category: "Veg Pizzas", veg: true, basePrice: 299, rating: 4.3, reviews: 876, desc: "Garden-fresh capsicum, mushroom, onion, and tomato on rich mozzarella.", ingredients: ["Capsicum", "Onion", "Mushroom", "Tomato", "Mozzarella", "Mixed Herbs"], img: "photo-1574071318508-1cdbab80d002" },
  { id: 3, name: "Paneer Tikka", category: "Veg Pizzas", veg: true, basePrice: 349, rating: 4.6, reviews: 1104, desc: "Tandoori-spiced paneer, bell peppers, and caramelized onions on tikka sauce.", ingredients: ["Paneer", "Bell Peppers", "Onion", "Tikka Sauce", "Coriander", "Chaat Masala"], img: "photo-1565299624946-b28f40a0ae38" },
  { id: 4, name: "Mexican Green Wave", category: "Veg Pizzas", veg: true, basePrice: 329, rating: 4.4, reviews: 692, desc: "Jalapeños, paprika, and crunchy onions on zesty green herb sauce.", ingredients: ["Jalapeños", "Capsicum", "Red Paprika", "Onion", "Green Herb Sauce", "Mozzarella"], img: "photo-1528137871618-79d2761e3fd5" },
  { id: 5, name: "BBQ Chicken", category: "Non-Veg Pizzas", veg: false, basePrice: 399, rating: 4.7, reviews: 1891, desc: "Smoky BBQ-glazed grilled chicken, caramelized onions, tangy BBQ drizzle.", ingredients: ["BBQ Chicken", "Caramelized Onion", "BBQ Sauce", "Mozzarella", "Smoked Paprika"], img: "photo-1590947132387-155cc02f3212" },
  { id: 6, name: "Chicken Pepperoni", category: "Non-Veg Pizzas", veg: false, basePrice: 449, rating: 4.8, reviews: 2341, desc: "Double-layered chicken pepperoni with rich tomato and a blanket of mozzarella.", ingredients: ["Chicken Pepperoni", "Rich Tomato Sauce", "Mozzarella", "Oregano", "Chilli Flakes"], img: "photo-1506354666786-959d6d497f1a" },
  { id: 7, name: "Peri Peri Chicken", category: "Non-Veg Pizzas", veg: false, basePrice: 379, rating: 4.5, reviews: 1023, desc: "Grilled chicken in fiery peri peri sauce with capsicum and red onion.", ingredients: ["Peri Peri Chicken", "Capsicum", "Red Onion", "Peri Peri Sauce", "Mozzarella"], img: "photo-1595854341625-f33ee10dbf94" },
  { id: 8, name: "Meat Lovers", category: "Premium Pizzas", veg: false, basePrice: 499, rating: 4.9, reviews: 3102, desc: "The ultimate feast — chicken, pepperoni, sausage, and smoked bacon in every bite.", ingredients: ["Grilled Chicken", "Pepperoni", "Sausage", "Smoked Bacon", "Mozzarella", "Tomato Sauce"], img: "photo-1571407970349-bc81e71e9468" },
  { id: 9, name: "Four Cheese", category: "Premium Pizzas", veg: true, basePrice: 429, rating: 4.7, reviews: 1567, desc: "Mozzarella, cheddar, parmesan, and smoky gouda melted in every bite.", ingredients: ["Mozzarella", "Cheddar", "Parmesan", "Gouda", "White Garlic Sauce", "Herbs"], img: "photo-1604382354936-07c5d9983bd3" },
  { id: 10, name: "Spicy Chicken", category: "Non-Veg Pizzas", veg: false, basePrice: 369, rating: 4.4, reviews: 789, desc: "Spiced chicken, capsicum, black olives, and a drizzle of sriracha.", ingredients: ["Spiced Chicken", "Capsicum", "Black Olives", "Sriracha Sauce", "Mozzarella", "Chilli Flakes"], img: "photo-1548369937-47519962c11a" },
  { id: 11, name: "Garlic Bread", category: "Sides", veg: true, basePrice: 129, rating: 4.5, reviews: 934, desc: "Crispy toasted bread with garlic butter and herb seasoning.", ingredients: ["Bread", "Garlic Butter", "Herbs", "Parmesan"], img: "photo-1573140247632-f8fd74997d5c" },
  { id: 12, name: "Coke 500ml", category: "Drinks", veg: true, basePrice: 60, rating: 4.2, reviews: 412, desc: "Ice-cold Coca-Cola — the perfect pizza companion.", ingredients: ["Coca-Cola"], img: "photo-1581006852262-e4307cf6a807" },
  { id: 13, name: "Choco Lava Cake", category: "Desserts", veg: true, basePrice: 149, rating: 4.8, reviews: 1203, desc: "Warm chocolate cake with a gooey molten center and vanilla ice cream.", ingredients: ["Dark Chocolate", "Butter", "Eggs", "Vanilla Ice Cream"], img: "photo-1563805042-7684c019e1cb" },
];

const CATEGORIES = ["All", "Classic Pizzas", "Premium Pizzas", "Veg Pizzas", "Non-Veg Pizzas", "Sides", "Drinks", "Desserts"];
const SIZES: Size[] = ["Regular", "Medium", "Large"];
const SIZE_INCHES: Record<Size, string> = { Regular: '7"', Medium: '10"', Large: '13"' };
const CRUSTS: Crust[] = ["Classic", "Thin Crust", "Cheese Burst"];
const TOPPINGS_LIST = ["Extra Cheese", "Jalapeños", "Olives", "Mushrooms", "Paneer", "Chicken", "Pepperoni"];

const SIZE_ADD: Record<Size, number> = { Regular: 0, Medium: 80, Large: 150 };
const CRUST_ADD: Record<Crust, number> = { Classic: 0, "Thin Crust": 0, "Cheese Burst": 60 };
const TOPPING_PRICE = 40;
const DELIVERY_FEE = 49;
const TAX_RATE = 0.05;

// ─── Utils ─────────────────────────────────────────────────────────────────

const pimg = (id: string, w = 600, h = 500) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format`;

const calcUnit = (p: Pizza, s: Size, c: Crust, tops: string[]) =>
  p.basePrice + SIZE_ADD[s] + CRUST_ADD[c] + tops.length * TOPPING_PRICE;

const DISPLAY = { fontFamily: "'Barlow Condensed', sans-serif" };

// ─── Micro Components ──────────────────────────────────────────────────────

function VegBadge({ veg }: { veg: boolean }) {
  return (
    <div className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center flex-shrink-0 ${veg ? "border-green-600" : "border-red-600"}`}>
      <div className={`w-2.5 h-2.5 rounded-full ${veg ? "bg-green-600" : "bg-red-600"}`} />
    </div>
  );
}

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "w-3.5 h-3.5" : "w-4.5 h-4.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`${cls} ${i <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
    </div>
  );
}

// ─── Pizza Card ────────────────────────────────────────────────────────────

function PizzaCard({ pizza, onView, onAddToCart }: {
  pizza: Pizza;
  onView: (p: Pizza) => void;
  onAddToCart: (p: Pizza) => void;
}) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
      onClick={() => onView(pizza)}
    >
      <div className="relative overflow-hidden bg-amber-50 h-52">
        <img
          src={pimg(pizza.img)}
          alt={pizza.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <VegBadge veg={pizza.veg} />
        </div>
        {pizza.category === "Premium Pizzas" && (
          <div className="absolute top-3 right-3 bg-[#F7C948] text-[#171717] text-[10px] font-black px-2 py-0.5 rounded-full tracking-wide">
            PREMIUM
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Stars rating={pizza.rating} />
          <span className="text-xs text-gray-400">({pizza.reviews.toLocaleString()})</span>
        </div>
        <h3 className="font-bold text-[#171717] text-lg leading-tight">{pizza.name}</h3>
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{pizza.desc}</p>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">Starts at</span>
            <div className="text-[#E6392F] font-black text-xl" style={DISPLAY}>₹{pizza.basePrice}</div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onAddToCart(pizza); }}
            className="bg-[#E6392F] text-white rounded-full px-5 py-2 text-sm font-semibold hover:bg-[#cc2f27] active:scale-95 transition-all duration-200"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Modal ─────────────────────────────────────────────────────────

function ProductModal({ state, onChange, onClose, onAddToCart }: {
  state: ModalState;
  onChange: (s: Partial<ModalState>) => void;
  onClose: () => void;
  onAddToCart: () => void;
}) {
  const { pizza, size, crust, toppings, qty } = state;
  const unit = calcUnit(pizza, size, crust, toppings);

  const toggleTopping = (t: string) => {
    const next = toppings.includes(t) ? toppings.filter(x => x !== t) : [...toppings, t];
    onChange({ toppings: next });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full md:max-w-2xl md:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="relative h-56 md:h-64 bg-amber-50 rounded-t-3xl overflow-hidden flex-shrink-0">
          <img src={pimg(pizza.img, 800, 400)} alt={pizza.name} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute top-4 left-4"><VegBadge veg={pizza.veg} /></div>
        </div>

        <div className="p-6">
          <h2 className="text-3xl font-black text-[#171717] leading-tight" style={DISPLAY}>{pizza.name}</h2>
          <div className="flex items-center gap-2 mt-1 mb-3">
            <Stars rating={pizza.rating} />
            <span className="text-sm text-gray-400">{pizza.rating} · {pizza.reviews.toLocaleString()} reviews</span>
          </div>
          <p className="text-gray-500 text-sm mb-4 leading-relaxed">{pizza.desc}</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {pizza.ingredients.map(ing => (
              <span key={ing} className="text-xs bg-[#FFF8F0] border border-amber-100 text-gray-500 px-2.5 py-1 rounded-full">{ing}</span>
            ))}
          </div>

          {/* Size */}
          <div className="mb-5">
            <p className="font-semibold text-[#171717] mb-2 text-sm">Size</p>
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map(s => (
                <button
                  key={s}
                  onClick={() => onChange({ size: s })}
                  className={`border-2 rounded-xl py-2.5 text-sm font-medium transition-all ${size === s ? "border-[#E6392F] bg-[#FFF0EE] text-[#E6392F]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                >
                  {s}
                  <br />
                  <span className="text-xs text-gray-400">{SIZE_INCHES[s]}</span>
                  {SIZE_ADD[s] > 0 && <span className="text-xs text-[#E6392F]"> +₹{SIZE_ADD[s]}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Crust */}
          <div className="mb-5">
            <p className="font-semibold text-[#171717] mb-2 text-sm">Crust</p>
            <div className="grid grid-cols-3 gap-2">
              {CRUSTS.map(c => (
                <button
                  key={c}
                  onClick={() => onChange({ crust: c })}
                  className={`border-2 rounded-xl py-2.5 text-xs font-medium transition-all leading-snug ${crust === c ? "border-[#E6392F] bg-[#FFF0EE] text-[#E6392F]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                >
                  {c}
                  {CRUST_ADD[c] > 0 && <><br /><span className="text-[#E6392F] font-semibold">+₹{CRUST_ADD[c]}</span></>}
                </button>
              ))}
            </div>
          </div>

          {/* Toppings */}
          <div className="mb-6">
            <p className="font-semibold text-[#171717] mb-2 text-sm">
              Extra Toppings <span className="text-xs text-gray-400 font-normal">(+₹{TOPPING_PRICE} each)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {TOPPINGS_LIST.map(t => (
                <button
                  key={t}
                  onClick={() => toggleTopping(t)}
                  className={`border-2 rounded-full px-3 py-1 text-xs font-medium transition-all flex items-center gap-1 ${toppings.includes(t) ? "border-[#E6392F] bg-[#E6392F] text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                >
                  {toppings.includes(t) && <Check className="w-3 h-3" />}
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Qty + Add */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onChange({ qty: Math.max(1, qty - 1) })}
                className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#E6392F] transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-black text-lg w-6 text-center">{qty}</span>
              <button
                onClick={() => onChange({ qty: qty + 1 })}
                className="w-9 h-9 rounded-full border-2 border-[#E6392F] bg-[#E6392F] text-white flex items-center justify-center hover:bg-[#cc2f27] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={onAddToCart}
              className="bg-[#E6392F] text-white font-black rounded-full px-7 py-3 hover:bg-[#cc2f27] active:scale-95 transition-all duration-200 text-sm"
            >
              Add to Cart — ₹{(unit * qty).toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Header ────────────────────────────────────────────────────────────────

function Header({ page, setPage, cartCount }: { page: Page; setPage: (p: Page) => void; cartCount: number }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "Menu", page: "menu" },
    { label: "Offers", page: "offers" },
    { label: "About", page: "about" },
    { label: "Contact", page: "contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => setPage("home")}
          className="flex items-center gap-2 font-black text-xl text-[#171717] flex-shrink-0"
          style={DISPLAY}
        >
          <Flame className="w-6 h-6 text-[#E6392F]" />
          CRUST <span className="text-[#E6392F]">&amp;</span> FIRE
        </button>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <button
              key={l.page}
              onClick={() => setPage(l.page)}
              className={`text-sm font-medium transition-colors ${page === l.page ? "text-[#E6392F]" : "text-gray-500 hover:text-[#171717]"}`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button className="hidden md:flex w-9 h-9 items-center justify-center text-gray-400 hover:text-[#171717] transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="hidden md:flex w-9 h-9 items-center justify-center text-gray-400 hover:text-[#171717] transition-colors">
            <User className="w-5 h-5" />
          </button>
          <button
            onClick={() => setPage("cart")}
            className="relative flex w-9 h-9 items-center justify-center text-gray-500 hover:text-[#171717] transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#E6392F] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setPage("menu")}
            className="hidden md:block bg-[#E6392F] text-white text-sm font-semibold rounded-full px-5 py-2 ml-2 hover:bg-[#cc2f27] active:scale-95 transition-all duration-200"
          >
            Order Now
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-gray-600"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-50 px-4 py-4">
          {navLinks.map(l => (
            <button
              key={l.page}
              onClick={() => { setPage(l.page); setMobileOpen(false); }}
              className={`block w-full text-left py-3 font-medium border-b border-gray-50 last:border-0 ${page === l.page ? "text-[#E6392F]" : "text-gray-700"}`}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => { setPage("menu"); setMobileOpen(false); }}
            className="mt-4 w-full bg-[#E6392F] text-white font-bold rounded-full py-3 hover:bg-[#cc2f27] transition-colors"
          >
            Order Now
          </button>
        </div>
      )}
    </header>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────

function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer className="bg-[#171717] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-black text-xl mb-3" style={DISPLAY}>
            <Flame className="w-5 h-5 text-[#E6392F]" />
            CRUST <span className="text-[#E6392F]">&amp;</span> FIRE
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Handcrafted pizzas made fresh in our cloud kitchen, delivered hot to your door.
          </p>
          <div className="flex gap-3 mt-5">
            {["FB", "IG", "TW"].map(s => (
              <div key={s} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold hover:bg-[#E6392F] cursor-pointer transition-colors">
                {s}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-gray-400">Quick Links</h4>
          <ul className="space-y-2">
            {(["home", "menu", "offers", "about", "contact"] as Page[]).map(p => (
              <li key={p}>
                <button onClick={() => setPage(p)} className="text-gray-400 hover:text-white text-sm capitalize transition-colors">
                  {p}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-gray-400">Contact</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 flex-shrink-0" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 flex-shrink-0" /> hello@crustandfire.in</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 flex-shrink-0" /> Delivers across Mumbai</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-gray-400">Hours</h4>
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Clock className="w-4 h-4" /> Mon – Sun
          </div>
          <p className="text-gray-400 text-sm ml-6">11:00 AM – 11:30 PM</p>
          <div className="mt-5 bg-[#E6392F] rounded-xl p-4">
            <p className="text-sm font-semibold mb-1">Free delivery above ₹499</p>
            <p className="text-xs text-red-200">Use code: <span className="font-black">CRUSTLOVE</span></p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-gray-500 text-xs">
        © 2024 Crust &amp; Fire. Made with ❤️ for pizza lovers.
      </div>
    </footer>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────────

function HomePage({ setPage, onViewPizza, onAddToCart }: {
  setPage: (p: Page) => void;
  onViewPizza: (p: Pizza) => void;
  onAddToCart: (p: Pizza) => void;
}) {
  const bestSellers = PIZZAS.filter(p => p.reviews > 1000).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#FFF8F0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {["🌿 Freshly Made", "⚡ Fast Delivery", "⭐ Quality Ingredients"].map(b => (
                <span key={b} className="text-xs font-medium bg-white border border-amber-100 text-gray-600 px-3 py-1.5 rounded-full shadow-sm">
                  {b}
                </span>
              ))}
            </div>
            <h1
              className="text-5xl md:text-7xl font-black text-[#171717] leading-none mb-5"
              style={DISPLAY}
            >
              HOT. FRESH.<br />
              <span className="text-[#E6392F]">MADE TO</span><br />
              CRAVE.
            </h1>
            <p className="text-gray-500 text-lg md:text-xl mb-8 max-w-md leading-relaxed">
              Handcrafted pizzas, loaded with flavour and delivered hot to your door.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setPage("menu")}
                className="bg-[#E6392F] text-white font-black rounded-full px-8 py-4 text-lg hover:bg-[#cc2f27] active:scale-95 transition-all duration-200 shadow-lg shadow-red-200"
                style={DISPLAY}
              >
                Order Now
              </button>
              <button
                onClick={() => setPage("menu")}
                className="border-2 border-[#171717] text-[#171717] font-black rounded-full px-8 py-4 text-lg hover:bg-[#171717] hover:text-white active:scale-95 transition-all duration-200"
                style={DISPLAY}
              >
                View Menu
              </button>
            </div>
            <div className="flex gap-8 mt-10">
              {[["50k+", "Happy Customers"], ["4.8★", "Avg. Rating"], ["30 min", "Avg. Delivery"]].map(([val, label]) => (
                <div key={label}>
                  <div className="font-black text-2xl text-[#E6392F]" style={DISPLAY}>{val}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex justify-center md:justify-end">
            <div className="relative w-full max-w-lg">
              <div className="aspect-square rounded-full overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src={pimg("photo-1604382354936-07c5d9983bd3", 800, 800)}
                  alt="Fresh hot pizzas from Crust and Fire"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-6 -left-4 md:left-0 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFF8F0] rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#E6392F]" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Your Order</p>
                  <p className="text-sm font-bold text-[#171717]">Out for Delivery!</p>
                </div>
              </div>
              <div className="absolute top-4 -right-2 md:right-0 bg-[#F7C948] rounded-2xl px-4 py-3 shadow-lg">
                <p className="text-xs font-black text-[#171717]" style={DISPLAY}>FREE DELIVERY<br />ABOVE ₹499</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo strip */}
      <div className="bg-[#E6392F] text-white py-3">
        <p className="text-center text-sm font-semibold tracking-wide px-4">
          🎉 BUY 1 GET 1 FREE · CODE:{" "}
          <span className="font-black bg-white/20 px-2 py-0.5 rounded">B1G1</span>
          &nbsp;·&nbsp; 20% OFF FIRST ORDER · CODE:{" "}
          <span className="font-black bg-white/20 px-2 py-0.5 rounded">FIRST20</span>
          &nbsp;·&nbsp; FREE DELIVERY ABOVE ₹499
        </p>
      </div>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[#E6392F] font-semibold text-xs uppercase tracking-widest mb-1">Fan Favourites</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#171717]" style={DISPLAY}>OUR BEST SELLERS</h2>
          </div>
          <button
            onClick={() => setPage("menu")}
            className="hidden md:flex items-center gap-1 text-[#E6392F] font-semibold text-sm hover:gap-2 transition-all"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bestSellers.map(p => (
            <PizzaCard key={p.id} pizza={p} onView={onViewPizza} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>

      {/* Craving */}
      <section className="bg-[#171717] py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-10" style={DISPLAY}>
            WHAT ARE YOU <span className="text-[#F7C948]">CRAVING?</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Classic Pizzas", emoji: "🍕" },
              { label: "Premium Pizzas", emoji: "⭐" },
              { label: "Veg Pizzas", emoji: "🌿" },
              { label: "Non-Veg Pizzas", emoji: "🍗" },
            ].map(cat => (
              <button
                key={cat.label}
                onClick={() => setPage("menu")}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 text-center transition-all hover:-translate-y-1 duration-200"
              >
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <p className="text-white font-semibold text-sm">{cat.label}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Build Your Pizza */}
      <section className="bg-[#FFF8F0] py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 md:order-1">
            <img
              src={pimg("photo-1513104890138-7c749659a591", 700, 700)}
              alt="Build your custom pizza"
              className="rounded-3xl shadow-xl w-full object-cover aspect-square"
            />
            <div className="absolute top-6 right-6 bg-[#F7C948] text-[#171717] font-black rounded-2xl px-4 py-3 text-sm shadow-lg" style={DISPLAY}>
              YOU CHOOSE,<br />WE BAKE!
            </div>
          </div>
          <div className="order-1 md:order-2">
            <p className="text-[#E6392F] font-semibold text-xs uppercase tracking-widest mb-2">Personalize It</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#171717] mb-4" style={DISPLAY}>
              BUILD YOUR PERFECT PIZZA
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Start with your favourite base, pick your crust, and pile on the toppings. We handcraft each pizza to your specs — fresh, hot, and exactly how you like it.
            </p>
            <div className="space-y-4 mb-8">
              {[
                { step: "01", label: "Choose Your Base", desc: "Classic tomato, BBQ, white garlic, or tikka" },
                { step: "02", label: "Pick Your Crust", desc: "Classic, thin crust, or indulgent cheese burst" },
                { step: "03", label: "Load the Toppings", desc: "7+ fresh toppings to mix and match" },
              ].map(s => (
                <div key={s.step} className="flex gap-4 items-start">
                  <div
                    className="w-10 h-10 bg-[#E6392F] text-white rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={DISPLAY}
                  >
                    {s.step}
                  </div>
                  <div>
                    <p className="font-bold text-[#171717]">{s.label}</p>
                    <p className="text-sm text-gray-400">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setPage("menu")}
              className="bg-[#E6392F] text-white font-black rounded-full px-8 py-4 hover:bg-[#cc2f27] active:scale-95 transition-all duration-200 shadow-lg shadow-red-200"
              style={DISPLAY}
            >
              Start Building →
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-[#E6392F] font-semibold text-xs uppercase tracking-widest mb-1">Why Us</p>
          <h2 className="text-4xl md:text-5xl font-black text-[#171717]" style={DISPLAY}>WHY CRUST &amp; FIRE?</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { icon: <Flame className="w-6 h-6 text-[#E6392F]" />, title: "Stone-Fired Flavor", desc: "Every pizza fired at 400°C for that authentic char and perfect crunch." },
            { icon: <Shield className="w-6 h-6 text-[#E6392F]" />, title: "Premium Ingredients", desc: "We source only the freshest produce and imported cheeses for every order." },
            { icon: <Truck className="w-6 h-6 text-[#E6392F]" />, title: "30-Min Delivery", desc: "From our kitchen to your door in 30 minutes — or your next pizza is on us." },
            { icon: <Heart className="w-6 h-6 text-[#E6392F]" />, title: "Made with Love", desc: "Each pizza is handcrafted by our expert pizzaiolos who live and breathe dough." },
          ].map(f => (
            <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#FFF0EE] rounded-xl flex items-center justify-center mb-4">{f.icon}</div>
              <h3 className="font-bold text-[#171717] mb-2 text-sm">{f.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-[#FFF8F0] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-[#E6392F] font-semibold text-xs uppercase tracking-widest mb-1">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#171717]" style={DISPLAY}>WHAT OUR FANS SAY</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Priya S.", location: "Bandra, Mumbai", rating: 5, review: "The Meat Lovers is absolute perfection. Crispy crust, loaded toppings, arrived piping hot. Crust & Fire is the only pizza I order now!", initials: "PS" },
              { name: "Rahul M.", location: "Andheri, Mumbai", rating: 5, review: "Ordered the Four Cheese on a whim and was completely blown away. The cheese burst crust is next level. Will definitely be ordering again!", initials: "RM" },
              { name: "Ananya K.", location: "Juhu, Mumbai", rating: 5, review: "As a vegetarian, I was skeptical. Then I tried the Paneer Tikka pizza and my life changed. The tikka sauce is incredible. 10/10!", initials: "AK" },
            ].map(r => (
              <div key={r.name} className="bg-white rounded-2xl p-6 shadow-sm">
                <Stars rating={r.rating} size="md" />
                <p className="text-gray-600 mt-4 mb-5 text-sm leading-relaxed">"{r.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E6392F] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {r.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-[#171717] text-sm">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#E6392F] py-14">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black mb-2" style={DISPLAY}>
              HUNGRY? WE&apos;RE 30 MINS AWAY.
            </h2>
            <p className="text-red-200 text-lg">Order now and get 20% off your first pizza.</p>
          </div>
          <button
            onClick={() => setPage("menu")}
            className="bg-white text-[#E6392F] font-black rounded-full px-10 py-4 text-lg hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap shadow-xl"
            style={DISPLAY}
          >
            ORDER NOW →
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── Menu Page ─────────────────────────────────────────────────────────────

function MenuPage({ onViewPizza, onAddToCart }: {
  onViewPizza: (p: Pizza) => void;
  onAddToCart: (p: Pizza) => void;
}) {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? PIZZAS : PIZZAS.filter(p => p.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-[#171717] mb-1" style={DISPLAY}>OUR MENU</h1>
        <p className="text-gray-400">Handcrafted with love. Built to be devoured.</p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${filter === cat ? "bg-[#E6392F] border-[#E6392F] text-white" : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"}`}
          >
            {cat}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No items in this category yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <PizzaCard key={p.id} pizza={p} onView={onViewPizza} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Cart Page ─────────────────────────────────────────────────────────────

function CartPage({ cart, setCart, setPage }: {
  cart: CartItem[];
  setCart: (c: CartItem[]) => void;
  setPage: (p: Page) => void;
}) {
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");

  const subtotal = cart.reduce((s, i) => s + i.unit * i.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + (subtotal > 0 ? DELIVERY_FEE : 0) + tax - discount;

  const applyPromo = () => {
    const codes: Record<string, number> = {
      FIRST20: Math.round(subtotal * 0.2),
      B1G1: 100,
      CRUSTLOVE: 50,
      COMBO299: 60,
    };
    const code = promo.trim().toUpperCase();
    if (codes[code]) {
      setDiscount(codes[code]);
      setPromoMsg(`✅ Code applied! You saved ₹${codes[code]}`);
    } else {
      setPromoMsg("❌ Invalid promo code. Try FIRST20, B1G1 or CRUSTLOVE.");
    }
  };

  const updateQty = (key: string, delta: number) => {
    setCart(cart.map(i => i.key === key ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const removeItem = (key: string) => setCart(cart.filter(i => i.key !== key));

  if (cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-8xl mb-6">🍕</div>
        <h2 className="text-4xl font-black text-[#171717] mb-2" style={DISPLAY}>YOUR CART IS EMPTY</h2>
        <p className="text-gray-400 mb-8">Looks like you haven&apos;t added any pizzas yet. Let&apos;s fix that!</p>
        <button
          onClick={() => setPage("menu")}
          className="bg-[#E6392F] text-white font-bold rounded-full px-8 py-4 hover:bg-[#cc2f27] transition-colors"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl md:text-5xl font-black text-[#171717] mb-8" style={DISPLAY}>YOUR CART</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.key} className="bg-white rounded-2xl shadow-sm p-4 flex gap-4">
              <div className="w-20 h-20 bg-amber-50 rounded-xl overflow-hidden flex-shrink-0">
                <img src={pimg(item.pizza.img, 160, 160)} alt={item.pizza.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <VegBadge veg={item.pizza.veg} />
                      <h3 className="font-bold text-[#171717]">{item.pizza.name}</h3>
                    </div>
                    <p className="text-xs text-gray-400">
                      {item.size} · {item.crust}
                      {item.toppings.length > 0 && ` · ${item.toppings.join(", ")}`}
                    </p>
                  </div>
                  <button onClick={() => removeItem(item.key)} className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.key, -1)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#E6392F] transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-sm w-5 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.key, 1)} className="w-7 h-7 rounded-full border border-[#E6392F] bg-[#E6392F] text-white flex items-center justify-center hover:bg-[#cc2f27] transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-black text-[#E6392F]" style={DISPLAY}>₹{(item.unit * item.qty).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <h3 className="font-bold text-[#171717] text-lg mb-5">Order Summary</h3>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-gray-500"><span>Delivery Fee</span><span>₹{DELIVERY_FEE}</span></div>
              <div className="flex justify-between text-gray-500"><span>Taxes (5%)</span><span>₹{tax}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium"><span>Discount</span><span>−₹{discount}</span></div>
              )}
            </div>
            <div className="border-t border-dashed border-gray-100 pt-3 mb-5">
              <div className="flex justify-between font-black text-[#171717] text-xl" style={DISPLAY}>
                <span>Total</span><span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <input
                value={promo}
                onChange={e => setPromo(e.target.value)}
                onKeyDown={e => e.key === "Enter" && applyPromo()}
                placeholder="Promo code"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#E6392F] transition-colors"
              />
              <button onClick={applyPromo} className="bg-[#171717] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
                Apply
              </button>
            </div>
            {promoMsg && <p className="text-xs mb-4 text-gray-500">{promoMsg}</p>}
            <button
              onClick={() => setPage("checkout")}
              className="w-full bg-[#E6392F] text-white font-black rounded-full py-4 hover:bg-[#cc2f27] active:scale-95 transition-all duration-200"
              style={DISPLAY}
            >
              Proceed to Checkout →
            </button>
            <p className="text-xs text-center text-gray-400 mt-3 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" /> Secure payment guaranteed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Checkout Page ─────────────────────────────────────────────────────────

function CheckoutPage({ cart, setPage, onConfirm }: {
  cart: CartItem[];
  setPage: (p: Page) => void;
  onConfirm: () => void;
}) {
  const [payment, setPayment] = useState("UPI");
  const subtotal = cart.reduce((s, i) => s + i.unit * i.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + DELIVERY_FEE + tax;

  const paymentOptions = [
    { id: "UPI", label: "UPI", icon: "📲" },
    { id: "Card", label: "Credit / Debit Card", icon: "💳" },
    { id: "COD", label: "Cash on Delivery", icon: "💵" },
    { id: "Wallet", label: "Wallet", icon: "👛" },
  ];

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E6392F] transition-colors bg-white";
  const labelCls = "text-xs font-semibold text-gray-500 mb-1 block";

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl md:text-5xl font-black text-[#171717] mb-8" style={DISPLAY}>CHECKOUT</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-[#171717] text-lg mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-[#E6392F]" /> Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelCls}>First Name</label><input placeholder="Rahul" className={inputCls} /></div>
              <div><label className={labelCls}>Last Name</label><input placeholder="Sharma" className={inputCls} /></div>
              <div className="col-span-2"><label className={labelCls}>Email</label><input placeholder="rahul@example.com" type="email" className={inputCls} /></div>
              <div className="col-span-2"><label className={labelCls}>Mobile Number</label><input placeholder="+91 98765 43210" type="tel" className={inputCls} /></div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-[#171717] text-lg mb-5 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#E6392F]" /> Delivery Address
            </h3>
            <div className="space-y-4">
              <div><label className={labelCls}>Flat / House Number</label><input placeholder="Flat 12B, Marina Tower" className={inputCls} /></div>
              <div><label className={labelCls}>Street / Area</label><input placeholder="Linking Road, Bandra West" className={inputCls} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>City</label><input placeholder="Mumbai" className={inputCls} /></div>
                <div><label className={labelCls}>PIN Code</label><input placeholder="400050" className={inputCls} /></div>
              </div>
              <div><label className={labelCls}>Delivery Instructions (optional)</label><input placeholder="Leave at door, call on arrival..." className={inputCls} /></div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-[#171717] text-lg mb-5">Payment Method</h3>
            <div className="space-y-3">
              {paymentOptions.map(opt => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 border-2 rounded-xl p-4 cursor-pointer transition-all ${payment === opt.id ? "border-[#E6392F] bg-[#FFF0EE]" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <input type="radio" name="payment" value={opt.id} checked={payment === opt.id} onChange={() => setPayment(opt.id)} className="accent-[#E6392F]" />
                  <span className="text-xl">{opt.icon}</span>
                  <span className="font-medium text-[#171717] text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary sidebar */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <h3 className="font-bold text-[#171717] text-lg mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {cart.map(item => (
                <div key={item.key} className="flex justify-between text-sm gap-2 py-1">
                  <span className="text-gray-500 truncate">{item.pizza.name} × {item.qty} ({item.size})</span>
                  <span className="font-medium text-[#171717] flex-shrink-0">₹{(item.unit * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed border-gray-100 pt-3 space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between text-gray-400"><span>Delivery</span><span>₹{DELIVERY_FEE}</span></div>
              <div className="flex justify-between text-gray-400"><span>Tax (5%)</span><span>₹{tax}</span></div>
            </div>
            <div className="flex justify-between font-black text-[#171717] text-2xl mb-5" style={DISPLAY}>
              <span>Total</span><span>₹{total.toLocaleString()}</span>
            </div>
            <button
              onClick={onConfirm}
              className="w-full bg-[#E6392F] text-white font-black rounded-full py-4 hover:bg-[#cc2f27] active:scale-95 transition-all duration-200"
              style={DISPLAY}
            >
              Place Order 🔥
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Confirmation Page ─────────────────────────────────────────────────────

function ConfirmationPage({ cart, setPage, clearCart }: {
  cart: CartItem[];
  setPage: (p: Page) => void;
  clearCart: () => void;
}) {
  const [orderNum] = useState(`CF${Math.floor(Math.random() * 900000 + 100000)}`);
  const stages = ["Order Confirmed", "Preparing", "Out for Delivery", "Delivered"];
  const currentStage = 1;

  const subtotal = cart.reduce((s, i) => s + i.unit * i.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + DELIVERY_FEE + tax;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
        <Check className="w-12 h-12 text-green-600" />
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-[#171717] mb-2" style={DISPLAY}>ORDER CONFIRMED!</h1>
      <p className="text-gray-400 mb-1 text-sm">Order #{orderNum}</p>
      <p className="text-gray-600 mb-8 leading-relaxed">
        Our pizzaiolos are already at work. Estimated delivery:{" "}
        <strong className="text-[#E6392F]">30–40 minutes</strong>
      </p>

      {/* Tracking */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 text-left">
        <h3 className="font-bold text-[#171717] mb-8 text-center">Live Order Tracking</h3>
        <div className="relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100">
            <div
              className="h-full bg-[#E6392F] transition-all duration-1000"
              style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }}
            />
          </div>
          <div className="relative flex justify-between">
            {stages.map((stage, i) => (
              <div key={stage} className="flex flex-col items-center gap-3">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-all ${i <= currentStage ? "bg-[#E6392F] border-[#E6392F]" : "bg-white border-gray-200"}`}>
                  {i <= currentStage
                    ? <Check className="w-4 h-4 text-white" />
                    : <div className="w-2 h-2 rounded-full bg-gray-200" />
                  }
                </div>
                <span className={`text-xs font-medium text-center max-w-[64px] leading-tight ${i <= currentStage ? "text-[#E6392F]" : "text-gray-300"}`}>
                  {stage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order items */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 text-left">
        <h3 className="font-bold text-[#171717] mb-4">Your Order</h3>
        {cart.map(item => (
          <div key={item.key} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-sm">
            <span className="text-gray-500">{item.pizza.name} × {item.qty} ({item.size})</span>
            <span className="font-medium text-[#171717]">₹{(item.unit * item.qty).toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between font-black text-[#171717] mt-4 text-xl" style={DISPLAY}>
          <span>Total Paid</span><span>₹{total.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button className="flex-1 bg-[#E6392F] text-white font-bold rounded-full py-4 hover:bg-[#cc2f27] transition-colors">
          Track My Order
        </button>
        <button
          onClick={() => { clearCart(); setPage("home"); }}
          className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold rounded-full py-4 hover:border-[#171717] hover:text-[#171717] transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

// ─── Offers Page ───────────────────────────────────────────────────────────

function OffersPage({ setPage }: { setPage: (p: Page) => void }) {
  const offers = [
    { code: "B1G1", title: "BUY 1 GET 1 FREE", desc: "Order any Large pizza and get a Medium pizza absolutely free. Valid every Tuesday and Wednesday.", color: "#E6392F", tag: "🔥 HOT DEAL", expiry: "Ends 31 Aug" },
    { code: "FIRST20", title: "20% OFF YOUR FIRST ORDER", desc: "First-time customer? Welcome to the family! Get 20% off your entire first order.", color: "#F7C948", tag: "🎉 NEW USER", expiry: "Always valid" },
    { code: "COMBO299", title: "COMBO MEAL FROM ₹299", desc: "Get a Regular pizza + garlic bread + Coke for just ₹299. The perfect value combo.", color: "#22A06B", tag: "💚 VALUE", expiry: "Limited time" },
    { code: "WEEKEND", title: "WEEKEND PIZZA DEAL", desc: "Sat & Sun specials — order 2 Medium pizzas and get free delivery + a free dessert.", color: "#171717", tag: "📅 WEEKEND", expiry: "Every weekend" },
    { code: "CRUSTLOVE", title: "FREE DELIVERY", desc: "Use this code to get free delivery on any order above ₹299. No questions asked.", color: "#E6392F", tag: "🚚 FREE SHIP", expiry: "Always valid" },
    { code: "CHEESE50", title: "₹50 OFF PREMIUM", desc: "Flat ₹50 off on all Premium pizza orders. Treat yourself to Four Cheese or Meat Lovers.", color: "#F7C948", tag: "⭐ PREMIUM", expiry: "Ends 15 Sep" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10">
        <p className="text-[#E6392F] font-semibold text-xs uppercase tracking-widest mb-1">Deals &amp; Offers</p>
        <h1 className="text-4xl md:text-5xl font-black text-[#171717]" style={DISPLAY}>HOT DEALS 🔥</h1>
        <p className="text-gray-400 mt-2">Limited time offers — grab them before they&apos;re gone!</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map(offer => (
          <div key={offer.code} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
            <div className="h-2" style={{ backgroundColor: offer.color }} />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full">{offer.tag}</span>
                <span className="text-xs text-gray-300">{offer.expiry}</span>
              </div>
              <h3 className="text-xl font-black text-[#171717] mb-2" style={DISPLAY}>{offer.title}</h3>
              <p className="text-sm text-gray-400 mb-5 leading-relaxed">{offer.desc}</p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 bg-gray-50 border border-dashed border-gray-200 rounded-xl px-3 py-2">
                  <Tag className="w-3.5 h-3.5 text-[#E6392F]" />
                  <span className="font-black text-[#171717] tracking-widest text-sm">{offer.code}</span>
                </div>
                <button
                  onClick={() => setPage("menu")}
                  className="bg-[#E6392F] text-white font-semibold rounded-full px-4 py-2 text-sm hover:bg-[#cc2f27] transition-colors"
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── About Page ────────────────────────────────────────────────────────────

function AboutPage() {
  return (
    <div>
      <div className="relative h-72 md:h-96 bg-[#171717] overflow-hidden">
        <img
          src={pimg("photo-1571407970349-bc81e71e9468", 1400, 600)}
          alt="Our kitchen"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-[#F7C948] font-semibold text-xs uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="text-5xl md:text-7xl font-black" style={DISPLAY}>MADE WITH FIRE</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <p className="text-[#E6392F] font-semibold text-xs uppercase tracking-widest mb-2">Who We Are</p>
            <h2 className="text-4xl font-black text-[#171717] mb-5" style={DISPLAY}>BORN FROM A PASSION FOR REAL PIZZA</h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Crust &amp; Fire was born in a small apartment kitchen in Mumbai where two pizza-obsessed friends spent their weekends perfecting dough recipes and testing sauce combinations.
            </p>
            <p className="text-gray-500 leading-relaxed mb-4">
              Today we operate as a cloud kitchen, crafting every pizza from scratch with hand-stretched dough, imported Italian tomatoes, and the freshest local toppings. No shortcuts. No frozen dough. Just real pizza made with fire.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Our mission is simple: deliver the best pizza in the city to your door, hotter and faster than you&apos;d expect, at a price that feels fair.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={pimg("photo-1540189549336-e6e99eb4b951", 400, 400)} alt="Fresh ingredients" className="rounded-2xl w-full aspect-square object-cover" />
            <img src={pimg("photo-1574071318508-1cdbab80d002", 400, 400)} alt="Pizza preparation" className="rounded-2xl w-full aspect-square object-cover mt-8" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-[#171717]" style={DISPLAY}>OUR COMMITMENTS</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "🌿", title: "Fresh Ingredients", desc: "We source vegetables fresh every morning from local farms. No preserved, no frozen — just vibrant, flavourful ingredients." },
            { icon: "🤌", title: "Handmade Dough", desc: "Our dough is hand-stretched each day. It proofs for 24 hours before hitting the oven, giving you that perfect chewy-crispy texture." },
            { icon: "🧀", title: "Quality Cheese", desc: "We use imported Italian mozzarella and premium local cheeses. Every pizza gets a generous, unapologetic amount of cheese." },
            { icon: "🔥", title: "Stone-Fired Oven", desc: "Our pizzas are fired at 400°C in a stone deck oven for 3–4 minutes — this creates the authentic char and crispy base you love." },
            { icon: "🧹", title: "Hygienic Kitchen", desc: "Our FSSAI-certified cloud kitchen follows strict hygiene protocols. Regular audits ensure every order is safe and clean." },
            { icon: "⚡", title: "Fast Delivery", desc: "We aim to get your pizza to you within 30 minutes. Our delivery partners are trained to keep your food hot in transit." },
          ].map(v => (
            <div key={v.title} className="bg-[#FFF8F0] rounded-2xl p-6 hover:shadow-sm transition-shadow">
              <div className="text-4xl mb-3">{v.icon}</div>
              <h3 className="font-bold text-[#171717] text-lg mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Contact Page ──────────────────────────────────────────────────────────

function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "What areas do you deliver to?", a: "We currently deliver across Mumbai — Bandra, Andheri, Juhu, Powai, Kurla, Dadar, and surrounding areas. Enter your pincode at checkout to confirm availability." },
    { q: "How long does delivery take?", a: "Our average delivery time is 30 minutes from the time you place your order. During peak hours (7–9 PM) this may extend to 45 minutes." },
    { q: "Can I customize my pizza?", a: "Absolutely! On each product page you can select your size, crust type, and add extra toppings. We love when you make it your own." },
    { q: "Do you cater to large orders?", a: "Yes! For orders of 10+ pizzas, please contact us directly on WhatsApp or call us at least 2 hours in advance for the best experience." },
    { q: "What is your refund policy?", a: "If your order is wrong or doesn't meet quality standards, contact us within 30 minutes of delivery and we will replace or refund it." },
  ];

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E6392F] transition-colors bg-white";
  const labelCls = "text-xs font-semibold text-gray-500 mb-1 block";

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10">
        <p className="text-[#E6392F] font-semibold text-xs uppercase tracking-widest mb-1">Get in Touch</p>
        <h1 className="text-4xl md:text-5xl font-black text-[#171717]" style={DISPLAY}>WE&apos;RE HERE FOR YOU</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="space-y-4">
          {[
            { icon: <Phone className="w-5 h-5 text-[#E6392F]" />, title: "Call Us", value: "+91 98765 43210", sub: "Mon–Sun, 11AM–11:30PM" },
            { icon: <MessageCircle className="w-5 h-5 text-[#E6392F]" />, title: "WhatsApp", value: "+91 98765 43210", sub: "Quick response guaranteed" },
            { icon: <Mail className="w-5 h-5 text-[#E6392F]" />, title: "Email", value: "hello@crustandfire.in", sub: "We respond within 2 hours" },
            { icon: <MapPin className="w-5 h-5 text-[#E6392F]" />, title: "Delivery Zone", value: "Mumbai — 15+ Neighbourhoods", sub: "Check availability at checkout" },
          ].map(c => (
            <div key={c.title} className="bg-white rounded-2xl shadow-sm p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-[#FFF0EE] rounded-xl flex items-center justify-center flex-shrink-0">{c.icon}</div>
              <div>
                <p className="font-bold text-[#171717]">{c.title}</p>
                <p className="text-[#E6392F] font-semibold text-sm">{c.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-[#171717] text-lg mb-5">Send a Message</h3>
          <div className="space-y-4">
            <div><label className={labelCls}>Your Name</label><input placeholder="Rahul Sharma" className={inputCls} /></div>
            <div><label className={labelCls}>Email</label><input placeholder="rahul@example.com" type="email" className={inputCls} /></div>
            <div>
              <label className={labelCls}>Subject</label>
              <select className={inputCls}>
                <option>Order Issue</option>
                <option>Feedback</option>
                <option>Catering Enquiry</option>
                <option>Other</option>
              </select>
            </div>
            <div><label className={labelCls}>Message</label><textarea rows={4} placeholder="Tell us how we can help..." className={`${inputCls} resize-none`} /></div>
            <button className="w-full bg-[#E6392F] text-white font-bold rounded-full py-3 hover:bg-[#cc2f27] transition-colors">
              Send Message →
            </button>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-3xl font-black text-[#171717] mb-6" style={DISPLAY}>FREQUENTLY ASKED QUESTIONS</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left gap-4"
              >
                <span className="font-semibold text-[#171717] text-sm">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── App Root ──────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [modal, setModal] = useState<ModalState | null>(null);

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openModal = (pizza: Pizza) => {
    setModal({ pizza, size: "Medium", crust: "Classic", toppings: [], qty: 1 });
  };

  const addToCart = () => {
    if (!modal) return;
    const { pizza, size, crust, toppings, qty } = modal;
    const unit = calcUnit(pizza, size, crust, toppings);
    const key = `${pizza.id}-${size}-${crust}-${[...toppings].sort().join(",")}`;
    setCart(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { key, pizza, size, crust, toppings, qty, unit }];
    });
    setModal(null);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.unit * i.qty, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header page={page} setPage={navigate} cartCount={cartCount} />

      <main>
        {page === "home" && (
          <HomePage setPage={navigate} onViewPizza={openModal} onAddToCart={openModal} />
        )}
        {page === "menu" && (
          <MenuPage onViewPizza={openModal} onAddToCart={openModal} />
        )}
        {page === "cart" && (
          <CartPage cart={cart} setCart={setCart} setPage={navigate} />
        )}
        {page === "checkout" && (
          <CheckoutPage cart={cart} setPage={navigate} onConfirm={() => navigate("confirmation")} />
        )}
        {page === "confirmation" && (
          <ConfirmationPage cart={cart} setPage={navigate} clearCart={() => setCart([])} />
        )}
        {page === "offers" && <OffersPage setPage={navigate} />}
        {page === "about" && <AboutPage />}
        {page === "contact" && <ContactPage />}
      </main>

      {page !== "confirmation" && <Footer setPage={navigate} />}

      {modal && (
        <ProductModal
          state={modal}
          onChange={update => setModal(prev => prev ? { ...prev, ...update } : null)}
          onClose={() => setModal(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* Mobile sticky cart bar */}
      {cart.length > 0 && !["cart", "checkout", "confirmation"].includes(page) && (
        <div className="fixed bottom-6 left-4 right-4 md:hidden z-30">
          <button
            onClick={() => navigate("cart")}
            className="w-full bg-[#E6392F] text-white font-bold rounded-2xl py-4 flex items-center justify-between px-5 shadow-2xl hover:bg-[#cc2f27] transition-colors"
          >
            <span className="bg-white/20 rounded-lg px-2 py-0.5 text-sm">{cartCount} {cartCount === 1 ? "item" : "items"}</span>
            <span className="font-black" style={DISPLAY}>VIEW CART →</span>
            <span className="font-black" style={DISPLAY}>₹{cartTotal.toLocaleString()}</span>
          </button>
        </div>
      )}
    </div>
  );
}
