import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BankingProvider } from "./context/BankingContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Cards from "./components/Cards";
import Loans from "./components/Loans";
import Support from "./components/Support";
import Investments from "./components/Investments";

const App = () => {
  return (
    <BankingProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-navy-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/cards" element={<Cards />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/support" element={<Support />} />
              <Route path="/investments" element={<Investments />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </BankingProvider>
  );
};

export default App;
