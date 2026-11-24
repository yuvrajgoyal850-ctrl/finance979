/**
 * PAISA PE CHARCHA - GOVERNMENT SCHEMES DIRECTORY
 * Interactive filtering, eligibility checker, and verified official government portal links
 */

(function () {
  'use strict';

  let schemesData = [];

  // Fallback data in case of network issue
  const FALLBACK_SCHEMES = [
    {
      id: "pmjdy",
      name: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
      category: "Banking & Inclusion",
      tagline: "National Mission for Financial Inclusion for all unbanked households",
      interestRate: "Savings Bank Rate",
      eligibility: "Any Indian citizen aged 10+ without a basic bank account",
      minInvestment: "₹0 (Zero Balance)",
      maxLimit: "No limit (Overdraft up to ₹10,000)",
      taxBenefit: "Exempt up to ₹10,000 u/s 80TTA",
      keyBenefits: [
        "Zero minimum balance requirement",
        "Free RuPay debit card with ₹2,00,000 accidental insurance cover",
        "Overdraft (OD) facility up to ₹10,000 for eligible accounts",
        "Direct Benefit Transfer (DBT) credit for welfare subsidies"
      ],
      officialLink: "https://pmjdy.gov.in",
      officialPortalName: "Department of Financial Services, GoI"
    },
    {
      id: "ssy",
      name: "Sukanya Samriddhi Yojana (SSY)",
      category: "Girl Child Savings",
      tagline: "High-yield government-backed sovereign scheme for girl child education and marriage",
      interestRate: "8.2% p.a. (Tax-Free)",
      eligibility: "Parents of a girl child aged 10 years or below (Max 2 accounts per family)",
      minInvestment: "₹250 / year",
      maxLimit: "₹1,50,000 / year",
      taxBenefit: "Triple Tax Exemption (EEE) under Section 80C",
      keyBenefits: [
        "Highest interest rate among small savings schemes (8.2% p.a.)",
        "Sovereign guarantee from Government of India",
        "Maturity after 21 years or upon marriage after age 18",
        "50% partial withdrawal allowed for higher education after age 18"
      ],
      officialLink: "https://www.indiapost.gov.in",
      officialPortalName: "India Post & RBI Authorized Commercial Banks"
    },
    {
      id: "ppf",
      name: "Public Provident Fund (PPF)",
      category: "Long-term Wealth & Retirement",
      tagline: "Premier long-term sovereign savings instrument with guaranteed returns and EEE tax status",
      interestRate: "7.1% p.a. (Tax-Free)",
      eligibility: "All resident Indian individuals (one account per citizen)",
      minInvestment: "₹500 / year",
      maxLimit: "₹1,50,000 / year",
      taxBenefit: "EEE (Exempt-Exempt-Exempt) u/s 80C",
      keyBenefits: [
        "15-year tenure with flexible 5-year extensions",
        "Immune from attachment by court orders for debts or liabilities",
        "Loan facility available from 3rd to 6th financial year",
        "Partial withdrawals permitted from 7th year onward"
      ],
      officialLink: "https://www.nsiindia.gov.in",
      officialPortalName: "National Savings Institute / India Post"
    },
    {
      id: "nps",
      name: "National Pension System (NPS)",
      category: "Pension & Retirement",
      tagline: "Low-cost market-linked voluntary pension system regulated by PFRDA",
      interestRate: "Market-linked (9.5% – 12.8% historical)",
      eligibility: "Indian citizens (Resident and NRI) aged 18 to 70 years",
      minInvestment: "₹1,000 / year",
      maxLimit: "No upper limit",
      taxBenefit: "Section 80CCD(1) + Exclusive Section 80CCD(1B) up to ₹50,000",
      keyBenefits: [
        "Lowest fund management fee in the world (approx 0.09%)",
        "Flexible equity exposure up to 75% for wealth accumulation",
        "60% lump sum at age 60 is 100% tax-free",
        "Mandatory 40% annuity ensures regular guaranteed lifetime pension"
      ],
      officialLink: "https://www.pfrda.org.in",
      officialPortalName: "PFRDA / Protean CRA"
    },
    {
      id: "apy",
      name: "Atal Pension Yojana (APY)",
      category: "Social Security & Pension",
      tagline: "Guaranteed monthly pension scheme for workers in the unorganized sector",
      interestRate: "Guaranteed ₹1,000 to ₹5,000 / month pension",
      eligibility: "Citizens aged 18 to 40 years with a bank account (Non-taxpayers)",
      minInvestment: "Auto-debit based on age (e.g. ₹210/mo at age 18 for ₹5,000 pension)",
      maxLimit: "₹5,000 / month lifetime pension",
      taxBenefit: "Eligible under Section 80CCD",
      keyBenefits: [
        "Sovereign guaranteed minimum pension backed by GoI",
        "Spouse continues to receive lifetime pension upon subscriber's demise",
        "Accumulated corpus returned to legal heirs after spouse",
        "Hassle-free automated monthly bank debit"
      ],
      officialLink: "https://www.npscra.nsdl.co.in",
      officialPortalName: "Protean / NSDL CRA"
    },
    {
      id: "pmjjby",
      name: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
      category: "Life Insurance",
      tagline: "Affordable one-year renewable group life insurance protection",
      interestRate: "Pure Term Life Cover",
      eligibility: "Savings bank account holders aged 18 to 50 years",
      minInvestment: "₹436 / year premium",
      maxLimit: "₹2,00,000 life insurance cover",
      taxBenefit: "Deduction under Section 80C",
      keyBenefits: [
        "₹2,00,000 term life insurance coverage for just ₹436/year (~₹1.2 per day)",
        "Covers death due to any cause (natural, illness, accident)",
        "Paperless enrollment via bank savings auto-debit",
        "Direct claim settlement into nominee's account"
      ],
      officialLink: "https://financialservices.gov.in",
      officialPortalName: "Department of Financial Services, GoI"
    },
    {
      id: "pmsby",
      name: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
      category: "Accidental Insurance",
      tagline: "Nationwide micro-insurance scheme covering accidental death and disability",
      interestRate: "Accidental Insurance Cover",
      eligibility: "Bank account holders aged 18 to 70 years",
      minInvestment: "₹20 / year premium",
      maxLimit: "₹2,00,000 accidental cover",
      taxBenefit: "Applicable under Section 80C",
      keyBenefits: [
        "Unbeatable nominal premium of only ₹20 per year",
        "₹2,00,000 for accidental death or permanent total disability",
        "₹1,00,000 for permanent partial disability",
        "Simple annual auto-debit every May from savings account"
      ],
      officialLink: "https://financialservices.gov.in",
      officialPortalName: "Department of Financial Services, GoI"
    },
    {
      id: "scss",
      name: "Senior Citizen Savings Scheme (SCSS)",
      category: "Senior Citizens",
      tagline: "Premier quarterly-interest paying sovereign deposit scheme for retirees",
      interestRate: "8.2% p.a. (Paid Quarterly)",
      eligibility: "Individuals aged 60+ (or 55+ for opted VRS retirees)",
      minInvestment: "₹1,000",
      maxLimit: "₹30,00,000",
      taxBenefit: "Section 80C eligible; interest exempt up to ₹50,000 u/s 80TTB",
      keyBenefits: [
        "Guaranteed quarterly income credited directly on 1st of every quarter",
        "Maximum deposit limit raised to ₹30 Lakhs",
        "5-year tenure extendable by 3 years",
        "Backed by absolute sovereign guarantee from Government of India"
      ],
      officialLink: "https://www.indiapost.gov.in",
      officialPortalName: "India Post & Commercial Banks"
    }
  ];

  const container = document.getElementById('schemesGridContainer');
  const filterButtons = document.querySelectorAll('.scheme-filter-btn');

  async function fetchSchemes() {
    try {
      const res = await fetch('/api/schemes');
      if (res.ok) {
        const data = await res.json();
        schemesData = data.schemes || FALLBACK_SCHEMES;
      } else {
        schemesData = FALLBACK_SCHEMES;
      }
    } catch (e) {
      schemesData = FALLBACK_SCHEMES;
    }
    renderSchemes('all');
  }

  function renderSchemes(filter = 'all') {
    if (!container) return;
    container.innerHTML = '';

    const list = filter === 'all'
      ? schemesData
      : schemesData.filter(item => {
          const cat = item.category.toLowerCase();
          if (filter === 'girl' && cat.includes('girl')) return true;
          if (filter === 'senior' && cat.includes('senior')) return true;
          if (filter === 'pension' && (cat.includes('pension') || cat.includes('retirement'))) return true;
          if (filter === 'insurance' && cat.includes('insurance')) return true;
          if (filter === 'savings' && (cat.includes('saving') || cat.includes('inclusion'))) return true;
          return false;
        });

    list.forEach(scheme => {
      const card = document.createElement('div');
      card.className = 'scheme-royal-card';
      card.innerHTML = `
        <div>
          <div class="scheme-top-badge">
            <span class="scheme-cat-pill">${scheme.category}</span>
            <span class="scheme-interest-tag"><i class="fa-solid fa-percent"></i> ${scheme.interestRate}</span>
          </div>
          <h4 class="scheme-name">${scheme.name}</h4>
          <p class="scheme-tagline">${scheme.tagline}</p>

          <ul class="scheme-details-list">
            <li><i class="fa-solid fa-user-check"></i> <strong>Eligibility:</strong> ${scheme.eligibility}</li>
            <li><i class="fa-solid fa-sack-dollar"></i> <strong>Min / Max:</strong> ${scheme.minInvestment} / ${scheme.maxLimit}</li>
            <li><i class="fa-solid fa-receipt"></i> <strong>Tax Benefits:</strong> ${scheme.taxBenefit}</li>
          </ul>

          <div style="margin-bottom: 18px;">
            <p style="font-size:0.8rem; font-weight:700; color:#D4AF37; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px;">Key Highlights:</p>
            <ul style="font-size:0.82rem; color:#CBD5E1; padding-left:18px; line-height:1.6;">
              ${scheme.keyBenefits.map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
        </div>

        <a href="${scheme.officialLink}" target="_blank" rel="noopener noreferrer" class="scheme-official-btn">
          <span>Official Portal (${scheme.officialPortalName})</span>
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      `;
      container.appendChild(card);
    });
  }

  // Filter Event Listeners
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const f = this.getAttribute('data-filter') || 'all';
      renderSchemes(f);
    });
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchSchemes);
  } else {
    fetchSchemes();
  }

})();
