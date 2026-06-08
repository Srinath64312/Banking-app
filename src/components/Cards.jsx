import React, { useState, useEffect } from "react";
import { CreditCard, Eye, EyeOff, Lock, Unlock, RefreshCw, Wifi } from "lucide-react";
import { useBanking } from "../context/BankingContext";

const CardVisual = ({ card, showDetails, onToggle, frozen }) => (
  <div
    className={`relative bg-gradient-to-br ${card.color} card-shine rounded-2xl p-7 w-full max-w-sm mx-auto shadow-2xl border border-white/10 cursor-pointer`}
    onClick={onToggle}
  >
    {/* Chip & NFC */}
    <div className="flex justify-between items-start mb-8">
      <div className="w-10 h-8 rounded-md bg-gradient-to-br from-gold-300 to-gold-500 opacity-90" />
      <Wifi size={20} className="text-white/40 rotate-90" />
    </div>

    <div className="font-mono text-white/80 text-base tracking-widest mb-6">
      {showDetails ? card.number : "•••• •••• •••• " + card.number.slice(-4)}
    </div>

    {/* Bottom Row */}
    <div className="flex justify-between items-end">
      <div>
        <div className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Card Holder</div>
        <div className="text-white font-medium text-sm">{card.holder}</div>
      </div>
      <div className="text-center">
        <div className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Expires</div>
        <div className="text-white font-medium text-sm">{card.expiry}</div>
      </div>
      <div className="text-right">
        <div className="text-white/50 text-lg font-bold italic">{card.type.split(" ")[0]}</div>
      </div>
    </div>

    {frozen && (
      <div className="absolute inset-0 rounded-2xl bg-navy-900/70 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center">
          <Lock size={28} className="text-blue-300 mx-auto mb-2" />
          <div className="text-white text-sm font-medium">Card Frozen</div>
        </div>
      </div>
    )}
  </div>
);

const Cards = () => {
  const { user, cards, updateCardFreeze, addNewCard, replaceCard, updateCardLimits } = useBanking();
  const [selectedCard, setSelectedCard] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'replace' | 'add_card'

  // Card Creator Form States
  const [customBrand, setCustomBrand] = useState("Visa");
  const [customTier, setCustomTier] = useState("Virtual");
  const [customColor, setCustomColor] = useState("from-blue-600 via-blue-700 to-blue-900");
  const [customLimit, setCustomLimit] = useState(10000);
  const [customName, setCustomName] = useState("");

  // Replacement Form State
  const [replaceReason, setReplaceReason] = useState("Damaged");

  // Limits sliders state
  const card = cards[selectedCard] || cards[0];
  const [dailyLimit, setDailyLimit] = useState(5000);
  const [onlineLimit, setOnlineLimit] = useState(2000);
  const [atmLimit, setAtmLimit] = useState(1000);

  useEffect(() => {
    if (card) {
      setDailyLimit(card.limit ? Math.round(card.limit * 0.1) : 5000);
      setOnlineLimit(card.limit ? Math.round(card.limit * 0.05) : 2000);
      setAtmLimit(card.limit ? Math.round(card.limit * 0.02) : 1000);
      setCustomName(user.name);
    }
  }, [selectedCard, card, user.name]);

  if (!card) return null;

  const toggleFreeze = () => {
    updateCardFreeze(card.id, !card.frozen);
  };

  const handleCreateCardSubmit = (e) => {
    e.preventDefault();
    addNewCard(customBrand, customTier, customColor, customLimit, customName || user.name);
    setActiveModal(null);
  };

  const handleReplaceCardSubmit = (e) => {
    e.preventDefault();
    replaceCard(card.id, replaceReason);
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto">
      {/* Modals */}
      {activeModal === "replace" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/80 backdrop-blur-sm px-4">
          <div className="glass-card w-full max-w-md p-6 rounded-2xl border border-navy-500/30 animate-slide-up shadow-2xl">
            <h3 className="font-display text-xl font-semibold text-white mb-2">Request Replacement Card</h3>
            <p className="text-navy-300 text-xs mb-4">Replacing your card will freeze the old card number and issue a new number instantly.</p>
            <form onSubmit={handleReplaceCardSubmit} className="space-y-4">
              <div>
                <label className="text-navy-400 text-xs mb-1.5 block">Reason for Replacement</label>
                <select
                  value={replaceReason}
                  onChange={(e) => setReplaceReason(e.target.value)}
                  className="w-full bg-navy-800/50 border border-navy-600/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-navy-400 focus:bg-navy-800"
                >
                  <option value="Damaged" className="bg-navy-900">Damaged / Not working</option>
                  <option value="Lost" className="bg-navy-900">Lost Card</option>
                  <option value="Stolen" className="bg-navy-900">Stolen Card</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-2.5 rounded-xl glass text-navy-200 text-sm hover:text-white">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold text-sm hover:opacity-90">Deactivate & Replace</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === "add_card" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/80 backdrop-blur-sm px-4">
          <div className="glass-card w-full max-w-md p-6 rounded-2xl border border-navy-500/30 animate-slide-up shadow-2xl text-left">
            <h3 className="font-display text-xl font-semibold text-white mb-2">Issue New Card</h3>
            <p className="text-navy-300 text-xs mb-4">Configure and customize your new digital banking card details.</p>
            
            <form onSubmit={handleCreateCardSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-left">
                <div>
                  <label className="text-navy-400 text-xs mb-1.5 block">Card Brand</label>
                  <select
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    className="w-full bg-navy-800/50 border border-navy-600/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:bg-navy-800"
                  >
                    <option value="Visa" className="bg-navy-900">Visa</option>
                    <option value="Mastercard" className="bg-navy-900">Mastercard</option>
                    <option value="Amex" className="bg-navy-900">Amex</option>
                  </select>
                </div>
                <div>
                  <label className="text-navy-400 text-xs mb-1.5 block">Card Tier</label>
                  <select
                    value={customTier}
                    onChange={(e) => setCustomTier(e.target.value)}
                    className="w-full bg-navy-800/50 border border-navy-600/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:bg-navy-800"
                  >
                    <option value="Virtual" className="bg-navy-900">Virtual Neon</option>
                    <option value="Gold" className="bg-navy-900">Gold Credit</option>
                    <option value="Platinum" className="bg-navy-900">Platinum Debit</option>
                    <option value="Infinite" className="bg-navy-900">Infinite Black</option>
                  </select>
                </div>
              </div>

              <div className="text-left">
                <label className="text-navy-400 text-xs mb-1.5 block">Card Design Theme</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { key: "from-blue-600 via-blue-700 to-blue-900", title: "Blue", class: "bg-blue-600" },
                    { key: "from-navy-700 via-navy-800 to-navy-900", title: "Navy", class: "bg-blue-950" },
                    { key: "from-slate-700 via-slate-800 to-slate-900", title: "Slate", class: "bg-slate-700" },
                    { key: "from-purple-600 via-purple-700 to-purple-900", title: "Purple", class: "bg-purple-600" },
                    { key: "from-red-600 via-red-700 to-red-900", title: "Crimson", class: "bg-red-600" }
                  ].map(theme => (
                    <button
                      key={theme.key}
                      type="button"
                      onClick={() => setCustomColor(theme.key)}
                      className={`h-8 rounded-lg border-2 ${theme.class} ${customColor === theme.key ? 'border-gold-400 scale-105' : 'border-white/10 opacity-70'}`}
                      title={theme.title}
                    />
                  ))}
                </div>
              </div>

              <div className="text-left">
                <label className="text-navy-400 text-xs mb-1.5 block">Name on Card</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Card Nickname / Holder"
                  className="w-full bg-navy-800/50 border border-navy-600/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-navy-400"
                />
              </div>

              <div className="text-left">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-navy-400">Card Monthly Limit</span>
                  <span className="text-white font-mono">${customLimit.toLocaleString()}</span>
                </div>
                <input
                  type="range" min={1000} max={75000} step={1000}
                  value={customLimit}
                  onChange={(e) => setCustomLimit(Number(e.target.value))}
                  className="w-full accent-gold-500 h-1.5 rounded-full appearance-none bg-navy-700/50 cursor-pointer"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-2.5 rounded-xl glass text-navy-200 text-sm hover:text-white">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 font-semibold text-sm hover:opacity-90">Issue Card</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="mb-8 animate-slide-up text-left">
        <h1 className="font-display text-3xl font-bold text-white mb-1">My Cards</h1>
        <p className="text-navy-300 text-sm">Manage your payment cards and spending limits</p>
      </div>

      {/* Card Selector */}
      <div className="flex gap-3 mb-8 animate-slide-up flex-wrap items-center">
        {cards.map((c, i) => (
          <button
            key={c.id}
            onClick={() => { setSelectedCard(i); setShowDetails(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedCard === i
                ? "bg-gold-500 text-navy-900"
                : "glass text-navy-300 hover:text-white"
            }`}
          >
            <CreditCard size={15} />
            {c.type}
          </button>
        ))}
        <button 
          onClick={() => {
            setActiveModal("add_card");
            setCustomName(user.name);
          }}
          className="glass px-4 py-2.5 rounded-xl text-sm text-navy-300 hover:text-white transition-all flex items-center gap-2"
        >
          + Add Card
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 text-left">
        {/* Card Visual */}
        <div className="space-y-5 animate-slide-up">
          <CardVisual
            card={card}
            showDetails={showDetails}
            onToggle={() => setShowDetails(!showDetails)}
            frozen={card.frozen}
          />
          <p className="text-center text-navy-400 text-xs">
            {showDetails ? "Click card to hide details" : "Click card to reveal details"}
          </p>

          {/* Card Actions */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="glass-card rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-navy-600/30 transition-all"
            >
              {showDetails ? <EyeOff size={18} className="text-gold-400" /> : <Eye size={18} className="text-gold-400" />}
              <span className="text-navy-300 text-xs">{showDetails ? "Hide" : "Show"} CVV</span>
            </button>
            <button
              onClick={toggleFreeze}
              className="glass-card rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-navy-600/30 transition-all"
            >
              {card.frozen ? <Unlock size={18} className="text-green-400" /> : <Lock size={18} className="text-red-400" />}
              <span className="text-navy-300 text-xs">{card.frozen ? "Unfreeze" : "Freeze"}</span>
            </button>
            <button 
              onClick={() => setActiveModal("replace")}
              className="glass-card rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-navy-600/30 transition-all"
            >
              <RefreshCw size={18} className="text-blue-400" />
              <span className="text-navy-300 text-xs">Replace</span>
            </button>
          </div>
        </div>

        {/* Card Details */}
        <div className="space-y-5 animate-slide-up">
          {/* Balance */}
          <div className="glass-card rounded-2xl p-6">
            <div className="text-navy-400 text-xs font-mono uppercase tracking-widest mb-2">Available Balance</div>
            <div className="font-display text-4xl font-bold text-white mb-1">
              ${card.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-navy-400 text-xs mb-4">Credit Limit: ${card.limit.toLocaleString()}</div>
            <div className="h-2 bg-navy-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
                style={{ width: `${card.limit ? (card.balance / card.limit) * 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-navy-400 mt-1.5">
              <span>Used: ${(card.limit - card.balance).toLocaleString()}</span>
              <span>{card.limit ? ((card.balance / card.limit) * 100).toFixed(0) : 0}% available</span>
            </div>
          </div>

          {/* Card Info */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="font-display text-lg font-semibold text-white">Card Details</h3>
            {[
              { label: "Card Number", value: showDetails ? card.number : "•••• •••• •••• " + card.number.slice(-4) },
              { label: "CVV", value: showDetails ? card.cvv : "•••" },
              { label: "Expiry Date", value: card.expiry },
              { label: "Card Type", value: card.type },
              { label: "Status", value: card.frozen ? "Frozen" : "Active" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-navy-700/30 last:border-0">
                <span className="text-navy-400 text-sm">{item.label}</span>
                <span className={`text-sm font-mono font-medium ${
                  item.label === "Status"
                    ? card.frozen ? "text-blue-400" : "text-green-400"
                    : "text-white"
                }`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Spending Limits */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold text-white mb-4">Spending Controls</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-navy-300">Daily Limit</span>
                  <span className="text-white font-mono font-semibold">${dailyLimit.toLocaleString()}</span>
                </div>
                <input
                  type="range" min={500} max={25000} step={250}
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(Number(e.target.value))}
                  className="w-full accent-gold-500 h-1.5 rounded-full appearance-none bg-navy-700/50 cursor-pointer"
                />
                <div className="text-navy-500 text-xs mt-1">Maximum allowed per day</div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-navy-300">Online Limit</span>
                  <span className="text-white font-mono font-semibold">${onlineLimit.toLocaleString()}</span>
                </div>
                <input
                  type="range" min={100} max={15000} step={100}
                  value={onlineLimit}
                  onChange={(e) => setOnlineLimit(Number(e.target.value))}
                  className="w-full accent-gold-500 h-1.5 rounded-full appearance-none bg-navy-700/50 cursor-pointer"
                />
                <div className="text-navy-500 text-xs mt-1">E-commerce transaction limit</div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-navy-300">ATM Limit</span>
                  <span className="text-white font-mono font-semibold">${atmLimit.toLocaleString()}</span>
                </div>
                <input
                  type="range" min={100} max={5000} step={100}
                  value={atmLimit}
                  onChange={(e) => setAtmLimit(Number(e.target.value))}
                  className="w-full accent-gold-500 h-1.5 rounded-full appearance-none bg-navy-700/50 cursor-pointer"
                />
                <div className="text-navy-500 text-xs mt-1">Daily ATM withdrawal limit</div>
              </div>

              <button
                onClick={() => updateCardLimits(card.id, dailyLimit, onlineLimit, atmLimit)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 font-semibold text-xs hover:opacity-90 transition-all mt-2"
              >
                Apply Limits
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
