import React, { useState, useEffect } from "react";
import { Calculator, CheckCircle } from "lucide-react";
import { useBanking } from "../context/BankingContext";

const Loans = () => {
  const { loans: activeLoans, addNewLoan, makeLoanPayment, addToast, user } = useBanking();
  const [loanAmount, setLoanAmount] = useState(10000);
  const [loanTerm, setLoanTerm] = useState(36);
  const [interestRate, setInterestRate] = useState(6.5);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    const r = interestRate / 100 / 12;
    const n = loanTerm;
    const p = loanAmount;
    if (r === 0) {
      const mp = p / n;
      setMonthlyPayment(mp);
      setTotalPayment(mp * n);
      setTotalInterest(0);
    } else {
      const mp = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setMonthlyPayment(mp);
      setTotalPayment(mp * n);
      setTotalInterest(mp * n - p);
    }
  }, [loanAmount, loanTerm, interestRate]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto">
      <div className="mb-8 animate-slide-up">
        <h1 className="font-display text-3xl font-bold text-white mb-1">Loans</h1>
        <p className="text-navy-300 text-sm">Manage your loans and calculate new ones</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Loans */}
        <div className="space-y-5 animate-slide-up">
          <h2 className="font-display text-xl font-semibold text-white">Active Loans</h2>
          {activeLoans.map((loan) => {
            const progress = ((loan.total - loan.remaining) / loan.total) * 100;
            return (
              <div key={loan.id} className="glass-card rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-gold-400 text-xs font-mono uppercase tracking-widest">{loan.type}</span>
                    <h3 className="font-display text-lg font-semibold text-white">{loan.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-green-400 text-xs glass px-2 py-1 rounded-full">
                    <CheckCircle size={12} /> Active
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <div className="text-navy-400 text-xs mb-1">Remaining</div>
                    <div className="font-display text-xl font-bold text-white">${loan.remaining.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-navy-400 text-xs mb-1">Monthly Payment</div>
                    <div className="font-display text-xl font-bold text-white">${loan.monthly}</div>
                  </div>
                  <div>
                    <div className="text-navy-400 text-xs mb-1">Interest Rate</div>
                    <div className="text-white font-semibold">{loan.rate}% APR</div>
                  </div>
                  <div>
                    <div className="text-navy-400 text-xs mb-1">Next Payment</div>
                    <div className="text-white font-semibold text-sm">{loan.nextPayment}</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-navy-400 mb-1.5">
                    <span>Paid: ${(loan.total - loan.remaining).toLocaleString()}</span>
                    <span>{progress.toFixed(0)}% paid off</span>
                  </div>
                  <div className="h-2 bg-navy-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (loan.monthly > user.totalBalance) {
                      addToast("Insufficient funds for payment", "error");
                      return;
                    }
                    makeLoanPayment(loan.id, loan.monthly);
                  }}
                  className="mt-4 w-full py-2.5 rounded-xl glass text-navy-200 text-sm hover:bg-navy-600/40 transition-all"
                >
                  Make a Payment
                </button>
              </div>
            );
          })}
        </div>

        {/* Loan Calculator */}
        <div className="animate-slide-up">
          <h2 className="font-display text-xl font-semibold text-white mb-5">Loan Calculator</h2>
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-gold-400 mb-2">
              <Calculator size={18} />
              <span className="text-sm font-medium">Estimate your payments</span>
            </div>

            {/* Amount Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-navy-300 text-sm">Loan Amount</label>
                <span className="text-white font-mono font-semibold">${loanAmount.toLocaleString()}</span>
              </div>
              <input
                type="range" min={1000} max={100000} step={500}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-gold-500 h-2 rounded-full appearance-none bg-navy-700/50 cursor-pointer"
              />
              <div className="flex justify-between text-navy-500 text-xs mt-1">
                <span>$1,000</span><span>$100,000</span>
              </div>
            </div>

            {/* Term Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-navy-300 text-sm">Loan Term</label>
                <span className="text-white font-mono font-semibold">{loanTerm} months</span>
              </div>
              <input
                type="range" min={6} max={360} step={6}
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full accent-gold-500 h-2 rounded-full appearance-none bg-navy-700/50 cursor-pointer"
              />
              <div className="flex justify-between text-navy-500 text-xs mt-1">
                <span>6 mo</span><span>360 mo</span>
              </div>
            </div>

            {/* Interest Rate Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-navy-300 text-sm">Interest Rate</label>
                <span className="text-white font-mono font-semibold">{interestRate}%</span>
              </div>
              <input
                type="range" min={1} max={20} step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-gold-500 h-2 rounded-full appearance-none bg-navy-700/50 cursor-pointer"
              />
              <div className="flex justify-between text-navy-500 text-xs mt-1">
                <span>1%</span><span>20%</span>
              </div>
            </div>

            {/* Results */}
            <div className="glass rounded-xl p-5 space-y-3 border border-gold-500/20">
              <div className="flex justify-between items-center">
                <span className="text-navy-300 text-sm">Monthly Payment</span>
                <span className="font-display text-2xl font-bold text-gold-400">
                  ${monthlyPayment.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-navy-700/30 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-navy-400">Total Repayment</span>
                  <span className="text-white font-mono">${totalPayment.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-navy-400">Total Interest</span>
                  <span className="text-red-400 font-mono">${totalInterest.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => addNewLoan(loanAmount, loanTerm, interestRate, monthlyPayment)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 font-semibold text-sm hover:opacity-90 transition-all"
            >
              Apply for This Loan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loans;
