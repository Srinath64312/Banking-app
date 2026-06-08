import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight, ArrowDownLeft, Send, Plus, Eye, EyeOff,
  TrendingUp, Bell, CreditCard, DollarSign, Activity,
} from "lucide-react";

import { useBanking } from "../context/BankingContext";

const quickActions = [
  { label: "Send Money", icon: <Send size={20} />, color: "from-blue-500 to-navy-600" },
  { label: "Add Money", icon: <Plus size={20} />, color: "from-green-500 to-green-700" },
  { label: "Pay Bills", icon: <DollarSign size={20} />, color: "from-purple-500 to-purple-700" },
  { label: "Analytics", icon: <Activity size={20} />, color: "from-gold-500 to-gold-600" },
];

const Dashboard = () => {
  const { 
    user, transactions, cards, addNewCard, addTransaction, addToast, 
    savingsGoal, bills, payBill, fundSavingsGoal, withdrawSavingsGoal 
  } = useBanking();
  
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [notifications, setNotifications] = useState(3);
  const [activeTab, setActiveTab] = useState("All");

  const [activeModal, setActiveModal] = useState(null); // 'send' | 'add' | 'savings' | 'pay_bills'
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [savingsAction, setSavingsAction] = useState("deposit"); // 'deposit' | 'withdraw'

  const recentTransactions = transactions.slice(0, 6);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Calculate dynamic spending breakdown from actual transaction category debits
  const debits = transactions.filter(t => t.type === "debit");
  const totalDebitAmt = debits.reduce((acc, t) => acc + t.amount, 0);

  const categoriesConfig = {
    Housing: { color: "#5473c0" },
    Food: { color: "#f0c84a" },
    Transport: { color: "#7f96d0" },
    Entertainment: { color: "#e6b800" },
    Utilities: { color: "#a855f7" },
    Others: { color: "#2a50b0" }
  };

  const categoriesMap = {};
  debits.forEach(t => {
    const cat = categoriesConfig[t.category] ? t.category : "Others";
    categoriesMap[cat] = (categoriesMap[cat] || 0) + t.amount;
  });

  const spendingCategories = Object.keys(categoriesConfig).map(label => {
    const amt = categoriesMap[label] || 0;
    const pct = totalDebitAmt > 0 ? Math.round((amt / totalDebitAmt) * 100) : 0;
    return {
      label,
      pct,
      color: categoriesConfig[label].color
    };
  });

  const filteredTx =
    activeTab === "All"
      ? recentTransactions
      : activeTab === "Income"
      ? recentTransactions.filter((t) => t.type === "credit")
      : recentTransactions.filter((t) => t.type === "debit");

  const handleActionClick = (label) => {
    if (label === "Send Money") setActiveModal("send");
    else if (label === "Add Money") setActiveModal("add");
    else if (label === "Pay Bills") setActiveModal("pay_bills");
    else if (label === "Analytics") navigate("/investments");
    else addToast("Feature coming soon!", "success");
  };

  const handleModalSubmit = () => {
    const numAmount = parseFloat(amount);
    
    if (activeModal === "savings") {
      if (!numAmount || numAmount <= 0) return addToast("Please enter a valid amount.", "error");
      let success = false;
      if (savingsAction === "deposit") {
        success = fundSavingsGoal(numAmount);
      } else {
        success = withdrawSavingsGoal(numAmount);
      }
      if (success) {
        setActiveModal(null);
        setAmount("");
      }
      return;
    }

    if (!numAmount || numAmount <= 0) return addToast("Please enter a valid amount.", "error");

    if (activeModal === "send") {
      if (!recipient) return addToast("Please enter a recipient.", "error");
      if (numAmount > user.totalBalance) return addToast("Insufficient funds.", "error");
      addTransaction("debit", numAmount, `Transfer to ${recipient}`, "Transfer", "↗️");
      addToast(`Successfully sent $${numAmount} to ${recipient}.`);
    } else if (activeModal === "add") {
      addTransaction("credit", numAmount, "Account Deposit", "Income", "💼");
      addToast(`Successfully added $${numAmount} to your account.`);
    }

    setActiveModal(null);
    setAmount("");
    setRecipient("");
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto relative">
      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/80 backdrop-blur-sm px-4">
          <div className="glass-card w-full max-w-md p-6 rounded-2xl border border-navy-500/30 animate-slide-up shadow-2xl">
            <h3 className="font-display text-xl font-semibold text-white mb-4">
              {activeModal === "send" ? "Send Money" : activeModal === "add" ? "Add Money" : activeModal === "savings" ? "Manage Savings Goal" : "Pay Utility Bills"}
            </h3>
            
            {activeModal === "pay_bills" ? (
              <div className="space-y-4">
                <p className="text-xs text-navy-300">Select an unpaid utility bill to pay off directly from your bank balance:</p>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {bills.map(bill => (
                    <div key={bill.id} className="flex justify-between items-center p-3 rounded-xl glass border border-navy-600/20">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{bill.icon}</span>
                        <div>
                          <div className="text-white text-xs font-semibold text-left">{bill.name}</div>
                          <div className="text-[10px] text-navy-400 text-left">Due: {bill.dueDate}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-white">${bill.amount}</span>
                        {bill.paid ? (
                          <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-medium">Paid</span>
                        ) : (
                          <button
                            onClick={() => { payBill(bill.id); }}
                            className="px-2.5 py-1 bg-gold-500 hover:bg-gold-600 text-navy-900 text-[10px] font-bold rounded-lg transition-colors"
                          >
                            Pay
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {bills.every(b => b.paid) && (
                    <div className="text-center py-6 text-navy-400 text-xs">
                      🎉 All bills paid!
                    </div>
                  )}
                </div>
                <div className="pt-2">
                  <button onClick={() => { setActiveModal(null); }} className="w-full py-2 rounded-xl glass text-navy-200 text-sm hover:text-white transition-all">Close</button>
                </div>
              </div>
            ) : activeModal === "savings" ? (
              <div className="space-y-4">
                <div className="flex gap-2 glass rounded-xl p-1 mb-2">
                  <button
                    onClick={() => setSavingsAction("deposit")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${savingsAction === "deposit" ? "bg-gold-500 text-navy-900" : "text-navy-300"}`}
                  >
                    Deposit (Save)
                  </button>
                  <button
                    onClick={() => setSavingsAction("withdraw")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${savingsAction === "withdraw" ? "bg-gold-500 text-navy-900" : "text-navy-300"}`}
                  >
                    Withdraw (Spend)
                  </button>
                </div>
                <div>
                  <label className="text-navy-300 text-xs mb-1 block">Amount ($)</label>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-navy-800/50 border border-navy-600/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-navy-400 transition-colors" placeholder="0.00" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setActiveModal(null); setAmount(""); }} className="flex-1 py-2.5 rounded-xl glass text-navy-200 text-sm hover:text-white transition-all">Cancel</button>
                  <button onClick={handleModalSubmit} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 font-semibold text-sm hover:opacity-90 transition-all">Confirm</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {activeModal === "send" && (
                  <div>
                    <label className="text-navy-300 text-xs mb-1 block">Recipient Name / Email</label>
                    <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full bg-navy-800/50 border border-navy-600/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-navy-400 transition-colors" placeholder="e.g. John Doe" />
                  </div>
                )}
                <div>
                  <label className="text-navy-300 text-xs mb-1 block">Amount ($)</label>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-navy-800/50 border border-navy-600/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-navy-400 transition-colors" placeholder="0.00" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setActiveModal(null); setAmount(""); setRecipient(""); }} className="flex-1 py-2.5 rounded-xl glass text-navy-200 text-sm hover:text-white transition-all">Cancel</button>
                  <button onClick={handleModalSubmit} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 font-semibold text-sm hover:opacity-90 transition-all">Confirm</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-10 animate-slide-up">
        <div>
          <p className="text-navy-300 text-sm mb-1 font-mono">{greeting} 👋</p>
          <h1 className="font-display text-3xl font-bold text-white">{user.name}</h1>
        </div>
        <button
          className="relative glass p-3 rounded-xl hover:bg-navy-600/40 transition-all"
          onClick={() => setNotifications(0)}
        >
          <Bell size={20} className="text-white" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-500 text-navy-900 text-[10px] font-bold flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance Card */}
          <div className="glass-card card-shine rounded-2xl p-7 border border-navy-600/30 animate-slide-up">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2 text-navy-300 text-xs font-mono uppercase tracking-widest mb-2">
                  Total Balance
                  <button onClick={() => setBalanceVisible(!balanceVisible)} className="hover:text-white transition-colors">
                    {balanceVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
                <div className="font-display text-4xl font-bold text-white transition-all">
                  {balanceVisible ? (
                    <>${user.totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</>
                  ) : (
                    <span className="tracking-widest">••••••</span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-2 text-green-400 text-sm">
                  <TrendingUp size={14} />
                  <span>+2.4% this month</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-navy-400 text-xs mb-1 font-mono">CARD NUMBER</div>
                <div className="font-mono text-navy-200 text-sm">4532 •••• •••• 7821</div>
              </div>
            </div>
            {/* Mini stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-400 text-xs mb-1">
                  <ArrowDownLeft size={14} /> Income
                </div>
                <div className="font-display text-xl font-semibold text-white">$5,050.00</div>
                <div className="text-navy-400 text-xs">This month</div>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-400 text-xs mb-1">
                  <ArrowUpRight size={14} /> Expenses
                </div>
                <div className="font-display text-xl font-semibold text-white">$2,238.11</div>
                <div className="text-navy-400 text-xs">This month</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-6 animate-slide-up">
            <h3 className="font-display text-lg font-semibold text-white mb-5">Quick Actions</h3>
            <div className="grid grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleActionClick(action.label)}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
                    {action.icon}
                  </div>
                  <span className="text-navy-300 text-xs text-center group-hover:text-white transition-colors">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Transactions */}
          <div className="glass-card rounded-2xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg font-semibold text-white">Recent Transactions</h3>
              <div className="flex gap-1 glass rounded-lg p-1">
                {["All", "Income", "Expenses"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      activeTab === tab ? "bg-navy-600 text-white" : "text-navy-300 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              {filteredTx.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-navy-700/30 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-lg">
                    {tx.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{tx.name}</div>
                    <div className="text-navy-400 text-xs">{tx.date}</div>
                  </div>
                  <div className={`text-sm font-semibold font-mono ${tx.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                    {tx.type === "credit" ? "+" : "-"}${tx.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Spending Breakdown */}
          <div className="glass-card rounded-2xl p-6 animate-slide-up">
            <h3 className="font-display text-lg font-semibold text-white mb-5">Spending Breakdown</h3>
            {spendingCategories.map((cat) => (
              <div key={cat.label} className="mb-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-navy-300">{cat.label}</span>
                  <span className="text-white font-mono">{cat.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-navy-700/50 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Savings Goal */}
          <div className="glass-card rounded-2xl p-6 animate-slide-up">
            <h3 className="font-display text-lg font-semibold text-white mb-2">Savings Goal</h3>
            <p className="text-navy-400 text-xs mb-5">{savingsGoal.name} — ${savingsGoal.target.toLocaleString()}</p>
            <div className="relative w-32 h-32 mx-auto mb-5">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#152b6b" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="#e6b800" strokeWidth="3"
                  strokeDasharray={`${Math.round((savingsGoal.current / savingsGoal.target) * 100)} 100`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-bold text-white">
                  {Math.round((savingsGoal.current / savingsGoal.target) * 100)}%
                </span>
                <span className="text-navy-400 text-xs">saved</span>
              </div>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <div className="text-center">
                <div className="text-navy-400 text-xs mb-1">Saved</div>
                <div className="text-white font-semibold">${savingsGoal.current.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              </div>
              <div className="text-center">
                <div className="text-navy-400 text-xs mb-1">Remaining</div>
                <div className="text-white font-semibold">${Math.max(0, savingsGoal.target - savingsGoal.current).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              </div>
            </div>
            <button
              onClick={() => { setActiveModal("savings"); setSavingsAction("deposit"); }}
              className="w-full py-2.5 rounded-xl glass text-gold-400 text-xs font-semibold hover:text-white transition-all block text-center"
            >
              Transfer Funds
            </button>
          </div>

          {/* Linked Cards */}
          <div className="glass-card rounded-2xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-lg font-semibold text-white">My Cards</h3>
              <button onClick={addNewCard} className="text-gold-400 text-xs hover:text-gold-300 transition-colors">+ Add Card</button>
            </div>
            <div className="space-y-3">
              {cards.map((card) => (
                <div key={card.number} className={`bg-gradient-to-r ${card.color} rounded-xl p-4 border border-navy-600/30`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-navy-300 text-xs mb-1">{card.type}</div>
                      <div className="font-mono text-white text-sm">•••• {card.number.slice(-4)}</div>
                    </div>
                    <CreditCard size={20} className="text-gold-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
