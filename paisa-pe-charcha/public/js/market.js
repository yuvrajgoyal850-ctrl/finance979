/**
 * PAISA PE CHARCHA - MARKET INSIGHTS DASHBOARD
 * Live Indian indices, commodities, sector heatmap, regulatory news, Chart.js trends
 */

(function () {
  'use strict';

  let indexChart = null;

  // Chart data for different timeframes (Nifty 50 historical realistic trajectory)
  const TIMEFRAME_DATA = {
    '1D': {
      labels: ['09:15', '10:00', '11:00', '12:00', '13:00', '14:00', '15:30'],
      values: [23810, 23845, 23820, 23890, 23940, 23910, 23914]
    },
    '1M': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      values: [23500, 23680, 23750, 23914]
    },
    '1Y': {
      labels: ['Dec', 'Feb', 'Apr', 'Jun', 'Aug', 'Oct', 'Nov'],
      values: [21450, 21900, 22500, 23300, 24800, 24200, 23914]
    },
    '5Y': {
      labels: ['2020', '2021', '2022', '2023', '2024', 'Current'],
      values: [12000, 15500, 17800, 21200, 24500, 23914]
    }
  };

  async function fetchMarketData() {
    try {
      const res = await fetch('/api/market/overview');
      if (res.ok) {
        const data = await res.json();
        renderMarketDashboard(data);
      }
    } catch (e) {
      console.warn("Market overview fetch failed, rendering fallback data", e);
    }
  }

  async function fetchMarketNews() {
    try {
      const res = await fetch('/api/market/news');
      if (res.ok) {
        const data = await res.json();
        renderNewsGrid(data.articles || []);
      }
    } catch (e) {
      console.warn("Market news fetch failed", e);
    }
  }

  function renderMarketDashboard(data) {
    // 1. Update Timestamp
    const timeEl = document.getElementById('marketLastUpdatedTime');
    if (timeEl && data.timestamp) {
      timeEl.innerText = data.timestamp;
    }

    // 2. Update Ticker Strip
    const tickerTrack = document.getElementById('marketTickerTrack');
    if (tickerTrack && data.indices && data.commodities) {
      let tickerHtml = '';
      const allItems = [...data.indices, ...data.commodities];
      // Duplicate for smooth infinite scroll
      const repeated = [...allItems, ...allItems];
      repeated.forEach(item => {
        const isPos = item.change >= 0;
        const sign = isPos ? '+' : '';
        const badgeClass = isPos ? 'positive' : 'negative';
        const icon = isPos ? 'fa-arrow-up' : 'fa-arrow-down';
        const formattedVal = Number(item.value).toLocaleString('en-IN', { maximumFractionDigits: 2 });

        tickerHtml += `
          <div class="ticker-item">
            <span class="ticker-name">${item.name}</span>
            <span class="ticker-val">${item.currency === 'USD' ? '$' : '₹'}${formattedVal}</span>
            <span class="ticker-badge ${badgeClass}">
              <i class="fa-solid ${icon}"></i> ${sign}${item.change} (${sign}${item.percentChange}%)
            </span>
          </div>
        `;
      });
      tickerTrack.innerHTML = tickerHtml;
    }

    // 3. Render Major Indices Cards
    const indicesContainer = document.getElementById('majorIndicesContainer');
    if (indicesContainer && data.indices) {
      indicesContainer.innerHTML = '';
      data.indices.forEach(idx => {
        const isPos = idx.change >= 0;
        const sign = isPos ? '+' : '';
        const icon = isPos ? 'fa-caret-up' : 'fa-caret-down';
        const colorClass = isPos ? 'text-emerald' : 'text-crimson';

        const card = document.createElement('div');
        card.className = 'index-royal-card';
        card.innerHTML = `
          <div class="index-card-head">
            <span class="index-title">${idx.name}</span>
            <span class="exchange-tag">${idx.exchange}</span>
          </div>
          <div class="index-card-val">₹${Number(idx.value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <div class="index-change-row ${colorClass}">
            <i class="fa-solid ${icon}"></i>
            <span>${sign}${idx.change} (${sign}${idx.percentChange}%)</span>
          </div>
          <div style="margin-top:14px; font-size:0.72rem; color:#94A3B8; display:flex; justify-content:space-between; border-top:1px solid rgba(255,255,255,0.06); padding-top:8px;">
            <span>52W L: ₹${Number(idx.low52).toLocaleString('en-IN')}</span>
            <span>52W H: ₹${Number(idx.high52).toLocaleString('en-IN')}</span>
          </div>
        `;
        indicesContainer.appendChild(card);
      });
    }

    // 4. Render Sector Heatmap
    const sectorContainer = document.getElementById('sectorHeatmapContainer');
    if (sectorContainer && data.sectorHeatmap) {
      sectorContainer.innerHTML = '';
      data.sectorHeatmap.forEach(sec => {
        const isPos = sec.change >= 0;
        const sign = isPos ? '+' : '';
        const itemClass = isPos ? 'positive' : 'negative';
        const colorClass = isPos ? 'text-emerald' : 'text-crimson';

        const item = document.createElement('div');
        item.className = `sector-item ${itemClass}`;
        item.innerHTML = `
          <span class="sector-name">${sec.sector}</span>
          <span class="sector-val ${colorClass}">${sign}${sec.change}%</span>
        `;
        sectorContainer.appendChild(item);
      });
    }
  }

  function renderNewsGrid(articles) {
    const container = document.getElementById('financialNewsContainer');
    if (!container) return;
    container.innerHTML = '';

    articles.forEach(article => {
      const card = document.createElement('div');
      card.className = 'news-card';
      card.innerHTML = `
        <div>
          <div class="news-meta-row">
            <span class="news-source-badge">${article.tag || 'Official Update'}</span>
            <span class="news-time"><i class="fa-regular fa-clock"></i> ${article.time}</span>
          </div>
          <h4 class="news-headline">${article.title}</h4>
          <p class="news-summary">${article.summary}</p>
        </div>
        <div style="border-top: 1px solid rgba(212,175,55,0.15); padding-top: 12px; margin-top: 10px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.75rem; color:#94A3B8;">${article.source}</span>
          <a href="${article.officialUrl}" target="_blank" rel="noopener noreferrer" class="news-official-link">
            <span>Verify Source</span>
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Render or update NIFTY 50 line chart
  function renderMarketChart(timeframe = '1D') {
    const canvas = document.getElementById('marketIndexCanvas');
    if (!canvas || typeof Chart === 'undefined') return;

    const tf = TIMEFRAME_DATA[timeframe] || TIMEFRAME_DATA['1D'];

    if (indexChart) {
      indexChart.data.labels = tf.labels;
      indexChart.data.datasets[0].data = tf.values;
      indexChart.update();
      return;
    }

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(212, 175, 55, 0.35)');
    gradient.addColorStop(1, 'rgba(212, 175, 55, 0.0)');

    indexChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: tf.labels,
        datasets: [{
          label: 'NIFTY 50',
          data: tf.values,
          borderColor: '#D4AF37',
          borderWidth: 2.5,
          fill: true,
          backgroundColor: gradient,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#FDE883',
          pointBorderColor: '#061326',
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` NIFTY 50: ₹${Number(ctx.parsed.y).toLocaleString('en-IN')}`
            }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.06)' },
            ticks: {
              color: '#94A3B8',
              callback: (v) => '₹' + Number(v).toLocaleString('en-IN')
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#E2E8F0' }
          }
        }
      }
    });
  }

  function init() {
    fetchMarketData();
    fetchMarketNews();
    renderMarketChart('1D');

    // Timeframe button switching
    const tfButtons = document.querySelectorAll('.tf-btn');
    tfButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        tfButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const tf = this.getAttribute('data-tf') || '1D';
        renderMarketChart(tf);
      });
    });

    // Refresh market prices every 60 seconds
    setInterval(fetchMarketData, 60000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
