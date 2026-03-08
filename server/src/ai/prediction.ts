
interface DailyUsage {
  date: Date;
  usage: number;
}

export class WaterForecaster {
  // Smoothing parameters
  private readonly ALPHA = 0.3; // Level smoothing
  private readonly BETA = 0.1;  // Trend smoothing
  private readonly GAMMA = 0.4; // Seasonal smoothing
  private readonly SEASON_LENGTH = 7; // Weekly cycle

  
   // PREDICT FUTURE USAGE USING HOLT-WINTERS
  
  public predict(history: DailyUsage[], daysToPredict: number = 7) {
    if (!history || history.length < this.SEASON_LENGTH * 2) {
      // If we don't have enough data for seasonality (2 weeks), use a simple weighted average
      return this.generateBasicForecast(history, daysToPredict);
    }

    const data = history.map((h) => h.usage);
    const maxVal = Math.max(...data) || 1;

    try {
      const forecast = this.holtWinters(data, daysToPredict);
      return forecast.map((val, i) => this.formatOutput(i, val, maxVal));
    } catch (error) {
      console.error("Math Model Error:", error);
      return this.generateBasicForecast(history, daysToPredict);
    }
  }

  /**
   * Core Holt-Winters Algorithm
   */
  private holtWinters(data: number[], horizon: number): number[] {
    const L = data.length;
    const S = this.SEASON_LENGTH;

    // Initial Level (Average of first season)
    let level = data.slice(0, S).reduce((a, b) => a + b, 0) / S;

    // Initial Trend
    let trend = (data.slice(S, S * 2).reduce((a, b) => a + b, 0) / S - level) / S;

    // Initial Seasonal Indices
    const seasonals: number[] = [];
    for (let i = 0; i < S; i++) {
      seasonals.push(data[i] / level);
    }

    // Training Loop (Walking through history to tune the parameters)
    for (let i = 0; i < L; i++) {
      const obs = data[i];
      const lastLevel = level;

      // Update Level
      level = this.ALPHA * (obs / seasonals[i % S]) + (1 - this.ALPHA) * (level + trend);
      // Update Trend
      trend = this.BETA * (level - lastLevel) + (1 - this.BETA) * trend;
      // Update Seasonality
      seasonals[i % S] = this.GAMMA * (obs / level) + (1 - this.GAMMA) * seasonals[i % S];
    }

    // Prediction Phase
    const predictions: number[] = [];
    for (let m = 1; m <= horizon; m++) {
      const idx = (L + m - 1) % S;
      const val = (level + m * trend) * seasonals[idx];
      predictions.push(Math.max(0, val));
    }

    return predictions;
  }

  private formatOutput(index: number, val: number, maxVal: number) {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + index);

    const dateStr = futureDate.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });

    // Alert: 15% above historic peak
    const isHighUsage = val > maxVal * 1.15;

    return {
      date: futureDate.toISOString().split("T")[0],
      day: index === 0 ? "Today" : futureDate.toLocaleDateString("en-US", { weekday: "short" }),
      displayDate: dateStr,
      predicted_usage: Math.round(val),
      reason: isHighUsage ? "Calculated Demand Spike" : "Normal Mathematical Trend",
      isAlert: isHighUsage,
      _meta: { model: "Holt-Winters-Math" }
    };
  }

  private generateBasicForecast(history: DailyUsage[], days: number) {
    const data = history.map(h => h.usage);
    const avg = data.length > 0 ? data.reduce((a, b) => a + b, 0) / data.length : 0;
    const max = Math.max(...data) || 1;
    
    return Array(days).fill(0).map((_, i) => {
      const val = avg * (0.95 + Math.random() * 0.1); // 5% variance
      return this.formatOutput(i, val, max);
    });
  }
}