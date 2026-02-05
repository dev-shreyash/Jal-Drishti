import { TrendingUp, Sparkles, Calendar, AlertTriangle } from "lucide-react";

// 1. DEFINE THE DATA INTERFACE
interface Prediction {
  date: string;
  day: string;
  displayDate: string;
  predicted_usage: number;
  reason: string;
  isAlert: boolean;
}

// 2. DEFINE THE PROPS INTERFACE
interface AiPredictionChartProps {
  data: Prediction[];
}

// 3. ACCEPT DATA AS PROP
export default function AiPredictionChart({ data }: AiPredictionChartProps) {
  
  // No need for local useEffect or fetchData anymore!
  // The Dashboard handles the loading state.

  if (!data || data.length === 0) return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6 text-center text-gray-400">
      <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-20" />
      <p className="text-sm">Historical data is required to generate AI forecasts.</p>
    </div>
  );

  // Calculate max for bar scaling
  const maxUsage = Math.max(...data.map(d => d.predicted_usage)) || 1;
  const todayPred = data[0];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 mt-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -z-10 opacity-60"></div>

      {/* HEADER */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-gray-900 text-lg">Demand Forecast</h3>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Sparkles className="h-3 w-3 text-purple-500" />
            <span>AI Prediction • Next 7 Days</span>
          </div>
        </div>

        {/* TODAY'S SNAPSHOT */}
        {todayPred && (
          <div className="text-right bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
            <div className="flex items-center justify-end space-x-1 text-blue-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Calendar className="h-3 w-3" />
              <span>{todayPred.displayDate} (Today)</span>
            </div>
            <p className="text-2xl font-black text-blue-900 leading-none">
              {(todayPred.predicted_usage / 1000).toFixed(1)}k <span className="text-sm font-medium text-blue-600">Liters</span>
            </p>
          </div>
        )}
      </div>

      {/* CHART BARS */}
      <div className="space-y-4">
        {data.map((day, i) => (
          <div key={i} className="group">
            <div className="flex items-center justify-between text-xs mb-1.5 px-1">
              <div className="flex items-center space-x-2">
                <span className={`font-bold w-12 ${day.day === "Today" ? "text-blue-700" : "text-gray-500"}`}>
                  {day.day === "Today" ? "TODAY" : day.day}
                </span>
                <span className="text-gray-400 font-medium">{day.displayDate}</span>
              </div>
              
              {day.isAlert && (
                <div className="flex items-center space-x-1 text-amber-600 animate-pulse">
                  <AlertTriangle className="h-3 w-3" />
                  <span className="font-bold">{day.reason}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3 h-8">
              {/* Bar Track */}
              <div className="flex-1 bg-gray-100 rounded-lg h-2.5 overflow-hidden">
                {/* Filled Bar */}
                <div 
                  className={`h-full rounded-lg transition-all duration-1000 ease-out relative ${
                    day.isAlert ? "bg-amber-500" : 
                    day.day === "Today" ? "bg-blue-600" : "bg-blue-300"
                  }`}
                  style={{ width: `${(day.predicted_usage / maxUsage) * 100}%` }} 
                >
                </div>
              </div>
              
              {/* Number */}
              <span className="text-xs font-bold text-gray-700 w-16 text-right tabular-nums">
                {day.predicted_usage.toLocaleString()} L
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-50 text-center">
        <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
          <Sparkles className="h-3 w-3" />
          Forecast generated based on historical village usage.
        </p>
      </div>
    </div>
  );
}