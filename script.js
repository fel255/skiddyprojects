document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const deleteBtn = document.getElementById('deleteBtn');
  const statusMessage = document.getElementById('statusMessage');
  const messageSound = document.getElementById('messageSound');
  
  // Preload the audio
  messageSound.load();
  
  // Delete button functionality
  deleteBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all fields?')) {
      contactForm.reset();
      hideStatus();
    }
  });
  
  // Form submission
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Disable send button during submission
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Get form values
    const formData = {
      username: document.getElementById('username').value,
      source: document.getElementById('source').value,
      whatsapp: document.getElementById('whatsapp').value,
      message: document.getElementById('message').value
    };
    
    // Validate form
    if (!validateForm(formData)) {
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send';
      return;
    }
    
    try {
      // Format the message
      const telegramMessage = formatMessage(formData);
      
      // Send to Telegram
      const success = await sendToTelegram(telegramMessage);
      
      if (success) {
        // Play success sound
        playNotificationSound();
        
        // Show success and reset form
        showStatus('Message sent successfully!', 'success');
        setTimeout(() => {
          contactForm.reset();
          hideStatus();
        }, 3000);
      }
    } catch (error) {
      showStatus('Failed to send message. Please try again.', 'error');
      console.error('Error:', error);
    } finally {
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send';
    }
  });
  
  // Form validation
  function validateForm(formData) {
    if (!formData.username || !formData.source || !formData.whatsapp || !formData.message) {
      showStatus('Please fill in all fields', 'error');
      return false;
    }
    
    // Basic WhatsApp number validation
    if (!/^[0-9+]{10,15}$/.test(formData.whatsapp)) {
      showStatus('Please enter a valid WhatsApp number', 'error');
      return false;
    }
    
    return true;
  }
  
  // Format Telegram message
  function formatMessage(formData) {
    return `📨 New Message from Iconic Tech Website:
        
👤 Username: ${formData.username}
📌 Source: ${formData.source}
📱 WhatsApp: ${formData.whatsapp}
✉️ Message: 
${formData.message}`;
  }
  
  // Send message to Telegram
  async function sendToTelegram(message) {
    // In a production environment, you would call your backend API here
    // For demonstration, we'll simulate a successful send
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, you would have:
    
    const botToken = '6184226714:AAH2Y3fLX5qM3kapPC0Mj5m8ay9Lr4Suql8';
    const chatId = '5028094995';
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        })
    });
    
    const data = await response.json();
    return data.ok;
    
    
    // For demo purposes, return true to simulate success
    return true;
  }
  
  // Play notification sound
  function playNotificationSound() {
    messageSound.currentTime = 0; // Rewind to start
    messageSound.play().catch(e => {
      console.warn('Audio playback failed:', e);
      // Fallback for browsers that block autoplay
      showStatus('Message sent! (Enable audio for notification sound)', 'success');
    });
  }
  
  // Show status message
  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message ' + type;
    statusMessage.style.display = 'block';
  }
  
  // Hide status message
  function hideStatus() {
    statusMessage.style.display = 'none';
  }
});