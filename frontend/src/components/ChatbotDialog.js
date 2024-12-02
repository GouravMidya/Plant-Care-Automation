import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Button,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import axios from 'axios';
import MarkdownRenderer from './MarkdownRenderer';

const ChatbotDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedQueryType, setSelectedQueryType] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedQueryType) return;

    const apiRoute = selectedQueryType === 'navigation' ? '/navigate' : '/chat';

    const newMessages = [...messages, { sender: 'user', text: inputMessage }];
    setMessages(newMessages);
    setInputMessage('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_PYTHON_URL}${apiRoute}`, {
        message: inputMessage,
        chat_history: messages,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'ai',
          text: response.data.response,
          route: response.data.route,
          routeDescription: response.data.route_description,
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: 'Sorry, something went wrong. Please try again.' },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleOpen = () => {
    setIsAnimating(true);
    setIsOpen(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsOpen(false);
    }, 300);
  };

  const handleOptionSelect = (type) => {
    setSelectedQueryType(type === selectedQueryType ? null : type);
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={handleOpen}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            width: 60,
            height: 60,
            padding: 0,
          }}
        >
          <img
            src="/planticon2.png"
            alt="Chatbot Icon"
            style={{ width: '50%', height: '50%', objectFit: 'contain' }}
          />
        </Button>
      )}

      {isOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: isAnimating ? 10 : 20,
            right: isAnimating ? 10 : 20,
            width: 400,
            height: 450,
            borderRadius: 4,
            boxShadow: 3,
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            transform: isAnimating
              ? 'scale(0) translate(200%, 200%)'
              : 'scale(1) translate(0, 0)',
            opacity: isAnimating ? 0 : 1,
            transition: 'transform 0.5s ease, opacity 0.3s ease',
          }}
        >
          <Box
            onClick={handleClose}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 1,
              borderBottom: '1px solid #ddd',
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              color: 'white',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                width: '100%',
              }}
            >
              <strong>Plant Care Assistant</strong>
            </Typography>
          </Box>

          <Box
            sx={{
              padding: 1,
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              borderBottom: '1px solid #ddd',
            }}
          >
            <Button
              variant={selectedQueryType === 'navigation' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => handleOptionSelect('navigation')}
            >
              Site Guide
            </Button>
            <Button
              variant={selectedQueryType === 'chat' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => handleOptionSelect('chat')}
            >
              Plant Helper
            </Button>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              padding: 1,
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  margin: '4px',
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    backgroundColor: msg.sender === 'user' ? 'primary.light' : 'grey.200',
                    color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                    borderRadius: 2,
                    p: 1,
                    my: 1,
                    maxWidth: '80%',
                    textAlign: msg.sender === 'user' ? 'right' : 'left',
                  }}
                >
                  {msg.sender === 'ai' ? (
                    <MarkdownRenderer markdownText={msg.text} />
                  ) : (
                    <MarkdownRenderer markdownText={msg.text} color="white"/>
                  )}
                  {msg.route && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: 'block' }}
                    >
                      Suggested Route: <a href={`${process.env.REACT_APP_FRONTEND_URL}${msg.route}`}>{msg.route}</a>
                    </Typography>
                  )}
                </Paper>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: 1,
              borderTop: '1px solid #ddd',
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              size="small"
              disabled={!selectedQueryType}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !selectedQueryType}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatbotDialog;
