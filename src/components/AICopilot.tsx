import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Globe, RefreshCw, Bot, User, Cpu, 
  HelpCircle, ArrowUpRight, Search, Zap, Check, MessageSquare
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  sources?: Array<{ title: string; uri: string }>;
  searchQueries?: string[];
  timestamp: Date;
}

interface AICopilotProps {
  onNavigate: (view: string) => void;
}

const PERSONALITIES = [
  {
    id: 'tech_expert',
    name: 'Hardware & Tech Expert',
    roleDescription: 'Senior systems engineer and hardware consultant.',
    icon: Cpu,
    systemInstruction: 'You are the NTIX Tech Support Guru. You provide highly detailed, expert guidance on hardware, computer repair, parts selection (laptops, phones, chargers, routers, earphones), troubleshooting operating systems, and network setups. Keep your tone professional, highly informative, and encouraging.',
    accent: 'from-cyan-500 to-blue-600',
    border: 'border-cyan-500/30'
  },
  {
    id: 'cyber_manager',
    name: 'Cyber Cafe Host',
    roleDescription: 'Friendly local tech hub coordinator.',
    icon: Bot,
    systemInstruction: 'You are the friendly cyber café manager of NTIX Tech Solutions in Kibwezi, Kenya. You advise customers on internet packages, workstation bookings, high-speed gaming specs, printing/scanning, laminating, typesetting, digital services, and local community IT requirements. Speak warmly, use clear and helpful language, and mention our location in Kibwezi, Kenya.',
    accent: 'from-indigo-500 to-purple-600',
    border: 'border-purple-500/30'
  },
  {
    id: 'web_researcher',
    name: 'Real-time Web Researcher',
    roleDescription: 'Ground-breaking search-powered analyst.',
    icon: Globe,
    systemInstruction: 'You are the NTIX Web Researcher, equipped with direct real-time access to Google Search. You specialize in pulling accurate, current, up-to-the-minute web details about tech trends, local news, scientific discoveries, specifications, and live comparisons. Cite your web sources directly and summarize info elegantly.',
    accent: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-500/30'
  }
];

const MODELS = [
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', desc: 'Default (Balanced speed & depth)' },
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Lite', desc: 'Ultra-fast response times' },
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', desc: 'Deep reasoning (Premium)' }
];

const SUGGESTED_QUESTIONS = [
  "What is the difference between a GaN charger and a normal USB charger?",
  "Recommend the best laptop specs for software engineering in 2026",
  "How do I setup a stable Wi-Fi 6 mesh network at home?",
  "What are the pricing options for cyber café printing & browsing?",
  "Who won the most recent formula 1 championship?"
];

export default function AICopilot({ onNavigate }: AICopilotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Hello! I am your NTIX AI Copilot. I can assist you with technology troubleshooting, cafe inquiries, or live web research. Which assistant persona would you like to speak with?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [currentPersonality, setCurrentPersonality] = useState(PERSONALITIES[0]);
  const [selectedModel, setSelectedModel] = useState('gemini-3.5-flash');
  const [useSearch, setUseSearch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Package conversation history up to last 12 messages for context
      const chatHistory = messages.concat(userMessage).map(msg => ({
        role: msg.role,
        text: msg.text
      })).slice(-12);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: chatHistory,
          model: selectedModel,
          systemInstruction: currentPersonality.systemInstruction,
          useSearch: useSearch
        })
      });

      if (!response.ok) {
        throw new Error('Communication failed with the server');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        text: data.reply,
        sources: data.sources,
        searchQueries: data.searchQueries,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: "I apologize, but I encountered an error connecting to the NTIX AI engine. Please verify your internet connection, confirm that your GEMINI_API_KEY is configured in Settings > Secrets, and try again.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: `Switched to ${currentPersonality.name}. How can I assist you today?`,
        timestamp: new Date()
      }
    ]);
  };

  const handlePersonalityChange = (personality: typeof PERSONALITIES[0]) => {
    setCurrentPersonality(personality);
    // Auto-toggle search for researcher
    if (personality.id === 'web_researcher') {
      setUseSearch(true);
    }
    setMessages([
      {
        role: 'assistant',
        text: `Hello! I am now operating as your ${personality.name}. ${personality.roleDescription} Ask me anything!`,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="w-full bg-[#030712] text-slate-100 font-sans flex-1 min-h-[calc(100vh-80px)] flex flex-col relative" id="ai-copilot-container">
      
      {/* Background Neon Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-cyan-500/5 rounded-full filter blur-3xl" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col md:flex-row gap-6 relative z-10">
        
        {/* SIDE PANEL: Configuration Controls */}
        <div className="w-full md:w-80 shrink-0 flex flex-col gap-5">
          
          {/* Persona Picker Card */}
          <div className="bg-[#090d16] border border-slate-800/80 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-black tracking-widest text-cyan-400 uppercase mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>AI COPILOT PERSONA</span>
            </h3>

            <div className="space-y-3">
              {PERSONALITIES.map((pers) => {
                const PersIcon = pers.icon;
                const isSelected = pers.id === currentPersonality.id;
                return (
                  <button
                    key={pers.id}
                    onClick={() => handlePersonalityChange(pers)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected 
                        ? `bg-slate-900 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]` 
                        : 'bg-transparent border-slate-800/50 hover:bg-slate-900/50 hover:border-slate-800'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${pers.accent} text-white shrink-0 shadow-md`}>
                      <PersIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-200'}`}>
                        {pers.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                        {pers.roleDescription}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Selection Card */}
          <div className="bg-[#090d16] border border-slate-800/80 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-4 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>COGNITIVE MODEL</span>
            </h3>

            <div className="space-y-2">
              {MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center justify-between ${
                    selectedModel === model.id
                      ? 'bg-slate-900 border-purple-500/40 text-purple-300'
                      : 'bg-transparent border-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span>{model.name}</span>
                    <span className="block text-[8px] text-slate-500 font-medium normal-case mt-0.5">{model.desc}</span>
                  </div>
                  {selectedModel === model.id && (
                    <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {selectedModel === 'gemini-3.1-pro-preview' && (
              <div className="mt-3 bg-purple-950/20 border border-purple-500/20 rounded-lg p-2.5 text-[10px] text-purple-300 leading-normal">
                Requires a paid API key. If the AI is unresponsive, ensure your paid credentials are configured in your Secrets dashboard.
              </div>
            )}
          </div>

          {/* Search Grounding Toggle */}
          <div className="bg-[#090d16] border border-slate-800/80 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-3 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>GROUNDING SERVICES</span>
            </h3>

            <label className="flex items-center gap-3 bg-slate-900/50 border border-slate-800/60 rounded-xl p-3 cursor-pointer hover:bg-slate-900 transition-colors">
              <input
                type="checkbox"
                checked={useSearch}
                onChange={(e) => setUseSearch(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-800 focus:ring-emerald-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-200 block">Google Search Grounding</span>
                <span className="text-[9px] text-slate-400 leading-snug block mt-0.5">Allow model to retrieve current web info & link citations</span>
              </div>
            </label>
          </div>

          {/* Helper reset & exit */}
          <div className="flex gap-2">
            <button
              onClick={clearChat}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear Chat</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="bg-slate-950 hover:bg-slate-900 text-slate-400 text-xs font-bold py-2.5 px-3.5 rounded-xl border border-slate-900 transition-all cursor-pointer uppercase tracking-wider"
            >
              Exit
            </button>
          </div>

        </div>

        {/* MAIN AREA: Interactive Scrollable Chat Feed */}
        <div className="flex-1 bg-[#090d16] border border-slate-800/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[550px] md:h-[650px]">
          
          {/* Chat Feed Header */}
          <div className="bg-[#0d1424] border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-r ${currentPersonality.accent} text-white`}>
                {React.createElement(currentPersonality.icon, { className: 'w-4.5 h-4.5' })}
              </div>
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <span>NTIX CO-PILOT ASSISTANT</span>
                  <span className="inline-flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Connected using <strong className="text-slate-300 font-bold">{selectedModel}</strong> • Search: <strong className={useSearch ? 'text-emerald-400' : 'text-slate-500'}>{useSearch ? 'ACTIVE' : 'OFF'}</strong>
                </p>
              </div>
            </div>
            
            <span className="text-[9px] font-mono font-extrabold tracking-widest text-cyan-400/80 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
              SECURE CLIENT
            </span>
          </div>

          {/* Message History Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">
            {messages.map((msg, i) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div 
                  key={i} 
                  className={`flex gap-3 max-w-[85%] ${
                    isAssistant ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'
                  }`}
                >
                  {/* Icon Avatar */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-md ${
                    isAssistant 
                      ? `bg-slate-900 border-slate-800 text-cyan-400` 
                      : 'bg-cyan-600 border-cyan-500 text-white'
                  }`}>
                    {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble Container */}
                  <div className="space-y-2">
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      isAssistant 
                        ? 'bg-slate-900/60 border border-slate-800 text-slate-100 rounded-tl-none' 
                        : 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-tr-none border border-cyan-500/20'
                    }`}>
                      {/* Render linebreaks gracefully */}
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    {/* Google Search groundings metadata */}
                    {isAssistant && msg.searchQueries && msg.searchQueries.length > 0 && (
                      <div className="flex flex-wrap gap-1 items-center px-1">
                        <span className="text-[8px] font-mono font-black text-emerald-400 tracking-wider uppercase flex items-center gap-1 shrink-0 mr-1">
                          <Search className="w-2.5 h-2.5" />
                          <span>Google Search Queries:</span>
                        </span>
                        {msg.searchQueries.map((q, idx) => (
                          <span key={idx} className="bg-slate-900 text-slate-400 text-[9px] border border-slate-800 px-1.5 py-0.5 rounded-md font-mono italic">
                            "{q}"
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Google Search citations/sources */}
                    {isAssistant && msg.sources && msg.sources.length > 0 && (
                      <div className="space-y-1.5 px-1 pt-1">
                        <span className="text-[8.5px] font-mono text-cyan-400 uppercase tracking-widest font-black block">
                          Verified Citations & Sources:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.sources.map((src, idx) => (
                            <a
                              key={idx}
                              href={src.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/30 rounded-lg p-2 flex items-center justify-between text-left transition-all group/src cursor-pointer"
                            >
                              <div className="truncate pr-2">
                                <span className="block text-[9px] font-bold text-slate-200 truncate group-hover/src:text-cyan-400 transition-colors">
                                  {src.title}
                                </span>
                                <span className="block text-[7px] text-slate-500 font-mono truncate">
                                  {src.uri}
                                </span>
                              </div>
                              <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover/src:text-cyan-400 shrink-0 transition-all" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timestamp */}
                    <span className="block text-[8px] text-slate-500 font-mono px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Loader Indicator */}
            {isLoading && (
              <div className="flex gap-3 max-w-[80%] mr-auto text-left">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin text-cyan-400" />
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <span className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[10px] text-slate-400 ml-1.5 italic font-mono uppercase tracking-wider">Formulating response via Gemini...</span>
                </div>
              </div>
            )}

            <div ref={threadEndRef} />
          </div>

          {/* Suggested Quick Questions Container */}
          {messages.length === 1 && !isLoading && (
            <div className="px-6 pb-2">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-black block mb-2">
                Suggested Prompt Starters:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="bg-[#0c1221] hover:bg-slate-850 border border-slate-800/80 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-400 rounded-xl px-3 py-1.5 text-[9.5px] font-medium text-left transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Sender Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="p-4 bg-[#0c1424] border-t border-slate-800/80 flex items-center gap-3"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ask our ${currentPersonality.name}...`}
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-50"
              />
              
              {/* Floating search icon status */}
              {useSearch && (
                <div className="absolute right-3.5 top-3 flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-400/80 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/30 pointer-events-none">
                  <Globe className="w-2.5 h-2.5 animate-pulse" />
                  <span>WEB ON</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold p-3 rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed border border-cyan-400/10"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
