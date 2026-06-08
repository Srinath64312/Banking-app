import React, { useState, useEffect } from "react";
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, Calendar } from "lucide-react";
import { useBanking } from "../context/BankingContext";

const categories = ["All", "Income", "Entertainment", "Groceries", "Transfer", "Utilities", "Transport", "Housing", "Food", "Investment"];

const Transactions = () => {
  const { transactions } = useBanking();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filtered, setFiltered] = useState(transactions);
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    let results = [...transactions];
    if (search) {
      results = results.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCategory !== "All") {
      results = results.filter((t) => {
        if (selectedCategory === "Income") return t.type === "credit";
        return t.category === selectedCategory;
      });
    }
    if (sortOrder === "newest") {
      results = [...results].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOrder === "oldest") {
      results = [...results].sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOrder === "highest") {
      results = [...results].sort((a, b) => b.amount - a.amount);
    }
    setFiltered(results);
  }, [search, selectedCategory, sortOrder]);

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Type", "Amount", "Date", "Category", "Status"];
    const rows = filtered.map(t => [t.id, `"${t.name}"`, t.type, t.amount, t.date, t.category, t.status]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `novabanque_transactions_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalCredit = filtered.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalDebit = filtered.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto">
      <div className="mb-8 animate-slide-up">
        <h1 className="font-display text-3xl font-bold text-white mb-1">Transactions</h1>
        <p className="text-navy-300 text-sm">Your complete financial history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8 animate-slide-up">
        <div className="glass-card rounded-xl p-4">
          <div className="text-navy-400 text-xs mb-1">Total In</div>
          <div className="font-display text-xl font-bold text-green-400">+${totalCredit.toFixed(2)}</div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="text-navy-400 text-xs mb-1">Total Out</div>
          <div className="font-display text-xl font-bold text-red-400">-${totalDebit.toFixed(2)}</div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="text-navy-400 text-xs mb-1">Net</div>
          <div className={`font-display text-xl font-bold ${totalCredit - totalDebit >= 0 ? "text-white" : "text-red-400"}`}>
            ${(totalCredit - totalDebit).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-5 mb-6 animate-slide-up">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-navy-800/50 border border-navy-600/30 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-navy-500 focus:outline-none focus:border-navy-400 transition-colors"
            />
          </div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-navy-800/50 border border-navy-600/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-navy-400 transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
          </select>
          <button onClick={handleExportCSV} className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl text-sm text-navy-200 hover:text-white hover:bg-navy-600/40 transition-all">
            <Download size={15} /> Export
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 flex-wrap mt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-gold-500 text-navy-900"
                  : "glass text-navy-300 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="glass-card rounded-2xl overflow-hidden animate-slide-up">
        <div className="divide-y divide-navy-700/30">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-navy-400">
              <div className="text-4xl mb-3">🔍</div>
              <div className="text-sm">No transactions found</div>
            </div>
          ) : (
            filtered.map((tx, idx) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-navy-700/20 transition-all cursor-pointer"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="w-11 h-11 rounded-xl glass flex items-center justify-center text-xl flex-shrink-0">
                  {tx.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium">{tx.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-navy-400 text-xs">{tx.date}</span>
                    <span className="text-navy-600 text-xs">•</span>
                    <span className="text-navy-400 text-xs">{tx.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      tx.status === "Completed"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {tx.status}
                  </span>
                  <div className={`flex items-center gap-1 font-mono font-semibold text-sm ${tx.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                    {tx.type === "credit" ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                    ${tx.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
