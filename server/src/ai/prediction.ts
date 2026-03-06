import { ARIMA } from "ml-arima";

interface DailyUsage {
  date: Date;
  usage: number;
}

/**
 * 💧 JAL-DRISHTI WATER FORECASTER
 * Handles Time-series forecasting using ml-arima with a robust fail-safe mechanism
 * to prevent crashes caused by environment or library initialization errors.
 */
export class WaterForecaster {
  
  public predict(history: DailyUsage[], daysToPredict: number = 7) {
    // 1. Validation: If no data, return empty list immediately
    if (!history || history.length === 0) return [];

    const rawData = history.map((h) => h.usage);
    const maxVal = Math.max(...rawData) || 1;
    
    // Normalize data (0 to 1) for better model stability
    const scaledData = rawData.map((val) => val / maxVal);

    let predictions: number[] = [];
    let engineUsed: "ML-ARIMA" | "HEURISTIC" = "HEURISTIC";

    // 2. Execute Prediction with Environment Safety Net
    try {
      /**
       * Using ml-arima (p, d, q) configuration.
       * p=1 (Auto-regressive), d=1 (Integrated/Trend), q=1 (Moving Average)
       */
      const arima = new ARIMA({ p: 1, d: 1, q: 1, verbose: false });
      
      arima.train(scaledData);
      const output = arima.predict(daysToPredict);
      
      // ml-arima returns an array of numbers directly
      predictions = Array.isArray(output) ? output : [output];

      // Verify output is numeric and valid
      const sum = predictions.reduce((a, b) => a + b, 0);
      if (isNaN(sum) || sum === 0) throw new Error("Invalid Output");
      
      engineUsed = "ML-ARIMA";
    } catch (error) {
      /**
       * 🛡️ FALLBACK: "Seasonal-Trend Heuristic"
       * If ML-ARIMA fails, we calculate the forecast using:
       * - Weighted Moving Average (Last 7 days)
       * - Growth Trend (Week-over-week change)
       * - Weekend Spikes (+15% demand)
       */
      console.warn("⚠️ AI prediction error detected. Deploying Heuristic Fallback.");

      const last7Days = rawData.slice(-7);
      const currentAvg = last7Days.reduce((a, b) => a + b, 0) / (last7Days.length || 1);
      
      // Calculate growth trend (compare current week to previous week)
      const prevWeekAvg = rawData.length > 14 
        ? rawData.slice(-14, -7).reduce((a, b) => a + b, 0) / 7 
        : currentAvg;
      
      const growthFactor = currentAvg > 0 ? (currentAvg - prevWeekAvg) / currentAvg : 0;

      predictions = Array(daysToPredict).fill(0).map((_, i) => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + i);
        const isWeekend = futureDate.getDay() === 0 || futureDate.getDay() === 6;

        // Apply logic: (Base Average * Trend Projection) + Noise + Weekend Bias
        const projection = 1 + (growthFactor * (i + 1) * 0.1); 
        const randomNoise = (Math.random() - 0.5) * 0.08;
        const weekendBoost = isWeekend ? 1.15 : 1.0;

        return (currentAvg / maxVal) * projection * weekendBoost + randomNoise;
      });

      engineUsed = "HEURISTIC";
    }

    // 3. De-Normalize & Map for Frontend Components
    return predictions.map((val, i) => {
      let predictedVal = val * maxVal;
      
      // Safety guards: Never return NaN or negative usage
      if (predictedVal < 0 || isNaN(predictedVal)) predictedVal = 0;

      return this.formatOutput(i, predictedVal, maxVal, engineUsed);
    });
  }

  /**
   * Formats raw math into a structure expected by AdminDashboard.tsx
   */
  private formatOutput(index: number, val: number, maxVal: number, engine: string) {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + index);

    const dateStr = futureDate.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });

    // Alert triggered if usage is 15% higher than historic max
    const isHighUsage = val > maxVal * 1.15;

    return {
      date: futureDate.toISOString().split("T")[0],
      day: index === 0 ? "Today" : futureDate.toLocaleDateString("en-US", { weekday: "short" }),
      displayDate: dateStr,
      predicted_usage: Math.round(val),
      reason: isHighUsage ? "High Demand Expected" : "Normal Trend",
      isAlert: isHighUsage,
      _meta: { engine } // Helpful for debugging which engine ran
    };
  }
}