/**
 * PAISA PE CHARCHA - 10 FINANCIAL CALCULATORS ENGINE
 * Precision formulas, Indian Rupee formatting (Lakhs & Crores), Chart.js integration
 */

(function () {
  'use strict';

  // Helper: Format Rupee with Indian grouping (e.g. ₹12,34,567)
  function formatINR(number) {
    if (isNaN(number) || number === null) return '₹0';
    const rounded = Math.round(number);
    return '₹' + rounded.toLocaleString('en-IN');
  }

  // Helper: Format Lakhs and Crores text
  function formatInWords(num) {
    if (num >= 10000000) {
      return (num / 10000000).toFixed(2) + ' Crores';
    } else if (num >= 100000) {
      return (num / 100000).toFixed(2) + ' Lakhs';
    }
    return '';
  }

  // Chart instances repository
  const charts = {};

  // Initialize or update a doughnut chart
  function renderDoughnutChart(canvasId, labels, data, colors) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;

    if (charts[canvasId]) {
      charts[canvasId].data.labels = labels;
      charts[canvasId].data.datasets[0].data = data;
      charts[canvasId].data.datasets[0].backgroundColor = colors;
      charts[canvasId].update();
      return;
    }

    const ctx = canvas.getContext('2d');
    charts[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderColor: '#061326',
          borderWidth: 2,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#CBD5E1',
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
              padding: 14
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return ` ${context.label}: ${formatINR(context.parsed)}`;
              }
            }
          }
        },
        cutout: '68%'
      }
    });
  }

  // Synchronize slider and number input
  function syncInputs(sliderId, inputId, callback) {
    const slider = document.getElementById(sliderId);
    const input = document.getElementById(inputId);
    if (!slider || !input) return;

    slider.addEventListener('input', () => {
      input.value = slider.value;
      if (callback) callback();
    });

    input.addEventListener('input', () => {
      let val = parseFloat(input.value);
      if (!isNaN(val)) {
        if (slider.min && val < parseFloat(slider.min)) val = parseFloat(slider.min);
        if (slider.max && val > parseFloat(slider.max)) val = parseFloat(slider.max);
        slider.value = val;
      }
      if (callback) callback();
    });
  }

  // =========================================================================
  // 1. SIP CALCULATOR
  // Formula: M = P * ({[1 + i]^n - 1} / i) * (1 + i)
  // =========================================================================
  function calculateSIP() {
    const monthlyInv = parseFloat(document.getElementById('sip-amount')?.value || 10000);
    const rate = parseFloat(document.getElementById('sip-rate')?.value || 12);
    const years = parseFloat(document.getElementById('sip-years')?.value || 10);

    const i = (rate / 100) / 12;
    const n = years * 12;

    const totalInvested = monthlyInv * n;
    let futureValue = 0;
    if (i > 0) {
      futureValue = monthlyInv * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    } else {
      futureValue = totalInvested;
    }
    const wealthGained = Math.max(0, futureValue - totalInvested);

    const fvEl = document.getElementById('sip-result-total');
    const invEl = document.getElementById('sip-result-invested');
    const retEl = document.getElementById('sip-result-wealth');
    const wordsEl = document.getElementById('sip-result-words');

    if (fvEl) fvEl.innerText = formatINR(futureValue);
    if (invEl) invEl.innerText = formatINR(totalInvested);
    if (retEl) retEl.innerText = formatINR(wealthGained);
    if (wordsEl) wordsEl.innerText = formatInWords(futureValue);

    renderDoughnutChart('sipChart', ['Invested Amount', 'Wealth Gained'], [totalInvested, wealthGained], ['#1E3A8A', '#D4AF37']);
  }

  // =========================================================================
  // 2. EMI CALCULATOR
  // Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  // =========================================================================
  function calculateEMI() {
    const principal = parseFloat(document.getElementById('emi-amount')?.value || 3000000);
    const rateAnnual = parseFloat(document.getElementById('emi-rate')?.value || 8.5);
    const tenureYears = parseFloat(document.getElementById('emi-tenure')?.value || 20);

    const r = (rateAnnual / 100) / 12;
    const n = tenureYears * 12;

    let emi = 0;
    if (r > 0) {
      emi = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    } else {
      emi = principal / n;
    }

    const totalPayment = emi * n;
    const totalInterest = Math.max(0, totalPayment - principal);

    const emiEl = document.getElementById('emi-result-monthly');
    const prinEl = document.getElementById('emi-result-principal');
    const intEl = document.getElementById('emi-result-interest');
    const totEl = document.getElementById('emi-result-total');

    if (emiEl) emiEl.innerText = formatINR(emi);
    if (prinEl) prinEl.innerText = formatINR(principal);
    if (intEl) intEl.innerText = formatINR(totalInterest);
    if (totEl) totEl.innerText = formatINR(totalPayment);

    renderDoughnutChart('emiChart', ['Principal Loan', 'Total Interest'], [principal, totalInterest], ['#0284C7', '#FF7722']);
  }

  // =========================================================================
  // 3. COMPOUND INTEREST CALCULATOR
  // Formula: A = P * (1 + r/n)^(n*t)
  // =========================================================================
  function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('ci-principal')?.value || 100000);
    const annualRate = parseFloat(document.getElementById('ci-rate')?.value || 8);
    const years = parseFloat(document.getElementById('ci-years')?.value || 5);
    const freq = parseFloat(document.getElementById('ci-frequency')?.value || 4); // default quarterly

    const n = freq;
    const t = years;
    const r = annualRate / 100;

    const maturityValue = principal * Math.pow(1 + (r / n), n * t);
    const interestEarned = maturityValue - principal;

    const matEl = document.getElementById('ci-result-maturity');
    const prinEl = document.getElementById('ci-result-principal');
    const intEl = document.getElementById('ci-result-interest');

    if (matEl) matEl.innerText = formatINR(maturityValue);
    if (prinEl) prinEl.innerText = formatINR(principal);
    if (intEl) intEl.innerText = formatINR(interestEarned);

    renderDoughnutChart('ciChart', ['Principal Deposit', 'Compound Interest'], [principal, interestEarned], ['#1E3A8A', '#10B981']);
  }

  // =========================================================================
  // 4. INCOME TAX CALCULATOR (Old vs New Regime FY 2024-25 / 2025-26)
  // =========================================================================
  function calculateIncomeTax() {
    const grossIncome = parseFloat(document.getElementById('tax-income')?.value || 1200000);
    const deductions80C = Math.min(150000, parseFloat(document.getElementById('tax-80c')?.value || 150000));
    const deductions80D = parseFloat(document.getElementById('tax-80d')?.value || 25000);
    const hraExemption = parseFloat(document.getElementById('tax-hra')?.value || 0);
    const homeLoanInt = Math.min(200000, parseFloat(document.getElementById('tax-homeloan')?.value || 0));
    const nps80CCD = Math.min(50000, parseFloat(document.getElementById('tax-nps')?.value || 0));

    // NEW TAX REGIME (Section 115BAC)
    // Standard deduction enhanced to ₹75,000 for salaried
    const newStdDeduction = 75000;
    const newTaxableIncome = Math.max(0, grossIncome - newStdDeduction);

    let newTax = 0;
    // Slabs:
    // 0 - 3L : Nil
    // 3L - 7L : 5%
    // 7L - 10L : 10%
    // 10L - 12L : 15%
    // 12L - 15L : 20%
    // > 15L : 30%
    if (newTaxableIncome > 1500000) {
      newTax += (newTaxableIncome - 1500000) * 0.30;
      newTax += 300000 * 0.20; // 12-15L
      newTax += 200000 * 0.15; // 10-12L
      newTax += 300000 * 0.10; // 7-10L
      newTax += 400000 * 0.05; // 3-7L
    } else if (newTaxableIncome > 1200000) {
      newTax += (newTaxableIncome - 1200000) * 0.20;
      newTax += 200000 * 0.15;
      newTax += 300000 * 0.10;
      newTax += 400000 * 0.05;
    } else if (newTaxableIncome > 1000000) {
      newTax += (newTaxableIncome - 1000000) * 0.15;
      newTax += 300000 * 0.10;
      newTax += 400000 * 0.05;
    } else if (newTaxableIncome > 700000) {
      newTax += (newTaxableIncome - 700000) * 0.10;
      newTax += 400000 * 0.05;
    } else if (newTaxableIncome > 300000) {
      newTax += (newTaxableIncome - 300000) * 0.05;
    }

    // Section 87A rebate for New Regime: If taxable income <= 7,00,000, rebate covers full tax!
    if (newTaxableIncome <= 700000) {
      newTax = 0;
    }
    const newTotalTax = newTax > 0 ? newTax * 1.04 : 0; // 4% Cess

    // OLD TAX REGIME
    const oldStdDeduction = 50000;
    const totalOldDeductions = oldStdDeduction + deductions80C + deductions80D + hraExemption + homeLoanInt + nps80CCD;
    const oldTaxableIncome = Math.max(0, grossIncome - totalOldDeductions);

    let oldTax = 0;
    // Slabs:
    // 0 - 2.5L : Nil
    // 2.5L - 5L : 5%
    // 5L - 10L : 20%
    // > 10L : 30%
    if (oldTaxableIncome > 1000000) {
      oldTax += (oldTaxableIncome - 1000000) * 0.30;
      oldTax += 500000 * 0.20;
      oldTax += 250000 * 0.05;
    } else if (oldTaxableIncome > 500000) {
      oldTax += (oldTaxableIncome - 500000) * 0.20;
      oldTax += 250000 * 0.05;
    } else if (oldTaxableIncome > 250000) {
      oldTax += (oldTaxableIncome - 250000) * 0.05;
    }

    if (oldTaxableIncome <= 500000) {
      oldTax = 0; // Section 87A rebate under old regime
    }
    const oldTotalTax = oldTax > 0 ? oldTax * 1.04 : 0; // 4% Cess

    // UI Updates
    const newTaxEl = document.getElementById('tax-result-new');
    const oldTaxEl = document.getElementById('tax-result-old');
    const diffEl = document.getElementById('tax-result-diff');
    const adviceEl = document.getElementById('tax-regime-advice');

    if (newTaxEl) newTaxEl.innerText = formatINR(newTotalTax);
    if (oldTaxEl) oldTaxEl.innerText = formatINR(oldTotalTax);

    const savings = Math.abs(oldTotalTax - newTotalTax);
    if (newTotalTax < oldTotalTax) {
      if (diffEl) diffEl.innerText = `Save ${formatINR(savings)} in New Regime`;
      if (adviceEl) adviceEl.innerHTML = `<span class="text-emerald"><i class="fa-solid fa-circle-check"></i> New Tax Regime is more beneficial for you by ${formatINR(savings)}.</span>`;
    } else if (oldTotalTax < newTotalTax) {
      if (diffEl) diffEl.innerText = `Save ${formatINR(savings)} in Old Regime`;
      if (adviceEl) adviceEl.innerHTML = `<span class="text-gold-gradient"><i class="fa-solid fa-circle-check"></i> Old Tax Regime saves you ${formatINR(savings)} due to your deductions.</span>`;
    } else {
      if (diffEl) diffEl.innerText = `Both regimes yield equal tax`;
      if (adviceEl) adviceEl.innerText = `Both regimes have identical tax liability. Prefer the New Regime for zero documentation hassle.`;
    }

    renderTaxBarChart('taxChart', ['New Regime Tax', 'Old Regime Tax'], [newTotalTax, oldTotalTax]);
  }

  function renderTaxBarChart(canvasId, labels, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;

    if (charts[canvasId]) {
      charts[canvasId].data.datasets[0].data = data;
      charts[canvasId].update();
      return;
    }

    const ctx = canvas.getContext('2d');
    charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Tax (incl. 4% Cess)',
          data: data,
          backgroundColor: ['#10B981', '#FF7722'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` Tax: ${formatINR(ctx.parsed.y)}`
            }
          }
        },
        scales: {
          y: {
            ticks: { color: '#94A3B8', callback: (val) => '₹' + (val / 1000) + 'k' },
            grid: { color: 'rgba(255,255,255,0.06)' }
          },
          x: {
            ticks: { color: '#E2E8F0' },
            grid: { display: false }
          }
        }
      }
    });
  }

  // =========================================================================
  // 5. FIXED DEPOSIT (FD) CALCULATOR
  // Indian banks compound FD quarterly: A = P * (1 + r/4)^(4*t)
  // =========================================================================
  function calculateFD() {
    const deposit = parseFloat(document.getElementById('fd-amount')?.value || 100000);
    const rate = parseFloat(document.getElementById('fd-rate')?.value || 7.25);
    const tenureYears = parseFloat(document.getElementById('fd-years')?.value || 3);

    const r = rate / 100;
    const maturity = deposit * Math.pow(1 + (r / 4), 4 * tenureYears);
    const interest = maturity - deposit;

    const matEl = document.getElementById('fd-result-total');
    const depEl = document.getElementById('fd-result-principal');
    const intEl = document.getElementById('fd-result-interest');

    if (matEl) matEl.innerText = formatINR(maturity);
    if (depEl) depEl.innerText = formatINR(deposit);
    if (intEl) intEl.innerText = formatINR(interest);

    renderDoughnutChart('fdChart', ['Principal Invested', 'Total Interest'], [deposit, interest], ['#143362', '#D4AF37']);
  }

  // =========================================================================
  // 6. RECURRING DEPOSIT (RD) CALCULATOR
  // Indian Banking formula (quarterly compounding of monthly deposits)
  // =========================================================================
  function calculateRD() {
    const monthlyDeposit = parseFloat(document.getElementById('rd-amount')?.value || 5000);
    const rate = parseFloat(document.getElementById('rd-rate')?.value || 7.0);
    const months = parseFloat(document.getElementById('rd-months')?.value || 24);

    const totalInvested = monthlyDeposit * months;
    const r = rate / 100;
    let maturity = 0;

    // Standard Indian Post Office / Bank RD quarterly compounding formula
    for (let m = 1; m <= months; m++) {
      // number of quarters remaining
      const quarters = (months - m + 1) / 3;
      maturity += monthlyDeposit * Math.pow(1 + (r / 4), quarters);
    }
    const interest = Math.max(0, maturity - totalInvested);

    const matEl = document.getElementById('rd-result-total');
    const depEl = document.getElementById('rd-result-principal');
    const intEl = document.getElementById('rd-result-interest');

    if (matEl) matEl.innerText = formatINR(maturity);
    if (depEl) depEl.innerText = formatINR(totalInvested);
    if (intEl) intEl.innerText = formatINR(interest);

    renderDoughnutChart('rdChart', ['Total Invested', 'Interest Earned'], [totalInvested, interest], ['#0E274D', '#10B981']);
  }

  // =========================================================================
  // 7. RETIREMENT CALCULATOR
  // Corpus needed adjusting for inflation and post-retirement returns
  // =========================================================================
  function calculateRetirement() {
    const currentAge = parseFloat(document.getElementById('ret-current-age')?.value || 30);
    const retireAge = parseFloat(document.getElementById('ret-retire-age')?.value || 60);
    const currentMonthlyExpense = parseFloat(document.getElementById('ret-monthly-exp')?.value || 45000);
    const inflation = parseFloat(document.getElementById('ret-inflation')?.value || 6) / 100;
    const lifeExpectancy = parseFloat(document.getElementById('ret-life-exp')?.value || 85);
    const postRetReturn = parseFloat(document.getElementById('ret-post-return')?.value || 8) / 100;

    const yearsToRetire = Math.max(1, retireAge - currentAge);
    const yearsInRetirement = Math.max(1, lifeExpectancy - retireAge);

    // Inflated monthly expense at retirement age
    const expenseAtRetirementMonthly = currentMonthlyExpense * Math.pow(1 + inflation, yearsToRetire);
    const expenseAtRetirementAnnual = expenseAtRetirementMonthly * 12;

    // Real rate of return post-retirement
    const realRate = (1 + postRetReturn) / (1 + inflation) - 1;

    let requiredCorpus = 0;
    if (Math.abs(realRate) > 0.0001) {
      requiredCorpus = expenseAtRetirementAnnual * ((1 - Math.pow(1 + realRate, -yearsInRetirement)) / realRate);
    } else {
      requiredCorpus = expenseAtRetirementAnnual * yearsInRetirement;
    }

    // Monthly SIP needed to reach corpus assuming 12% pre-retirement CAGR
    const preRetRateMonthly = 0.12 / 12;
    const totalMonths = yearsToRetire * 12;
    const monthlySIPNeeded = (requiredCorpus * preRetRateMonthly) / (Math.pow(1 + preRetRateMonthly, totalMonths) - 1);

    const corpusEl = document.getElementById('ret-result-corpus');
    const sipNeededEl = document.getElementById('ret-result-sip');
    const expAtRetEl = document.getElementById('ret-result-monthly-exp');

    if (corpusEl) corpusEl.innerText = formatINR(requiredCorpus);
    if (sipNeededEl) sipNeededEl.innerText = formatINR(monthlySIPNeeded);
    if (expAtRetEl) expAtRetEl.innerText = formatINR(expenseAtRetirementMonthly);

    renderDoughnutChart('retChart', ['Required Corpus Target', 'Monthly SIP Recommended'], [requiredCorpus, monthlySIPNeeded * totalMonths], ['#D4AF37', '#1E3A8A']);
  }

  // =========================================================================
  // 8. INFLATION CALCULATOR
  // Future purchasing power: FV = PV * (1 + r)^t
  // =========================================================================
  function calculateInflation() {
    const presentValue = parseFloat(document.getElementById('inf-amount')?.value || 50000);
    const rate = parseFloat(document.getElementById('inf-rate')?.value || 6);
    const years = parseFloat(document.getElementById('inf-years')?.value || 15);

    const futureCost = presentValue * Math.pow(1 + (rate / 100), years);
    const increase = futureCost - presentValue;

    const futEl = document.getElementById('inf-result-future');
    const presEl = document.getElementById('inf-result-present');
    const incEl = document.getElementById('inf-result-increase');

    if (futEl) futEl.innerText = formatINR(futureCost);
    if (presEl) presEl.innerText = formatINR(presentValue);
    if (incEl) incEl.innerText = formatINR(increase);

    renderDoughnutChart('infChart', ['Present Cost', 'Inflation Surge'], [presentValue, increase], ['#0284C7', '#EF4444']);
  }

  // =========================================================================
  // 9. LUMPSUM INVESTMENT CALCULATOR
  // Formula: A = P * (1 + r)^t
  // =========================================================================
  function calculateLumpsum() {
    const principal = parseFloat(document.getElementById('lump-amount')?.value || 100000);
    const rate = parseFloat(document.getElementById('lump-rate')?.value || 12);
    const years = parseFloat(document.getElementById('lump-years')?.value || 10);

    const totalValue = principal * Math.pow(1 + (rate / 100), years);
    const wealthGained = totalValue - principal;

    const totEl = document.getElementById('lump-result-total');
    const prinEl = document.getElementById('lump-result-principal');
    const gainEl = document.getElementById('lump-result-wealth');

    if (totEl) totEl.innerText = formatINR(totalValue);
    if (prinEl) prinEl.innerText = formatINR(principal);
    if (gainEl) gainEl.innerText = formatINR(wealthGained);

    renderDoughnutChart('lumpChart', ['Principal Invested', 'Wealth Gained'], [principal, wealthGained], ['#143362', '#D4AF37']);
  }

  // =========================================================================
  // 10. SALARY & IN-HAND CTC CALCULATOR
  // Indian corporate salary structure breakdown
  // =========================================================================
  function calculateSalary() {
    const annualCTC = parseFloat(document.getElementById('sal-ctc')?.value || 1200000);
    const bonusAnnual = parseFloat(document.getElementById('sal-bonus')?.value || 100000);

    const fixedGrossAnnual = Math.max(0, annualCTC - bonusAnnual);
    const monthlyGross = fixedGrossAnnual / 12;

    // Typical Indian Corporate standard breakdown:
    // Basic: 40-50% of gross
    const basicMonthly = monthlyGross * 0.45;
    // HRA: 50% of Basic
    const hraMonthly = basicMonthly * 0.50;
    // Employee Provident Fund (EPF): 12% of Basic (capped at ₹1,800 or full 12%)
    const epfMonthly = basicMonthly * 0.12;
    // Employer PF contribution (part of CTC)
    const employerPF = epfMonthly;
    // Professional Tax (usually ₹200/month in most states)
    const profTax = 200;

    // Special allowance is balancing figure
    const specialAllowance = Math.max(0, monthlyGross - basicMonthly - hraMonthly - employerPF);

    // Approximate Monthly TDS under New Tax Regime
    const taxableApprox = Math.max(0, fixedGrossAnnual - 75000);
    let annualTaxApprox = 0;
    if (taxableApprox > 1500000) annualTaxApprox = (taxableApprox - 1500000) * 0.30 + 140000;
    else if (taxableApprox > 1200000) annualTaxApprox = (taxableApprox - 1200000) * 0.20 + 80000;
    else if (taxableApprox > 1000000) annualTaxApprox = (taxableApprox - 1000000) * 0.15 + 50000;
    else if (taxableApprox > 700000) annualTaxApprox = (taxableApprox - 700000) * 0.10 + 20000;
    else annualTaxApprox = 0; // Rebate u/s 87A

    const monthlyTDS = (annualTaxApprox * 1.04) / 12;

    // Take home in-hand = Monthly Gross - Employee EPF - Prof Tax - Monthly TDS - Employer PF (already in CTC)
    const inHandMonthly = Math.max(0, monthlyGross - epfMonthly - employerPF - profTax - monthlyTDS);

    const inHandEl = document.getElementById('sal-result-inhand');
    const grossEl = document.getElementById('sal-result-gross');
    const epfEl = document.getElementById('sal-result-epf');
    const tdsEl = document.getElementById('sal-result-tds');

    if (inHandEl) inHandEl.innerText = formatINR(inHandMonthly);
    if (grossEl) grossEl.innerText = formatINR(monthlyGross);
    if (epfEl) epfEl.innerText = formatINR(epfMonthly);
    if (tdsEl) tdsEl.innerText = formatINR(monthlyTDS);

    renderDoughnutChart('salChart', ['In-Hand Monthly Pay', 'PF & Deductions', 'Estimated Tax TDS'], [inHandMonthly, epfMonthly + profTax, monthlyTDS], ['#10B981', '#FF7722', '#EF4444']);
  }

  // =========================================================================
  // SETUP EVENT LISTENERS & TABS
  // =========================================================================
  function init() {
    // Sync all 10 calculators
    syncInputs('sip-amount-range', 'sip-amount', calculateSIP);
    syncInputs('sip-rate-range', 'sip-rate', calculateSIP);
    syncInputs('sip-years-range', 'sip-years', calculateSIP);

    syncInputs('emi-amount-range', 'emi-amount', calculateEMI);
    syncInputs('emi-rate-range', 'emi-rate', calculateEMI);
    syncInputs('emi-tenure-range', 'emi-tenure', calculateEMI);

    syncInputs('ci-principal-range', 'ci-principal', calculateCompoundInterest);
    syncInputs('ci-rate-range', 'ci-rate', calculateCompoundInterest);
    syncInputs('ci-years-range', 'ci-years', calculateCompoundInterest);
    const ciFreq = document.getElementById('ci-frequency');
    if (ciFreq) ciFreq.addEventListener('change', calculateCompoundInterest);

    syncInputs('tax-income-range', 'tax-income', calculateIncomeTax);
    syncInputs('tax-80c-range', 'tax-80c', calculateIncomeTax);
    syncInputs('tax-80d-range', 'tax-80d', calculateIncomeTax);
    syncInputs('tax-hra-range', 'tax-hra', calculateIncomeTax);
    syncInputs('tax-homeloan-range', 'tax-homeloan', calculateIncomeTax);
    syncInputs('tax-nps-range', 'tax-nps', calculateIncomeTax);

    syncInputs('fd-amount-range', 'fd-amount', calculateFD);
    syncInputs('fd-rate-range', 'fd-rate', calculateFD);
    syncInputs('fd-years-range', 'fd-years', calculateFD);

    syncInputs('rd-amount-range', 'rd-amount', calculateRD);
    syncInputs('rd-rate-range', 'rd-rate', calculateRD);
    syncInputs('rd-months-range', 'rd-months', calculateRD);

    syncInputs('ret-current-age-range', 'ret-current-age', calculateRetirement);
    syncInputs('ret-retire-age-range', 'ret-retire-age', calculateRetirement);
    syncInputs('ret-monthly-exp-range', 'ret-monthly-exp', calculateRetirement);
    syncInputs('ret-inflation-range', 'ret-inflation', calculateRetirement);

    syncInputs('inf-amount-range', 'inf-amount', calculateInflation);
    syncInputs('inf-rate-range', 'inf-rate', calculateInflation);
    syncInputs('inf-years-range', 'inf-years', calculateInflation);

    syncInputs('lump-amount-range', 'lump-amount', calculateLumpsum);
    syncInputs('lump-rate-range', 'lump-rate', calculateLumpsum);
    syncInputs('lump-years-range', 'lump-years', calculateLumpsum);

    syncInputs('sal-ctc-range', 'sal-ctc', calculateSalary);
    syncInputs('sal-bonus-range', 'sal-bonus', calculateSalary);

    // Tab buttons switching
    const tabButtons = document.querySelectorAll('.calc-tab-btn');
    const panels = document.querySelectorAll('.calculator-panel');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target');
        tabButtons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        this.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
          // Trigger calculation for the selected tab to render its chart
          triggerCalculationForPanel(targetId);
        }
      });
    });

    // Run initial calculations
    calculateSIP();
    calculateEMI();
    calculateIncomeTax();
  }

  function triggerCalculationForPanel(panelId) {
    switch (panelId) {
      case 'calc-sip': calculateSIP(); break;
      case 'calc-emi': calculateEMI(); break;
      case 'calc-ci': calculateCompoundInterest(); break;
      case 'calc-tax': calculateIncomeTax(); break;
      case 'calc-fd': calculateFD(); break;
      case 'calc-rd': calculateRD(); break;
      case 'calc-retirement': calculateRetirement(); break;
      case 'calc-inflation': calculateInflation(); break;
      case 'calc-lumpsum': calculateLumpsum(); break;
      case 'calc-salary': calculateSalary(); break;
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
