# 🎓 Rajasthan Student Service Portal
## AI-Based Dropout Prediction and Counselling System

> **Empowering Every Student in Rajasthan** | "Bridging Heritage with Innovation for Rajasthan's Future"

[![TypeScript](https://img.shields.io/badge/TypeScript-83.5%25-blue?style=flat-square)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.14-38b2ac?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📋 Overview

The **Rajasthan Student Service Portal** is an AI-powered web application designed to predict students at risk of dropping out and provide personalized counselling recommendations. Using machine learning and advanced data analysis, the system identifies educational barriers specific to Rajasthan and connects students with government schemes, mentorship opportunities, and tailored support services.

### Key Objectives
- 🎯 **Predict dropout risks** using multi-dimensional data analysis
- 🤖 **Leverage AI** for personalized educational guidance
- 💰 **Match students** with 50+ government schemes and financial aid programs
- 👥 **Connect mentors** with students for 1-on-1 guidance
- 🧠 **Provide learning support** through AI-powered tutoring
- 📊 **Track progress** with real-time analytics and early warning systems

---

## 🌟 Key Features

### 1. **Early Warning System (EWS)**
- Real-time dropout risk prediction based on:
  - Attendance rates
  - Academic performance (grades)
  - Family income levels
  - Distance to school
  - Student engagement metrics
- Risk classification: Low, Moderate, Critical
- Actionable recommendations for intervention

### 2. **AI Service Advisor**
- Intelligent matching engine scanning 50+ government schemes
- Tailored recommendations based on:
  - Student profile and background
  - Location (33 districts in Rajasthan)
  - Support needs
  - Educational interests
- Instant eligibility checks

### 3. **Smart Automations**
- Automated eligibility verification
- Application process assistance
- Notification and reminder systems
- Document management workflows

### 4. **Learning Hub**
- **Visual Doubt Solver**: Upload images of problems and get AI-powered solutions
- **Study Material Analysis**: Get personalized insights from uploaded study materials
- **Interactive Learning**: Multi-format content support (PDFs, documents, images)

### 5. **AI Voice Assistant**
- Voice-based query handling in English (Indian accent)
- Text-to-Speech responses
- Natural language understanding for educational queries
- Accessibility-first design

### 6. **Mentorship Platform**
- Connect with local experts and community leaders
- View mentor availability and schedules
- Schedule 1-on-1 sessions
- Topics: Scholarship guidance, career counseling, academic support

### 7. **Analytics Dashboard**
- Dropout rate trends by district
- Analysis of primary dropout reasons:
  - Financial constraints (30%)
  - Lack of interest (20%)
  - Child marriage/social factors (20%)
  - Distance/infrastructure (15%)
  - Migration/agriculture (10%)
  - Other factors (5%)

### 8. **Government Schemes Focus**
- **Gargi Puraskar**: Awards for girls with 75% marks
- **Rajshree Yojana**: Support for girls' education
- **Scooty Scheme**: Transport assistance
- **Merit Scholarships**: Academic excellence programs

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19.0.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS 4.1.14
- **UI Components**: 
  - Lucide React (icons)
  - Framer Motion (animations)
  - Recharts (data visualization)
- **AI Integration**: Google Generative AI (Gemini)

### Backend/Services
- **API Gateway**: Express.js 4.21.2
- **Runtime**: Node.js
- **Environment Management**: dotenv

### Data & ML
- **Jupyter Notebooks** (14.8%): ML model development and analysis
- **Machine Learning**: Dropout prediction models

---

## 📦 Project Structure

```
AI-BASED-DROP-OUT-PREDICTION-AND-COUNSELLING-SYSTEM/
├── src/
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Entry point
│   ├── services/
│   │   └── geminiService.ts   # AI/ML service integration
│   ├── lib/
│   │   └── utils.ts           # Utility functions
│   └── components/            # Reusable components
├── index.html                 # HTML entry point
├── package.json               # Dependencies configuration
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── .env.example               # Environment variables template
├── rajasthan-student-service-portal.zip  # Packaged application
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Google Generative AI (Gemini) API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GWTM505/AI-BASED-DROP-OUT-PREDITICION-AND-COUNSELLING-SYSTEM.git
   cd AI-BASED-DROP-OUT-PREDITICION-AND-COUNSELLING-SYSTEM
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your values:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   APP_URL=http://localhost:3000
   ```

   > To get a Gemini API key:
   > 1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
   > 2. Click "Create API key"
   > 3. Copy and paste it into `.env`

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Generated production files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 🔌 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Generative AI API key | `AIza...` |
| `APP_URL` | Application URL for self-referential links | `http://localhost:3000` |

---

## 📊 Data & Analytics

### Risk Assessment Factors (EWS)

The system calculates risk using weighted metrics:

| Factor | Weight | Critical Threshold |
|--------|--------|-------------------|
| Attendance | 40% | < 75% |
| Academic Performance | 20% | < 60% |
| Family Income | 20% | < ₹5,000/month |
| Distance to School | 10% | > 15 km |
| Student Engagement | 10% | < 2/5 |

### Districts Covered (Rajasthan)
Ajmer, Alwar, Banswara, Baran, Barmer, Bharatpur, Bhilwara, Bikaner, Bundi, Chittorgarh, Churu, Dausa, Dholpur, Dungarpur, Hanumangarh, Jaipur, Jaisalmer, Jalore, and 15+ more

---

## 🎯 Core Functionality

### 1. Dropout Risk Prediction
```typescript
// Input: Student profile (attendance, grades, income, distance, engagement)
// Output: Risk score (0-100), Risk level (Low/Moderate/Critical), Advice
```

### 2. Government Scheme Matching
```typescript
// Input: Student profile + support needs + interests
// Output: Ranked list of matching government schemes + eligibility status
```

### 3. AI-Powered Recommendations
```typescript
// Input: Student profile + learning history
// Output: Personalized strategies, career paths, learning automations
```

### 4. Visual Problem Solving
```typescript
// Input: Image of problem + query text
// Output: Solution explanation, step-by-step guidance
```

### 5. Voice Interaction
```typescript
// Input: Voice query (speech-to-text)
// Output: Audio response (text-to-speech)
```

---

## 🔐 Security & Privacy

- **Environment Variables**: Sensitive data (API keys) stored in `.env`, never committed to git
- **HTTPS Ready**: Built for secure cloud deployment (Google Cloud Run)
- **No Data Persistence**: Demo mode doesn't store personal student data
- **CORS Enabled**: Cross-origin requests configured for API endpoints

---

## 📱 Responsive Design

The portal is fully responsive across:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1280px+)

Built with Tailwind CSS for mobile-first design principles.

---

## 🧪 Testing

### Type Checking
```bash
npm run lint
```

Validates TypeScript types across the project.

### Development with Hot Module Replacement (HMR)
```bash
npm run dev
```

Automatic reloading on file changes.

---

## 📚 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run clean` | Remove build artifacts |
| `npm run lint` | Type check with TypeScript |

---

## 🤝 Integration Points

### Google Generative AI (Gemini)
- Scheme matching and recommendations
- Educational content analysis
- Problem-solving assistance
- Personalized guidance generation

### Speech API
- Voice recognition (SpeechRecognition API)
- Text-to-speech synthesis (SpeechSynthesis API)

### Data Visualization
- Real-time charts and graphs
- District-level analytics
- Student risk heatmaps

---

## 📖 Use Cases

### For Students
1. ✅ Check if you're at risk of dropping out
2. ✅ Find government schemes you're eligible for
3. ✅ Get personalized study recommendations
4. ✅ Connect with mentors for guidance
5. ✅ Solve problems using AI voice assistant

### For School Administrators
1. 📊 Monitor student risk at scale
2. 📍 Identify at-risk students by district
3. 👥 Manage mentor availability and sessions
4. 📋 Track intervention effectiveness

### For Policymakers
1. 📈 Analyze dropout trends by region
2. 💡 Understand primary dropout reasons
3. 🎯 Optimize scheme distribution
4. 📊 Measure intervention impact

---

## 🐛 Known Limitations

- **Demo Mode**: Currently runs with simulated data for demonstration
- **File Uploads**: Study material analysis requires manual text extraction
- **Speech Recognition**: Requires modern browser support (Chrome, Edge, Safari)
- **Offline Support**: Requires internet connection for AI services

---

## 🔮 Future Enhancements

- [ ] Real database integration (PostgreSQL/MongoDB)
- [ ] Advanced ML model training with historical data
- [ ] Multi-language support (Hindi, local languages)
- [ ] Mobile app (React Native)
- [ ] Blockchain for certificate verification
- [ ] Real-time student progress tracking
- [ ] Parent/guardian portal
- [ ] Community forum for peer support
- [ ] Integration with state education department systems
- [ ] SMS/WhatsApp notifications

---

## 📝 License

This project is developed for the Government of Rajasthan's student welfare initiative.

---

## 👤 Author

**GWTM505**

- GitHub: [@GWTM505](https://github.com/GWTM505)
- Repository: [AI-BASED-DROP-OUT-PREDITICION-AND-COUNSELLING-SYSTEM](https://github.com/GWTM505/AI-BASED-DROP-OUT-PREDITICION-AND-COUNSELLING-SYSTEM)

---

## 📞 Support

### Helpdesk
- **Phone**: 1800-123-4567
- **Email**: support@rajasthanstudentportal.gov.in
- **Hours**: Monday-Friday, 9 AM - 6 PM IST

### Documentation
- See the project folder structure for detailed component documentation
- Review `.env.example` for configuration options
- Check Jupyter notebooks for ML model details

---

## 🙏 Acknowledgments

This project is developed in support of:
- 🇮🇳 Government of Rajasthan's educational initiatives
- **Gargi Puraskar**: Recognition of girls' educational achievement
- **Rajshree Yojana**: Support for girls' education
- All educators, mentors, and community leaders supporting student success

---

## 🎓 Vision

> *"Education is the most powerful weapon which you can use to change the world. In the land of warriors, let knowledge be your greatest strength."*

The Rajasthan Student Service Portal is committed to:
- 🌟 Reducing dropout rates through early intervention
- 💪 Empowering students with personalized support
- 🤝 Building bridges between education and opportunity
- 📈 Creating pathways to success for every student

---

**Last Updated**: June 2026  
**Status**: Active Development  
**Portal Reach**: 33 Districts | **Active Schemes**: 50+ Services
