import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChatPage.css';
import logOutIcon from './assets/log-out-icon.png';
import deleteIcon from './assets/delete.png';
import newChatIcon from './assets/newchat.png';
import tafbotImage from './assets/tafbot.png';
import userLogo from './assets/user-logo.png';
import botLogo from './assets/tafbot.png';
import FAQModal from './FAQModal';
import faqIcon from './assets/faq-icon.png';
import hotjar from '@hotjar/browser';
import FeedbackForm from './FeedbackForm';

function ChatPage() {
  const [currentChat, setCurrentChat] = useState('TAFBot');
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedConversations, setSavedConversations] = useState([]);
  const [isStopped, setIsStopped] = useState(false);
  const [typingIntervalId, setTypingIntervalId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const hotjarId = process.env.REACT_APP_HOTJAR_ID;
  const hotjarVersion = process.env.REACT_APP_HOTJAR_SNIPPET_VERSION;
  const username = localStorage.getItem('username');

  useEffect(() => {
    const hotjarId = process.env.REACT_APP_HOTJAR_ID;
    const hotjarVersion = process.env.REACT_APP_HOTJAR_SNIPPET_VERSION;
    if (hotjarId && hotjarVersion) {
      hotjar.initialize(hotjarId, parseInt(hotjarVersion));
    }
  }, []);

  useEffect(() => {
    const fetchChatHistory = async () => {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        try {
          const response = await axios.get('http://localhost:3000/chatHistory', {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      }
    };

    fetchChatHistory();
  }, [navigate]);

  const saveMessages = async (userMessage, botMessage) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return;

    const messagesToSave = [
      { message: userMessage, sender: 'user' },
      { message: botMessage, sender: 'bot' }
    ];

    try {
      await axios.post('http://localhost:3000/saveMessage', messagesToSave, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
    } catch (error) {
      console.error('Could not save messages:', error);
    }
  };

  const requestNotificationPermission = () => {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("Check Notifications", {
          body: "Receiving notifications works!",
          icon: tafbotImage
        });
      }
    });
  };

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
    } else {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      fetchChatHistory();
    }
  }, [navigate]);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get('http://localhost:3000/chatHistory');
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleExportConversations = () => {
    const conversationCsv = messages.map(msg =>
      `"${msg.sender === 'user' ? 'User' : 'TAFBot'}","${msg.text.replace(/"/g, '""')}"`
    ).join('\n');

    const blob = new Blob([conversationCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversation.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const btn = document.getElementById("request-permission-btn");
    if (btn) {
      btn.addEventListener("click", requestNotificationPermission);
    }
  
    return () => {
      if (btn) {
        btn.removeEventListener("click", requestNotificationPermission);
      }
    };
  }, []);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    Notification.requestPermission();
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'bot' && !lastMessage.temp && Notification.permission === "granted" && document.visibilityState === 'hidden') {
        new Notification("TAFBot is typing a response...", {
          body: lastMessage.text,
          icon: tafbotImage
        });
      }
    }
  }, [messages]);

  const sendMessage = async (message, sender) => {
    const authToken = localStorage.getItem('authToken');
    if (authToken && message.trim() !== '') {
      try {
        await axios.post('http://localhost:3000/saveMessage', 
          { message, sender },
          { headers: { "Authorization": `Bearer ${authToken}` } }
        );
      } catch (error) {
        console.error('Could not save the message:', error);
      }
    }
  };

  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !isStopped) {
      setMessages(prevMessages => [...prevMessages, { text: trimmedInput, sender: 'user', timestamp: new Date().toLocaleTimeString() }]);
      setInput('');
      setIsLoading(true);
      try {
        const response = await axios.post('http://10.198.83.7:8000/stream_chat', {
          content: trimmedInput,
          queries: messages.filter(m => m.sender === 'user').map(m => m.text),
          answers: messages.filter(m => m.sender === 'bot').map(m => m.text),
        });
        setIsLoading(false);
        const botMessage = response.data;
        await saveMessages(trimmedInput, botMessage);
        simulateTyping(botMessage);
      } catch (error) {
        setIsLoading(false);
        console.error('There was an error sending the message to the chatbot:', error);
        setMessages(prevMessages => [...prevMessages, { text: "Error: Could not connect to the chat service.", sender: 'bot' }]);
      }
    }
  };

  const simulateTyping = (botMessage) => {
    setIsTyping(true);
    let i = 0;
    const typingSpeed = 50;
    if (typingIntervalId) clearInterval(typingIntervalId);

    if (Notification.permission === "granted" && document.visibilityState === 'hidden') {
      new Notification("TAFBot is typing a response...", {
        icon: tafbotImage
      });
    }

    const newTypingIntervalId = setInterval(() => {
      if (i < botMessage.length) {
        i++;
        setMessages(prevMessages => {
          const messagesWithoutTemporary = prevMessages.filter(m => !m.temp);
          return [...messagesWithoutTemporary, { text: botMessage.substring(0, i), sender: 'bot', temp: true }];
        });
      } else {
        clearInterval(newTypingIntervalId);
        setIsTyping(false);
        setMessages(prevMessages => {
          return prevMessages.filter(m => !m.temp).concat({ text: botMessage, sender: 'bot', timestamp: new Date().toLocaleTimeString() });
        });
      }
    }, typingSpeed);

    setTypingIntervalId(newTypingIntervalId);
  };

  const handleBackToWelcome = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      const newSavedConversation = {
        id: Date.now(),
        messages: [...messages],
        title: `Conversation from ${new Date().toLocaleTimeString()}`,
      };
      setSavedConversations((prevConversations) => {
        const updatedConversations = [newSavedConversation, ...prevConversations].slice(0, 2);
        return updatedConversations;
      });
    }
    setMessages([]);
  };

  const handleClearConversations = () => {
    const isConfirmed = window.confirm("Are you sure you want to clear all conversations?");
    if (isConfirmed) {
      setMessages([]);
      setSavedConversations([]);
    }
  };

  const handleSelectConversation = (conversationId) => {
    const selectedConversation = savedConversations.find(conv => conv.id === conversationId);
    if (selectedConversation) {
      setMessages(selectedConversation.messages);
    }
  };

  const handleStop = () => {
    if (isLoading) setIsLoading(false);
    if (isTyping) {
      setIsTyping(false);
      if (typingIntervalId) {
        clearInterval(typingIntervalId);
        setTypingIntervalId(null);
      }
      setMessages(prevMessages => prevMessages.filter(m => !m.temp));
    }
  };

  useEffect(() => {
    if (input.length === 0) {
      setIsStopped(false);
    }
  }, [input]);

  return (
    <div className="chat-page">
      <div className="sidebar">
        <div className="sidebar-button" onClick={handleNewChat}>
          <img src={newChatIcon} alt="New Chat" className="new-chat-icon" />
          New chat
        </div>
        <div className="sidebar-button" onClick={handleClearConversations}>
          <img src={deleteIcon} alt="Delete" className="delete-icon" />
          Clear conversations
        </div>
        <div className="separator"></div>
        {savedConversations.map(conversation => (
          <div key={conversation.id} className="sidebar-button saved-conversation" onClick={() => handleSelectConversation(conversation.id)}>
            {conversation.title}
          </div>
        ))}
        <div className="sidebar-lower">
          <button id="request-permission-btn">Check notifications</button>
          <button onClick={handleExportConversations}>Export Conversations as CSV</button>
          <div className="sidebar-button logout-container" onClick={handleBackToWelcome}>
            <img src={logOutIcon} alt="Log out" className="log-out-icon" />
            Log out
          </div>
          <FeedbackForm username={username} />
        </div>
        <div className="sidebar-button" onClick={() => setShowFAQModal(true)}>
          <img src={faqIcon} alt="FAQs" className="faq-icon" />
          FAQs
        </div>
        <FAQModal show={showFAQModal} onClose={() => setShowFAQModal(false)} />
      </div>
      <div className="chat-container">
        <div className="chat-header">
          <img src={tafbotImage} alt="TAFBot" className="tafbot-icon" />
          {currentChat}
        </div>
        <div className="chat-messages" ref={messagesEndRef}>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.sender === 'user' ? (
                <>
                  <img src={userLogo} alt="User" className="user-logo" />
                  <div className="message-text">{message.text}</div>
                  <div className="message-timestamp">{message.timestamp}</div>
                </>
              ) : (
                <>
                  <img src={botLogo} alt="Bot" className="bot-logo" />
                  <div className="message-text">{message.text}</div>
                  <div className="message-timestamp">{message.timestamp}</div>
                </>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="message loading-message">
              <div className="loading-dots">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
            </div>
          )}
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder={`Ask ${currentChat} a question...`}
            disabled={isLoading}
          />
          <button onClick={(isLoading || isTyping) ? handleStop : handleSendMessage}>
            {(isLoading || isTyping) ? 'Stop' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
