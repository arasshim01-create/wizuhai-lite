<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Chat with WizuHAI — Your Wizard Assistant</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0d0b14;
      --surface: #13101f;
      --surface2: #1a1530;
      --border: rgba(160, 100, 255, 0.15);
      --purple: #a855f7;
      --purple-dim: #7c3aed;
      --purple-glow: rgba(168, 85, 247, 0.35);
      --gold: #f0b429;
      --text: #e8e0f5;
      --text-dim: #8b7fa8;
      --font-display: 'Cinzel Decorative', serif;
      --font-body: 'DM Sans', sans-serif;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* Noise texture overlay */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
      opacity: 0.4;
    }

    /* Ambient glow background */
    body::after {
      content: '';
      position: fixed;
      top: -20%;
      left: 50%;
      transform: translateX(-50%);
      width: 800px;
      height: 600px;
      background: radial-gradient(ellipse, rgba(120, 60, 220, 0.12) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .container {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 24px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
      height: 100vh;
    }

    /* HEADER */
    .header {
      grid-column: 1 / -1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      animation: fadeUp 0.6s ease both;
    }

    .logo {
      font-family: var(--font-display);
      font-size: 1.3rem;
      color: var(--purple);
      letter-spacing: 0.05em;
      text-shadow: 0 0 20px var(--purple-glow);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(240, 180, 41, 0.1);
      border: 1px solid rgba(240, 180, 41, 0.25);
      color: var(--gold);
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      padding: 6px 14px;
      border-radius: 100px;
    }

    /* CHAT AREA */
    .chat-column {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-height: 0;
    }

    .chat-box {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(168, 85, 247, 0.1);
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-right: 8px;
    }

    .messages::-webkit-scrollbar {
      width: 6px;
    }

    .messages::-webkit-scrollbar-track {
      background: transparent;
    }

    .messages::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 3px;
    }

    .message {
      display: flex;
      gap: 10px;
      animation: slideIn 0.3s ease both;
    }

    .message.user {
      justify-content: flex-end;
    }

    .message-content {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 12px 16px;
      max-width: 70%;
      word-wrap: break-word;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .message.user .message-content {
      background: var(--purple);
      border-color: var(--purple);
      color: white;
    }

    .message.assistant .message-content {
      color: var(--text-dim);
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--surface2);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      flex-shrink: 0;
    }

    /* INPUT AREA */
    .input-area {
      display: flex;
      gap: 10px;
      border-top: 1px solid var(--border);
      padding-top: 16px;
    }

    input[type="text"] {
      flex: 1;
      background: var(--surface2);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 12px 16px;
      border-radius: 100px;
      font-family: var(--font-body);
      font-size: 0.95rem;
      transition: all 0.2s;
    }

    input[type="text"]:focus {
      outline: none;
      border-color: var(--purple);
      box-shadow: 0 0 12px var(--purple-glow);
    }

    input[type="text"]::placeholder {
      color: var(--text-dim);
    }

    .send-btn {
      background: var(--purple);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 100px;
      font-family: var(--font-body);
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .send-btn:hover {
      background: #c084fc;
      transform: translateY(-2px);
      box-shadow: 0 4px 16px var(--purple-glow);
    }

    .send-btn:active {
      transform: translateY(0);
    }

    /* SIDEBAR - MASCOT */
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
    }

    .mascot-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 8px 32px rgba(168, 85, 247, 0.1);
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
      justify-content: center;
    }

    .mascot-img {
      width: 140px;
      height: 140px;
      object-fit: contain;
      margin: 0 auto;
      filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.3));
      animation: float 4s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }

    .mascot-name {
      font-family: var(--font-display);
      font-size: 1.1rem;
      color: var(--purple);
      margin-bottom: 8px;
    }

    .mascot-status {
      font-size: 0.85rem;
      color: var(--text-dim);
      line-height: 1.6;
    }

    .mood-indicator {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-top: 12px;
    }

    .mood-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--surface2);
      border: 1px solid var(--border);
      animation: pulse 2s ease-in-out infinite;
    }

    .mood-dot.active {
      background: var(--purple);
      border-color: var(--purple);
      box-shadow: 0 0 8px var(--purple-glow);
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }

    .info-card {
      background: rgba(168, 85, 247, 0.05);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 14px;
      font-size: 0.8rem;
      color: var(--text-dim);
      line-height: 1.5;
      width: 100%;
    }

    /* ANIMATIONS */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .container {
        grid-template-columns: 1fr;
        height: auto;
        gap: 16px;
      }

      .sidebar {
        flex-direction: row;
        order: -1;
      }

      .mascot-card {
        flex: 0 1 auto;
        padding: 16px;
        min-width: 0;
      }

      .mascot-img {
        width: 100px;
        height: 100px;
      }

      .message-content {
        max-width: 90%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- HEADER -->
    <div class="header">
      <div class="logo">WIZUHAI</div>
      <div class="badge">✦ Free Chat</div>
    </div>

    <!-- CHAT COLUMN -->
    <div class="chat-column">
      <div class="chat-box">
        <div class="messages" id="messages">
          <div class="message assistant">
            <div class="avatar">🧙</div>
            <div class="message-content">
              Greetings! I'm your wizard assistant. Ask me anything—I'm here to help with your daily tasks, creative ideas, or just a chat. What's on your mind?
            </div>
          </div>
        </div>

        <div class="input-area">
          <input 
            type="text" 
            id="userInput" 
            placeholder="Message your wizard..." 
            autocomplete="off"
          />
          <button class="send-btn" id="sendBtn">Send</button>
        </div>
      </div>
    </div>

    <!-- SIDEBAR -->
    <div class="sidebar">
      <div class="mascot-card">
        <div class="mascot-name">Your Wizard</div>
        <img src="images/mascot.png" alt="WizuHAI Wizard" class="mascot-img" />
        <div class="mascot-status">
          Currently feeling<br/>
          <strong style="color: var(--gold);">✨ Helpful</strong>
        </div>
        <div class="mood-indicator">
          <div class="mood-dot active"></div>
          <div class="mood-dot active"></div>
          <div class="mood-dot"></div>
        </div>
        <div class="info-card">
          💬 <strong>Free Plan:</strong> Unlimited chat. Coming soon: Memory & custom personality in paid tier.
        </div>
      </div>
    </div>
  </div>

  <script>
    const messagesDiv = document.getElementById('messages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    let conversationHistory = [];

    function addMessage(text, isUser = false) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
      
      const avatar = document.createElement('div');
      avatar.className = 'avatar';
      avatar.textContent = isUser ? '👤' : '🧙';
      
      const content = document.createElement('div');
      content.className = 'message-content';
      content.textContent = text;
      
      if (!isUser) {
        messageDiv.appendChild(avatar);
      }
      messageDiv.appendChild(content);
      if (isUser) {
        messageDiv.appendChild(avatar);
      }
      
      messagesDiv.appendChild(messageDiv);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    async function sendMessage() {
      const text = userInput.value.trim();
      if (!text) return;

      addMessage(text, true);
      userInput.value = '';
      sendBtn.disabled = true;

      conversationHistory.push({
        role: 'user',
        content: text
      });

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: conversationHistory
          })
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        const data = await response.json();
        const assistantMessage = data.message;

        conversationHistory.push({
          role: 'assistant',
          content: assistantMessage
        });

        addMessage(assistantMessage, false);
      } catch (error) {
        console.error('Error:', error);
        addMessage("✨ Oops! Something went wrong with my magic. Try again?");
      } finally {
        sendBtn.disabled = false;
        userInput.focus();
      }
    }

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  </script>
</body>
</html>