
import { GoogleGenAI, Type } from "@google/genai";
import { Plot } from "../types";

// Safely initialize Gemini client so it never breaks the UI
let ai: GoogleGenAI | null = null;

try {
  const apiKey = process.env.API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  } else {
    console.warn("GEMINI API key not found. AI features are disabled.");
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI client:", error);
  ai = null;
}

export async function analyzePlotCompliance(plot: Plot) {
  const prompt = `
    Analyze the following industrial plot for potential compliance issues based on its data.
    Plot ID: ${plot.id}
    Company: ${plot.companyName}
    Area Allocated: ${plot.areaAllocated} sq.m
    Area Currently Occupied: ${plot.areaCurrent} sq.m
    Status: ${plot.status}
    Violations Flagged: ${plot.violations.join(', ')}
    Risk Score: ${plot.riskScore}
    Outstanding Dues: ₹${plot.dues}

    Provide a concise official assessment including:
    1. Nature of violation (if any)
    2. Estimated financial impact
    3. Recommended legal action
    4. Urgency level
  `;

  if (!ai) {
    return "AI analysis is currently disabled due to missing or invalid configuration.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    // Newer @google/genai clients expose .text() helper
    return typeof (response as any).text === "function"
      ? (response as any).text()
      : "Analysis generated. (Text format not recognized.)";
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "Analysis unavailable at the moment. Please check later.";
  }
}

export async function generateRegionInsight(plots: Plot[]) {
    const stats = plots.reduce((acc, p) => {
        acc.totalDues += p.dues;
        if (p.violations.length > 0) acc.violationCount++;
        return acc;
    }, { totalDues: 0, violationCount: 0 });

    const prompt = `
        System: Act as an industrial planning consultant for CSIDC.
        Data Summary:
        - Total Plots: ${plots.length}
        - Plots with Violations: ${stats.violationCount}
        - Total Outstanding Revenue: ₹${stats.totalDues}

        Provide a 2-sentence strategic insight for the regional manager.
    `;

    if (!ai) {
      return "Critical monitoring suggested for payment defaults and land utility.";
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { thinkingConfig: { thinkingBudget: 0 } }
      });
      return typeof (response as any).text === "function"
        ? (response as any).text()
        : "Critical monitoring suggested for payment defaults and land utility.";
    } catch (e) {
      console.error("AI Insight Error:", e);
      return "Critical monitoring suggested for payment defaults and land utility.";
    }
}
