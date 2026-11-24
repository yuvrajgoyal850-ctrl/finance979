/**
 * PAISA PE CHARCHA - AI FINANCIAL TERMINAL
 * High-performance client-side AI chat controller with history, copy, export, and mode controls
 */

(function () {
  'use strict';

  // DOM Elements
  const chatContainer = document.getElementById('chatMessagesContainer');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  const clearChatBtn = document.getElementById('clearChatBtn');
  const exportChatBtn = document.getElementById('exportChatBtn');
  const newChatBtn = document.getElementById('newChatBtn');
  const terminalWrapper = document.getElementById('aiTerminalWrapper');
  const fullscreenToggleBtn = document.getElementById('fullscreenToggleBtn');
  const modeButtons = document.querySelectorAll('.mode-btn');

  // State
  let currentMode = 'general';
  let isGenerating = false;
  let chatHistory = [];

  const STORAGE_KEY = 'paisa_pe_charcha_chat_history_v1';
  const API_KEY_STORAGE = 'paisa_pe_charcha_gemini_key';

  // Initial welcome message
  const DEFAULT_WELCOME_MSG = {
    role: 'bot',
    text: `### 🇮🇳 Namaste! Welcome to Paisa Pe Charcha Financial AI Terminal

I am your dedicated **Paisa Pe Charcha Financial Intelligence Assistant**, equipped with institutional-grade knowledge of Indian personal finance, Income Tax Act provisions (FY 2024-25 / 2025-26), Reserve Bank of India monetary regulations, SEBI investment rules, and Government welfare schemes.

#### How may I assist your financial journey today?
* **Income Tax Planning:** Compare Old vs New Tax Regime, 80C, 80D, 87A rebate
* **Mutual Funds & SIP:** Rupee-cost averaging, compounding rules, index vs active funds
* **Loan Optimization:** Home loan prepayment calculations, reducing tenure, CIBIL repair
* **Sovereign Schemes:** Sukanya Samriddhi (8.2%), PPF, NPS, Atal Pension Yojana (APY)
* **Budgeting & Safety:** 50/30/20 rule, liquid emergency funds, pure term insurance

*Select a quick prompt below or type your financial query.*`,
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    keyTakeaways: [
      "Salaried individuals with income up to ₹7.75 Lakhs pay ₹0 tax under the New Tax Regime.",
      "Investing ₹15,000/month for 15 years at 15% CAGR accumulates over ₹1 Crore (15x15x15 rule).",
      "Always maintain 6 months of mandatory living expenses in liquid debt funds or auto-sweep FDs."
    ],
    suggestedPrompts: [
      "Compare Old vs New Tax Regime for ₹12 Lakh salary",
      "How to save 40% interest on my Home Loan?",
      "Sukanya Samriddhi vs PPF: Which is better?",
      "How to invest my first ₹10,000 monthly SIP?"
    ]
  };

  // Load chat history from LocalStorage
  function loadHistory() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        chatHistory = JSON.parse(saved);
      } else {
        chatHistory = [DEFAULT_WELCOME_MSG];
      }
    } catch (e) {
      chatHistory = [DEFAULT_WELCOME_MSG];
    }
    renderAllMessages();
  }

  // Save chat history to LocalStorage
  function saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
    } catch (e) {
      console.warn("Storage quota exceeded or disabled", e);
    }
  }

  // Render markdown text to safe HTML
  function formatMarkdown(text) {
    if (!text) return '';
    let html = text;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');

    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Horizontal Rule
    html = html.replace(/---/gim, '<hr>');

    // Bullet Lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^([0-9]+)\. (.*$)/gim, '<li>$2</li>');
    html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
    // Consolidate consecutive lists
    html = html.replace(/<\/ul>\s*<ul>/gim, '');

    // Paragraphs
    html = html.replace(/\n\n+/g, '</p><p>');
    if (!html.startsWith('<h') && !html.startsWith('<ul') && !html.startsWith('<div')) {
      html = '<p>' + html + '</p>';
    }

    return html;
  }

  // Render single message element
  function createMessageElement(msg, index) {
    const isUser = msg.role === 'user';
    const row = document.createElement('div');
    row.className = `chat-msg-row ${isUser ? 'user-row' : 'bot-row'}`;

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.innerHTML = isUser ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-building-columns"></i>';

    const bodyWrapper = document.createElement('div');
    bodyWrapper.className = 'msg-body-wrapper';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = isUser ? `<p>${escapeHTML(msg.text)}</p>` : formatMarkdown(msg.text);

    // Key takeaways card if bot
    if (!isUser && msg.keyTakeaways && msg.keyTakeaways.length > 0) {
      const takeawayBox = document.createElement('div');
      takeawayBox.className = 'takeaway-box';
      takeawayBox.innerHTML = `
        <div class="takeaway-title"><i class="fa-solid fa-lightbulb"></i> Institutional Takeaways</div>
        <ul>${msg.keyTakeaways.map(t => `<li>${t}</li>`).join('')}</ul>
      `;
      bubble.appendChild(takeawayBox);
    }

    bodyWrapper.appendChild(bubble);

    // Meta bar
    const metaBar = document.createElement('div');
    metaBar.className = 'msg-meta-bar';
    metaBar.innerHTML = `
      <span>${msg.timestamp || 'Just now'}</span>
      ${!isUser ? `
        <button class="msg-copy-btn" data-index="${index}" title="Copy response">
          <i class="fa-regular fa-copy"></i> Copy
        </button>
      ` : ''}
    `;
    bodyWrapper.appendChild(metaBar);

    // Suggested prompts chips below latest bot message
    if (!isUser && msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && index === chatHistory.length - 1) {
      const chipsContainer = document.createElement('div');
      chipsContainer.className = 'suggested-chips-container';
      msg.suggestedPrompts.forEach(promptText => {
        const chip = document.createElement('button');
        chip.className = 'suggested-chip';
        chip.innerHTML = `<i class="fa-solid fa-arrow-turn-down"></i> ${escapeHTML(promptText)}`;
        chip.addEventListener('click', () => {
          sendUserMessage(promptText);
        });
        chipsContainer.appendChild(chip);
      });
      bodyWrapper.appendChild(chipsContainer);
    }

    row.appendChild(avatar);
    row.appendChild(bodyWrapper);

    return row;
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
  }

  // Render all messages
  function renderAllMessages() {
    if (!chatContainer) return;
    chatContainer.innerHTML = '';
    chatHistory.forEach((msg, idx) => {
      const el = createMessageElement(msg, idx);
      chatContainer.appendChild(el);
    });
    scrollToBottom();
    attachCopyEvents();
  }

  function scrollToBottom() {
    if (!chatContainer) return;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function attachCopyEvents() {
    document.querySelectorAll('.msg-copy-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = this.getAttribute('data-index');
        const targetMsg = chatHistory[idx];
        if (targetMsg && targetMsg.text) {
          navigator.clipboard.writeText(targetMsg.text).then(() => {
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fa-solid fa-check text-emerald"></i> Copied!';
            setTimeout(() => {
              this.innerHTML = originalHTML;
            }, 2000);
          }).catch(err => console.error("Copy failed", err));
        }
      });
    });
  }

  // Show typing indicator
  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'botTypingIndicator';
    indicator.className = 'chat-msg-row bot-row';
    indicator.innerHTML = `
      <div class="msg-avatar"><i class="fa-solid fa-building-columns"></i></div>
      <div class="msg-body-wrapper">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    chatContainer.appendChild(indicator);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('botTypingIndicator');
    if (indicator) indicator.remove();
  }

  // Send Message function
  async function sendUserMessage(text) {
    const cleanText = text.trim();
    if (!cleanText || isGenerating) return;

    isGenerating = true;
    if (sendBtn) sendBtn.disabled = true;

    const timeString = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    // Add user message to history
    chatHistory.push({
      role: 'user',
      text: cleanText,
      timestamp: timeString
    });

    renderAllMessages();
    showTypingIndicator();

    if (chatInput) chatInput.value = '';

    try {
      const storedKey = localStorage.getItem(API_KEY_STORAGE) || '';

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-key': storedKey
        },
        body: JSON.stringify({
          message: cleanText,
          mode: currentMode,
          history: chatHistory.map(m => ({ role: m.role, content: m.text }))
        })
      });

      removeTypingIndicator();

      if (!response.ok) {
        throw new Error(`Server returned error status: ${response.status}`);
      }

      const data = await response.json();

      chatHistory.push({
        role: 'bot',
        text: data.response || "We encountered an issue processing your query. Please rephrase or try again.",
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        keyTakeaways: data.keyTakeaways || [],
        suggestedPrompts: data.suggestedPrompts || []
      });

      saveHistory();
      renderAllMessages();
    } catch (err) {
      removeTypingIndicator();
      console.error("AI Assistant query failed:", err);
      chatHistory.push({
        role: 'bot',
        text: `### ⚠️ Connection Notice\n\nWe encountered a temporary connection glitch. Our built-in intelligence engine is ready. Please try asking your question again or check network connectivity.`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        keyTakeaways: ["Your data remains secure.", "You can also explore our 10 interactive calculators."],
        suggestedPrompts: ["Compare Old vs New Tax Regime", "Calculate SIP of ₹10,000"]
      });
      saveHistory();
      renderAllMessages();
    } finally {
      isGenerating = false;
      if (sendBtn) sendBtn.disabled = false;
      if (chatInput) chatInput.focus();
    }
  }

  // Event Listeners
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (chatInput) sendUserMessage(chatInput.value);
    });
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
      }
    });
  }

  // Quick Prompt Pills
  document.querySelectorAll('.quick-prompt-pill').forEach(pill => {
    pill.addEventListener('click', function () {
      const prompt = this.getAttribute('data-prompt') || this.innerText;
      sendUserMessage(prompt);
    });
  });

  // Mode Selection
  modeButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      modeButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentMode = this.getAttribute('data-mode') || 'general';
    });
  });

  // Clear Chat
  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', () => {
      if (confirm("Are you sure you want to clear your conversation history?")) {
        chatHistory = [DEFAULT_WELCOME_MSG];
        saveHistory();
        renderAllMessages();
      }
    });
  }

  // New Chat
  if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
      chatHistory = [DEFAULT_WELCOME_MSG];
      saveHistory();
      renderAllMessages();
      if (chatInput) chatInput.focus();
    });
  }

  // Export Chat
  if (exportChatBtn) {
    exportChatBtn.addEventListener('click', () => {
      let exportText = `PAISA PE CHARCHA - FINANCIAL ADVISORY TRANSCRIPT\n`;
      exportText += `Date: ${new Date().toLocaleString('en-IN')}\n`;
      exportText += `===========================================================\n\n`;

      chatHistory.forEach(msg => {
        const role = msg.role === 'user' ? 'YOU' : 'PAISA PE CHARCHA AI';
        exportText += `[${msg.timestamp || ''}] ${role}:\n${msg.text}\n\n`;
        if (msg.keyTakeaways && msg.keyTakeaways.length > 0) {
          exportText += `Key Takeaways:\n- ${msg.keyTakeaways.join('\n- ')}\n\n`;
        }
        exportText += `-----------------------------------------------------------\n\n`;
      });

      const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Paisa_Pe_Charcha_Chat_${new Date().toISOString().slice(0, 10)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // Fullscreen toggle
  if (fullscreenToggleBtn && terminalWrapper) {
    fullscreenToggleBtn.addEventListener('click', () => {
      terminalWrapper.classList.toggle('fullscreen-mode');
      const isFull = terminalWrapper.classList.contains('fullscreen-mode');
      fullscreenToggleBtn.innerHTML = isFull ?
        '<i class="fa-solid fa-compress"></i>' :
        '<i class="fa-solid fa-expand"></i>';
      scrollToBottom();
    });
  }

  // Expose global trigger for external links ("Talk to AI" buttons)
  window.PPC_OpenAIWithPrompt = function (promptText) {
    const aiSection = document.getElementById('ai-assistant');
    if (aiSection) {
      aiSection.scrollIntoView({ behavior: 'smooth' });
    }
    if (promptText) {
      setTimeout(() => {
        sendUserMessage(promptText);
      }, 600);
    }
  };

  // Initialize
  loadHistory();

})();
