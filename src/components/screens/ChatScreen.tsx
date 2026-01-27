import { motion } from 'framer-motion';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/ui/button';
import type { Message } from '@/types';

export const ChatScreen = () => {
  const { matches, currentMatchId, messages, addMessage, setScreen, setCurrentMatch, addNotification } = useAppStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMatch = matches.find(m => m.id === currentMatchId);
  const chatMessages = messages.filter(m => m.matchId === currentMatchId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleBack = () => {
    setCurrentMatch(null);
    setScreen('matches');
  };

  const handleSend = () => {
    if (!inputValue.trim() || !currentMatchId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      matchId: currentMatchId,
      senderId: 'user',
      text: inputValue.trim(),
      timestamp: new Date()
    };

    addMessage(userMessage);
    setInputValue('');

    // Simulate reply after delay
    setTimeout(() => {
      const replies = [
        "Hey! I noticed we both love exploring new coffee shops ☕",
        "That's so cool! I've been meaning to check that out too",
        "I feel like we have such similar vibes based on our digital footprint 😊",
        "What's the most interesting thing you've discovered online lately?",
      ];
      
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        matchId: currentMatchId,
        senderId: currentMatchId,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date()
      };

      addMessage(replyMessage);
      addNotification({
        id: Date.now().toString(),
        type: 'message',
        matchId: currentMatchId,
        text: `New message from ${currentMatch?.name}`
      });
    }, 1500 + Math.random() * 1500);
  };

  if (!currentMatch) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-10"
      >
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <img
          src={currentMatch.avatar}
          alt={currentMatch.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <h2 className="font-semibold">{currentMatch.name}</h2>
          <div className="flex items-center gap-1 text-xs text-accent">
            <Sparkles className="w-3 h-3" />
            <span>{currentMatch.compatibility}% match</span>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Intro card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <img
            src={currentMatch.avatar}
            alt={currentMatch.name}
            className="w-20 h-20 rounded-full object-cover mx-auto mb-3 ring-4 ring-primary/20"
          />
          <h3 className="font-display font-bold text-lg mb-1">
            You matched with {currentMatch.name}!
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {currentMatch.compatibility}% compatible based on your digital footprint
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {currentMatch.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Chat messages */}
        {chatMessages.map((message, index) => {
          const isUser = message.senderId === 'user';
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                  isUser
                    ? 'gradient-primary text-primary-foreground rounded-br-md'
                    : 'glass rounded-bl-md'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span className={`text-[10px] mt-1 block ${
                  isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass border-t border-border px-4 py-3 flex items-center gap-3"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        <Button
          variant={inputValue.trim() ? "glow" : "glass"}
          size="icon"
          onClick={handleSend}
          disabled={!inputValue.trim()}
        >
          <Send className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
};
