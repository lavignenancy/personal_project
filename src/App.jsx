import { useState, useMemo } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  UtensilsCrossed,
  Car,
  Receipt,
  Smartphone,
  Home,
  MoreHorizontal,
  List,
  PieChart as PieChartIcon,
  Wifi,
  BatteryFull,
  SignalHigh,
  Check,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import "./App.css";

const forest = "#1F6F4A";
const gold = "#D9A620";
const brick = "#B23A2E";
const paper = "#FAF6EC";

const CATEGORIES = [
  { name: "Food", icon: UtensilsCrossed, color: brick },
  { name: "Transport", icon: Car, color: forest },
  { name: "Bills", icon: Receipt, color: gold },
  { name: "Airtime", icon: Smartphone, color: "#6B5CA5" },
  { name: "Rent", icon: Home, color: "#2E6F8E" },
  { name: "Other", icon: MoreHorizontal, color: "#7C8B7F" },
];

const initialTxns = [
  {
    id: 1,
    type: "sent",
    amount: 350,
    party: "Mama Njeri Groceries",
    when: "Today, 2:14 PM",
    category: null,
  },
  {
    id: 2,
    type: "sent",
    amount: 1200,
    party: "KPLC Prepaid",
    when: "Today, 9:02 AM",
    category: "Bills",
  },
  {
    id: 3,
    type: "received",
    amount: 5000,
    party: "Wanjiku K.",
    when: "Yesterday, 6:41 PM",
    category: null,
  },
  {
    id: 4,
    type: "sent",
    amount: 100,
    party: "Boda Boda - Kev",
    when: "Yesterday, 5:15 PM",
    category: "Transport",
  },
  {
    id: 5,
    type: "sent",
    amount: 50,
    party: "Safaricom Airtime",
    when: "Yesterday, 1:07 PM",
    category: "Airtime",
  },
  {
    id: 6,
    type: "sent",
    amount: 8500,
    party: "Landlord - Otieno",
    when: "Mon, 8:00 AM",
    category: "Rent",
  },
  {
    id: 7,
    type: "sent",
    amount: 620,
    party: "Naivas Supermarket",
    when: "Sun, 4:22 PM",
    category: null,
  },
  {
    id: 8,
    type: "sent",
    amount: 200,
    party: "Java House",
    when: "Sun, 11:10 AM",
    category: "Food",
  },
];

function currency(n) {
  return `KSh ${n.toLocaleString()}`;
}

export default function App() {
  const [txns, setTxns] = useState(initialTxns);
  const [tab, setTab] = useState("transactions");
  const [openId, setOpenId] = useState(null);

  const unclassifiedCount = txns.filter(
    (t) => t.type === "sent" && !t.category,
  ).length;

  const categoryTotals = useMemo(() => {
    const totals = {};
    txns.forEach((t) => {
      if (t.type === "sent" && t.category) {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
      }
    });
    return CATEGORIES.map((c) => ({
      name: c.name,
      value: totals[c.name] || 0,
      color: c.color,
    })).filter((c) => c.value > 0);
  }, [txns]);

  const totalSpent = txns
    .filter((t) => t.type === "sent" && t.category)
    .reduce((sum, t) => sum + t.amount, 0);

  const classify = (id, category) => {
    setTxns((prev) => prev.map((t) => (t.id === id ? { ...t, category } : t)));
    setOpenId(null);
  };

  return (
    <div className="screen-wrap">
      <div className="phone">
        <div className="status-bar">
          <span>9:41</span>
          <div className="status-icons">
            <SignalHigh size={13} />
            <Wifi size={13} />
            <BatteryFull size={15} />
          </div>
        </div>

        <div className="header">
          <div className="header-top">
            <h1 className="app-title">Hela</h1>
            <span className="app-subtitle">M-Pesa Ledger</span>
          </div>
          {tab === "transactions" && unclassifiedCount > 0 && (
            <p className="header-note">
              {unclassifiedCount} transaction{unclassifiedCount > 1 ? "s" : ""}{" "}
              waiting to be sorted.
            </p>
          )}
          {tab === "dashboard" && (
            <p className="header-note">What your money did this month.</p>
          )}
        </div>

        <div className="body-scroll">
          {tab === "transactions" ? (
            <ul className="txn-list">
              {txns.map((t, i) => {
                const cat = CATEGORIES.find((c) => c.name === t.category);
                const Icon = cat
                  ? cat.icon
                  : t.type === "received"
                    ? ArrowDownLeft
                    : ArrowUpRight;
                const isOpen = openId === t.id;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => setOpenId(isOpen ? null : t.id)}
                      className={`txn-row ${i === txns.length - 1 && !isOpen ? "no-border" : ""}`}
                    >
                      <div
                        className="txn-icon"
                        style={{
                          background: cat ? `${cat.color}1A` : "#EDE6D3",
                          color: cat ? cat.color : "#5C6B5E",
                        }}
                      >
                        <Icon size={17} />
                      </div>
                      <div className="txn-info">
                        <p className="txn-party">{t.party}</p>
                        <p className="txn-when">{t.when}</p>
                      </div>
                      <div className="txn-amount-wrap">
                        <p
                          className="txn-amount"
                          style={{
                            color: t.type === "received" ? forest : "#1E2B22",
                          }}
                        >
                          {t.type === "received" ? "+" : "-"}
                          {currency(t.amount)}
                        </p>
                        {t.category ? (
                          <p className="txn-cat-label">{t.category}</p>
                        ) : t.type === "sent" ? (
                          <span className="unsorted-badge">Unsorted</span>
                        ) : (
                          <p className="txn-cat-label">Received</p>
                        )}
                      </div>
                    </button>

                    {isOpen && t.type === "sent" && (
                      <div className="category-picker">
                        {CATEGORIES.map((c) => {
                          const CatIcon = c.icon;
                          const active = t.category === c.name;
                          return (
                            <button
                              key={c.name}
                              onClick={() => classify(t.id, c.name)}
                              className={`category-pill ${active ? "active" : ""}`}
                              style={active ? { background: c.color } : {}}
                            >
                              {active && <Check size={12} />}
                              <CatIcon size={12} />
                              {c.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="dashboard">
              <p className="dashboard-label">Total classified spend</p>
              <p className="dashboard-total">{currency(totalSpent)}</p>

              {categoryTotals.length > 0 ? (
                <>
                  <div className="chart-wrap">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={categoryTotals}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={50}
                          outerRadius={78}
                          paddingAngle={3}
                        >
                          {categoryTotals.map((entry, idx) => (
                            <Cell
                              key={idx}
                              fill={entry.color}
                              stroke={paper}
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => currency(value)}
                          contentStyle={{
                            background: "#1E2B22",
                            border: "none",
                            borderRadius: 8,
                            fontFamily: "IBM Plex Mono, monospace",
                            fontSize: 12,
                          }}
                          itemStyle={{ color: paper }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <ul className="legend-list">
                    {categoryTotals
                      .sort((a, b) => b.value - a.value)
                      .map((c) => (
                        <li key={c.name} className="legend-row">
                          <span className="legend-name">
                            <span
                              className="legend-dot"
                              style={{ background: c.color }}
                            />
                            {c.name}
                          </span>
                          <span className="legend-value">
                            {currency(c.value)}
                          </span>
                        </li>
                      ))}
                  </ul>
                </>
              ) : (
                <p className="empty-note">
                  Sort a few transactions to see your spending take shape.
                </p>
              )}

              {unclassifiedCount > 0 && (
                <p className="footnote">
                  {unclassifiedCount} transaction
                  {unclassifiedCount > 1 ? "s" : ""} not counted yet — sort them
                  from the Transactions tab.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="tab-bar">
          <button
            onClick={() => setTab("transactions")}
            className={`tab-btn ${tab === "transactions" ? "active" : ""}`}
          >
            <List size={18} />
            <span className="tab-label">Transactions</span>
          </button>
          <button
            onClick={() => setTab("dashboard")}
            className={`tab-btn ${tab === "dashboard" ? "active" : ""}`}
          >
            <PieChartIcon size={18} />
            <span className="tab-label">Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
