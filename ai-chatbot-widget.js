// Inject AI Chatbot Widget HTML
const aiChatbotHTML = `
<div id="ai-chatbot-widget" class="ai-chatbot-widget">
  <button id="ai-chatbot-btn" aria-label="Open AI Assistant" style="padding:0; background:none; border:none; box-shadow:none;">
    <video src="icon.mp4" autoplay loop muted playsinline style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; display: block;"></video>
  </button>
  <div id="ai-chatbot-menu" class="ai-chatbot-menu">
    <div class="ai-chatbot-header">
      <span>AI Assistant</span>
      <button id="ai-chatbot-close" aria-label="Close Chatbot">✕</button>
    </div>
    <div class="ai-chatbot-body">
      <div class="ai-chatbot-messages" id="ai-chatbot-messages">
        <!-- Messages will appear here -->
      </div>
      <form id="ai-chatbot-form" autocomplete="off">
        <input type="text" id="ai-chatbot-input" placeholder="Type your message..." autocomplete="off" />
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
</div>
`;
document.getElementById('ai-chatbot-widget-container').innerHTML = aiChatbotHTML;

// AI Chatbot Widget Logic
const chatbotWidget = document.getElementById('ai-chatbot-widget');
const chatbotBtn = document.getElementById('ai-chatbot-btn');
const chatbotMenu = document.getElementById('ai-chatbot-menu');
const chatbotClose = document.getElementById('ai-chatbot-close');
const chatbotMessages = document.getElementById('ai-chatbot-messages');
const chatbotForm = document.getElementById('ai-chatbot-form');
const chatbotInput = document.getElementById('ai-chatbot-input');

function addChatbotMessage(text, sender = 'bot') {
  const msg = document.createElement('div');
  msg.className = 'ai-chatbot-message ' + sender;
  msg.textContent = text;
  chatbotMessages.appendChild(msg);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function botReply(userText) {
  const t = userText.trim().toLowerCase();
  let reply = "I'm still learning! Try asking something else 😅";
  if (t.includes('book')) reply = "You can book your move easily using our form!";
  else if (t.includes('track')) reply = "Tracking will be available once your move is booked.";
  else if (t.includes('services')) reply = "We offer home, office, and cargo moving solutions.";
  else if (t.includes('hi') || t.includes('hello')) reply = "Hi there! 👋 How can I help you today?";
  setTimeout(() => addChatbotMessage(reply, 'bot'), 500);
}

// Show widget after 4 seconds
let chatbotAutoPopupActive = false;
let chatbotUserInteracted = false;
setTimeout(() => {
  chatbotWidget.style.display = 'flex';
  chatbotBtn.style.display = 'flex';
  chatbotMenu.classList.remove('open');
  // Auto-greeting
  chatbotMenu.classList.add('open');
  addChatbotMessage("Hello! 👋 I'm MoveEase AI – need help finding a service?", 'bot');
  chatbotAutoPopupActive = true;
  chatbotUserInteracted = false;
  // Listen for user interaction during auto-popup
  function userInteracted() {
    if (chatbotAutoPopupActive) chatbotUserInteracted = true;
  }
  chatbotMenu.addEventListener('mouseenter', userInteracted);
  chatbotMenu.addEventListener('mousedown', userInteracted);
  chatbotMenu.addEventListener('touchstart', userInteracted);
  chatbotBtn.addEventListener('mousedown', userInteracted);
  chatbotBtn.addEventListener('touchstart', userInteracted);
  setTimeout(() => {
    chatbotAutoPopupActive = false;
    if (!chatbotUserInteracted) {
      chatbotMenu.classList.remove('open');
    }
    // Clean up listeners
    chatbotMenu.removeEventListener('mouseenter', userInteracted);
    chatbotMenu.removeEventListener('mousedown', userInteracted);
    chatbotMenu.removeEventListener('touchstart', userInteracted);
    chatbotBtn.removeEventListener('mousedown', userInteracted);
    chatbotBtn.removeEventListener('touchstart', userInteracted);
  }, 3500);
}, 4000);

// Open chat on button click
chatbotBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  chatbotMenu.classList.add('open');
  setTimeout(() => chatbotInput.focus(), 200);
});
// Close chat
chatbotClose.addEventListener('click', (e) => {
  e.stopPropagation();
  chatbotMenu.classList.remove('open');
});
// Close when clicking outside
document.addEventListener('click', (e) => {
  if (chatbotMenu.classList.contains('open')) {
    if (!chatbotWidget.contains(e.target)) {
      chatbotMenu.classList.remove('open');
    }
  }
});
// Handle form submit
chatbotForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const val = chatbotInput.value.trim();
  if (!val) return;
  addChatbotMessage(val, 'user');
  chatbotInput.value = '';
  botReply(val);
});
