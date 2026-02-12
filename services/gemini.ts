
import { GoogleGenAI, Type } from "@google/genai";
import { Plot } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
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

    try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: { thinkingConfig: { thinkingBudget: 0 } }
        });
        return response.text;
    } catch (e) {
        return "Critical monitoring suggested for payment defaults and land utility.";
    }
}
