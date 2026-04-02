import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  TrendingDown, 
  MapPin, 
  Lightbulb, 
  ArrowRight, 
  ChevronRight,
  GraduationCap,
  School,
  HeartHandshake,
  AlertCircle,
  Loader2,
  Sparkles,
  UserCircle,
  Save,
  CheckCircle2,
  Trophy,
  Calendar,
  Clock,
  Check,
  X,
  Plus,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Mic,
  Upload,
  Image as ImageIcon,
  FileText,
  Volume2,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { 
  generateStrategies, 
  generateRecommendations,
  generateCareerPaths,
  generateAutomations,
  solveVisualDoubt,
  analyzeStudyMaterial,
  getVoiceAssistantResponse,
  type Strategy, 
  type Recommendation,
  type StudentProfile,
  type CareerPath,
  type Automation,
  type VisualDoubtResponse,
  type MaterialAnalysis
} from '@/src/services/geminiService';

// Mock Data for Rajasthan Education Context
const DROPOUT_REASONS = [
  { name: 'Financial Constraints', value: 30, color: '#ea580c' },
  { name: 'Lack of Interest', value: 20, color: '#6366f1' },
  { name: 'Child Marriage/Social', value: 20, color: '#f59e0b' },
  { name: 'Distance/Infrastructure', value: 15, color: '#d97706' },
  { name: 'Migration/Agriculture', value: 10, color: '#fbbf24' },
  { name: 'Other', value: 5, color: '#78350f' },
];

const DISTRICT_DATA = [
  { name: 'Jaisalmer', rate: 18.5 },
  { name: 'Barmer', rate: 16.2 },
  { name: 'Bikaner', rate: 14.8 },
  { name: 'Jodhpur', rate: 12.5 },
  { name: 'Jaipur', rate: 8.2 },
  { name: 'Udaipur', rate: 11.4 },
];

const RAJASTHAN_DISTRICTS = [
  "Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"
];

const SUPPORT_AREAS = [
  "Financial Aid", "Transportation", "Hostel Facilities", "Academic Tutoring", "Career Counseling", "Mental Health", "Digital Literacy", "Vocational Training", "Child Marriage Prevention", "Remote Learning", "Motivation & Engagement"
];

const INTEREST_AREAS = [
  "Agriculture", "Technology", "Arts & Crafts", "Tourism", "Healthcare", "Teaching", "Business", "Public Service", "Sports", "Renewable Energy"
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'strategies' | 'resources' | 'profile' | 'prd' | 'automations' | 'early-warning' | 'learning-hub' | 'voice-assistant'>('overview');
  const [loading, setLoading] = useState(false);
  const [scanningPhase, setScanningPhase] = useState<string | null>(null);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [userInput, setUserInput] = useState('');

  // Profile State
  const [profile, setProfile] = useState<StudentProfile>({
    status: '',
    location: '',
    supportNeeds: [],
    gender: 'Female',
    interests: []
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [careerLoading, setCareerLoading] = useState(false);
  const [automationsLoading, setAutomationsLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Learning Hub State
  const [uploadedMaterial, setUploadedMaterial] = useState<MaterialAnalysis | null>(null);
  const [materialLoading, setMaterialLoading] = useState(false);
  const [visualDoubt, setVisualDoubt] = useState<VisualDoubtResponse | null>(null);
  const [visualLoading, setVisualLoading] = useState(false);
  const [visualImage, setVisualImage] = useState<string | null>(null);
  const [visualQuery, setVisualQuery] = useState('');

  // Voice Assistant State
  const [isListening, setIsListening] = useState(false);
  const [voiceResponse, setVoiceResponse] = useState<string | null>(null);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleVoiceInteraction = async () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    // Check for SpeechRecognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onresult = async (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      setVoiceLoading(true);
      try {
        const response = await getVoiceAssistantResponse(speechToText);
        setVoiceResponse(response);
        
        // Text-to-Speech
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.lang = 'en-IN';
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        setError("Failed to get voice response.");
      } finally {
        setVoiceLoading(false);
      }
    };

    recognition.start();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMaterialLoading(true);
    try {
      // In a real app, we'd extract text from PDF/Doc. 
      // For this demo, we'll simulate text extraction.
      const simulatedText = `Study Material for ${file.name}: Rajasthan's history is rich with tales of bravery and cultural heritage. The state's educational initiatives like the Gargi Puraskar and Mukhyamantri Rajshree Yojana aim to empower students, especially girls, to achieve their full potential.`;
      const analysis = await analyzeStudyMaterial(simulatedText);
      setUploadedMaterial(analysis);
    } catch (err) {
      setError("Failed to analyze study material.");
    } finally {
      setMaterialLoading(false);
    }
  };

  const handleVisualDoubt = async () => {
    if (!visualImage || !visualQuery) return;
    setVisualLoading(true);
    try {
      const result = await solveVisualDoubt(visualImage.split(',')[1], visualQuery);
      setVisualDoubt(result);
    } catch (err) {
      setError("Failed to solve visual doubt.");
    } finally {
      setVisualLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setVisualImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Early Warning System State
  const [ewsData, setEwsData] = useState({
    attendance: 85,
    grades: 70,
    familyIncome: 15000,
    distance: 5,
    engagement: 3 // 1-5
  });
  const [riskScore, setRiskScore] = useState<{ score: number, level: string, color: string, advice: string[] } | null>(null);

  const calculateRisk = () => {
    let score = 0;
    // Attendance: 40% weight
    if (ewsData.attendance < 70) score += 40;
    else if (ewsData.attendance < 80) score += 20;
    else if (ewsData.attendance < 90) score += 10;

    // Grades: 20% weight
    if (ewsData.grades < 40) score += 20;
    else if (ewsData.grades < 60) score += 10;

    // Income: 20% weight
    if (ewsData.familyIncome < 5000) score += 20;
    else if (ewsData.familyIncome < 10000) score += 10;

    // Distance: 10% weight
    if (ewsData.distance > 15) score += 10;
    else if (ewsData.distance > 8) score += 5;

    // Engagement: 10% weight
    if (ewsData.engagement < 2) score += 10;
    else if (ewsData.engagement < 3) score += 5;

    let level = 'Low';
    let color = 'text-emerald-600';
    let advice = [
      "Maintain current engagement levels.",
      "Participate in monthly community mentorship sessions.",
      "Explore merit-based scholarship opportunities."
    ];

    if (score >= 60) {
      level = 'Critical';
      color = 'text-rose-600';
      advice = [
        "Immediate home visit by community volunteer required.",
        "Apply for 'Emergency Financial Support' scheme.",
        "Enroll in mandatory remedial classes.",
        "Counseling session with parents regarding Gargi Puraskar benefits."
      ];
    } else if (score >= 30) {
      level = 'Moderate';
      color = 'text-amber-600';
      advice = [
        "Schedule a 1-on-1 session with a mentor.",
        "Check eligibility for transportation subsidies.",
        "Join a peer-support study group.",
        "Monitor attendance weekly."
      ];
    }

    setRiskScore({ score, level, color, advice });
  };

  useEffect(() => {
    if (activeTab === 'early-warning' && !riskScore) {
      calculateRisk();
    }
  }, [activeTab]);

  // Mentor Availability State
  const [isMentorMode, setIsMentorMode] = useState(false);
  const [mentorAvailability, setMentorAvailability] = useState<Record<string, string[]>>({
    'Prof. Rajesh Kumar': ['Monday 10:00 - 12:00', 'Wednesday 14:00 - 16:00'],
    'Dr. Anita Sharma': ['Tuesday 09:00 - 11:00', 'Thursday 15:00 - 17:00'],
    'Smt. Meena Devi (Community Leader)': ['Friday 11:00 - 13:00'],
    'Shri Alok Singh (Education Officer)': ['Monday 16:00 - 18:00']
  });
  const [newAvailabilitySlot, setNewAvailabilitySlot] = useState('');

  const handleAddAvailability = () => {
    if (!newAvailabilitySlot) return;
    const mentorName = 'Prof. Rajesh Kumar'; // Simulating as the logged-in mentor
    setMentorAvailability(prev => ({
      ...prev,
      [mentorName]: [...(prev[mentorName] || []), newAvailabilitySlot]
    }));
    setNewAvailabilitySlot('');
  };

  const handleRemoveAvailability = (slot: string) => {
    const mentorName = 'Prof. Rajesh Kumar';
    setMentorAvailability(prev => ({
      ...prev,
      [mentorName]: prev[mentorName].filter(s => s !== slot)
    }));
  };

  // Mentorship Sessions State
  const [sessions, setSessions] = useState<any[]>([
    {
      id: '1',
      mentorName: 'Dr. Anita Sharma',
      proposedTime: '2026-04-05T10:00',
      status: 'Confirmed',
      topic: 'Scholarship Application Guidance'
    }
  ]);
  const [newSessionTime, setNewSessionTime] = useState('');
  const [newSessionTopic, setNewSessionTopic] = useState('');
  const [selectedMentor, setSelectedMentor] = useState('Prof. Rajesh Kumar');

  const handleScheduleSession = () => {
    if (!newSessionTime || !newSessionTopic) return;
    
    const session = {
      id: Math.random().toString(36).substr(2, 9),
      mentorName: selectedMentor,
      proposedTime: newSessionTime,
      status: 'Pending',
      topic: newSessionTopic
    };
    
    setSessions(prev => [session, ...prev]);
    setNewSessionTime('');
    setNewSessionTopic('');
  };

  const handleConfirmSession = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'Confirmed' } : s));
  };

  const handleSuggestAlternative = (id: string, altTime: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'Rescheduled', alternativeTime: altTime } : s));
  };

  const handleGenerateStrategies = async () => {
    setLoading(true);
    setError(null);
    setScanningPhase("Analyzing Profile...");
    try {
      const context = userInput || (profile.status ? `A ${profile.gender} student in ${profile.location} who is ${profile.status} and needs ${profile.supportNeeds.join(', ')}. Focus on girls' education priority.` : "Dropout prevention in Rajasthan with highest preference to girls' education");
      
      setTimeout(() => setScanningPhase("Scanning Government Database..."), 1500);
      setTimeout(() => setScanningPhase("Matching Eligibility Criteria..."), 3000);
      setTimeout(() => setScanningPhase("Finalizing Recommendations..."), 4500);

      const result = await generateStrategies(context);
      if (result && result.length > 0) {
        setStrategies(result);
        setActiveTab('strategies');
      } else {
        setError("No matching strategies found. Please try a different search term.");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to connect to the AI service. Please check your connection and try again.");
    } finally {
      setLoading(false);
      setScanningPhase(null);
    }
  };

  const handleSaveProfile = async () => {
    setProfileSaved(true);
    setError(null);
    setRecommendationsLoading(true);
    setCareerLoading(true);
    setAutomationsLoading(true);
    try {
      const [recResult, careerResult, autoResult] = await Promise.all([
        generateRecommendations(profile),
        generateCareerPaths(profile),
        generateAutomations(profile)
      ]);
      setRecommendations(recResult);
      setCareerPaths(careerResult);
      setAutomations(autoResult);
    } catch (error) {
      console.error(error);
      setError("Failed to generate personalized recommendations. Please try again later.");
    } finally {
      setRecommendationsLoading(false);
      setCareerLoading(false);
      setAutomationsLoading(false);
      setTimeout(() => setProfileSaved(false), 3000);
    }
  };

  const toggleSupportNeed = (need: string) => {
    setProfile(prev => ({
      ...prev,
      supportNeeds: prev.supportNeeds.includes(need)
        ? prev.supportNeeds.filter(n => n !== need)
        : [...prev.supportNeeds, need]
    }));
  };

  const toggleInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="portal-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-lg shadow-sm">
                <GraduationCap className="text-[#003366] w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight leading-none text-white">
                  Rajasthan Student Service Portal
                </h1>
                <p className="text-[10px] font-bold text-orange-200 uppercase tracking-widest mt-0.5">
                  Government of Rajasthan Initiative | Heritage of Excellence, Future of Innovation
                </p>
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('overview')}
                className={cn("portal-nav-item", activeTab === 'overview' ? "active" : "inactive")}
              >
                Citizen Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('strategies')}
                className={cn("portal-nav-item", activeTab === 'strategies' ? "active" : "inactive")}
              >
                AI Service Advisor
              </button>
              <button 
                onClick={() => setActiveTab('automations')}
                className={cn("portal-nav-item", activeTab === 'automations' ? "active" : "inactive")}
              >
                Smart Automations
              </button>
              <button 
                onClick={() => setActiveTab('early-warning')}
                className={cn("portal-nav-item flex items-center gap-1.5", activeTab === 'early-warning' ? "active" : "inactive")}
              >
                <ShieldAlert className="w-4 h-4" />
                Early Warning
              </button>
              <button 
                onClick={() => setActiveTab('learning-hub')}
                className={cn("portal-nav-item flex items-center gap-1.5", activeTab === 'learning-hub' ? "active" : "inactive")}
              >
                <BrainCircuit className="w-4 h-4" />
                Learning Hub
              </button>
              <button 
                onClick={() => setActiveTab('voice-assistant')}
                className={cn("portal-nav-item flex items-center gap-1.5", activeTab === 'voice-assistant' ? "active" : "inactive")}
              >
                <Mic className="w-4 h-4" />
                AI Voice
              </button>
              <button 
                onClick={() => setActiveTab('resources')}
                className={cn("portal-nav-item", activeTab === 'resources' ? "active" : "inactive")}
              >
                Scheme Directory
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={cn("portal-nav-item flex items-center gap-1.5", activeTab === 'profile' ? "active" : "inactive")}
              >
                <UserCircle className="w-4 h-4" />
                My Digital ID
              </button>
              <button 
                onClick={() => setActiveTab('prd')}
                className={cn("portal-nav-item", activeTab === 'prd' ? "active" : "inactive")}
              >
                Project Doc
              </button>
            </nav>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-[10px] text-slate-300 font-bold uppercase">Helpdesk</p>
                <p className="text-xs font-bold text-white">1800-123-4567</p>
              </div>
              <button 
                onClick={handleGenerateStrategies}
                className="bg-white text-[#003366] px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-100 transition-all flex items-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-[#FF9933]" />
                Apply AI Logic
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6"
            >
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <section className="relative overflow-hidden rounded-3xl bg-[#003366] text-white p-8 md:p-12 border-b-8 border-[#138808]">
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 mb-6">
                    <div className="w-2 h-2 rounded-full bg-[#FF9933] animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-orange-200">Official Student Portal</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-2 leading-tight">
                    Empowering Every <span className="text-[#FF9933]">Student</span> in Rajasthan
                  </h2>
                  <p className="text-orange-200/80 text-sm md:text-base font-medium mb-6 tracking-wide italic">
                    "Bridging Heritage with Innovation for Rajasthan's Future"
                  </p>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 mb-8 max-w-lg">
                    <p className="text-white text-sm font-medium leading-relaxed italic">
                      "Education is the most powerful weapon which you can use to change the world. In the land of warriors, let knowledge be your greatest strength."
                    </p>
                    <p className="text-orange-200 text-[10px] font-bold uppercase tracking-widest mt-2">— Educational Note for Rajasthan's Youth</p>
                  </div>
                  <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                    Access personalized government services, AI-driven educational strategies, and financial support systems designed to eliminate barriers for all students.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white/5 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Portal Reach</p>
                      <p className="text-2xl font-bold text-[#FF9933]">33 Districts</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Active Schemes</p>
                      <p className="text-2xl font-bold text-emerald-400">50+ Services</p>
                    </div>
                    <div className="bg-[#FF9933]/10 backdrop-blur-sm px-4 py-3 rounded-2xl border border-[#FF9933]/30 flex items-center gap-2">
                      <HeartHandshake className="text-[#FF9933] w-5 h-5" />
                      <p className="text-[10px] font-bold text-[#FF9933] uppercase tracking-wider">Girls' Education Priority</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-40 pointer-events-none">
                  <img 
                    src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1000" 
                    alt="Rajasthan Heritage - Hawa Mahal" 
                    className="object-cover w-full h-full"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#003366]" />
                </div>
              </section>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <AlertCircle className="text-orange-600 w-5 h-5" />
                    Primary Reasons for Dropout
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={DROPOUT_REASONS}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {DROPOUT_REASONS.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {DROPOUT_REASONS.map((reason) => (
                      <div key={reason.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: reason.color }} />
                        <span className="text-xs text-slate-600">{reason.name} ({reason.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <MapPin className="text-orange-600 w-5 h-5" />
                    Dropout Rates by District
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={DISTRICT_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="rate" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* AI Scheme Matcher Section on Home Page */}
              <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-8 shadow-sm group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                  <div className="lg:w-1/2">
                    <div className="inline-flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full border border-orange-200 mb-4">
                      <Sparkles className="w-3 h-3 text-orange-600" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-orange-700">AI-Powered Matching</span>
                    </div>
                    <h3 className="text-3xl font-bold text-[#003366] mb-4">Find Your Perfect <span className="text-orange-600">Government Scheme</span></h3>
                    <p className="text-slate-600 mb-8 text-lg">
                      Our AI engine scans over 50+ Rajasthan government schemes to find the ones that match your specific profile, location, and educational needs.
                    </p>
                    <div className="flex flex-wrap gap-4 mb-8">
                      <div className="flex items-center gap-2 text-sm text-portal-navy font-medium">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Eligibility Check
                      </div>
                      <div className="flex items-center gap-2 text-sm text-portal-navy font-medium">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Instant Application
                      </div>
                      <div className="flex items-center gap-2 text-sm text-portal-navy font-medium">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Priority Matching
                      </div>
                    </div>
                    <button 
                      onClick={handleGenerateStrategies}
                      className="bg-[#003366] text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center gap-3 group/btn"
                    >
                      <Sparkles className="w-5 h-5 text-[#FF9933] group-hover/btn:rotate-12 transition-transform" />
                      Run AI Scheme Matcher
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                    {[
                      { label: 'Gargi Puraskar', icon: Trophy, color: 'text-orange-600', bg: 'bg-orange-50' },
                      { label: 'Rajshree Yojana', icon: HeartHandshake, color: 'text-rose-600', bg: 'bg-rose-50' },
                      { label: 'Scooty Scheme', icon: School, color: 'text-teal-600', bg: 'bg-teal-50' },
                      { label: 'Scholarships', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
                    ].map((item, i) => (
                      <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-slate-50 flex flex-col items-center text-center hover:shadow-md transition-all">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3", item.bg, item.color)}>
                          <item.icon className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-portal-navy">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mentor Availability Section on Home Page */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-[#003366] flex items-center gap-2">
                      <Users className="w-6 h-6 text-orange-600" />
                      Available Mentors Today
                    </h3>
                    <p className="text-slate-500">Connect with local experts and community leaders for 1-on-1 guidance.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTab('resources');
                      setTimeout(() => {
                        const element = document.getElementById('mentorship-section');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="bg-[#003366] text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule a Session
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(mentorAvailability).map(([name, slots], idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-orange-200 transition-all group">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">
                          {name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-portal-navy group-hover:text-orange-600 transition-colors truncate">{name}</h4>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Available Slots</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {slots.slice(0, 2).map((slot, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2 text-[10px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                            <Clock className="w-3 h-3 text-orange-500 shrink-0" />
                            <span className="truncate">{slot}</span>
                          </div>
                        ))}
                        {slots.length > 2 && (
                          <p className="text-[10px] text-center text-slate-400 mt-2">+{slots.length - 2} more slots</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'early-warning' && (
            <motion.div
              key="early-warning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-[#003366] flex items-center gap-3">
                    <ShieldAlert className="w-8 h-8 text-rose-600" />
                    Early Warning System (EWS)
                  </h2>
                  <p className="text-slate-500">
                    Predicting dropout risks using multi-dimensional data analysis and AI-driven indicators.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Panel */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-portal-navy mb-6 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Risk Indicators
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-bold text-portal-navy">Attendance Rate</label>
                          <span className="text-sm font-bold text-blue-600">{ewsData.attendance}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" max="100" 
                          value={ewsData.attendance}
                          onChange={(e) => setEwsData(prev => ({ ...prev, attendance: parseInt(e.target.value) }))}
                          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Critical threshold: Below 75%</p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-bold text-portal-navy">Average Grades</label>
                          <span className="text-sm font-bold text-blue-600">{ewsData.grades}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" max="100" 
                          value={ewsData.grades}
                          onChange={(e) => setEwsData(prev => ({ ...prev, grades: parseInt(e.target.value) }))}
                          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-portal-navy mb-2">Monthly Family Income (₹)</label>
                        <select 
                          value={ewsData.familyIncome}
                          onChange={(e) => setEwsData(prev => ({ ...prev, familyIncome: parseInt(e.target.value) }))}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={3000}>Below ₹5,000</option>
                          <option value={7500}>₹5,000 - ₹10,000</option>
                          <option value={15000}>₹10,000 - ₹25,000</option>
                          <option value={30000}>Above ₹25,000</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-portal-navy mb-2">Distance to School (km)</label>
                        <input 
                          type="number" 
                          value={ewsData.distance}
                          onChange={(e) => setEwsData(prev => ({ ...prev, distance: parseInt(e.target.value) }))}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-portal-navy mb-2">Student Engagement</label>
                        <div className="flex justify-between gap-2">
                          {[1, 2, 3, 4, 5].map(val => (
                            <button
                              key={val}
                              onClick={() => setEwsData(prev => ({ ...prev, engagement: val }))}
                              className={cn(
                                "flex-1 py-2 rounded-lg text-xs font-bold border transition-all",
                                ewsData.engagement === val 
                                  ? "bg-blue-600 text-white border-blue-600" 
                                  : "bg-white text-slate-400 border-slate-200 hover:border-blue-300"
                              )}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between mt-1 px-1">
                          <span className="text-[10px] text-slate-400">Low</span>
                          <span className="text-[10px] text-slate-400">High</span>
                        </div>
                      </div>

                      <button 
                        onClick={calculateRisk}
                        className="w-full bg-portal-navy text-white py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Analyze Risk Level
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-2 space-y-6">
                  {riskScore && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden"
                    >
                      <div className={cn(
                        "absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-20",
                        riskScore.level === 'Critical' ? "bg-rose-500" :
                        riskScore.level === 'Moderate' ? "bg-amber-500" : "bg-emerald-500"
                      )} />
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Risk Assessment</p>
                            <h3 className={cn("text-4xl font-black", riskScore.color)}>{riskScore.level} Risk</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Risk Index Score</p>
                            <p className="text-3xl font-bold text-portal-navy">{riskScore.score}/100</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="text-sm font-bold text-portal-navy mb-4 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-orange-500" />
                              Why this score?
                            </h4>
                            <div className="space-y-3">
                              {ewsData.attendance < 75 && (
                                <div className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl border border-rose-100">
                                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                  <p className="text-xs text-rose-700 leading-relaxed">Attendance is significantly below the state safety threshold of 75%.</p>
                                </div>
                              )}
                              {ewsData.familyIncome < 10000 && (
                                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                  <p className="text-xs text-amber-700 leading-relaxed">Economic stress detected. Financial support may be needed to prevent withdrawal.</p>
                                </div>
                              )}
                              {ewsData.distance > 10 && (
                                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                  <p className="text-xs text-blue-700 leading-relaxed">Long commute distance increases the likelihood of irregular attendance.</p>
                                </div>
                              )}
                              {riskScore.level === 'Low' && (
                                <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <p className="text-xs text-emerald-700 leading-relaxed">Student shows strong indicators of stability and academic persistence.</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-portal-navy mb-4 flex items-center gap-2">
                              <ArrowRight className="w-4 h-4 text-blue-500" />
                              Recommended Interventions
                            </h4>
                            <div className="space-y-2">
                              {riskScore.advice.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                                  <p className="text-xs text-portal-navy font-medium">{item}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100">
                          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <Users className="w-5 h-5 text-orange-600" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-portal-navy">Connect with Mentor</p>
                                <p className="text-[10px] text-slate-500">Immediate consultation available</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => setActiveTab('resources')}
                              className="bg-portal-navy text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                            >
                              View Eligible Schemes
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-4">How EWS Works</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <h4 className="text-sm font-bold">Data Aggregation</h4>
                          <p className="text-[10px] text-blue-100 leading-relaxed">Collects attendance, grades, and socio-economic data from state databases.</p>
                        </div>
                        <div className="space-y-2">
                          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <h4 className="text-sm font-bold">Pattern Matching</h4>
                          <p className="text-[10px] text-blue-100 leading-relaxed">AI analyzes historical dropout patterns to identify high-risk profiles early.</p>
                        </div>
                        <div className="space-y-2">
                          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <h4 className="text-sm font-bold">Proactive Action</h4>
                          <p className="text-[10px] text-blue-100 leading-relaxed">Triggers automated alerts to mentors and suggests targeted financial aid.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'learning-hub' && (
            <motion.div
              key="learning-hub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-[#003366] flex items-center gap-3">
                    <BrainCircuit className="w-8 h-8 text-indigo-600" />
                    Learning Hub & Visual Advisor
                  </h2>
                  <p className="text-slate-500">
                    Upload study materials for AI analysis or use visual tools for diagram-based learning.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Study Material Uploader */}
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-portal-navy">Study Material Uploader</h3>
                  </div>
                  
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-indigo-400 transition-all cursor-pointer relative">
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                    <Upload className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                    <p className="text-sm font-bold text-portal-navy">Click or drag to upload material</p>
                    <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, TXT</p>
                  </div>

                  {materialLoading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    </div>
                  )}

                  {uploadedMaterial && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-portal-navy mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          AI Summary
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{uploadedMaterial.summary}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-portal-navy mb-2">Key Learning Points</h4>
                        <ul className="space-y-1">
                          {uploadedMaterial.keyPoints.map((point, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-portal-navy mb-2">Quick Quiz</h4>
                        <div className="space-y-3">
                          {uploadedMaterial.quizQuestions.map((q, i) => (
                            <div key={i} className="bg-white p-3 rounded-xl border border-slate-200">
                              <p className="text-xs font-bold text-portal-navy mb-1">Q: {q.question}</p>
                              <p className="text-[10px] text-emerald-600 font-bold">A: {q.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Visual Answer System */}
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-portal-navy">Visual Answer System</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="relative group">
                      {visualImage ? (
                        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-200">
                          <img src={visualImage} alt="Visual Doubt" className="w-full h-48 object-cover" />
                          <button 
                            onClick={() => setVisualImage(null)}
                            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded-full hover:bg-white transition-all"
                          >
                            <X className="w-4 h-4 text-rose-600" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-emerald-400 transition-all cursor-pointer relative">
                          <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            onChange={handleImageUpload}
                            accept="image/*"
                          />
                          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                          <p className="text-sm font-bold text-portal-navy">Upload Diagram or Problem Image</p>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="What is your doubt about this image?"
                        value={visualQuery}
                        onChange={(e) => setVisualQuery(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button 
                        onClick={handleVisualDoubt}
                        disabled={!visualImage || !visualQuery || visualLoading}
                        className="absolute right-2 top-2 bg-emerald-600 text-white p-1.5 rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {visualLoading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                    </div>
                  )}

                  {visualDoubt && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="space-y-4 bg-emerald-50 p-6 rounded-2xl border border-emerald-100"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-portal-navy mb-2">AI Explanation</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{visualDoubt.explanation}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {visualDoubt.concepts.map((concept, i) => (
                          <span key={i} className="px-2 py-1 bg-white border border-emerald-200 rounded-lg text-[10px] font-bold text-emerald-700">
                            {concept}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'voice-assistant' && (
            <motion.div
              key="voice-assistant"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">AI IVR Call System</span>
                </div>
                <h2 className="text-4xl font-bold text-portal-navy">Voice Doubt Solver</h2>
                <p className="text-slate-500 max-w-lg mx-auto">
                  Ask your questions naturally. Our AI Voice Assistant will listen and provide instant educational guidance.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-xl text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/30 to-transparent pointer-events-none" />
                
                <div className="relative z-10 space-y-12">
                  <div className="flex justify-center">
                    <button 
                      onClick={handleVoiceInteraction}
                      className={cn(
                        "w-32 h-32 rounded-full flex items-center justify-center transition-all relative group",
                        isListening 
                          ? "bg-rose-600 shadow-[0_0_40px_rgba(225,29,72,0.4)]" 
                          : "bg-indigo-600 shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:scale-105"
                      )}
                    >
                      {isListening ? (
                        <>
                          <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
                          <Mic className="w-12 h-12 text-white" />
                        </>
                      ) : (
                        <Mic className="w-12 h-12 text-white" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-6">
                    {isListening ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <motion.div 
                              key={i}
                              animate={{ height: [10, 30, 10] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                              className="w-1.5 bg-rose-500 rounded-full"
                            />
                          ))}
                        </div>
                        <p className="text-rose-600 font-bold animate-pulse">Listening to your query...</p>
                      </div>
                    ) : (
                      <p className="text-slate-400 font-medium">Tap the microphone and start speaking</p>
                    )}

                    {transcript && (
                      <div className="max-w-md mx-auto bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">You said:</p>
                        <p className="text-sm text-portal-navy font-medium">"{transcript}"</p>
                      </div>
                    )}

                    {voiceLoading && (
                      <div className="flex items-center justify-center gap-2 text-indigo-600">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm font-bold">AI is thinking...</span>
                      </div>
                    )}

                    {voiceResponse && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-lg mx-auto bg-indigo-600 text-white p-6 rounded-3xl shadow-lg relative"
                      >
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-indigo-600 rotate-45" />
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                            <Volume2 className="w-5 h-5" />
                          </div>
                          <p className="text-sm font-medium leading-relaxed text-left">
                            {voiceResponse}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-slate-100">
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-portal-navy">Multi-Lingual</p>
                      <p className="text-[10px] text-slate-500">Supports Hindi and English queries</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-portal-navy">Instant Response</p>
                      <p className="text-[10px] text-slate-500">Powered by Gemini 3.1 Flash</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-portal-navy">IVR Simulation</p>
                      <p className="text-[10px] text-slate-500">Interactive Voice Response feel</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'strategies' && (
            <motion.div
              key="strategies"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-[#003366] flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-[#FF9933]" />
                    AI-Matched Schemes & Strategies
                  </h2>
                  <p className="text-slate-500">
                    Personalized results based on Rajasthan's socio-economic data and official government schemes.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Search specific needs..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      className="px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none w-full md:w-64"
                    />
                    <button 
                      onClick={handleGenerateStrategies}
                      disabled={loading}
                      className="bg-slate-900 text-white px-6 py-2 rounded-xl font-medium hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      Re-Analyze
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Girls' Education", icon: GraduationCap },
                  { label: "Dropout Prevention", icon: AlertCircle },
                  { label: "Lack of Interest", icon: BookOpen },
                  { label: "Child Marriage Prevention", icon: HeartHandshake }
                ].map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setUserInput(tag.label);
                      const tempInput = tag.label;
                      setLoading(true);
                      setScanningPhase("Analyzing Profile...");
                      const runAI = async () => {
                        try {
                          setTimeout(() => setScanningPhase("Scanning Government Database..."), 1500);
                          setTimeout(() => setScanningPhase("Matching Eligibility Criteria..."), 3000);
                          setTimeout(() => setScanningPhase("Finalizing Recommendations..."), 4500);
                          const result = await generateStrategies(tempInput);
                          setStrategies(result);
                          setActiveTab('strategies');
                        } catch (error) {
                          console.error(error);
                        } finally {
                          setLoading(false);
                          setScanningPhase(null);
                        }
                      };
                      runAI();
                    }}
                    className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:border-orange-300 hover:text-orange-600 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <tag.icon className="w-3 h-3" />
                    {tag.label}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <div className="relative w-24 h-24 mb-8">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-orange-100 border-t-orange-600 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-orange-600 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-portal-navy mb-2">{scanningPhase}</h3>
                  <p className="text-slate-500 animate-pulse">Connecting to Rajasthan State Data Center...</p>
                </div>
              ) : strategies.length > 0 ? (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {strategies.map((strategy, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-orange-300 transition-all group relative overflow-hidden shadow-sm"
                      >
                        <div className="absolute top-0 right-0 p-6">
                          <div className="flex flex-col items-end">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Match Score</div>
                            <div className="text-2xl font-black text-orange-600">{strategy.matchScore}%</div>
                          </div>
                        </div>

                        <div className="flex justify-between items-start mb-6">
                          <div className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                            strategy.category === 'Policy' ? "bg-blue-50 text-blue-700 border border-blue-100" :
                            strategy.category === 'Financial' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                            strategy.category === 'Infrastructure' ? "bg-purple-50 text-purple-700 border border-purple-100" :
                            "bg-orange-50 text-orange-700 border border-orange-100"
                          )}>
                            {strategy.category}
                          </div>
                        </div>

                        <h4 className="text-2xl font-bold mb-3 group-hover:text-orange-600 transition-colors pr-20">{strategy.title}</h4>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                          {strategy.description}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              Eligibility
                            </p>
                            <div className="space-y-1">
                              {strategy.eligibilityCriteria.map((item, i) => (
                                <div key={i} className="text-xs text-portal-navy flex items-center gap-2">
                                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <ArrowRight className="w-3 h-3 text-blue-500" />
                              Action Steps
                            </p>
                            <div className="space-y-1">
                              {strategy.implementation.slice(0, 3).map((step, i) => (
                                <div key={i} className="text-xs text-portal-navy flex items-center gap-2">
                                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                                  {step}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-xl">
                              <Trophy className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Official Scheme</p>
                              <p className="text-sm font-bold text-portal-navy">{strategy.linkedScheme}</p>
                            </div>
                          </div>
                          <button className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
                            Apply Now
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {careerPaths.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                        <h3 className="text-2xl font-bold text-[#003366]">Suggested Career Paths</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {careerPaths.map((path, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-blue-200 transition-all"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                path.marketDemand === 'High' ? "bg-emerald-100 text-emerald-700" :
                                path.marketDemand === 'Medium' ? "bg-blue-100 text-blue-700" :
                                "bg-slate-100 text-portal-navy"
                              )}>
                                {path.marketDemand} Demand
                              </span>
                            </div>
                            <h4 className="text-lg font-bold mb-2 text-portal-navy">{path.role}</h4>
                            <p className="text-slate-600 text-xs mb-4">{path.description}</p>
                            
                            <div className="space-y-4">
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Required Skills</p>
                                <div className="flex flex-wrap gap-1">
                                  {path.requiredSkills.map(skill => (
                                    <span key={skill} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Suggested Courses</p>
                                <ul className="text-[10px] text-slate-600 list-disc list-inside">
                                  {path.suggestedCourses.map(course => (
                                    <li key={course}>{course}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="pt-3 border-t border-slate-100">
                                <p className="text-[10px] italic text-slate-500">{path.localRelevance}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="glass-card p-20 text-center flex flex-col items-center">
                  <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mb-8">
                    <Sparkles className="text-slate-300 w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Ready to Match Schemes?</h3>
                  <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg">
                    Click the "Apply AI Logic" button to analyze your profile and find the best government support for your education.
                  </p>
                  <button 
                    onClick={handleGenerateStrategies}
                    className="bg-[#003366] text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center gap-3"
                  >
                    <Sparkles className="w-5 h-5 text-[#FF9933]" />
                    Run AI Scheme Matcher
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'resources' && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-bold mb-4">Existing Government Schemes</h2>
                <p className="text-slate-500">Rajasthan has several initiatives to support students. Awareness is the key to utilization.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Chiranjeevi Scholarship",
                    desc: "Financial aid for higher education for students from economically weaker sections.",
                    icon: HeartHandshake,
                    color: "bg-rose-500"
                  },
                  {
                    title: "Gargi Puraskar",
                    desc: "Rewards for girl students who excel in secondary and senior secondary exams.",
                    icon: GraduationCap,
                    color: "bg-indigo-500"
                  },
                  {
                    title: "Devnarayan Scooty Scheme",
                    desc: "Providing transport to meritorious girl students to encourage college attendance.",
                    icon: School,
                    color: "bg-teal-500"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="glass-card p-6 flex flex-col items-center text-center">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white", item.color)}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-500 mb-6 flex-grow">{item.desc}</p>
                    <button className="text-orange-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-orange-50 rounded-3xl p-8 border border-orange-100 flex flex-col md:flex-row items-center gap-8">
                <div className="bg-white p-4 rounded-2xl shadow-sm rotate-3">
                  <img 
                    src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=300" 
                    alt="Education" 
                    className="w-48 h-48 object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-portal-navy mb-4">Need personalized assistance?</h3>
                  <p className="text-slate-600 mb-6">Our community mentors are available to help students navigate scholarship applications and re-enrollment processes.</p>
                  <div className="flex flex-wrap gap-4">
                    <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
                      Find a Mentor
                    </button>
                    <button className="bg-white text-portal-navy border border-slate-200 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>

              {/* Mentorship Scheduling Section */}
              <div id="mentorship-section" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-6 h-6 text-[#003366]" />
                    <h3 className="text-2xl font-bold text-[#003366]">1-on-1 Mentorship Sessions</h3>
                  </div>
                  <button 
                    onClick={() => setIsMentorMode(!isMentorMode)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                      isMentorMode 
                        ? "bg-orange-600 text-white border-orange-600" 
                        : "bg-white text-slate-600 border-slate-200 hover:border-orange-300"
                    )}
                  >
                    {isMentorMode ? "Switch to Student View" : "Switch to Mentor Mode"}
                  </button>
                </div>

                {isMentorMode ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                  >
                    {/* Availability Management */}
                    <div className="lg:col-span-1">
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-orange-600">
                          <Calendar className="w-5 h-5" />
                          Set Your Availability
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-bold text-portal-navy mb-1">Add New Slot</label>
                            <input 
                              type="text"
                              placeholder="e.g. Monday 10:00 - 12:00"
                              value={newAvailabilitySlot}
                              onChange={(e) => setNewAvailabilitySlot(e.target.value)}
                              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                            />
                          </div>
                          <button 
                            onClick={handleAddAvailability}
                            disabled={!newAvailabilitySlot}
                            className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-all disabled:opacity-50"
                          >
                            Add Slot
                          </button>
                          
                          <div className="pt-4 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Your Current Slots</p>
                            <div className="space-y-2">
                              {mentorAvailability['Prof. Rajesh Kumar']?.map((slot, i) => (
                                <div key={i} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                                  <span className="text-xs text-portal-navy">{slot}</span>
                                  <button 
                                    onClick={() => handleRemoveAvailability(slot)}
                                    className="text-rose-500 hover:text-rose-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mentor's Session List */}
                    <div className="lg:col-span-2">
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[400px]">
                        <h4 className="text-lg font-bold mb-6">Incoming Requests</h4>
                        <div className="space-y-4">
                          {sessions.filter(s => s.mentorName === 'Prof. Rajesh Kumar').map((session) => (
                            <div key={session.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                              <div>
                                <h5 className="font-bold text-portal-navy">{session.topic}</h5>
                                <p className="text-xs text-slate-500">Requested by Student</p>
                                <p className="text-xs text-slate-600 mt-1">{new Date(session.proposedTime).toLocaleString()}</p>
                              </div>
                              <div className="flex gap-2">
                                {session.status === 'Pending' && (
                                  <>
                                    <button 
                                      onClick={() => handleConfirmSession(session.id)}
                                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold"
                                    >
                                      Confirm
                                    </button>
                                    <button 
                                      onClick={() => handleSuggestAlternative(session.id, new Date(Date.now() + 86400000).toISOString())}
                                      className="bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-bold"
                                    >
                                      Suggest Alt
                                    </button>
                                  </>
                                )}
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                                  {session.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Schedule Form */}
                    <div className="lg:col-span-1">
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <Plus className="w-5 h-5 text-orange-600" />
                          Propose a Session
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-bold text-portal-navy mb-1">Select Mentor</label>
                            <select 
                              value={selectedMentor}
                              onChange={(e) => setSelectedMentor(e.target.value)}
                              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                            >
                              <option>Prof. Rajesh Kumar</option>
                              <option>Dr. Anita Sharma</option>
                              <option>Smt. Meena Devi (Community Leader)</option>
                              <option>Shri Alok Singh (Education Officer)</option>
                            </select>
                          </div>

                          {/* Display Mentor Availability */}
                          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                            <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-2">Mentor's Availability</p>
                            <div className="space-y-1">
                              {mentorAvailability[selectedMentor]?.map((slot, i) => (
                                <p key={i} className="text-[10px] text-blue-700 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {slot}
                                </p>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-portal-navy mb-1">Session Topic</label>
                            <input 
                              type="text"
                              placeholder="e.g. Scholarship Help"
                              value={newSessionTopic}
                              onChange={(e) => setNewSessionTopic(e.target.value)}
                              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-portal-navy mb-1">Proposed Date & Time</label>
                            <input 
                              type="datetime-local"
                              value={newSessionTime}
                              onChange={(e) => setNewSessionTime(e.target.value)}
                              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                            />
                          </div>
                          <button 
                            onClick={handleScheduleSession}
                            disabled={!newSessionTime || !newSessionTopic}
                            className="w-full bg-[#003366] text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                          >
                            Propose Session
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Sessions List */}
                    <div className="lg:col-span-2">
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[400px]">
                        <h4 className="text-lg font-bold mb-6">Your Sessions</h4>
                        {sessions.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <Calendar className="w-12 h-12 mb-4 opacity-20" />
                            <p>No sessions scheduled yet.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {sessions.map((session) => (
                              <motion.div
                                key={session.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                              >
                                <div className="flex items-start gap-4">
                                  <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                    session.status === 'Confirmed' ? "bg-emerald-100 text-emerald-600" :
                                    session.status === 'Rescheduled' ? "bg-amber-100 text-amber-600" :
                                    "bg-blue-100 text-blue-600"
                                  )}>
                                    {session.status === 'Confirmed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-portal-navy">{session.topic}</h5>
                                    <p className="text-xs text-slate-500">with {session.mentorName}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                      <span className="text-[10px] flex items-center gap-1 text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(session.proposedTime).toLocaleDateString()}
                                      </span>
                                      <span className="text-[10px] flex items-center gap-1 text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                                        <Clock className="w-3 h-3" />
                                        {new Date(session.proposedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    {session.alternativeTime && (
                                      <p className="text-[10px] text-amber-600 font-bold mt-2">
                                        Mentor suggested alternative: {new Date(session.alternativeTime).toLocaleString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                    session.status === 'Confirmed' ? "bg-emerald-100 text-emerald-700" :
                                    session.status === 'Rescheduled' ? "bg-amber-100 text-amber-700" :
                                    "bg-blue-100 text-blue-700"
                                  )}>
                                    {session.status}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'automations' && (
            <motion.div
              key="automations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-[#003366]">Smart Automations</h2>
                  <p className="text-slate-500">AI-driven background tasks working for your educational success.</p>
                </div>
                <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  System Active
                </div>
              </div>

              {automationsLoading ? (
                <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-12 h-12 text-[#003366] animate-spin mb-4" />
                  <p className="text-slate-500 font-medium">Configuring background triggers for your profile...</p>
                </div>
              ) : automations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {automations.map((auto, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-2 h-full bg-[#138808]" />
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-slate-100 p-2 rounded-lg">
                          <Sparkles className="w-5 h-5 text-[#003366]" />
                        </div>
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold uppercase",
                          auto.status === 'Active' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {auto.status}
                        </span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Trigger</p>
                          <p className="text-sm font-bold text-portal-navy">{auto.trigger}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Automated Action</p>
                          <p className="text-sm text-slate-600">{auto.action}</p>
                        </div>
                        <div className="pt-3 border-t border-slate-100">
                          <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            Impact: {auto.impact}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-12 text-center flex flex-col items-center">
                  <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="text-slate-400 w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No Automations Configured</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mb-8">
                    Complete your profile to activate smart background tasks that help you stay on track with scholarships and deadlines.
                  </p>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="bg-[#003366] text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
                  >
                    Set Up Profile
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'prd' && (
            <motion.div
              key="prd"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl">
                <div className="flex items-center gap-4 mb-8 border-b pb-8">
                  <div className="bg-[#003366] p-3 rounded-2xl">
                    <BookOpen className="text-white w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-[#003366]">Project Requirement Document</h2>
                    <p className="text-slate-500">v2.1 - Rajasthan Student Service Portal</p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none space-y-8">
                  <section>
                    <h3 className="text-xl font-bold text-portal-navy mb-4">1. Project Overview</h3>
                    <p className="text-slate-600 leading-relaxed">
                      The Rajasthan Student Service Portal is a centralized government-to-citizen (G2C) platform designed to reduce educational dropout rates across the state. By leveraging AI-driven insights and official government data, the portal provides personalized guidance to students, parents, and educators.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-portal-navy mb-4">2. Core Objectives</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                      {[
                        "Zero-Dropout Target for Female Students",
                        "Automated Scholarship Eligibility Matching",
                        "Community-Driven Mentorship Network",
                        "Real-Time Socio-Economic Data Visualization",
                        "Inclusive Support for Rural & Long-Distance Students"
                      ].map((obj, i) => (
                        <li key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3 m-0">
                          <CheckCircle2 className="text-emerald-600 w-5 h-5 shrink-0" />
                          <span className="text-sm font-medium text-portal-navy">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-portal-navy mb-4">3. Technical Requirements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                        <h4 className="text-sm font-bold text-blue-900 mb-2 uppercase">Frontend</h4>
                        <p className="text-xs text-blue-700">React 18, Tailwind CSS, Framer Motion, Recharts</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                        <h4 className="text-sm font-bold text-orange-900 mb-2 uppercase">AI Engine</h4>
                        <p className="text-xs text-orange-700">Gemini 3 Flash (Real-time Strategy & Career Generation)</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <h4 className="text-sm font-bold text-emerald-900 mb-2 uppercase">Data Layer</h4>
                        <p className="text-xs text-emerald-700">Official Rajasthan Govt. Scheme API Integration (Simulated)</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-portal-navy mb-4">4. Smart Automations Roadmap</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4 p-4 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <span className="font-bold text-slate-500">A1</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-portal-navy">Auto-Eligibility Engine</h4>
                          <p className="text-xs text-slate-500">Automatically matches student profiles with 50+ government scholarships without manual search.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 p-4 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <span className="font-bold text-slate-500">A2</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-portal-navy">Predictive Dropout Alert</h4>
                          <p className="text-xs text-slate-500">Uses attendance and socio-economic data to alert mentors before a student potentially drops out.</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Form */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <UserCircle className="text-orange-600 w-6 h-6" />
                      Your Profile
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-portal-navy mb-1">Gender</label>
                        <div className="flex gap-2">
                          {['Female', 'Male', 'Other'].map((g) => (
                            <button
                              key={g}
                              onClick={() => setProfile(p => ({ ...p, gender: g as any }))}
                              className={cn(
                                "flex-1 py-2 rounded-xl text-sm font-medium border transition-all",
                                profile.gender === g 
                                  ? "bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-100" 
                                  : "bg-white text-slate-600 border-slate-200 hover:border-orange-300"
                              )}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                        {profile.gender === 'Female' && (
                          <p className="text-[10px] text-orange-600 font-bold mt-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Priority Support Enabled
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-portal-navy mb-1">Educational Status</label>
                        <select 
                          value={profile.status}
                          onChange={(e) => setProfile(p => ({ ...p, status: e.target.value }))}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                        >
                          <option value="">Select Status</option>
                          <option value="School Student (Primary)">School Student (Primary)</option>
                          <option value="School Student (Secondary)">School Student (Secondary)</option>
                          <option value="College Student">College Student</option>
                          <option value="Dropout (Seeking Re-entry)">Dropout (Seeking Re-entry)</option>
                          <option value="Vocational Trainee">Vocational Trainee</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-portal-navy mb-1">Location (District)</label>
                        <select 
                          value={profile.location}
                          onChange={(e) => setProfile(p => ({ ...p, location: e.target.value }))}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                        >
                          <option value="">Select District</option>
                          {RAJASTHAN_DISTRICTS.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-portal-navy mb-3">Support Needed</label>
                        <div className="flex flex-wrap gap-2">
                          {SUPPORT_AREAS.map(need => (
                            <button
                              key={need}
                              onClick={() => toggleSupportNeed(need)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                                profile.supportNeeds.includes(need)
                                  ? "bg-orange-600 text-white border-orange-600"
                                  : "bg-white text-slate-600 border-slate-200 hover:border-orange-300"
                              )}
                            >
                              {need}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-portal-navy mb-3">Your Interests</label>
                        <div className="flex flex-wrap gap-2">
                          {INTEREST_AREAS.map(interest => (
                            <button
                              key={interest}
                              onClick={() => toggleInterest(interest)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                                profile.interests.includes(interest)
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                              )}
                            >
                              {interest}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={handleSaveProfile}
                        disabled={recommendationsLoading || careerLoading || !profile.status || !profile.location}
                        className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50 mt-4"
                      >
                        {recommendationsLoading || careerLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : profileSaved ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Save className="w-5 h-5" />}
                        {profileSaved ? "Profile Saved!" : "Save & Get Recommendations"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-200">
                    <Trophy className="w-10 h-10 mb-4 opacity-80" />
                    <h4 className="text-lg font-bold mb-2">Inclusive Support</h4>
                    <p className="text-orange-100 text-sm mb-4">
                      While we prioritize girls' education, we provide financial support for boys and specialized solutions for students traveling long distances.
                    </p>
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
                      Mentor Matching
                    </button>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-portal-navy">Personalized Recommendations</h3>
                    {recommendations.length > 0 && (
                      <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-wider">
                        Tailored for you
                      </span>
                    )}
                  </div>

                  {recommendationsLoading ? (
                    <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
                      <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
                      <p className="text-slate-500 font-medium">Gemini is curating resources for your specific needs...</p>
                    </div>
                  ) : recommendations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {recommendations.map((rec, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="glass-card p-6 border-l-4 border-l-orange-600"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                              {rec.resourceType}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold mb-2">{rec.title}</h4>
                          <p className="text-slate-600 text-sm mb-4 leading-relaxed">{rec.advice}</p>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Next Step</p>
                            <p className="text-sm font-medium text-portal-navy">{rec.actionStep}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="glass-card p-12 text-center flex flex-col items-center">
                      <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                        <UserCircle className="text-slate-400 w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Complete your profile</h3>
                      <p className="text-slate-500 max-w-sm mx-auto mb-8">
                        Tell us about your education and where you need help so we can provide personalized recommendations and match you with a mentor.
                      </p>
                    </div>
                  )}

                  {/* Mentor Preview (Static for now) */}
                  {recommendations.length > 0 && (
                    <div className="glass-card p-6">
                      <h4 className="text-lg font-bold mb-4">Potential Mentors in {profile.location}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2].map(i => (
                          <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center font-bold text-orange-700">
                              M{i}
                            </div>
                            <div>
                              <p className="font-bold text-sm">Mentor Candidate {i}</p>
                              <p className="text-xs text-slate-500">Specializes in {profile.supportNeeds[0] || "Education"}</p>
                            </div>
                            <button className="ml-auto text-orange-600">
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Desktop Footer */}
      <footer className="hidden md:block bg-[#003366] text-white py-12 border-t-4 border-[#FF9933] mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl shadow-lg">
                <GraduationCap className="text-[#003366] w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-bold tracking-tight">Rajasthan Student Portal</h4>
                <p className="text-xs text-orange-200 font-bold uppercase tracking-widest">Heritage of Excellence</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium italic text-slate-300">
                "Empowering Rajasthan's Youth, One Student at a Time."
              </p>
            </div>
            <div className="text-right text-slate-400 text-xs">
              <p>© 2026 Government of Rajasthan</p>
              <p>Department of Information Technology & Communication</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer / Mobile Nav */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden z-50">
        <div className="flex justify-around items-center h-16">
          <button onClick={() => setActiveTab('overview')} className={cn("flex flex-col items-center gap-1", activeTab === 'overview' ? "text-[#003366]" : "text-slate-400")}>
            <TrendingDown className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('strategies')} className={cn("flex flex-col items-center gap-1", activeTab === 'strategies' ? "text-[#003366]" : "text-slate-400")}>
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">AI Advisor</span>
          </button>
          <button onClick={() => setActiveTab('automations')} className={cn("flex flex-col items-center gap-1", activeTab === 'automations' ? "text-[#003366]" : "text-slate-400")}>
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Auto</span>
          </button>
          <button onClick={() => setActiveTab('resources')} className={cn("flex flex-col items-center gap-1", activeTab === 'resources' ? "text-[#003366]" : "text-slate-400")}>
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Schemes</span>
          </button>
          <button onClick={() => setActiveTab('profile')} className={cn("flex flex-col items-center gap-1", activeTab === 'profile' ? "text-[#003366]" : "text-slate-400")}>
            <UserCircle className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">My ID</span>
          </button>
          <button onClick={() => setActiveTab('early-warning')} className={cn("flex flex-col items-center gap-1", activeTab === 'early-warning' ? "text-[#003366]" : "text-slate-400")}>
            <ShieldAlert className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">EWS</span>
          </button>
          <button onClick={() => setActiveTab('learning-hub')} className={cn("flex flex-col items-center gap-1", activeTab === 'learning-hub' ? "text-[#003366]" : "text-slate-400")}>
            <BrainCircuit className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Learn</span>
          </button>
          <button onClick={() => setActiveTab('voice-assistant')} className={cn("flex flex-col items-center gap-1", activeTab === 'voice-assistant' ? "text-[#003366]" : "text-slate-400")}>
            <Mic className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Voice</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
