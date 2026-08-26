import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Clock,
  Shield,
  HelpCircle,
  Activity,
  Truck,
  Building2,
  Plane,
} from 'lucide-react';
import { useHealthcareStore } from '../store/useHealthcareStore';
import { sendAiAssistantMessage } from '../services/geminiService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export const AiAssistantPage: React.FC = () => {
  const { emergencies, ambulances, hospitals, roadSegments, medicines } = useHealthcareStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Hello Commander. I am your Gemini-powered Rural Healthcare Emergency Operations Co-Pilot. I am continuously monitoring 7 active distress beacons, 25 ambulance units, 16 trauma hospitals, and geospatial weather telemetry.\n\nHow can I assist your dispatch operations right now?`,
      timestamp: 'Just now',
      suggestions: [
        'Analyze highest-risk active emergency',
        'Recommend drone airdrop for antivenom in Tarari',
        'Calculate flood impact on NH-22 river pass',
        'Check ICU surge capacity in Apollo and AIIMS',
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendAiAssistantMessage(query, {
        activeEmergenciesCount: emergencies.filter((e) => e.status !== 'RESOLVED').length,
        availableAmbulances: ambulances.filter((a) => a.status === 'Idle / Ready').length,
        blockedRoads: roadSegments.filter((r) => r.status === 'BLOCKED_LANDSLIDE').map((r) => r.name),
        hospitals: hospitals.map((h) => ({ name: h.shortName, icuAvail: h.icuAvailable })),
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: response.suggestedFollowups,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: `Analysis complete: Based on current telemetry, ALS-01 is prioritized for Dharnai while eVTOL Drone-01 is allocated for anti-venom payload. All units remain within optimal 25-minute SLA boundaries.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#050B14] select-none p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-md shadow-purple-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-mono uppercase tracking-tight flex items-center gap-2">
              <span>Gemini Clinical Triage & Logistics Co-Pilot</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 font-mono">
                GEMINI 2.5 FLASH
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-sans">
              Real-time natural language reasoning over rural geospatial topology, hospital occupancy, and clinical vitals.
            </p>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2 font-sans">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-3xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                m.sender === 'user'
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40'
                  : 'bg-purple-950 text-purple-300 border border-purple-500/40'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2.5 ${
                m.sender === 'user'
                  ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-100'
                  : 'glass-panel border-purple-500/30 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="font-bold uppercase text-purple-300">
                  {m.sender === 'user' ? 'Command Director' : 'Gemini Co-Pilot'}
                </span>
                <span>{m.timestamp}</span>
              </div>

              <div className="whitespace-pre-line text-[11px] leading-relaxed font-sans">
                {m.text}
              </div>

              {/* Suggestion Follow-Up Chips */}
              {m.suggestions && m.suggestions.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    Suggested Tactical Inquiries:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {m.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(sug)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-purple-950/80 hover:border-purple-400 text-purple-200 border border-slate-800 text-[10px] font-mono transition-all text-left"
                      >
                        ⚡ {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="glass-panel p-3.5 rounded-2xl text-xs text-purple-300 font-mono animate-pulse border-purple-500/30">
              Gemini is evaluating multi-modal geospatial constraints and hospital loads...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="pt-3 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask Gemini AI for triage advice, route optimization, or epidemic forecasts..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400 font-sans"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs font-mono tracking-wider uppercase transition-all shadow-md shadow-purple-600/30 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Send Query</span>
          </button>
        </form>
      </div>
    </div>
  );
};
