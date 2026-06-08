import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign, Wallet, ArrowUpRight, ArrowDownLeft, Shield } from "lucide-react";
import { useBanking } from "../context/BankingContext";

const INITIAL_MARKET = [
  { symbol: "AAPL", name: "Apple Inc.", type: "stock", price: 178.45, change: 1.2 },
  { symbol: "NVDA", name: "NVIDIA Corp.", type: "stock", price: 124.30, change: 3.4 },
  { symbol: "TSLA", name: "Tesla Inc.", type: "stock", price: 184.80, change: -2.1 },
  { symbol: "MSFT", name: "Microsoft Corp.", type: "stock", price: 415.60, change: 0.5 },
  { symbol: "BTC", name: "Bitcoin", type: "crypto", price: 68450.00, change: 2.7 },
  { symbol: "ETH", name: "Ethereum", type: "crypto", price: 3740.00, change: 1.8 },
  { symbol: "SOL", name: "Solana", type: "crypto", price: 165.20, change: -4.3 }
];

const Investments = () => {
  const { user, portfolio, buyAsset, sellAsset, addToast } = useBanking();
  const [market, setMarket] = useState(INITIAL_MARKET);
  const [selectedAsset, setSelectedAsset] = useState("NVDA");
  const [tradeType, setTradeType] = useState("buy");
  const [sharesInput, setSharesInput] = useState("");
  
  // Track chart price history for each asset
  const [history, setHistory] = useState(() => {
    const initialHist = {};
    INITIAL_MARKET.forEach(a => {
      // pre-populate with 8 items close to the current price for a realistic graph
      const arr = [];
      let current = a.price;
      for (let i = 0; i < 8; i++) {
        current = current * (1 + (Math.random() * 0.04 - 0.02));
        arr.push(current);
      }
      arr.push(a.price); // latest
      initialHist[a.symbol] = arr;
    });
    return initialHist;
  });

  // Price fluctuation simulation (Random Walk)
  useEffect(() => {
    const interval = setInterval(() => {
      setMarket(prevMarket => {
        const updated = prevMarket.map(asset => {
          const pct = (Math.random() * 2.4 - 1.2) / 100; // -1.2% to +1.2% fluctuation
          const newPrice = Number((asset.price * (1 + pct)).toFixed(asset.type === "crypto" ? 2 : 2));
          const change = Number((pct * 100).toFixed(2));
          
          // Update history
          setHistory(prevHist => {
            const h = prevHist[asset.symbol] || [asset.price];
            const updatedH = [...h.slice(-9), newPrice]; // keep last 10 entries
            return { ...prevHist, [asset.symbol]: updatedH };
          });

          return {
            ...asset,
            price: newPrice,
            change: change
          };
        });
        return updated;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const activeAsset = market.find(a => a.symbol === selectedAsset) || market[0];
  const activeHistory = history[selectedAsset] || [activeAsset.price];
  const isUp = activeAsset.change >= 0;

  // Calculate SVG line points for chart
  const minVal = Math.min(...activeHistory);
  const maxVal = Math.max(...activeHistory);
  const range = maxVal - minVal || 1;
  const padding = range * 0.1;
  const chartMin = minVal - padding;
  const chartMax = maxVal + padding;
  const chartRange = chartMax - chartMin;
  
  const width = 500;
  const height = 180;
  
  const points = activeHistory.map((val, idx) => {
    const x = (idx / (activeHistory.length - 1)) * width;
    const y = height - ((val - chartMin) / chartRange) * (height - 30) - 15;
    return `${x},${y}`;
  }).join(" ");

  // SVG Area fill path points
  const areaPoints = `${points} ${width},${height} 0,${height}`;

  // Calculate user total portfolio value
  const totalHoldingsValue = portfolio.reduce((total, item) => {
    const marketAsset = market.find(a => a.symbol === item.symbol);
    const currentPrice = marketAsset ? marketAsset.price : item.avgPrice;
    return total + (item.shares * currentPrice);
  }, 0);

  const totalInvestedValue = portfolio.reduce((total, item) => {
    return total + (item.shares * item.avgPrice);
  }, 0);

  const netReturn = totalHoldingsValue - totalInvestedValue;
  const netReturnPct = totalInvestedValue ? (netReturn / totalInvestedValue) * 100 : 0;

  // Handle Trade Execution
  const handleTrade = (e) => {
    e.preventDefault();
    const qty = parseFloat(sharesInput);
    if (isNaN(qty) || qty <= 0) {
      addToast("Please enter a valid quantity.", "error");
      return;
    }

    if (tradeType === "buy") {
      const success = buyAsset(activeAsset.symbol, activeAsset.name, activeAsset.type, qty, activeAsset.price);
      if (success) setSharesInput("");
    } else {
      const success = sellAsset(activeAsset.symbol, qty, activeAsset.price);
      if (success) setSharesInput("");
    }
  };

  const currentHolding = portfolio.find(p => p.symbol === activeAsset.symbol);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Ticker Tape */}
      <div className="glass rounded-xl px-4 py-3 mb-8 overflow-hidden relative border border-navy-500/20">
        <div className="flex gap-8 animate-marquee whitespace-nowrap text-xs font-mono">
          {market.map(asset => (
            <div key={asset.symbol} className="inline-flex items-center gap-2 cursor-pointer hover:text-white transition-colors" onClick={() => setSelectedAsset(asset.symbol)}>
              <span className="text-white font-semibold">{asset.symbol}</span>
              <span className="text-navy-300">${asset.price.toLocaleString()}</span>
              <span className={`flex items-center text-[10px] ${asset.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                {asset.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {asset.change >= 0 ? "+" : ""}{asset.change}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Header Summary */}
      <div className="grid md:grid-cols-3 gap-6 mb-8 animate-slide-up">
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
          <div>
            <span className="text-navy-400 text-xs font-mono uppercase tracking-wider block mb-1">Portfolio Balance</span>
            <span className="font-display text-2xl font-bold text-white">${totalHoldingsValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            <div className="text-xs text-navy-400 mt-1">Total Invested: ${totalInvestedValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-900 shadow-lg">
            <Wallet size={20} />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
          <div>
            <span className="text-navy-400 text-xs font-mono uppercase tracking-wider block mb-1">Total Return</span>
            <span className={`font-display text-2xl font-bold ${netReturn >= 0 ? "text-green-400" : "text-red-400"}`}>
              {netReturn >= 0 ? "+" : ""}${netReturn.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <span className={`text-xs flex items-center gap-1 font-semibold mt-1 ${netReturn >= 0 ? "text-green-400" : "text-red-400"}`}>
              {netReturn >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {netReturn >= 0 ? "+" : ""}{netReturnPct.toFixed(2)}%
            </span>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-navy-900 shadow-lg ${netReturn >= 0 ? "bg-green-500" : "bg-red-500"}`}>
            {netReturn >= 0 ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
          <div>
            <span className="text-navy-400 text-xs font-mono uppercase tracking-wider block mb-1">Buying Power (Cash)</span>
            <span className="font-display text-2xl font-bold text-white">${user.totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
              <Shield size={12} /> 256-bit Secure Wallet
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shadow-lg">
            <DollarSign size={20} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Market Graph */}
        <div className="lg:col-span-2 space-y-6 animate-slide-up">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-lg bg-navy-700 text-navy-200">{activeAsset.type}</span>
                  <h2 className="font-display text-2xl font-bold text-white">{activeAsset.name}</h2>
                  <span className="text-lg font-bold text-navy-400 font-mono">{activeAsset.symbol}</span>
                </div>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="font-display text-3xl font-extrabold text-white">${activeAsset.price.toLocaleString()}</span>
                  <span className={`flex items-center text-sm font-semibold ${isUp ? "text-green-400" : "text-red-400"}`}>
                    {isUp ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                    {isUp ? "+" : ""}{activeAsset.change}%
                  </span>
                </div>
              </div>
              
              {/* Asset Selector */}
              <div className="flex gap-1.5 glass rounded-xl p-1 max-w-full overflow-x-auto">
                {market.map(asset => (
                  <button
                    key={asset.symbol}
                    onClick={() => {
                      setSelectedAsset(asset.symbol);
                      setSharesInput("");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedAsset === asset.symbol ? "bg-gold-500 text-navy-900" : "text-navy-300 hover:text-white"
                    }`}
                  >
                    {asset.symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Price Chart */}
            <div className="relative mt-2 h-48 w-full bg-navy-950/40 rounded-xl overflow-hidden border border-navy-800/30">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isUp ? "#10b981" : "#f43f5e"} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={isUp ? "#10b981" : "#f43f5e"} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {/* Horizontal Guide Lines */}
                <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke="#152b6b" strokeWidth="0.5" strokeDasharray="4 4" />
                <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} stroke="#152b6b" strokeWidth="0.5" strokeDasharray="4 4" />
                <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke="#152b6b" strokeWidth="0.5" strokeDasharray="4 4" />

                {/* Fill Area */}
                <polygon points={areaPoints} fill="url(#chartGlow)" />

                {/* Plot Line */}
                <polyline points={points} fill="none" stroke={isUp ? "#10b981" : "#f43f5e"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              
              {/* Floating indicators */}
              <div className="absolute top-3 right-3 text-[10px] font-mono text-navy-400 bg-navy-900/60 px-2 py-0.5 rounded border border-navy-800/30">
                Peak: ${chartMax.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className="absolute bottom-3 right-3 text-[10px] font-mono text-navy-400 bg-navy-900/60 px-2 py-0.5 rounded border border-navy-800/30">
                Floor: ${chartMin.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* User Holdings Table */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold text-white mb-5">Your Asset Holdings</h3>
            {portfolio.length === 0 ? (
              <div className="text-center py-12 text-navy-400">
                <span className="text-4xl block mb-2">📈</span>
                <span className="text-sm">You do not own any stocks or cryptocurrencies yet.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-navy-200">
                  <thead className="text-xs uppercase font-mono tracking-wider text-navy-400 border-b border-navy-700/30 pb-2">
                    <tr>
                      <th className="py-3">Asset</th>
                      <th className="py-3">Balance</th>
                      <th className="py-3 text-right">Avg Buy Price</th>
                      <th className="py-3 text-right">Current Price</th>
                      <th className="py-3 text-right">Total Return</th>
                      <th className="py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-700/20 font-medium">
                    {portfolio.map(holding => {
                      const mAsset = market.find(a => a.symbol === holding.symbol);
                      const curPrice = mAsset ? mAsset.price : holding.avgPrice;
                      const curVal = holding.shares * curPrice;
                      const costVal = holding.shares * holding.avgPrice;
                      const returnVal = curVal - costVal;
                      const returnPct = costVal ? (returnVal / costVal) * 100 : 0;
                      
                      return (
                        <tr key={holding.symbol} className="hover:bg-navy-700/10 transition-colors">
                          <td className="py-3.5">
                            <div>
                              <div className="font-semibold text-white">{holding.name}</div>
                              <div className="text-xs text-navy-400 font-mono">{holding.symbol}</div>
                            </div>
                          </td>
                          <td className="py-3.5 font-mono">
                            <div>{holding.shares.toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
                            <div className="text-xs text-navy-400">${curVal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                          </td>
                          <td className="py-3.5 text-right font-mono">${holding.avgPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                          <td className="py-3.5 text-right font-mono">${curPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                          <td className={`py-3.5 text-right font-mono ${returnVal >= 0 ? "text-green-400" : "text-red-400"}`}>
                            <div>{returnVal >= 0 ? "+" : ""}${returnVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            <div className="text-xs font-semibold">{returnVal >= 0 ? "+" : ""}{returnPct.toFixed(2)}%</div>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => {
                                setSelectedAsset(holding.symbol);
                                setTradeType("sell");
                                setSharesInput(holding.shares.toString());
                              }}
                              className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 hover:bg-red-500/25 rounded-lg transition-all"
                            >
                              Sell All
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Trade Widget */}
        <div className="animate-slide-up">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold text-white mb-5">Order Terminal</h3>
            
            {/* Toggle Buy / Sell */}
            <div className="grid grid-cols-2 gap-2 glass rounded-xl p-1 mb-6">
              <button
                onClick={() => { setTradeType("buy"); setSharesInput(""); }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  tradeType === "buy" ? "bg-green-500 text-navy-900" : "text-navy-300 hover:text-white"
                }`}
              >
                BUY
              </button>
              <button
                onClick={() => { setTradeType("sell"); setSharesInput(""); }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  tradeType === "sell" ? "bg-red-500 text-navy-900" : "text-navy-300 hover:text-white"
                }`}
              >
                SELL
              </button>
            </div>

            <form onSubmit={handleTrade} className="space-y-5">
              <div>
                <label className="text-navy-400 text-xs mb-1.5 block">Trading Asset</label>
                <div className="w-full bg-navy-800/50 border border-navy-600/30 rounded-xl px-4 py-3 flex items-center justify-between text-sm text-white">
                  <span className="font-bold">{activeAsset.symbol} - {activeAsset.name}</span>
                  <span className="font-mono font-semibold">${activeAsset.price.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-navy-400 text-xs mb-1.5 block">Quantity ({activeAsset.type === "crypto" ? "coins" : "shares"})</label>
                <input
                  type="number"
                  step="any"
                  min="0.0001"
                  placeholder="0.00"
                  value={sharesInput}
                  onChange={(e) => setSharesInput(e.target.value)}
                  className="w-full bg-navy-800/50 border border-navy-600/30 rounded-xl px-4 py-3 text-sm text-white placeholder-navy-500 focus:outline-none focus:border-navy-400 transition-colors"
                />
                {currentHolding && (
                  <div className="text-[10px] text-navy-400 mt-1.5 text-right font-mono">
                    Held: {currentHolding.shares.toLocaleString()} {activeAsset.symbol}
                  </div>
                )}
              </div>

              <div className="border-t border-navy-700/30 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-navy-400">Estimated cost</span>
                  <span className="text-white font-mono font-semibold">
                    ${((parseFloat(sharesInput) || 0) * activeAsset.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-400">Available cash</span>
                  <span className="text-white font-mono font-semibold">${user.totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-bold text-sm text-navy-900 transition-all ${
                  tradeType === "buy" ? "bg-gradient-to-r from-green-400 to-green-600" : "bg-gradient-to-r from-red-400 to-red-600"
                } hover:opacity-90`}
              >
                Place {tradeType.toUpperCase()} Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investments;
