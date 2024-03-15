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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  const [currentChat, setCurrentChat] = useState('TAFBot'); 
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false); // Noua stare pentru loading
  const [savedConversations, setSavedConversations] = useState([]);
  // Adăugăm o nouă stare pentru a urmări dacă utilizatorul a apăsat pe butonul de stop
  const [isStopped, setIsStopped] = useState(false);
  // Adaugă o nouă stare pentru intervalul de simulare a tastării
  const [typingIntervalId, setTypingIntervalId] = useState(null);
  
  const restoreConversation = (conversation) => {
    setMessages(conversation.messages);
    setCurrentChat(conversation.chatName);
  };
  //let navigate = useNavigate();
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !isStopped) {
      // Adaugă mesajul utilizatorului la chat
      setMessages(prevMessages => [...prevMessages, { text: trimmedInput, sender: 'user' }]);
      setInput(''); // Golește input-ul
      setIsLoading(true); // Începe încărcarea
  
      try {
        // Realizează cererea POST către server
        const response = await axios.post('http://10.198.82.154:8000/stream_chat', {
          content: trimmedInput,
          queries: messages.filter(m => m.sender === 'user').map(m => m.text),
          answers: messages.filter(m => m.sender === 'bot').map(m => m.text),
        });
  
        setIsLoading(false); // Oprește încărcarea
        const botMessage = response.data; // Prezumăm că răspunsul serverului este text simplu
        
        // Simulează tastarea răspunsului botului
        simulateTyping(botMessage);
      } catch (error) {
        setIsLoading(false); // Oprește încărcarea în cazul unei erori
        console.error('There was an error sending the message to the chatbot:', error);
        // Afișează un mesaj de eroare în chat
        setMessages(prevMessages => [...prevMessages, { text: "Error: Could not connect to the chat service.", sender: 'bot' }]);
      }
    }
  };

  const simulateTyping = (botMessage) => {
    setIsLoading(true); // Începe simularea (aceasta va schimba butonul în "Stop")

    let i = 0;
    const typingSpeed = 50;
    const addTemporaryMessage = (text) => {
      setMessages(prevMessages => {
        const messagesWithoutTemporary = prevMessages.filter(m => !m.temp);
        return [...messagesWithoutTemporary, { text, sender: 'bot', temp: true }];
      });
    };

    // Asigură-te că orice interval anterior este oprit înainte de a începe unul nou
    if (typingIntervalId) {
      clearInterval(typingIntervalId);
    }
  
    const newTypingIntervalId = setInterval(() => {
      if (i <= botMessage.length) {
        addTemporaryMessage(botMessage.substring(0, i));
        i++;
      } else {
        clearInterval(newTypingIntervalId);
        setTypingIntervalId(null);
        setMessages(prevMessages => prevMessages.filter(m => !m.temp).concat([{ text: botMessage, sender: 'bot' }]));
      }
    }, typingSpeed);

    // Actualizează starea cu noul ID al intervalului
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
    setIsLoading(false); // Oprește simularea și revine la starea inițială
    if (typingIntervalId) {
      clearInterval(typingIntervalId);
      setTypingIntervalId(null);
    }
    // Elimină mesajele temporare pentru a curăța conversația
    setMessages(prevMessages => prevMessages.filter(m => !m.temp));
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
          <button onClick={isLoading ? handleStop : handleSendMessage}>
  {isLoading ? 'Stop' : 'Send'}
</button>
          
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
