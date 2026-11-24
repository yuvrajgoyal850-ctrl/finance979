/**
 * PAISA PE CHARCHA - INDIAN FINANCIAL KNOWLEDGE CENTRE
 * Institutional guides, category filtering, search, and reading modal
 */

(function () {
  'use strict';

  const KNOWLEDGE_ARTICLES = [
    {
      id: "kb-rbi",
      title: "Reserve Bank of India (RBI) & Indian Banking System",
      category: "banking",
      categoryName: "Banking & RBI",
      icon: "fa-building-columns",
      readTime: "6 min read",
      authority: "Statutory Regulator: RBI",
      summary: "Understand how the central bank steers the Indian economy via the Repo Rate, bank reserve requirements (CRR, SLR), and protects depositors via the ₹5 Lakh DICGC insurance.",
      content: `
        <h3>The Reserve Bank of India: Guardian of Monetary Stability</h3>
        <p>Established on April 1, 1935, under the Reserve Bank of India Act, 1934, the RBI serves as India's central banking institution. It controls monetary policy, issues bank notes, and regulates commercial and cooperative banks.</p>
        
        <h4>Key Monetary Policy Instruments:</h4>
        <ul>
          <li><strong>Policy Repo Rate:</strong> The benchmark interest rate at which the RBI lends short-term money to commercial banks against government securities. When inflation rises, RBI increases the repo rate to curb excessive borrowing. When repo rate drops, home and auto loan EMIs become cheaper.</li>
          <li><strong>Cash Reserve Ratio (CRR):</strong> The percentage of a commercial bank's total deposits that must be maintained with the RBI in cash form without interest.</li>
          <li><strong>Statutory Liquidity Ratio (SLR):</strong> The percentage of deposits banks must invest in approved safe assets like Government of India bonds.</li>
        </ul>

        <h4>The DICGC ₹5,00,000 Safety Net:</h4>
        <p>Under the Deposit Insurance and Credit Guarantee Corporation (DICGC) Act, each depositor in an insured commercial bank is guaranteed up to <strong>₹5,00,000 (₹5 Lakhs)</strong> across both principal and interest if a bank fails. This applies per depositor, per bank across all branches.</p>
      `
    },
    {
      id: "kb-sebi",
      title: "SEBI & Capital Market Regulations for Retail Investors",
      category: "markets",
      categoryName: "Capital Markets",
      icon: "fa-chart-line",
      readTime: "7 min read",
      authority: "Statutory Regulator: SEBI",
      summary: "How the Securities and Exchange Board of India safeguards your money through strict disclosure rules, ASBA IPO bidding, and the online SCORES dispute redressal mechanism.",
      content: `
        <h3>Securities and Exchange Board of India (SEBI)</h3>
        <p>SEBI was established as a statutory body in 1992 to protect the interests of investors in securities and promote the orderly development of Indian securities markets.</p>

        <h4>Cornerstone Investor Protections:</h4>
        <ul>
          <li><strong>ASBA (Application Supported by Blocked Amount):</strong> When you apply for an IPO in India, your application money remains safely in your own bank account, earning normal savings interest, until shares are actually allotted.</li>
          <li><strong>SCORES (SEBI Complaints Redress System):</strong> A centralized online grievance redress system. If your registered stockbroker, Depository Participant (CDSL/NSDL), or mutual fund AMC fails to resolve your complaint within 30 days, you can lodge a grievance directly on SCORES with statutory escalation.</li>
          <li><strong>Mandatory Risk Disclosures:</strong> SEBI mandates that brokerages clearly warn traders that 9 out of 10 individual traders in equity futures and options (F&O) incur net financial losses.</li>
        </ul>
      `
    },
    {
      id: "kb-tax",
      title: "Income Tax Architecture: New vs. Old Regime Masterclass",
      category: "tax",
      categoryName: "Direct Taxation",
      icon: "fa-file-invoice-dollar",
      readTime: "8 min read",
      authority: "CBDT & Ministry of Finance",
      summary: "Detailed breakdown of Section 115BAC, standard deductions, Section 87A full tax rebates up to ₹7.75 Lakhs, and tax-saving deductions under Sections 80C, 80D, and NPS.",
      content: `
        <h3>The Dual Income Tax Architecture in India</h3>
        <p>Salaried and individual taxpayers can evaluate their tax liability between two regimes every financial year:</p>
        
        <h4>The New Tax Regime (Default u/s 115BAC):</h4>
        <ul>
          <li>Standard deduction enhanced to <strong>₹75,000</strong> for salaried employees.</li>
          <li>Full tax rebate under <strong>Section 87A</strong> for taxable income up to ₹7,00,000. This means salaried individuals earning up to <strong>₹7,75,000 pay zero income tax</strong>!</li>
          <li>Slab brackets: 0-3L Nil, 3-7L 5%, 7-10L 10%, 10-12L 15%, 12-15L 20%, above 15L 30%.</li>
        </ul>

        <h4>The Old Tax Regime Deductions:</h4>
        <ul>
          <li><strong>Section 80C:</strong> Up to ₹1,50,000 for EPF, PPF, ELSS, SSY, Life Insurance, and Home Loan Principal.</li>
          <li><strong>Section 80D:</strong> Up to ₹25,000 for self/family and ₹50,000 for senior citizen parents' health insurance.</li>
          <li><strong>Section 80CCD(1B):</strong> Additional exclusive deduction of ₹50,000 for National Pension System (NPS).</li>
          <li><strong>Section 24(b):</strong> Up to ₹2,00,000 deduction on home loan interest.</li>
        </ul>
      `
    },
    {
      id: "kb-mutual-funds",
      title: "Mutual Funds Demystified: Direct Plans vs. Regular Plans",
      category: "investments",
      categoryName: "Mutual Funds",
      icon: "fa-coins",
      readTime: "6 min read",
      authority: "AMFI & SEBI",
      summary: "Understand Net Asset Value (NAV), Total Expense Ratio (TER), index funds, and why choosing Direct Plans over Regular Plans can save you over ₹30 Lakhs in lifetime commissions.",
      content: `
        <h3>The Power of Mutual Fund Investing</h3>
        <p>A mutual fund pools money from thousands of investors to invest in a diversified portfolio of equities, debt instruments, or gold, managed by professional SEBI-licensed Fund Managers.</p>

        <h4>Direct Plan vs. Regular Plan:</h4>
        <ul>
          <li><strong>Regular Plans:</strong> Sold through distributors, agents, or relationship managers. The AMC pays an ongoing commission (0.5% to 1.2% every year) from your invested money to the intermediary.</li>
          <li><strong>Direct Plans:</strong> Purchased directly from the AMC or direct platforms. Zero distributor commissions, leading to a higher NAV and significantly superior long-term compounded wealth.</li>
        </ul>

        <h4>Capital Gains Taxation (Equity Funds):</h4>
        <ul>
          <li><strong>LTCG (Holding > 12 months):</strong> Tax-free up to ₹1.25 Lakh per financial year; taxed at 12.5% on gains exceeding ₹1.25 Lakh.</li>
          <li><strong>STCG (Holding ≤ 12 months):</strong> Taxed flat at 20%.</li>
        </ul>
      `
    },
    {
      id: "kb-stocks",
      title: "Stock Market Fundamentals: NSE, BSE & Demat Accounts",
      category: "markets",
      categoryName: "Stock Trading",
      icon: "fa-arrow-trend-up",
      readTime: "7 min read",
      authority: "NSE / BSE / SEBI",
      summary: "A beginner's guide to Indian stock exchanges, NIFTY 50, SENSEX, price-to-earnings (P/E) ratios, market capitalization, and long-term equity investing principles.",
      content: `
        <h3>Understanding the Indian Stock Market</h3>
        <p>India is home to two premier stock exchanges: the <strong>National Stock Exchange (NSE)</strong> and the <strong>Bombay Stock Exchange (BSE)</strong>, which is Asia's oldest stock exchange (founded in 1875).</p>

        <h4>Key Core Concepts:</h4>
        <ul>
          <li><strong>Demat & Trading Account:</strong> A Demat account holds your shares electronically (with NSDL or CDSL), while a Trading account interfaces with the exchange to execute buy and sell orders.</li>
          <li><strong>NIFTY 50 & SENSEX:</strong> Benchmark indices representing the largest and most liquid blue-chip companies in India across major sectors.</li>
          <li><strong>Price-to-Earnings (P/E) Ratio:</strong> Compares a company's share price to its annual earnings per share. It helps assess whether a stock is attractively priced or trading at a premium valuation.</li>
        </ul>
      `
    },
    {
      id: "kb-budgeting",
      title: "Personal Budgeting Mastery & The 50/30/20 Rule",
      category: "planning",
      categoryName: "Budgeting",
      icon: "fa-wallet",
      readTime: "5 min read",
      authority: "Financial Planning Standards Board",
      summary: "How to allocate your monthly take-home salary into Needs (50%), Wants (30%), and automated Savings (20%), and build a bulletproof 6-month liquid emergency fund.",
      content: `
        <h3>Building Disciplined Personal Cash Flow</h3>
        <p>The foundation of lasting financial freedom is not how much you earn, but how systematically you allocate your monthly income.</p>

        <h4>The 50 / 30 / 20 Framework:</h4>
        <ul>
          <li><strong>50% Needs:</strong> Rent/Home EMI, groceries, children's school fees, utility bills, and basic medical insurance.</li>
          <li><strong>30% Wants:</strong> Vacations, dining out, entertainment, shopping, gadgets, and lifestyle upgrades.</li>
          <li><strong>20% Savings & Investments:</strong> Automated SIPs, emergency fund deposits, PPF, and voluntary retirement contributions.</li>
        </ul>

        <h4>The 6-Month Emergency Corpus:</h4>
        <p>Calculate your mandatory monthly living expenses (Needs + EMIs). Maintain <strong>6 to 9 times that figure</strong> in high-liquidity instruments like auto-sweep fixed deposits or liquid debt mutual funds. Never invest emergency reserves in volatile stocks or real estate.</p>
      `
    },
    {
      id: "kb-upi",
      title: "Digital Payments, UPI & Cyber Fraud Prevention",
      category: "banking",
      categoryName: "Digital Security",
      icon: "fa-shield-halved",
      readTime: "5 min read",
      authority: "NPCI & Ministry of Home Affairs",
      summary: "The essential safety rules for UPI, understanding that UPI PIN is never entered to receive money, and immediate emergency steps to dial 1930 for cyber fraud.",
      content: `
        <h3>UPI: India's Revolutionary Digital Payment Infrastructure</h3>
        <p>Developed by the National Payments Corporation of India (NPCI), UPI (Unified Payments Interface) powers instant real-time bank transfers 24/7/365.</p>

        <h4>The Golden Rules of Digital Safety:</h4>
        <ul>
          <li><strong>PIN is ONLY for Debiting:</strong> You NEVER need to enter your UPI PIN or scan a QR code to receive money. If someone asks you to enter a PIN to receive a lottery, prize, or refund, it is 100% a scam.</li>
          <li><strong>Avoid Screen Sharing Apps:</strong> Never install remote desktop apps (like AnyDesk, TeamViewer) at the request of an unknown caller claiming to be bank customer care.</li>
          <li><strong>National Cyber Crime Helpline 1930:</strong> If any fraudulent debit occurs, immediately dial <strong>1930</strong> or register a complaint on <a href="https://cybercrime.gov.in" target="_blank" style="color:#FF7722;text-decoration:underline;">cybercrime.gov.in</a> within 24 hours to freeze the defrauded funds in interbank transit.</li>
        </ul>
      `
    },
    {
      id: "kb-insurance",
      title: "Insurance Blueprint: Pure Term vs. ULIPs & Health Cover",
      category: "planning",
      categoryName: "Insurance",
      icon: "fa-user-shield",
      readTime: "6 min read",
      authority: "IRDAI",
      summary: "Why you must strictly separate insurance from investments: buy pure Term Insurance with 15-20x annual income cover and comprehensive family health insurance.",
      content: `
        <h3>Risk Management: Guarding Your Family's Future</h3>
        <p>Regulated by the Insurance Regulatory and Development Authority of India (IRDAI), insurance is a pure risk-transfer mechanism, not a wealth-building product.</p>

        <h4>Pure Term Life Insurance:</h4>
        <ul>
          <li>Provides a high sum assured (e.g. ₹1 Crore to ₹2 Crore) for an affordable annual premium (often ₹10,000 to ₹18,000 for healthy young adults).</li>
          <li>Cover should ideally equal <strong>15 to 20 times your annual gross income</strong> plus all outstanding liabilities (such as Home Loans).</li>
        </ul>

        <h4>Why Avoid ULIPs and Endowment Plans:</h4>
        <p>Endowment and traditional money-back insurance policies bundle insurance with low-yield investments, typically generating returns of only 4% to 5.5% (failing to beat inflation). Instead, follow the golden principle: <em>Buy pure term insurance, and invest the remaining surplus into diversified equity index funds.</em></p>
      `
    },
    {
      id: "kb-schemes",
      title: "Government Sovereign Savings: SSY, PPF & Senior Citizens",
      category: "schemes",
      categoryName: "Govt Savings",
      icon: "fa-landmark-flag",
      readTime: "7 min read",
      authority: "Department of Economic Affairs",
      summary: "Deep dive into sovereign-guaranteed small savings schemes: Sukanya Samriddhi Yojana (8.2%), PPF (7.1%), and Senior Citizen Savings Scheme (8.2%) with EEE tax benefits.",
      content: `
        <h3>Sovereign Guarantees: Zero Credit Risk Wealth</h3>
        <p>Administered by the Ministry of Finance and operated through India Post and authorized commercial banks, small savings schemes offer sovereign security with quarterly interest declarations.</p>

        <h4>Flagship Sovereign Instruments:</h4>
        <ul>
          <li><strong>Sukanya Samriddhi Yojana (SSY):</strong> 8.2% p.a. interest, highest among small savings. Available for girls up to age 10. EEE tax status.</li>
          <li><strong>Public Provident Fund (PPF):</strong> 7.1% p.a. interest. 15-year tenure with sovereign protection against court attachments. EEE tax status.</li>
          <li><strong>Senior Citizen Savings Scheme (SCSS):</strong> 8.2% p.a. interest paid quarterly directly into bank accounts for retirees aged 60+. Deposit limit up to ₹30 Lakhs.</li>
        </ul>
      `
    }
  ];

  // DOM Elements
  const container = document.getElementById('knowledgeGridContainer');
  const filterPills = document.querySelectorAll('.knowledge-filter-pill');
  const modalOverlay = document.getElementById('knowledgeModalOverlay');
  const modalTitle = document.getElementById('knowledgeModalTitle');
  const modalAuthority = document.getElementById('knowledgeModalAuthority');
  const modalBody = document.getElementById('knowledgeModalBody');
  const modalCloseBtn = document.getElementById('knowledgeModalCloseBtn');

  function renderArticles(categoryFilter = 'all') {
    if (!container) return;
    container.innerHTML = '';

    const filtered = categoryFilter === 'all'
      ? KNOWLEDGE_ARTICLES
      : KNOWLEDGE_ARTICLES.filter(item => item.category === categoryFilter);

    filtered.forEach(article => {
      const card = document.createElement('div');
      card.className = 'knowledge-card';
      card.innerHTML = `
        <div>
          <div class="knowledge-badge-row">
            <span class="knowledge-category-tag">${article.categoryName}</span>
            <div class="knowledge-authority-icon">
              <i class="fa-solid ${article.icon}"></i>
            </div>
          </div>
          <h4 class="knowledge-title">${article.title}</h4>
          <p class="knowledge-summary">${article.summary}</p>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(212,175,55,0.15); padding-top:14px; margin-top:8px;">
          <span style="font-size:0.75rem; color:#94A3B8;"><i class="fa-regular fa-clock"></i> ${article.readTime}</span>
          <button class="knowledge-action-link" data-id="${article.id}">
            Read Guide <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      `;
      container.appendChild(card);
    });

    // Attach click events to "Read Guide"
    document.querySelectorAll('.knowledge-action-link').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        openArticleModal(id);
      });
    });
  }

  function openArticleModal(id) {
    const article = KNOWLEDGE_ARTICLES.find(a => a.id === id);
    if (!article || !modalOverlay) return;

    if (modalTitle) modalTitle.innerText = article.title;
    if (modalAuthority) modalAuthority.innerText = `${article.authority} • ${article.readTime}`;
    if (modalBody) modalBody.innerHTML = article.content;

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  }

  // Filter Pills Event
  filterPills.forEach(pill => {
    pill.addEventListener('click', function () {
      filterPills.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const cat = this.getAttribute('data-category') || 'all';
      renderArticles(cat);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Initial render
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => renderArticles('all'));
  } else {
    renderArticles('all');
  }

})();
