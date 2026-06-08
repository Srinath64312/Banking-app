import React, { createContext, useState, useContext, useCallback } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const BankingContext = createContext();

export const useBanking = () => useContext(BankingContext);

export const BankingProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "Alex Morgan",
    totalBalance: 48290.50,
  });

  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const [transactions, setTransactions] = useState([
    { id: 1, name: "Netflix Subscription", type: "debit", amount: 15.99, date: "2026-05-17", category: "Entertainment", icon: "🎬", status: "Completed" },
    { id: 2, name: "Salary Deposit", type: "credit", amount: 4850.00, date: "2026-05-16", category: "Income", icon: "💼", status: "Completed" },
    { id: 3, name: "Whole Foods Market", type: "debit", amount: 87.43, date: "2026-05-15", category: "Groceries", icon: "🛒", status: "Completed" },
    { id: 4, name: "Transfer from Mike", type: "credit", amount: 200.00, date: "2026-05-14", category: "Transfer", icon: "↗️", status: "Completed" },
    { id: 5, name: "Spotify Premium", type: "debit", amount: 9.99, date: "2026-05-13", category: "Entertainment", icon: "🎵", status: "Completed" },
    { id: 6, name: "Electric Bill", type: "debit", amount: 124.70, date: "2026-05-12", category: "Utilities", icon: "⚡", status: "Completed" },
    { id: 7, name: "Uber Ride", type: "debit", amount: 22.50, date: "2026-05-11", category: "Transport", icon: "🚗", status: "Completed" },
    { id: 8, name: "ATM Withdrawal", type: "debit", amount: 100.00, date: "2026-05-10", category: "Cash", icon: "🏧", status: "Completed" },
    { id: 9, name: "Freelance Payment", type: "credit", amount: 750.00, date: "2026-05-09", category: "Income", icon: "💻", status: "Completed" },
    { id: 10, name: "Rent Payment", type: "debit", amount: 1800.00, date: "2026-05-01", category: "Housing", icon: "🏠", status: "Completed" },
    { id: 11, name: "Coffee Shop", type: "debit", amount: 6.75, date: "2026-05-08", category: "Food", icon: "☕", status: "Completed" },
    { id: 12, name: "Dividend Income", type: "credit", amount: 145.30, date: "2026-05-07", category: "Investment", icon: "📈", status: "Completed" },
  ]);

  const [cards, setCards] = useState([
    { id: 1, type: "Visa Gold", number: "4532 8821 4523 7821", holder: "Alex Morgan", expiry: "12/28", cvv: "342", balance: 48290.50, limit: 75000, color: "from-navy-700 via-navy-800 to-navy-900", accent: "#e6b800", frozen: false },
    { id: 2, type: "Mastercard Platinum", number: "5412 7531 9920 4290", holder: "Alex Morgan", expiry: "08/27", cvv: "891", balance: 12450.00, limit: 25000, color: "from-slate-700 via-slate-800 to-slate-900", accent: "#7f96d0", frozen: false },
  ]);

  const [loans, setLoans] = useState([
    { id: 1, name: "Home Mortgage", total: 320000, remaining: 248500, rate: 3.75, monthly: 1482, nextPayment: "Jun 1, 2026", type: "Mortgage" },
    { id: 2, name: "Auto Loan", total: 28000, remaining: 14200, rate: 5.2, monthly: 524, nextPayment: "May 25, 2026", type: "Auto" },
  ]);

  const updateCardFreeze = (id, frozen) => {
    setCards(cards.map(card => card.id === id ? { ...card, frozen } : card));
    addToast(`Card successfully ${frozen ? "frozen" : "unfrozen"}.`);
  };

  const addTransaction = (type, amount, name, category, icon) => {
    const newTx = {
      id: Date.now(),
      name, type, amount,
      date: new Date().toISOString().split('T')[0],
      category, icon, status: "Completed"
    };
    setTransactions(prev => [newTx, ...prev]);
    
    if (type === "credit") {
      setUser(prev => ({ ...prev, totalBalance: prev.totalBalance + amount }));
    } else {
      setUser(prev => ({ ...prev, totalBalance: prev.totalBalance - amount }));
    }
  };

  const [savingsGoal, setSavingsGoal] = useState({
    name: "New MacBook Pro",
    target: 3499.00,
    current: 2379.00
  });

  const [bills, setBills] = useState([
    { id: 1, name: "Electricity Bill", amount: 124.70, dueDate: "2026-06-15", category: "Utilities", icon: "⚡", paid: false },
    { id: 2, name: "Water Bill", amount: 45.20, dueDate: "2026-06-20", category: "Utilities", icon: "💧", paid: false },
    { id: 3, name: "High-Speed Internet", amount: 79.99, dueDate: "2026-06-10", category: "Utilities", icon: "🌐", paid: false },
    { id: 4, name: "Natural Gas Bill", amount: 65.40, dueDate: "2026-06-28", category: "Utilities", icon: "🔥", paid: false }
  ]);

  const [portfolio, setPortfolio] = useState([
    { symbol: "AAPL", name: "Apple Inc.", shares: 5, avgPrice: 175.50, type: "stock" },
    { symbol: "NVDA", name: "NVIDIA Corp.", shares: 10, avgPrice: 120.00, type: "stock" },
    { symbol: "BTC", name: "Bitcoin", shares: 0.05, avgPrice: 65000.00, type: "crypto" }
  ]);

  const fundSavingsGoal = (amount) => {
    if (amount > user.totalBalance) {
      addToast("Insufficient funds to transfer.", "error");
      return false;
    }
    setUser(prev => ({ ...prev, totalBalance: prev.totalBalance - amount }));
    setSavingsGoal(prev => ({ ...prev, current: Math.min(prev.target, prev.current + amount) }));
    addTransaction("debit", amount, "Funded Savings Goal", "Savings", "🎯");
    addToast(`Transferred $${amount} to savings goal.`);
    return true;
  };

  const withdrawSavingsGoal = (amount) => {
    if (amount > savingsGoal.current) {
      addToast("Cannot withdraw more than saved.", "error");
      return false;
    }
    setSavingsGoal(prev => ({ ...prev, current: Math.max(0, prev.current - amount) }));
    setUser(prev => ({ ...prev, totalBalance: prev.totalBalance + amount }));
    addTransaction("credit", amount, "Withdrew from Savings Goal", "Savings", "🎯");
    addToast(`Withdrew $${amount} from savings goal.`);
    return true;
  };

  const payBill = (billId) => {
    const bill = bills.find(b => b.id === billId);
    if (!bill) return;
    if (bill.paid) {
      addToast("Bill already paid.", "error");
      return;
    }
    if (bill.amount > user.totalBalance) {
      addToast("Insufficient funds to pay bill.", "error");
      return;
    }
    setUser(prev => ({ ...prev, totalBalance: prev.totalBalance - bill.amount }));
    setBills(prev => prev.map(b => b.id === billId ? { ...b, paid: true } : b));
    addTransaction("debit", bill.amount, bill.name, "Utilities", bill.icon);
    addToast(`Successfully paid ${bill.name}!`);
  };

  const buyAsset = (symbol, name, type, shares, currentPrice) => {
    const cost = shares * currentPrice;
    if (cost > user.totalBalance) {
      addToast("Insufficient funds to purchase asset.", "error");
      return false;
    }
    
    setUser(prev => ({ ...prev, totalBalance: prev.totalBalance - cost }));
    
    setPortfolio(prev => {
      const existing = prev.find(item => item.symbol === symbol);
      if (existing) {
        const newShares = existing.shares + shares;
        const newAvg = ((existing.shares * existing.avgPrice) + cost) / newShares;
        return prev.map(item => item.symbol === symbol ? { ...item, shares: newShares, avgPrice: newAvg } : item);
      } else {
        return [...prev, { symbol, name, shares, avgPrice: currentPrice, type }];
      }
    });

    addTransaction("debit", cost, `Bought ${shares} ${symbol}`, "Investment", "📈");
    addToast(`Successfully purchased ${shares} shares of ${symbol}.`);
    return true;
  };

  const sellAsset = (symbol, shares, currentPrice) => {
    const holding = portfolio.find(item => item.symbol === symbol);
    if (!holding || holding.shares < shares) {
      addToast("Insufficient holdings to sell.", "error");
      return false;
    }
    
    const revenue = shares * currentPrice;
    setUser(prev => ({ ...prev, totalBalance: prev.totalBalance + revenue }));
    
    setPortfolio(prev => {
      return prev.map(item => {
        if (item.symbol === symbol) {
          const remaining = item.shares - shares;
          return { ...item, shares: remaining };
        }
        return item;
      }).filter(item => item.shares > 0);
    });

    addTransaction("credit", revenue, `Sold ${shares} ${symbol}`, "Investment", "📉");
    addToast(`Successfully sold ${shares} shares of ${symbol}.`);
    return true;
  };

  const replaceCard = (cardId, reason) => {
    setCards(prev => prev.map(card => {
      if (card.id === cardId) {
        const brands = card.type.split(" ");
        const brand = brands[0] || "Visa";
        let prefix = "4532";
        if (brand === "Mastercard") prefix = "5412";
        if (brand === "Amex") prefix = "3782";

        return {
          ...card,
          number: `${prefix} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
          cvv: Math.floor(100 + Math.random() * 900).toString(),
          frozen: false
        };
      }
      return card;
    }));
    addToast(`Card replacement ordered (${reason}). New details issued!`);
  };

  const updateCardLimits = (cardId, dailyLimit, onlineLimit, atmLimit) => {
    addToast("Card spending controls successfully updated!");
  };

  const addNewCard = (brand = "Visa", cardType = "Virtual", colorGradient = "from-blue-600 via-blue-700 to-blue-900", cardLimit = 10000, customName = "Alex Morgan") => {
    let prefix = "4532";
    if (brand === "Mastercard") prefix = "5412";
    if (brand === "Amex") prefix = "3782";
    
    const newCard = {
      id: Date.now(),
      type: `${brand} ${cardType}`,
      number: `${prefix} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      holder: customName,
      expiry: "12/30",
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      balance: 0,
      limit: cardLimit,
      color: colorGradient,
      accent: brand === "Visa" ? "#60a5fa" : brand === "Mastercard" ? "#f87171" : "#fbbf24",
      frozen: false
    };
    setCards(prev => [...prev, newCard]);
    addToast(`New ${brand} ${cardType} card successfully issued!`);
  };

  const addNewLoan = (amount, term, rate, monthly) => {
    const newLoan = {
      id: Date.now(),
      name: "Personal Loan",
      total: amount,
      remaining: amount,
      rate,
      monthly: Math.round(monthly),
      nextPayment: new Date(Date.now() + 30*24*60*60*1000).toDateString(),
      type: "Personal"
    };
    setLoans(prev => [...prev, newLoan]);
    addTransaction("credit", amount, "Loan Disbursement", "Loan", "🏦");
    addToast("Loan approved and funds deposited.");
  };

  const makeLoanPayment = (loanId, amount) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        return { ...loan, remaining: Math.max(0, loan.remaining - amount) };
      }
      return loan;
    }));
    addTransaction("debit", amount, "Loan Payment", "Payment", "💳");
    addToast("Loan payment successful!");
  };

  return (
    <BankingContext.Provider value={{ 
      user, transactions, cards, loans, savingsGoal, bills, portfolio,
      updateCardFreeze, addTransaction, addNewCard, addNewLoan, makeLoanPayment, addToast,
      fundSavingsGoal, withdrawSavingsGoal, payBill, buyAsset, sellAsset, replaceCard, updateCardLimits
    }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className="glass card-shine px-4 py-3 rounded-xl flex items-center gap-3 animate-slide-up shadow-xl shadow-navy-900/50 border border-navy-500/30">
            {t.type === "success" ? <CheckCircle size={18} className="text-green-400" /> : <XCircle size={18} className="text-red-400" />}
            <span className="text-white text-sm font-medium">{t.message}</span>
          </div>
        ))}
      </div>
    </BankingContext.Provider>
  );
};
