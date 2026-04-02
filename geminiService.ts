import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export interface Strategy {
  title: string;
  category: "Policy" | "Community" | "Infrastructure" | "Financial";
  description: string;
  impact: "High" | "Medium" | "Low";
  implementation: string[];
  linkedScheme: string;
  matchScore: number;
  eligibilityCriteria: string[];
}

export interface Recommendation {
  title: string;
  advice: string;
  resourceType: "Scholarship" | "Mentorship" | "Skill Development" | "Community Support";
  actionStep: string;
}

export interface Automation {
  trigger: string;
  action: string;
  status: "Active" | "Pending" | "Completed";
  impact: string;
}

export interface CareerPath {
  role: string;
  description: string;
  requiredSkills: string[];
  suggestedCourses: string[];
  marketDemand: "High" | "Medium" | "Low";
  localRelevance: string;
}

export interface StudentProfile {
  status: string;
  location: string;
  supportNeeds: string[];
  gender: 'Female' | 'Male' | 'Other';
  interests: string[];
}

export async function generateStrategies(context: string): Promise<Strategy[]> {
  const isChildMarriageFocus = context.toLowerCase().includes("child marriage");
  const isLackOfInterestFocus = context.toLowerCase().includes("lack of interest") || context.toLowerCase().includes("re-engage");
  
  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate AT LEAST 10 AI-Matched Schemes and Strategies to reduce school and college dropouts in Rajasthan, India. 
      Context: ${context}
      
      ${isChildMarriageFocus ? `SPECIAL FOCUS: The user is specifically asking about OVERCOMING CHILD MARRIAGE for girls. 
      Prioritize strategies that:
      1. Use education as a shield against early marriage.
      2. Involve community leaders and 'Sathins' (village-level workers).
      3. Leverage the 'Mukhyamantri Rajshree Yojana' and other conditional cash transfer schemes.
      4. Focus on vocational training and economic independence for girls.` : ""}

      ${isLackOfInterestFocus ? `SPECIAL FOCUS: The user is specifically asking about LACK OF INTEREST in studies.
      Prioritize strategies that:
      1. Introduce Activity-Based Learning (ABL) and gamification in classrooms.
      2. Connect curriculum to local Rajasthan heritage, arts, and crafts to make it relevant.
      3. Implement 'Joyful Learning' centers and extracurricular clubs (Sports, Music, Tech).
      4. Provide career counseling that shows the direct link between education and local job opportunities.` : ""}
      
      CRITICAL PRIORITY: 
      - Give the highest preference to girls' education.
      - Include financial support strategies for boys from economically weaker sections.
      - Provide solutions for long-distance students.
      
      MANDATORY: For each item, identify and link it to a relevant Rajasthan Government Scheme (e.g., Gargi Puraskar, Devnarayan Scooty Scheme, CM Sarvajan Uchcha Shiksha Scholarship, Cycle Distribution Scheme, Mukhyamantri Rajshree Yojana, etc.).
      
      Ensure an equal distribution across categories: Policy, Community, Infrastructure, and Financial.
      Focus on local cultural nuances (like child marriage, seasonal migration, water scarcity, and rural-urban divide).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING, enum: ["Policy", "Community", "Infrastructure", "Financial"] },
              description: { type: Type.STRING },
              impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
              implementation: { type: Type.ARRAY, items: { type: Type.STRING } },
              linkedScheme: { type: Type.STRING, description: "The specific Rajasthan government scheme this strategy leverages or supports." },
              matchScore: { type: Type.NUMBER, description: "A score from 0-100 indicating how well this matches the student's profile." },
              eligibilityCriteria: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key criteria for the student to qualify." },
            },
            required: ["title", "category", "description", "impact", "implementation", "linkedScheme", "matchScore", "eligibilityCriteria"],
          },
        },
      },
    }));

    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}

export async function generateRecommendations(profile: StudentProfile): Promise<Recommendation[]> {
  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on this student profile from Rajasthan, provide 3 personalized recommendations to prevent dropout or support their education:
      Status: ${profile.status}
      Location: ${profile.location}
      Support Needs: ${profile.supportNeeds.join(", ")}
      Gender: ${profile.gender}
      Interests: ${profile.interests.join(", ")}
      
      CRITICAL PRIORITY: Give the highest preference to girls' education and female-centric support systems. 
      INCLUSIVITY: If the student is male, provide relevant financial support and mentorship recommendations suitable for boys in Rajasthan.
      LONG DISTANCE: If the student mentions transportation or distance issues, prioritize solutions like the 'Cycle Distribution Scheme', 'Transport Voucher Scheme', or local hostel options.
      Consider Rajasthan-specific schemes like Gargi Puraskar, Devnarayan Scooty Scheme, and CM Sarvajan Uchcha Shiksha Scholarship.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              advice: { type: Type.STRING },
              resourceType: { type: Type.STRING, enum: ["Scholarship", "Mentorship", "Skill Development", "Community Support"] },
              actionStep: { type: Type.STRING },
            },
            required: ["title", "advice", "resourceType", "actionStep"],
          },
        },
      },
    }));

    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}

export async function generateCareerPaths(profile: StudentProfile): Promise<CareerPath[]> {
  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on this student profile from Rajasthan, suggest 3 personalized career paths:
      Status: ${profile.status}
      Location: ${profile.location}
      Gender: ${profile.gender}
      Interests: ${profile.interests.join(", ")}
      
      Consider the market demand in Rajasthan (e.g., Tourism, Handicrafts, Renewable Energy, Agriculture Tech, IT Services in Jaipur/Jodhpur).
      Include potential job roles, required skills, and relevant educational courses or vocational training available in Rajasthan.
      Ensure recommendations are culturally relevant and accessible based on their location.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING },
              description: { type: Type.STRING },
              requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedCourses: { type: Type.ARRAY, items: { type: Type.STRING } },
              marketDemand: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
              localRelevance: { type: Type.STRING, description: "Why this is relevant to the student's location in Rajasthan." },
            },
            required: ["role", "description", "requiredSkills", "suggestedCourses", "marketDemand", "localRelevance"],
          },
        },
      },
    }));

    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}

export interface VisualDoubtResponse {
  explanation: string;
  concepts: string[];
  suggestedResources: string[];
}

export interface MaterialAnalysis {
  summary: string;
  keyPoints: string[];
  quizQuestions: { question: string; answer: string }[];
}

export async function solveVisualDoubt(imageB64: string, query: string): Promise<VisualDoubtResponse> {
  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          inlineData: {
            data: imageB64,
            mimeType: "image/jpeg",
          },
        },
        {
          text: `You are an expert educational tutor in Rajasthan. Analyze this diagram/image and solve the student's doubt: "${query}". 
          Explain the concepts clearly, identify any diagrams, and suggest local Rajasthan-based educational resources or schemes if relevant.`,
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING },
            concepts: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedResources: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["explanation", "concepts", "suggestedResources"],
        },
      },
    }));

    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to solve visual doubt", e);
    return { explanation: "Failed to analyze image.", concepts: [], suggestedResources: [] };
  }
}

export async function analyzeStudyMaterial(text: string): Promise<MaterialAnalysis> {
  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this study material and provide a summary, key points, and a short quiz:
      Content: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            quizQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                },
                required: ["question", "answer"],
              },
            },
          },
          required: ["summary", "keyPoints", "quizQuestions"],
        },
      },
    }));

    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to analyze material", e);
    return { summary: "Failed to analyze.", keyPoints: [], quizQuestions: [] };
  }
}

export async function getVoiceAssistantResponse(query: string): Promise<string> {
  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an AI Voice Assistant for the Rajasthan Student Service Portal. 
      The student is asking via voice: "${query}". 
      Provide a concise, helpful, and encouraging response (max 50 words) that can be easily spoken by a text-to-speech engine. 
      Focus on Rajasthan government schemes, educational support, and motivation.`,
    }));
    return response.text || "I'm sorry, I couldn't process that. How can I help you with your studies in Rajasthan?";
  } catch (e) {
    return "I'm having trouble connecting. Please try again later.";
  }
}

export async function generateAutomations(profile: StudentProfile): Promise<Automation[]> {
  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on this student profile from Rajasthan, create 4 "Smart Automations" that would run in the background to support their education:
      Status: ${profile.status}
      Location: ${profile.location}
      Gender: ${profile.gender}
      Interests: ${profile.interests.join(", ")}
      Support Needs: ${profile.supportNeeds.join(", ")}
      
      Automations should be like: "If [Trigger], then [Action]".
      Examples:
      - "If a new scholarship for girls in Jaisalmer is announced, then automatically notify the student and pre-fill the application."
      - "If the student's attendance drops below 80%, then automatically alert the assigned mentor."
      - "If a vocational training workshop in Renewable Energy starts in Jodhpur, then automatically register the student."
      
      Ensure they are practical for the Rajasthan context and leverage government services.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              trigger: { type: Type.STRING },
              action: { type: Type.STRING },
              status: { type: Type.STRING, enum: ["Active", "Pending", "Completed"] },
              impact: { type: Type.STRING },
            },
            required: ["trigger", "action", "status", "impact"],
          },
        },
      },
    }));

    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}
