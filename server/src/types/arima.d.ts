// server/src/types/arima.d.ts

declare module 'arima' {
  interface ArimaConfig {
    p?: number; // Auto-Regressive part
    d?: number; // Integrated part
    q?: number; // Moving Average part
    P?: number;
    D?: number;
    Q?: number;
    s?: number;
    verbose?: boolean;
    method?: number; // 0=CSS-ML, 1=CSS, 2=ML
    optimizer?: number; // 0=Nelder-Mead, 1=BFGS
  }

  class ARIMA {
    constructor(config?: ArimaConfig);
    
    /**
     * Train the model with an array of numbers (time-series data)
     */
    train(data: number[]): void;

    /**
     * Predict future values
     * @param steps Number of steps to predict
     * @returns A tuple: [predictedValues, errors]
     */
    predict(steps: number): [number[], number[]];
  }

  export default ARIMA;
}