import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  UtensilsCrossed,
  Car,
  Receipt,
  Smartphone,
  Home,
  MoreHorizontal,
  Wifi,
  BatteryFull,
  SignalHigh,
  Check,
} from "lucide-react";
import "./App.css";


const COLORS = { forest: "#1F6F4A", brick: "#B23A2E", gold: "#D9A620", neutral: "#7C8B7F" };

const CATEGORIES = [
  { name: "Food", icon: UtensilsCrossed, color: COLORS.brick },
  { name: "Transport", icon: Car, color: COLORS.forest },
  { name: "Bills", icon: Receipt, color: COLORS.gold },
  { name: "Airtime", icon: Smartphone, color: "#6B5CA5" },
  { name: "Rent", icon: Home, color: "#2E6F8E" },
  { name: "Other", icon: MoreHorizontal, color: COLORS.neutral },
];

const INITIAL_TXNS = [
  { id: 1, type: "sent", amount: 350, party: "Mama Njeri Groceries", when: "Today, 2:14 PM", category: null },
  { id: 2, type: "sent", amount: 1200, party: "KPLC Prepaid", when: "Today, 9:02 AM", category: "Bills" },
  { id: 3, type: "received", amount: 5000, party: "Wanjiku K.", when: "Yesterday, 6:41 PM", category: null },
  { id: 4, type: "sent", amount: 100, party: "Boda Boda - Kev", when: "Yesterday, 5:15 PM", category: "Transport" },
  { id: 5, type: "sent", amount: 50, party: "Safaricom Airtime", when: "Yesterday, 1:07 PM", category: "Airtime" },
  { id: 6, type: "sent", amount: 8500, party: "Landlord - Otieno", when: "Mon, 8:00 AM", category: "Rent" },
  { id: 7, type: "sent", amount: 620, party: "Naivas Supermarket", when: "Sun, 4:22 PM", category: null },
  { id: 8, type: "sent", amount: 200, party: "Java House", when: "Sun, 11:10 AM", category: "Food" },
];

const formatCurrency = (amount) => `KSh ${amount.toLocaleString()}`;

export default function App() {
  const [txns, setTxns] = useState(INITIAL_TXNS);
  const [currentTab, setCurrentTab] = useState("transactions");
  const [activeTxnId, setActiveTxnId] = useState(null);

  
  const outgoingTxns = txns.filter((t) => t.type === "sent");
  const unsortedCount = outgoingTxns.filter((t) => !t.category).length;
  
  const totalSpent = outgoingTxns
    .filter((t) => t.category)
    .reduce((sum, t) => sum + t.amount, 0);

  
  const categoryBreakdown = CATEGORIES.map((cat) => {
    const total = outgoingTxns
      .filter((t) => t.category === cat.name)
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...cat, total, percentage: totalSpent ? (total / totalSpent) * 100 : 0 };
  }).filter((cat) => cat.total > 0);

  const handleClassify = (id, categoryName) => {
    setTxns(txns.map((t) => (t.id === id ? { ...t, category: categoryName } : t)));
    setActiveTxnId(null);
  };

  return (
    <div className="screen-wrap">
      <div className="phone">
        {/* Status Bar */}
        <div className="status-bar">
          <span>9:41</span>
          <div className="status-icons">
            <SignalHigh size={13} /> <Wifi size={13} /> <BatteryFull size={15} />
          </div>
        </div>

        {/*  Header */}
        <div className="header">
          <div className="header-top">
            <h1 className="app-title">Hela</h1>
            <span className="app-subtitle">M-Pesa Ledger</span>
          </div>
          <p className="header-note">
            {currentTab === "transactions"
              ? `${unsortedCount} transaction${unsortedCount !== 1 ? "s" : ""} waiting to be sorted.`
              : "What your money did this month."}
          </p>
        </div>

        {/*Content Views */}
        <div className="body-scroll">
          {currentTab === "transactions" ? (
            <ul className="txn-list">
              {txns.map((txn, index) => (
                <TransactionItem
                  key={txn.id}
                  txn={txn}
                  isLast={index === txns.length - 1}
                  isOpen={activeTxnId === txn.id}
                  onToggle={() => setActiveTxnId(activeTxnId === txn.id ? null : txn.id)}
                  onSelectCategory={(catName) => handleClassify(txn.id, catName)}
                />
              ))}
            </ul>
          ) : (
            <div className="dashboard">
              <p className="dashboard-label">Total classified spend</p>
              <p className="dashboard-total">{formatCurrency(totalSpent)}</p>

              {/* bar charts */}
              <div className="budget-breakdown">
                {categoryBreakdown.map((cat) => (
                  <div key={cat.name} className="breakdown-row">
                    <div className="breakdown-info">
                      <span>{cat.name}</span>
                      <strong>{formatCurrency(cat.total)}</strong>
                    </div>
                    <div className="progress-bar-bg">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Tab Navigation */}
        <div className="tab-bar">
          <button 
            className={`tab-btn ${currentTab === "transactions" ? "active" : ""}`}
            onClick={() => setCurrentTab("transactions")}
          >
            Transactions
          </button>
          <button 
            className={`tab-btn ${currentTab === "dashboard" ? "active" : ""}`}
            onClick={() => setCurrentTab("dashboard")}
          >
            Insights
          </button>
        </div>
      </div>
    </div>
  );
}

function TransactionItem({ txn, isLast, isOpen, onToggle, onSelectCategory }) {
  const currentCategory = CATEGORIES.find((c) => c.name === txn.category);
  
  const IconComponent = currentCategory 
    ? currentCategory.icon 
    : (txn.type === "received" ? ArrowDownLeft : ArrowUpRight);

  return (
    <li>
      <button onClick={onToggle} className={`txn-row ${isLast && !isOpen ? "no-border" : ""}`}>
        <div
          className="txn-icon"
          style={{
            background: currentCategory ? `${currentCategory.color}1A` : "#EDE6D3",
            color: currentCategory ? currentCategory.color : "#5C6B5E",
          }}
        >
          <IconComponent size={17} />
        </div>
        
        <div className="txn-info">
          <p className="txn-party">{txn.party}</p>
          <p className="txn-when">{txn.when}</p>
        </div>

        <div className="txn-amount-wrap">
          <p className="txn-amount" style={{ color: txn.type === "received" ? COLORS.forest : "#1E2B22" }}>
            {txn.type === "received" ? "+" : "-"}{formatCurrency(txn.amount)}
          </p>
          <span className={`txn-cat-label ${!txn.category && txn.type === "sent" ? "unsorted-badge" : ""}`}>
            {txn.category || (txn.type === "received" ? "Received" : "Unsorted")}
          </span>
        </div>
      </button>

      {/* Expanded Categorization Drawer */}
      {isOpen && txn.type === "sent" && (
        <div className="category-picker">
          {CATEGORIES.map((cat) => {
            const CatIcon = cat.icon;
            const isSelected = txn.category === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`category-pill ${isSelected ? "active" : ""}`}
                style={isSelected ? { background: cat.color } : {}}
              >
                {isSelected && <Check size={12} />}
                <CatIcon size={12} />
                {cat.name}
              </button>
            );
          })}
        </div>
      )}
    </li>
  );
}
