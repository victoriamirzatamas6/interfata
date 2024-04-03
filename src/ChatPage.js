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

function ChatPage() {
  
  const [currentChat, setCurrentChat] = useState('TAFBot');
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedConversations, setSavedConversations] = useState([]);
  const [isStopped, setIsStopped] = useState(false);
  const [typingIntervalId, setTypingIntervalId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);


  const requestNotificationPermission = () => {
    Notification.requestPermission().then(permission => {
      console.log("Permission:", permission);
      if (permission === "granted") {
        new Notification("Allow Notifications", {
          body: "Receiving notifications works!",
          icon: tafbotImage
        });
      }
    });
  };
  

  const handleExportConversations = () => {
    // Convertiți conversațiile într-un format CSV
    const conversationCsv = messages.map(msg =>
      `"${msg.sender === 'user' ? 'User' : 'TAFBot'}","${msg.text.replace(/"/g, '""')}"` // Dublați ghilimelele pentru a evita erorile în CSV
    ).join('\n');
  
    // Crearea unui blob cu textul conversației în format CSV
    const blob = new Blob([conversationCsv], { type: 'text/csv;charset=utf-8;' });
  
    // Crearea unui URL pentru descărcare
    const url = URL.createObjectURL(blob);
  
    // Crearea unui element <a> temporar pentru a iniția descărcarea
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversation.csv'; // Numele fișierului
    document.body.appendChild(a); // Adăugați elementul în document pentru a-l putea utiliza
    a.click(); // Simulați un click pe element pentru a declanșa descărcarea
  
    // Curățați și eliminați elementul <a> după ce descărcarea a fost inițiată
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Eliberați memoria URL-ului creat
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
  // State și ref-uri
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  // Restul state-urilor și ref-urilor rămân neschimbate

  useEffect(() => {
    // Cer permisiunea pentru notificări și ajustează scroll-ul
    Notification.requestPermission();
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // Asigură-te că ultimul mesaj este de la bot și că este final (nu temporar)
      if (lastMessage.sender === 'bot' && !lastMessage.temp && Notification.permission === "granted" && document.visibilityState === 'hidden') {
        new Notification("TAFBot is typing a response...", {
          body: lastMessage.text,
          icon: tafbotImage
        });
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !isStopped) {
      setMessages(prevMessages => [...prevMessages, { text: trimmedInput, sender: 'user' }]);
      setInput('');
      setIsLoading(true);
      try {
        const response = await axios.post('http://10.198.82.154:8000/stream_chat', {
          content: trimmedInput,
          queries: messages.filter(m => m.sender === 'user').map(m => m.text),
          answers: messages.filter(m => m.sender === 'bot').map(m => m.text),
        });
        setIsLoading(false);
        const botMessage = response.data;
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
  
    // Verifică dacă pagina este în background la începutul simulării
    // și trimite o notificare o singură dată
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
          return prevMessages.filter(m => !m.temp).concat({ text: botMessage, sender: 'bot' });
        });
      }
    }, typingSpeed);
  
    setTypingIntervalId(newTypingIntervalId);
  };
  const handleBackToWelcome = () => {
    navigate('/');
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
    // Confirmă ștergerea conversațiilor
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
    if (isLoading) setIsLoading(false); // Stop loading if necessary
    if (isTyping) {
      setIsTyping(false); // Stop typing simulation
      if (typingIntervalId) {
        clearInterval(typingIntervalId);
        setTypingIntervalId(null);
      }
      // Remove temporary messages to clear the conversation
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
    <div key={conversation.id} className="sidebar-button" onClick={() => handleSelectConversation(conversation.id)}>
      {conversation.title}
    </div>
  ))}
  
        <div className="sidebar-lower">
        <button id="request-permission-btn">Allow notifications</button>
  <button onClick={handleExportConversations}>Export Conversations as CSV</button>
          <div className="sidebar-button logout-container" onClick={handleBackToWelcome}>
            <img src={logOutIcon} alt="Log out" className="log-out-icon" />
            Log out
          </div>
        </div>
      </div>
      <div className="chat-container">
        <div className="chat-header">
          <img src={tafbotImage} alt="TAFBot" className="tafbot-icon" />
          {currentChat}
        </div>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.sender === 'user' ? (
                <>
                  <img src={userLogo} alt="User" className="user-logo" />
                  <div className="message-text">{message.text}</div>
                </>
              ) : (
                <>
                  <img src={botLogo} alt="Bot" className="bot-logo" />
                  <div className="message-text">{message.text}</div>
                </>
              )}
            </div>
          ))}
          {isLoading && (
            
  <div className="message loading-message">
    
    <div className="loading-dots" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
  <div style={{width: '8px', height: '8px', backgroundColor: '#9b8b8b', borderRadius: '50%', margin: '0 2px', animation: 'bounce 1.4s infinite ease-in-out both'}}></div>
  <div style={{width: '8px', height: '8px', backgroundColor: '#9b8b8b', borderRadius: '50%', margin: '0 2px', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s'}}></div>
  <div style={{width: '8px', height: '8px', backgroundColor: '#9b8b8b', borderRadius: '50%', margin: '0 2px', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s'}}></div>
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
            disabled={isLoading} // Dezactivează inputul în timpul încărcării
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