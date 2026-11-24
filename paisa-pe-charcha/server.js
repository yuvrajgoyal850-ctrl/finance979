/**
 * PAISA PE CHARCHA - The Royal Indian Financial Intelligence Platform
 * Backend Server (Pure Node.js Standard Library - Zero external dependencies)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Native .env loader (Zero external dependencies)
const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  try {
    const envLines = fs.readFileSync(envFile, 'utf8').split(/\r?\n/);
    envLines.forEach(line => {
      const clean = line.trim();
      if (clean && !clean.startsWith('#')) {
        const eqIdx = clean.indexOf('=');
        if (eqIdx !== -1) {
          const k = clean.substring(0, eqIdx).trim();
          const v = clean.substring(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
          if (!process.env[k]) {
            process.env[k] = v;
          }
        }
      }
    });
  } catch (e) {
    console.warn("Could not read .env file:", e.message);
  }
}

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// ==========================================
// KNOWLEDGE BASE & GOVERNMENT SCHEMES DATA
// ==========================================
const SCHEMES_DATABASE = [
  {
    id: "pmjdy",
    name: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
    category: "Banking & Inclusion",
    tagline: "National Mission for Financial Inclusion for all unbanked households",
    interestRate: "As per Savings Bank Account",
    eligibility: "Any Indian citizen aged 10 years or older without a basic bank account",
    minInvestment: "₹0 (Zero Balance Account)",
    maxLimit: "No upper limit (Overdraft up to ₹10,000 after 6 months)",
    taxBenefit: "Normal savings interest exemption up to ₹10,000 u/s 80TTA",
    keyBenefits: [
      "Zero minimum balance requirement",
      "Free RuPay debit card with in-built ₹2,00,000 accidental insurance cover",
      "Overdraft (OD) facility up to ₹10,000 to eligible account holders",
      "Direct Benefit Transfer (DBT) credit for government subsidies"
    ],
    officialLink: "https://pmjdy.gov.in",
    officialPortalName: "Department of Financial Services, Ministry of Finance"
  },
  {
    id: "ssy",
    name: "Sukanya Samriddhi Yojana (SSY)",
    category: "Girl Child Savings",
    tagline: "High-yield government-backed sovereign scheme for girl child education and marriage",
    interestRate: "8.2% p.a. (Compounded annually, Q4 FY24-25)",
    eligibility: "Parents/legal guardians of a girl child aged 10 years or below. Max 2 accounts per family",
    minInvestment: "₹250 per financial year",
    maxLimit: "₹1,50,000 per financial year",
    taxBenefit: "Triple Tax Exemption (EEE): 80C deduction, tax-free interest, and tax-free maturity",
    keyBenefits: [
      "Highest interest rate among small savings schemes (currently 8.2%)",
      "Sovereign guarantee backed by Government of India",
      "Maturity on completion of 21 years from account opening or upon marriage after age 18",
      "Partial withdrawal up to 50% allowed for higher education after age 18"
    ],
    officialLink: "https://www.indiapost.gov.in",
    officialPortalName: "India Post & RBI Authorized Banks"
  },
  {
    id: "ppf",
    name: "Public Provident Fund (PPF)",
    category: "Long-term Wealth & Retirement",
    tagline: "Premier long-term sovereign savings instrument with guaranteed returns and EEE tax status",
    interestRate: "7.1% p.a. (Compounded annually, sovereign guaranteed)",
    eligibility: "All resident Indian citizens (individuals only; HUF and NRIs cannot open new accounts)",
    minInvestment: "₹500 per financial year",
    maxLimit: "₹1,50,000 per financial year",
    taxBenefit: "EEE (Exempt-Exempt-Exempt) under Old Tax Regime Section 80C",
    keyBenefits: [
      "15-year tenure with option to extend indefinitely in blocks of 5 years with or without deposits",
      "Cannot be attached by any court decree for debts or liabilities",
      "Loan facility available from 3rd to 6th financial year",
      "Partial withdrawals permitted from 7th financial year onward"
    ],
    officialLink: "https://www.nsiindia.gov.in",
    officialPortalName: "National Savings Institute / India Post"
  },
  {
    id: "nps",
    name: "National Pension System (NPS)",
    category: "Pension & Retirement",
    tagline: "Low-cost market-linked voluntary pension system regulated by PFRDA",
    interestRate: "Market-linked (Historical returns 9.5% – 12.8% across Equity & Debt options)",
    eligibility: "Any Indian citizen (resident or non-resident) aged 18 to 70 years",
    minInvestment: "₹1,000 per financial year (Tier I)",
    maxLimit: "No upper ceiling",
    taxBenefit: "Section 80CCD(1) up to ₹1.5L + Exclusive Section 80CCD(1B) up to ₹50,000 additional",
    keyBenefits: [
      "Lowest fund management fee in the world (approx 0.09% p.a.)",
      "Choice of Active Choice (up to 75% equity) or Auto Choice lifecycle funds",
      "60% lump sum at age 60 is 100% tax-free; remaining 40% utilized for regular monthly annuity",
      "Corporate NPS allows up to 10% or 14% of Basic salary tax deduction under 80CCD(2)"
    ],
    officialLink: "https://www.pfrda.org.in",
    officialPortalName: "Pension Fund Regulatory and Development Authority (PFRDA)"
  },
  {
    id: "apy",
    name: "Atal Pension Yojana (APY)",
    category: "Social Security & Pension",
    tagline: "Guaranteed monthly pension scheme for workers in the unorganized sector",
    interestRate: "Guaranteed fixed pension ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000/month after age 60",
    eligibility: "Indian citizens aged 18 to 40 years with a savings bank account (Non-income taxpayers)",
    minInvestment: "Monthly auto-debit contribution based on entry age (e.g. ₹210/mo at age 18 for ₹5,000 pension)",
    maxLimit: "Maximum guaranteed pension of ₹5,000 per month",
    taxBenefit: "Eligible for tax benefits under Section 80CCD",
    keyBenefits: [
      "Government of India guarantees minimum pension regardless of market fluctuations",
      "Spouse continues to receive lifetime pension upon subscriber's demise",
      "Entire accumulated corpus handed to nominee after demise of both subscriber and spouse",
      "Automatic auto-debit facility from bank savings account"
    ],
    officialLink: "https://www.npscra.nsdl.co.in",
    officialPortalName: "Protean / NSDL CRA"
  },
  {
    id: "pmjjby",
    name: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
    category: "Life Insurance",
    tagline: "Affordable one-year renewable group life insurance protection",
    interestRate: "N/A (Pure Term Insurance)",
    eligibility: "Bank account holders aged 18 to 50 years who give consent for auto-debit",
    minInvestment: "₹436 per annum premium",
    maxLimit: "Coverage of ₹2,00,000 in case of death due to any reason",
    taxBenefit: "Premium eligible for deduction under Section 80C",
    keyBenefits: [
      "Extremely affordable term insurance cover of ₹2,00,000 for just ₹436/year (~₹1.2 per day)",
      "Covers death due to any reason (natural, accidental, or illness)",
      "Simple paperless enrollment via bank savings account",
      "Direct settlement into nominee's bank account"
    ],
    officialLink: "https://financialservices.gov.in",
    officialPortalName: "Department of Financial Services, GoI"
  },
  {
    id: "pmsby",
    name: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    category: "Accidental Insurance",
    tagline: "Nationwide micro-insurance scheme covering accidental death and disability",
    interestRate: "N/A (Accident Insurance)",
    eligibility: "Bank account holders aged 18 to 70 years",
    minInvestment: "₹20 per annum premium",
    maxLimit: "Coverage of ₹2,00,000 for accidental death/permanent total disability",
    taxBenefit: "Section 80C applicable on premium",
    keyBenefits: [
      "Unmatched low premium of only ₹20 per year",
      "₹2,00,000 compensation for accidental death or total irrecoverable loss of both eyes/hands/feet",
      "₹1,00,000 compensation for permanent partial disability",
      "One-click auto-debit from savings account every May"
    ],
    officialLink: "https://financialservices.gov.in",
    officialPortalName: "Department of Financial Services, GoI"
  },
  {
    id: "scss",
    name: "Senior Citizen Savings Scheme (SCSS)",
    category: "Senior Citizens",
    tagline: "Premier quarterly-interest paying sovereign deposit scheme for retirees",
    interestRate: "8.2% p.a. (Paid quarterly)",
    eligibility: "Individuals aged 60+ (or 55+ for opted VRS retirees)",
    minInvestment: "₹1,000",
    maxLimit: "₹30,00,000 per individual",
    taxBenefit: "Deposit qualifies for Section 80C. Interest exempt up to ₹50,000 u/s 80TTB for seniors",
    keyBenefits: [
      "Guaranteed quarterly income credited directly to bank account on 1st of April, July, Oct, Jan",
      "Maximum deposit limit raised to ₹30 Lakhs",
      "5-year tenure extendable by 3 years",
      "Sovereign guarantee from Government of India"
    ],
    officialLink: "https://www.indiapost.gov.in",
    officialPortalName: "India Post & Commercial Banks"
  },
  {
    id: "mssc",
    name: "Mahila Samman Savings Certificate (MSSC)",
    category: "Women Empowerment",
    tagline: "Special 2-year sovereign small savings scheme dedicated to women and girls",
    interestRate: "7.5% p.a. (Compounded quarterly)",
    eligibility: "Women or legal guardians in the name of a minor girl",
    minInvestment: "₹1,000",
    maxLimit: "₹2,00,000",
    taxBenefit: "Standard TDS rules apply; normal income tax rules",
    keyBenefits: [
      "Attractive 7.5% fixed interest compounded quarterly for a short 2-year tenure",
      "Partial withdrawal up to 40% permitted after 1 year",
      "No credit risk - sovereign backed by Ministry of Finance",
      "Available across post offices and authorized commercial banks"
    ],
    officialLink: "https://www.indiapost.gov.in",
    officialPortalName: "Ministry of Finance & Department of Posts"
  }
];

// ==========================================
// MARKET OVERVIEW DATA ENGINE
// ==========================================
function getMarketData() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
  const dateStr = now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' });

  return {
    status: "success",
    timestamp: `${dateStr}, ${timeStr}`,
    marketStatus: "MARKET ACTIVE (NSE / BSE)",
    indices: [
      {
        name: "NIFTY 50",
        symbol: "^NSEI",
        exchange: "NSE",
        value: 23914.15,
        change: 148.60,
        percentChange: 0.63,
        isPositive: true,
        high52: 26277.35,
        low52: 21281.45,
        open: 23810.00,
        dayHigh: 23965.20,
        dayLow: 23780.50
      },
      {
        name: "BSE SENSEX",
        symbol: "^BSESN",
        exchange: "BSE",
        value: 78922.40,
        change: 482.30,
        percentChange: 0.62,
        isPositive: true,
        high52: 85978.25,
        low52: 70319.04,
        open: 78550.10,
        dayHigh: 79110.80,
        dayLow: 78420.00
      },
      {
        name: "NIFTY BANK",
        symbol: "^NSEBANK",
        exchange: "NSE",
        value: 51240.80,
        change: 312.45,
        percentChange: 0.61,
        isPositive: true,
        high52: 54467.35,
        low52: 44429.10,
        open: 51010.00,
        dayHigh: 51390.00,
        dayLow: 50920.00
      },
      {
        name: "NIFTY IT",
        symbol: "^CNXIT",
        exchange: "NSE",
        value: 42180.25,
        change: -115.30,
        percentChange: -0.27,
        isPositive: false,
        high52: 44250.00,
        low52: 30840.00,
        open: 42350.00,
        dayHigh: 42410.00,
        dayLow: 42090.00
      }
    ],
    commodities: [
      {
        name: "Gold 24K (10g)",
        unit: "per 10g",
        value: 77450.00,
        change: 220.00,
        percentChange: 0.28,
        currency: "INR",
        isPositive: true
      },
      {
        name: "Silver (1kg)",
        unit: "per 1kg",
        value: 91800.00,
        change: -350.00,
        percentChange: -0.38,
        currency: "INR",
        isPositive: false
      },
      {
        name: "Crude Oil (Brent)",
        unit: "per bbl",
        value: 74.20,
        change: 0.45,
        percentChange: 0.61,
        currency: "USD",
        isPositive: true
      },
      {
        name: "USD / INR",
        unit: "Exchange Rate",
        value: 84.42,
        change: 0.04,
        percentChange: 0.05,
        currency: "INR",
        isPositive: true
      }
    ],
    sectorHeatmap: [
      { sector: "Banking & Financials", change: 0.82, positive: true },
      { sector: "Automobile & Auto Ancillary", change: 1.15, positive: true },
      { sector: "FMCG & Consumption", change: 0.35, positive: true },
      { sector: "Pharmaceuticals & Healthcare", change: 0.54, positive: true },
      { sector: "Information Technology", change: -0.27, positive: false },
      { sector: "Metals & Mining", change: 0.94, positive: true },
      { sector: "Energy & Oil & Gas", change: 0.41, positive: true },
      { sector: "Realty & Infrastructure", change: 1.48, positive: true }
    ],
    topGainers: [
      { name: "Tata Motors", price: 798.50, change: 3.42 },
      { name: "HDFC Bank", price: 1745.20, change: 1.85 },
      { name: "State Bank of India", price: 815.40, change: 1.72 },
      { name: "Mahindra & Mahindra", price: 2940.00, change: 1.64 }
    ],
    topLosers: [
      { name: "Infosys Ltd", price: 1845.00, change: -1.12 },
      { name: "Tata Consultancy Services", price: 4120.50, change: -0.85 },
      { name: "Wipro", price: 542.10, change: -0.74 }
    ]
  };
}

// ==========================================
// FINANCIAL NEWS FEED ENGINE
// ==========================================
function getFinancialNews() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' });

  return {
    status: "success",
    lastUpdated: dateStr,
    articles: [
      {
        id: "news-1",
        title: "RBI Monetary Policy Committee Maintains Focus on Durably Aligning Inflation to 4% Target",
        source: "Reserve Bank of India Press Release",
        category: "Central Banking & Monetary Policy",
        time: "3 hours ago",
        summary: "The Monetary Policy Committee (MPC) evaluated growth-inflation dynamics, emphasizing resilient domestic economic activity and disciplined systemic liquidity while observing food inflation moderation trends.",
        tag: "Official RBI",
        officialUrl: "https://www.rbi.org.in"
      },
      {
        id: "news-2",
        title: "New Tax Regime (Section 115BAC): Standard Deduction Enhanced to ₹75,000 for Salaried Taxpayers",
        source: "Central Board of Direct Taxes (CBDT)",
        category: "Direct Taxation",
        time: "6 hours ago",
        summary: "CBDT clarifies simplified tax slabs under the New Tax Regime, offering standard deduction of ₹75,000 and full tax rebate under Section 87A for taxable incomes up to ₹7.75 Lakhs for salaried individuals.",
        tag: "Tax Circular",
        officialUrl: "https://incometax.gov.in"
      },
      {
        id: "news-3",
        title: "SEBI Introduces T+0 Optional Settlement Cycle and Strengthens Direct Plan Disclosures for Mutual Funds",
        source: "Securities and Exchange Board of India",
        category: "Capital Markets Regulation",
        time: "10 hours ago",
        summary: "SEBI deepens investor protection frameworks by tightening total expense ratio (TER) transparency and expanding optional same-day settlement across registered brokerages.",
        tag: "SEBI Regulatory",
        officialUrl: "https://www.sebi.gov.in"
      },
      {
        id: "news-4",
        title: "NPCI Reports Monthly UPI Transactions Crossing Record ₹20 Lakh Crore Milestone with UPI Lite Expansion",
        source: "National Payments Corporation of India (NPCI)",
        category: "Digital Payments",
        time: "14 hours ago",
        summary: "Unified Payments Interface (UPI) logs unprecedented velocity across retail merchant and peer-to-peer segments, propelled by seamless offline UPI Lite tap-and-pay integrations.",
        tag: "Digital India",
        officialUrl: "https://www.npci.org.in"
      },
      {
        id: "news-5",
        title: "Ministry of Finance Re-affirms Sovereign Interest Rates on Small Savings Schemes for Current Quarter",
        source: "Department of Economic Affairs, Ministry of Finance",
        category: "Small Savings",
        time: "1 day ago",
        summary: "Interest rates on Sukanya Samriddhi Account (8.2%), Senior Citizen Savings Scheme (8.2%), and Public Provident Fund (7.1%) held steady with sovereign backing.",
        tag: "Government Gazette",
        officialUrl: "https://dea.gov.in"
      }
    ]
  };
}

// ==========================================
// ADVANCED INDIAN FINANCIAL REASONING ENGINE
// ==========================================
function generateFinancialAIResponse(userMessage, conversationHistory = [], preferredMode = "general") {
  const query = userMessage.toLowerCase().trim();

  // Helper for rupee formatting
  const inr = (num) => "₹" + Number(num).toLocaleString('en-IN');

  // Classification & Response Synthesis
  let topic = "General Personal Finance";
  let responseText = "";
  let suggestedPrompts = [];
  let keyTakeaways = [];

  // 1. TAXATION (Old vs New Regime, 80C, 80D, 87A, slabs)
  if (query.includes('tax') || query.includes('regime') || query.includes('80c') || query.includes('80d') || query.includes('slab') || query.includes('115bac') || query.includes('income tax')) {
    topic = "Income Tax (Old vs. New Tax Regime FY 2024-25 / 2025-26)";
    
    responseText = `### 🏛️ Indian Income Tax Advisory & Regime Comparison

Under the provisions of the Income-tax Act, 1961 (as amended by Finance Acts), individuals have two distinct tax regimes to choose from:

#### 1. The New Tax Regime (Section 115BAC – Default Regime)
The New Tax Regime offers lower slab rates with minimal deductions:
* **₹0 – ₹3,00,000:** Nil
* **₹3,00,001 – ₹7,00,000:** 5%
* **₹7,00,001 – ₹10,00,000:** 10%
* **₹10,00,001 – ₹12,00,000:** 15%
* **₹12,00,001 – ₹15,00,000:** 20%
* **Above ₹15,00,000:** 30%

**Crucial Features in New Regime:**
* **Standard Deduction for Salaried:** Enhanced to **₹75,000**.
* **Section 87A Rebate:** If your taxable income after standard deduction does not exceed ₹7,00,000, your tax liability is reduced to **zero**. Consequently, salaried employees earning up to **₹7,75,000** pay **₹0 income tax**!
* **Family Pension Deduction:** Enhanced to ₹25,000.

---

#### 2. The Old Tax Regime (With Deductions & Exemptions)
The Old Regime offers traditional tax slabs but allows comprehensive deductions:
* **Up to ₹2,50,000:** Nil
* **₹2,50,001 – ₹5,00,000:** 5%
* **₹5,00,001 – ₹10,00,000:** 20%
* **Above ₹10,00,000:** 30%
*(Plus 4% Health & Education Cess across both regimes)*

**Allowed Deductions under Old Regime:**
* **Section 80C:** Up to ₹1,50,000 (EPF, PPF, ELSS, Life Insurance, Home Loan Principal, SSY).
* **Section 80D:** Up to ₹25,000 (Self & Family) + ₹50,000 (Senior Citizen Parents) for Health Insurance.
* **Section 24(b):** Up to ₹2,00,000 for Home Loan Interest on self-occupied property.
* **Section 80CCD(1B):** Additional ₹50,000 for National Pension System (NPS).
* **HRA Exemption u/s 10(13A):** Based on actual rent paid, salary, and metro/non-metro rules.

---

#### ⚖️ Strategic Recommendation: Which Regime Should You Choose?
* **Breakeven Threshold:** For an annual income of ₹10 Lakhs to ₹15 Lakhs, if your total eligible deductions under Old Regime exceed **₹3,75,000 – ₹4,25,000** (combining HRA + 80C + 80D + Home Loan Interest), the **Old Regime** may save more tax.
* If your total deductions are **under ₹3.5 Lakhs**, the **New Tax Regime** almost always results in lower tax outflow and zero hassle of preserving investment proofs.`;

    keyTakeaways = [
      "Salaried income up to ₹7.75 Lakhs is 100% tax-free under New Regime u/s 87A + standard deduction.",
      "New Regime is the default regime; employees can switch during ITR filing (for salaried without business income).",
      "Use our Income Tax Calculator tool on the platform to compare your exact take-home pay."
    ];

    suggestedPrompts = [
      "Show me how to save tax under New Regime",
      "What is Section 80CCD(1B) NPS tax benefit?",
      "Can I switch between Old and New tax regimes every year?",
      "What is Capital Gains tax on mutual funds?"
    ];

  // 2. SIP & MUTUAL FUNDS (Compounding, Index funds, SIP vs Lumpsum)
  } else if (query.includes('sip') || query.includes('mutual fund') || query.includes('lumpsum') || query.includes('compounding') || query.includes('equity') || query.includes('etf')) {
    topic = "SIP, Compounding & Mutual Fund Wealth Creation";

    responseText = `### 📈 Systematic Investment Plan (SIP) & Long-Term Wealth Architecture

A **Systematic Investment Plan (SIP)** is an automated wealth-building mechanism regulated by SEBI that instills financial discipline and leverages rupee-cost averaging.

#### 🌟 The Magic of Rupee-Cost Averaging
When the stock market is elevated, your fixed monthly SIP buys fewer mutual fund units; when markets experience a correction, your SIP automatically acquires more units at a discount. Over a 5 to 15-year horizon, this eliminates the risk of trying to time the market.

#### 🧮 The Power of the "15 × 15 × 15" Wealth Rule
In Indian mutual fund history, equity broad-market indices have delivered annualized returns around 12% to 15%:
* **Invest:** ₹15,000 per month
* **Tenure:** 15 Years (180 months)
* **Expected Return:** 15% CAGR
* **Your Total Investment:** ₹27,00,000 (₹27 Lakhs)
* **Accumulated Wealth:** **₹1,00,27,601 (Over ₹1 Crore!)**
* *Your wealth generated by pure compounding:* **₹73,27,601!**

---

#### 🎯 Mutual Fund Categories Breakdown:
1. **NIFTY 50 Index Funds (Recommended for Core Portfolio):**
   * Passive low-cost investing mimicking the top 50 Indian blue-chip companies.
   * Very low Expense Ratio (often 0.10% – 0.20%).
2. **Flexi-Cap / Multi-Cap Funds:**
   * Fund manager can dynamically allocate across Large, Mid, and Small-cap stocks.
3. **Mid-Cap & Small-Cap Funds:**
   * Higher volatility, suitable for aggressive investors with a horizon strictly beyond 7–10 years.
4. **Direct Plan vs. Regular Plan:**
   * **Always select 'Direct – Growth' plans.** Regular plans route through distributors, charging an extra 0.5% – 1.2% commission every year, which can erode ₹20–30 Lakhs over a 20-year horizon!

---

#### ⚖️ Current Capital Gains Tax on Mutual Funds (Post-Budget):
* **Long-Term Capital Gains (LTCG):** Holding period > 12 months for equity funds. Gains up to **₹1.25 Lakhs per financial year are tax-free**; gains exceeding ₹1.25 Lakhs are taxed at **12.5%**.
* **Short-Term Capital Gains (STCG):** Holding period ≤ 12 months for equity funds is taxed at **20%**.`;

    keyTakeaways = [
      "Always invest via Direct-Growth plans to avoid intermediary commission leakage.",
      "The 15x15x15 rule demonstrates that ₹15,000/month for 15 years at 15% return builds ₹1 Crore.",
      "Equity fund LTCG above ₹1.25 Lakh/year is taxed at 12.5% without indexation."
    ];

    suggestedPrompts = [
      "Calculate SIP of ₹10,000 for 10 years",
      "Which is better: Index Fund or Active Mutual Fund?",
      "How does step-up SIP accelerate wealth?",
      "What is the difference between Direct and Regular mutual funds?"
    ];

  // 3. HOME LOAN, EMI & PREPAYMENT STRATEGY
  } else if (query.includes('emi') || query.includes('loan') || query.includes('home loan') || query.includes('prepay') || query.includes('interest') || query.includes('cibil')) {
    topic = "Loan Advisory, EMI Amortization & Smart Prepayment";

    responseText = `### 🏠 Loan Architecture, EMI Dynamics & Prepayment Mastery

When taking long-tenure loans (such as Home Loans or Car Loans), the traditional amortization schedule heavily front-loads interest payments. In the initial 5 to 7 years of a 20-year home loan, up to **70% of your monthly EMI goes directly toward interest**, not principal reduction!

#### 📐 The Mathematics of Equated Monthly Installment (EMI)
$$\\text{EMI} = P \\times r \\times \\frac{(1+r)^n}{(1+r)^n - 1}$$
*Where $P$ is principal, $r$ is monthly interest rate, and $n$ is total months.*

For example, on a **₹50,00,000 (₹50 Lakh) Home Loan at 8.75% for 20 years**:
* **Monthly EMI:** ₹44,186
* **Total Principal Borrowed:** ₹50,00,000
* **Total Interest Payable:** **₹56,04,534**
* **Total Cash Outflow:** **₹1,06,04,534** (You pay more than double the borrowed amount!)

---

#### 🚀 Three Proven Strategies to Slash Your Loan Tenure & Save Millions:

1. **The "1 Extra EMI Per Year" Strategy:**
   * Paying just **one additional EMI each calendar year** directly towards principal reduces a 20-year loan tenure down to approximately **16 years**, saving over **₹12,00,000 in interest**!
2. **The "5% Annual EMI Step-Up" Strategy:**
   * As your salary or business cash flow increases each year, instruct your bank to increase your monthly EMI by just **5% annually**. A 20-year loan is liquidated in roughly **11 to 12 years**!
3. **The SIP Home Loan Hedging Technique:**
   * Start a monthly equity mutual fund SIP equal to **10% of your EMI amount** (e.g. ₹4,400/month for a ₹44,000 EMI). Over 15–20 years at 12% CAGR, that small SIP will grow to over ₹45 Lakhs, effectively **recovering 100% of the interest you paid to the bank**!

---

#### 🛡️ CIBIL & Credit Score Optimization Guidelines:
* Maintain a credit score of **750 or above** to secure premier lending rates (banks reserve their lowest ROI for 780+ CIBIL).
* Keep your **Credit Utilization Ratio below 30%** on credit cards.
* Avoid taking multiple personal loans or BNPL (Buy Now Pay Later) schemes concurrently.`;

    keyTakeaways = [
      "On a 20-year home loan, you repay more interest than the original borrowed principal.",
      "Paying 1 extra EMI per year can cut 4+ years off a 20-year home loan.",
      "Maintain a 750+ CIBIL score to qualify for repo-linked concessional interest rates."
    ];

    suggestedPrompts = [
      "Should I prepay home loan or invest in mutual funds?",
      "How to calculate EMI for a ₹30 Lakh loan?",
      "How can I improve my CIBIL score fast?",
      "What is the difference between Fixed and Floating interest rates?"
    ];

  // 4. GOVERNMENT SCHEMES (PPF, SSY, NPS, PMJDY, etc.)
  } else if (query.includes('scheme') || query.includes('ppf') || query.includes('sukanya') || query.includes('nps') || query.includes('atal') || query.includes('jan dhan') || query.includes('pmjdy') || query.includes('pmsby') || query.includes('pmjjby')) {
    topic = "Indian Sovereign Government Schemes & Welfare Initiatives";

    responseText = `### 🇮🇳 Flagship Government of India Financial & Social Security Schemes

The Government of India and the Reserve Bank of India provide several sovereign-guaranteed instruments designed to guarantee capital safety, promote financial inclusion, and offer high tax-free yields.

#### 1. Sukanya Samriddhi Yojana (SSY) – Best for Girl Child
* **Current Interest:** **8.2% p.a.** (Highest sovereign small-savings rate)
* **Eligibility:** Parents of girls aged up to 10 years.
* **Tax Status:** **EEE (Exempt-Exempt-Exempt)** – Section 80C deduction, tax-free annual compounding, and 100% tax-free maturity!
* **Annual Limits:** Min ₹250, Max ₹1,50,000 per financial year.
* **Maturity:** 21 years from opening or on marriage after age 18.

#### 2. Public Provident Fund (PPF) – The Sovereign Anchor
* **Current Interest:** **7.1% p.a.** (Compounded annually)
* **Tenure:** 15 years, extendable in blocks of 5 years with or without fresh contributions.
* **Special Legal Immunity:** Protected from court attachment under any decree or liability.
* **Tax Status:** Full **EEE** status u/s 80C.

#### 3. National Pension System (NPS) – Low-Cost Retirement Vehicle
* **Regulator:** PFRDA (Pension Fund Regulatory and Development Authority).
* **Fund Management Charge:** ~0.09% (World's lowest).
* **Exclusive Tax Benefit:** **₹50,000 additional tax deduction** under Section 80CCD(1B), over and above the ₹1.5L 80C limit!
* **Exit at 60:** 60% lump sum is 100% tax-free; 40% mandatory annuity ensures lifelong monthly pension.

#### 4. Atal Pension Yojana (APY) – Universal Social Security
* **Eligibility:** Citizens aged 18–40 years (unorganized sector / non-income tax payers).
* **Guaranteed Monthly Pension:** ₹1,000 to ₹5,000 per month starting at age 60, backed by sovereign guarantee.
* **Spouse & Nominee Protection:** Continued pension for spouse and full corpus return to nominee.

#### 5. Pradhan Mantri Jeevan Jyoti (PMJJBY) & Suraksha Bima (PMSBY)
* **PMJJBY:** ₹2,00,000 life insurance for only **₹436/year** (Ages 18–50).
* **PMSBY:** ₹2,00,000 accidental cover for only **₹20/year** (Ages 18–70).`;

    keyTakeaways = [
      "Sukanya Samriddhi Yojana (8.2%) and PPF (7.1%) carry the coveted Triple EEE tax exemption.",
      "NPS provides an exclusive ₹50,000 tax deduction under Section 80CCD(1B).",
      "PMJJBY and PMSBY provide ₹4 Lakh combined life + accident cover for under ₹460 annually."
    ];

    suggestedPrompts = [
      "Compare PPF vs Sukanya Samriddhi Yojana",
      "How to open an NPS Tier 1 account online?",
      "Who is eligible for Atal Pension Yojana?",
      "Tell me about Senior Citizen Savings Scheme (SCSS)"
    ];

  // 5. RBI, BANKING, SEBI & UPI REGULATIONS (Prioritized before generic budgeting)
  } else if (query.includes('rbi') || query.includes('sebi') || query.includes('repo') || query.includes('dicgc') || query.includes('bank') || query.includes('upi') || query.includes('fraud') || query.includes('cyber')) {
    topic = "RBI Monetary Framework, SEBI Regulations & Digital Safety";

    responseText = `### 🏛️ Indian Banking Framework, Regulatory Safeguards & Consumer Rights

The Reserve Bank of India (RBI) and the Securities and Exchange Board of India (SEBI) enforce stringent statutory mechanisms to protect Indian citizens' capital and digital transactions.

#### 1. Bank Safety & The DICGC ₹5,00,000 Guarantee
* Under the **Deposit Insurance and Credit Guarantee Corporation (DICGC) Act**, every depositor in an insured commercial or cooperative bank is insured up to a **maximum of ₹5,00,000 (₹5 Lakhs)** for both principal and interest amount.
* The ₹5 Lakh insurance applies per depositor, per bank across all branches (savings, fixed, current, and recurring deposits combined).
* *Smart Tip:* If your liquid cash exceeds ₹5 Lakhs, distribute deposits across different commercial scheduled banks (e.g., SBI, HDFC, ICICI, Bank of Baroda).

#### 2. The Repo Rate & External Benchmark Lending Rate (EBLR)
* **Repo Rate:** The benchmark rate at which the RBI lends short-term liquidity to commercial banks.
* Since October 2019, RBI mandated that all floating-rate retail loans (home loans, auto loans) must be linked to an **External Benchmark** (predominantly the RBI Repo Rate). When RBI lowers rates, banks are legally mandated to pass on interest reductions to retail borrowers.

#### 3. SEBI Regulatory Armor for Retail Investors
* **ASBA (Application Supported by Blocked Amount):** In IPO applications, money never leaves your bank account until actual shares are allotted.
* **SCORES Portal (SEBI Complaints Redress System):** An official online platform where retail investors can file formal grievances against listed companies, brokers, or mutual fund houses with mandatory resolution timelines.

#### 4. Digital Payments & UPI Safety Protocols:
* **The Golden Rule:** You **NEVER enter your UPI PIN to receive money**. UPI PIN is required strictly when debiting money from your own account.
* **National Cyber Crime Helpline:** In case of financial cyber fraud, immediately dial **1930** or report within 24 hours at [cybercrime.gov.in](https://cybercrime.gov.in) to trigger automatic banking inter-bank freeze on fraudulent transactions.`;

    keyTakeaways = [
      "Bank deposits are protected by RBI subsidiary DICGC up to ₹5,00,000 per bank per depositor.",
      "Entering a UPI PIN is strictly for debiting/paying money; never enter PIN to receive money.",
      "Dial 1930 immediately in case of any unauthorized online banking or UPI debit transaction."
    ];

    suggestedPrompts = [
      "Is my money safe in private banks in India?",
      "How does RBI repo rate affect my home loan EMI?",
      "What is SEBI SCORES grievance mechanism?",
      "What should I do if money is debited via UPI fraud?"
    ];

  // 6. BUDGETING, EMERGENCY FUND & PERSONAL FINANCE
  } else if (query.includes('budget') || query.includes('emergency') || query.includes('50/30/20') || query.includes('50-30-20') || query.includes('salary allocation') || query.includes('living expense') || query.includes('savings rule')) {
    topic = "Personal Financial Architecture & Household Budgeting";

    responseText = `### 🏛️ Indian Banking Framework, Regulatory Safeguards & Consumer Rights

The Reserve Bank of India (RBI) and the Securities and Exchange Board of India (SEBI) enforce stringent statutory mechanisms to protect Indian citizens' capital and digital transactions.

#### 1. Bank Safety & The DICGC ₹5,00,000 Guarantee
* Under the **Deposit Insurance and Credit Guarantee Corporation (DICGC) Act**, every depositor in an insured commercial or cooperative bank is insured up to a **maximum of ₹5,00,000 (₹5 Lakhs)** for both principal and interest amount.
* The ₹5 Lakh insurance applies per depositor, per bank across all branches (savings, fixed, current, and recurring deposits combined).
* *Smart Tip:* If your liquid liquid cash exceeds ₹5 Lakhs, distribute deposits across different commercial scheduled banks (e.g., SBI, HDFC, ICICI, Bank of Baroda).

#### 2. The Repo Rate & External Benchmark Lending Rate (EBLR)
* **Repo Rate:** The benchmark rate at which the RBI lends short-term liquidity to commercial banks.
* Since October 2019, RBI mandated that all floating-rate retail loans (home loans, auto loans) must be linked to an **External Benchmark** (predominantly the RBI Repo Rate). When RBI lowers rates, banks are legally mandated to pass on interest reductions to retail borrowers.

#### 3. SEBI Regulatory Armor for Retail Investors
* **ASBA (Application Supported by Blocked Amount):** In IPO applications, money never leaves your bank account until actual shares are allotted.
* **SCORES Portal (SEBI Complaints Redress System):** An official online platform where retail investors can file formal grievances against listed companies, brokers, or mutual fund houses with mandatory resolution timelines.

#### 4. Digital Payments & UPI Safety Protocols:
* **The Golden Rule:** You **NEVER enter your UPI PIN to receive money**. UPI PIN is required strictly when debiting money from your own account.
* **National Cyber Crime Helpline:** In case of financial cyber fraud, immediately dial **1930** or report within 24 hours at [cybercrime.gov.in](https://cybercrime.gov.in) to trigger automatic banking inter-bank freeze on fraudulent transactions.`;

    keyTakeaways = [
      "Bank deposits are protected by RBI subsidiary DICGC up to ₹5,00,000 per bank per depositor.",
      "Entering a UPI PIN is strictly for debiting/paying money; never enter PIN to receive money.",
      "Dial 1930 immediately in case of any unauthorized online banking or UPI debit transaction."
    ];

    suggestedPrompts = [
      "Is my money safe in private banks in India?",
      "How does RBI repo rate affect my home loan EMI?",
      "What is SEBI SCORES grievance mechanism?",
      "What should I do if money is debited via UPI fraud?"
    ];

  // DEFAULT / COMPREHENSIVE FINANCIAL ADVISOR RESPONSE
  } else {
    topic = "Paisa Pe Charcha Financial Intelligence";

    responseText = `### 🇮🇳 Namaste! Welcome to Paisa Pe Charcha Financial AI Terminal

I am your dedicated **Paisa Pe Charcha Financial Intelligence Assistant**, engineered with deep institutional understanding of the Indian economic ecosystem, Reserve Bank of India guidelines, Income Tax provisions, and wealth-building strategies.

#### How I Can Empower Your Financial Decisions:

1. **🏛️ Income Tax Optimization:**
   * Detailed Old vs. New Tax Regime breakdown (FY 2024-25 / 2025-26).
   * Deductions under Section 80C, 80D, 80CCD(1B) NPS, HRA, and Section 87A rebates.

2. **📈 Wealth Creation & Investment Architecture:**
   * SIP calculations, compounding models, Direct Index Funds vs Active Mutual Funds.
   * Sovereign Gold Bonds (SGB), Public Provident Fund (PPF), and Equity Taxation (LTCG / STCG).

3. **🏠 Loan & Debt Amortization Strategies:**
   * Home loan interest reduction techniques, prepayments, and EMI calculations.
   * CIBIL score repair and credit utilization optimization.

4. **🇮🇳 Sovereign Government Schemes:**
   * Eligibility and official procedures for Sukanya Samriddhi (SSY), NPS, APY, PMJDY, and PMJJBY.

5. **🛡️ Financial Security & Risk Mitigation:**
   * 50/30/20 budgeting blueprint, liquid emergency fund sizing, and pure Term Insurance planning.

---
*Feel free to ask a specific question or select from the recommended queries below!*`;

    keyTakeaways = [
      "Paisa Pe Charcha provides objective, un-biased Indian financial education and analytical assistance.",
      "Use our 10 interactive calculators located in the Financial Tools section for precise numerical calculations.",
      "Always consult a SEBI-registered financial planner (RIA) or Chartered Accountant for personalized execution."
    ];

    suggestedPrompts = [
      "Which is better: Old Tax Regime or New Tax Regime for ₹12 Lakh salary?",
      "How much will ₹10,000 monthly SIP grow to in 15 years?",
      "Explain the best government schemes for senior citizens",
      "How can I save ₹20 Lakhs in interest on my home loan?"
    ];
  }

  return {
    status: "success",
    topic: topic,
    response: responseText,
    keyTakeaways: keyTakeaways,
    suggestedPrompts: suggestedPrompts,
    timestamp: new Date().toISOString()
  };
}

// ==========================================
// GEMINI EXTERNAL API INTEGRATION HANDLER
// ==========================================
async function callGeminiAPI(apiKey, prompt, history = []) {
  const systemInstruction = `You are "Paisa Pe Charcha AI", the premier, world-class Royal Indian Financial Intelligence Assistant.
You possess deep, institutional-grade authority and expertise in Indian personal finance, Income Tax Act 1961 (including the latest FY 2024-25 / 2025-26 budget provisions), Reserve Bank of India (RBI) monetary framework, SEBI capital market regulations, Government of India sovereign schemes (SSY, PPF, NPS, APY, PMJDY), mutual funds, SIPs, loans, EMI reduction, and budgeting.
Tone: Authoritative, respectful, royal, trustworthy, encouraging, clear, and beginner-friendly.
Format: Use well-structured markdown with bold titles, bullet points, rupee symbol (₹), lakhs and crores.
Disclaimer: Conclude with a brief reminder that this is for educational purposes.`;

  const contents = [];
  // Add history
  if (Array.isArray(history)) {
    for (const msg of history.slice(-6)) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content || msg.text || '' }]
      });
    }
  }
  // Add current prompt
  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: contents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1500
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("No text candidate returned from Gemini API");
  }

  return text;
}

// ==========================================
// REQUEST ROUTING & HTTP SERVER
// ==========================================
const server = http.createServer(async (req, res) => {
  // Setup CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-key');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // 1. API: AI Chat Assistant
  if (pathname === '/api/ai/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const userMessage = payload.message || '';
        const history = payload.history || [];
        const mode = payload.mode || 'general';
        const clientApiKey = req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY;

        if (!userMessage.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "Message content cannot be empty." }));
          return;
        }

        // Try external Gemini API if key is present
        if (clientApiKey && clientApiKey.trim().length > 10) {
          try {
            const externalAIResponse = await callGeminiAPI(clientApiKey.trim(), userMessage, history);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              status: "success",
              source: "gemini-live-api",
              topic: "Live AI Advisory",
              response: externalAIResponse,
              keyTakeaways: [
                "Analysis generated live via Google Gemini AI backend.",
                "Review calculations and consult a certified financial advisor before major commitments."
              ],
              suggestedPrompts: [
                "Explain the tax impact of this in detail",
                "How does this fit into a 5-year financial plan?",
                "Give me a step-by-step action plan"
              ],
              timestamp: new Date().toISOString()
            }));
            return;
          } catch (geminiError) {
            console.error("External Gemini API failed, falling back to Royal Financial Reasoning Engine:", geminiError.message);
            // Gracefully fall through to built-in reasoning engine
          }
        }

        // Use built-in specialized Indian Financial Reasoning Engine
        const aiResult = generateFinancialAIResponse(userMessage, history, mode);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(aiResult));
      } catch (err) {
        console.error("Chat API processing error:", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Error processing financial intelligence query.", details: err.message }));
      }
    });
    return;
  }

  // 2. API: Market Overview
  if (pathname === '/api/market/overview' && req.method === 'GET') {
    const marketData = getMarketData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(marketData));
    return;
  }

  // 3. API: Financial News
  if (pathname === '/api/market/news' && req.method === 'GET') {
    const newsData = getFinancialNews();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newsData));
    return;
  }

  // 4. API: Government Schemes
  if (pathname === '/api/schemes' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: "success", count: SCHEMES_DATABASE.length, schemes: SCHEMES_DATABASE }));
    return;
  }

  // 5. API: Newsletter & Feedback
  if (pathname === '/api/newsletter' && req.method === 'POST') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: "success", message: "Namaste! You have successfully subscribed to the Paisa Pe Charcha Financial Intelligence Digest." }));
    return;
  }

  if (pathname === '/api/feedback' && req.method === 'POST') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: "success", message: "Dhanyawad! Your message has been received by our editorial and financial research desk." }));
    return;
  }

  // 6. Static File Serving
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // 404 handler or fallback to index.html for SPA routes
      const fallbackPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(fallbackPath, (fallbackErr, data) => {
        if (fallbackErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found - Paisa Pe Charcha');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Cache static assets, but revalidate html
    if (ext === '.html') {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }

    const stream = fs.createReadStream(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  PAISA PE CHARCHA - The Royal Financial Platform       `);
  console.log(`  Server listening on port ${PORT}                      `);
  console.log(`  URL: http://localhost:${PORT}                         `);
  console.log(`=======================================================`);
});
