import React, { useState } from "react";
import { MessageCircle, Phone, Mail, ChevronDown, ChevronUp, Send, CheckCircle } from "lucide-react";
import { useBanking } from "../context/BankingContext";

const faqs = [
  { q: "How do I transfer money internationally?", a: "Go to Dashboard → Quick Actions → Send Money. Select 'International Transfer', enter the recipient's IBAN/SWIFT and amount. Transfers typically complete within 1–2 business days." },
  { q: "What are the transfer limits?", a: "Daily transfer limit is $25,000 for personal accounts. You can request a temporary increase by contacting support with a valid reason." },
  { q: "How do I freeze or unfreeze my card?", a: "Navigate to Cards → select the card → click 'Freeze'. To unfreeze, click 'Unfreeze'. Changes take effect immediately." },
  { q: "Is my money FDIC insured?", a: "Yes, all deposits are insured up to $250,000 per account by the FDIC (Federal Deposit Insurance Corporation)." },
  { q: "How do I dispute a transaction?", a: "Go to Transactions → select the transaction → click 'Dispute'. Fill out the dispute form and our team will review within 3–5 business days." },
  { q: "Can I change my PIN?", a: "Yes! Go to Cards → select your card → scroll to Card Details → Change PIN. You'll receive a verification code to confirm the change." },
];

const Support = () => {
  const { user, addToast } = useBanking();
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  // Chatbot State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I am Nova, your virtual banking assistant. How can I help you today? You can ask me about freezing cards, checking balance, applying for loans, or trading stocks/cryptos."
    }
  ]);

  const handleSubmit = () => {
    if (form.name && form.email && form.message) {
      setSubmitted(true);
      addToast("Message successfully sent!", "success");
      setTimeout(() => setSubmitted(false), 4000);
      setForm({ name: "", email: "", subject: "", message: "" });
    } else {
      addToast("Please fill in all required fields.", "error");
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: chatInput.trim()
    };

    setChatMessages(prev => [...prev, userMsg]);
    const inputLower = chatInput.toLowerCase();
    setChatInput("");

    setTimeout(() => {
      let botReplyText = "";
      if (inputLower.includes("freeze") || inputLower.includes("unfreeze") || inputLower.includes("lock")) {
        botReplyText = "You can freeze or unfreeze any card instantly in the Cards tab. Simply select the card from the selector list and click the 'Freeze' or 'Unfreeze' action button.";
      } else if (inputLower.includes("balance") || inputLower.includes("money") || inputLower.includes("fund") || inputLower.includes("cash")) {
        botReplyText = `Your current total balance is $${user.totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}. You can transfer funds to your savings goal, pay utilities, or send money directly from the Dashboard.`;
      } else if (inputLower.includes("loan") || inputLower.includes("mortgage") || inputLower.includes("borrow")) {
        botReplyText = "NovaBanque offers personal, auto, and mortgage loans. Head over to the Loans tab to simulate payments with our EMI calculator and apply instantly.";
      } else if (inputLower.includes("invest") || inputLower.includes("stock") || inputLower.includes("crypto") || inputLower.includes("portfolio") || inputLower.includes("buy") || inputLower.includes("sell")) {
        botReplyText = "You can manage and trade assets in real-time in the new Investments tab! Monitor stock/crypto ticker tape updates and execute BUY/SELL orders using your cash balance.";
      } else if (inputLower.includes("hello") || inputLower.includes("hi") || inputLower.includes("hey")) {
        botReplyText = "Hello! How is your day going? Let me know what you need help with regarding your NovaBanque accounts.";
      } else {
        botReplyText = "I'm sorry, I didn't quite catch that. Could you ask me about 'freezing cards', 'checking balance', 'getting a loan', or 'trading stocks in the Investments tab'?";
      }

      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: "bot",
        text: botReplyText
      }]);
    }, 700);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto">
      {/* Chatbot Dialog */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/80 backdrop-blur-sm px-4">
          <div className="glass-card w-full max-w-md p-6 rounded-2xl border border-navy-500/30 animate-slide-up shadow-2xl flex flex-col h-[500px] text-left">
            <div className="flex justify-between items-center pb-3 border-b border-navy-700/30 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                <h3 className="font-display text-lg font-bold text-white">Nova Virtual Agent</h3>
              </div>
              <button 
                onClick={() => setChatOpen(false)} 
                className="text-navy-400 hover:text-white transition-colors text-sm font-semibold"
              >
                Close
              </button>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 font-medium' 
                      : 'glass border border-navy-600/20 text-white'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Form Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about cards, balance, loans..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-navy-800/50 border border-navy-600/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-navy-400 transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold transition-all flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mb-8 animate-slide-up text-left">
        <h1 className="font-display text-3xl font-bold text-white mb-1">Support</h1>
        <p className="text-navy-300 text-sm">We're here to help, 24 hours a day</p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-3 gap-4 mb-10 animate-slide-up">
        <button
          onClick={() => setChatOpen(true)}
          className="glass-card rounded-2xl p-5 flex flex-col items-center gap-3 hover:bg-navy-600/30 transition-all group"
        >
          <div className="text-green-400 group-hover:scale-110 transition-transform"><MessageCircle size={22} /></div>
          <div className="text-white font-semibold text-sm">Live Chat</div>
          <div className="text-navy-400 text-xs text-center">Avg. 2 min response</div>
        </button>

        <button
          className="glass-card rounded-2xl p-5 flex flex-col items-center gap-3 hover:bg-navy-600/30 transition-all group cursor-default"
        >
          <div className="text-blue-400"><Phone size={22} /></div>
          <div className="text-white font-semibold text-sm">Call Us</div>
          <div className="text-navy-400 text-xs text-center">+1 (800) 668-2265</div>
        </button>

        <button
          className="glass-card rounded-2xl p-5 flex flex-col items-center gap-3 hover:bg-navy-600/30 transition-all group cursor-default"
        >
          <div className="text-gold-400"><Mail size={22} /></div>
          <div className="text-white font-semibold text-sm">Email</div>
          <div className="text-navy-400 text-xs text-center">support@novabanque.com</div>
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 text-left">
        {/* FAQ */}
        <div className="animate-slide-up">
          <h2 className="font-display text-xl font-semibold text-white mb-5">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden">
                <button
                  className="w-full flex justify-between items-center px-5 py-4 text-left font-semibold"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-white text-sm font-medium pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp size={16} className="text-gold-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-navy-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-navy-300 text-sm leading-relaxed border-t border-navy-700/30 pt-3 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="animate-slide-up">
          <h2 className="font-display text-xl font-semibold text-white mb-5">Send a Message</h2>
          <div className="glass-card rounded-2xl p-6 space-y-4">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                <CheckCircle size={48} className="text-green-400 mb-4" />
                <h3 className="font-display text-xl font-semibold text-white mb-2">Message Sent!</h3>
                <p className="text-navy-300 text-sm">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-navy-400 text-xs mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Alex Morgan"
                      className="w-full bg-navy-800/50 border border-navy-600/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-navy-500 focus:outline-none focus:border-navy-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-navy-400 text-xs mb-1.5 block">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="alex@email.com"
                      className="w-full bg-navy-800/50 border border-navy-600/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-navy-500 focus:outline-none focus:border-navy-400 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-navy-400 text-xs mb-1.5 block">Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-navy-800/50 border border-navy-600/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-navy-400 transition-colors"
                  >
                    <option value="" className="bg-navy-800">Select a topic</option>
                    <option value="account" className="bg-navy-800 text-white">Account Issues</option>
                    <option value="card" className="bg-navy-800 text-white">Card Problems</option>
                    <option value="transfer" className="bg-navy-800 text-white">Transfer Help</option>
                    <option value="fraud" className="bg-navy-800 text-white">Fraud/Security</option>
                    <option value="other" className="bg-navy-800 text-white">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-navy-400 text-xs mb-1.5 block">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your issue in detail..."
                    rows={5}
                    className="w-full bg-navy-800/50 border border-navy-600/30 rounded-xl px-4 py-3 text-sm text-white placeholder-navy-500 focus:outline-none focus:border-navy-400 transition-colors resize-none"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 font-semibold text-sm hover:opacity-90 transition-all"
                >
                  <Send size={16} /> Send Message
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
