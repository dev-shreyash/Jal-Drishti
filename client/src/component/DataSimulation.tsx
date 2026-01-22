import { useState, useEffect } from 'react'
import axios, { AxiosError } from 'axios'
import { Database, MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface Pump { 
  pump_id: number; 
  pump_name: string;
  qr_code: string;
  model_number?: string | null;
  latitude: number;
  longitude: number;
  flow_rate_lph: number;
  is_smart_pump: boolean;
}

interface Village { 
  village_id: number; 
  village_name: string; 
  taluka: string;      // Added
  district: string; 
  state: string;       // Added
  pincode: string;     // Added
  population?: number | null; 
  pumps: Pump[]; 
}

interface ApiErrorResponse {
  error: string;
}

export default function DataSimulation() {
  // State Management
  const [villages, setVillages] = useState<Village[]>([])
  const [selectedVillageId, setSelectedVillageId] = useState<string>('')
  const [selectedPumpId, setSelectedPumpId] = useState<string>('')
  
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null)

  // 1. Fetch Assets on Load
  useEffect(() => {
    axios.get('http://localhost:3000/api/simulation/assets')
      .then(res => setVillages(res.data))
      .catch(err => console.error("Failed to load assets", err))
  }, [])

  // 2. Handle Generation Logic
  const handleGenerate = async () => {
    if (!selectedPumpId) return
    
    setLoading(true)
    setStatus(null)

    try {
      // Calls your new modular Backend Route
      const res = await axios.post('http://localhost:3000/api/simulation/generate', {
        pump_id: selectedPumpId,
        days: 90 // Generates 3 months of history
      })
      
      setStatus({ type: 'success', msg: res.data.message })
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>
      
      const errorMsg = error.response?.data?.error || "Connection Failed"
      setStatus({ type: 'error', msg: errorMsg })
    } finally {
      setLoading(false)
    }
  }

  // Find the selected village object to show its pumps
  const activeVillage = villages.find(v => v.village_id.toString() === selectedVillageId)

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
          <Database size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">AI Data Seed</h2>
          <p className="text-blue-100 text-sm">Inject realistic usage patterns for training</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        
        {/* Step 1: Village Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Target Village</label>
          <div className="relative">
            <select 
              className="w-full p-3 pl-4 border border-gray-300 rounded-lg appearance-none bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={selectedVillageId}
              onChange={(e) => { 
                setSelectedVillageId(e.target.value); 
                setSelectedPumpId('') // Reset pump on village change
              }}
            >
              <option value="">-- Choose a Location --</option>
              {villages.map(v => (
                <option key={v.village_id} value={v.village_id}>
                  {v.village_name}, {v.district}
                </option>
              ))}
            </select>
            <MapPin className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
          </div>
        </div>

        {/* Step 2: Pump Selection (Only appears after Village is selected) */}
        <div className={`transition-all duration-300 ${selectedVillageId ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Pump Asset</label>
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
            value={selectedPumpId}
            onChange={(e) => setSelectedPumpId(e.target.value)}
            disabled={!selectedVillageId}
          >
            <option value="">-- Choose an Asset --</option>
            {activeVillage?.pumps.map(p => (
              <option key={p.pump_id} value={p.pump_id}>
                {p.pump_name} (ID: {p.pump_id})
              </option>
            ))}
          </select>
        </div>

        {/* Step 3: Action Button */}
        <button
          onClick={handleGenerate}
          disabled={!selectedPumpId || loading}
          className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-md
            ${!selectedPumpId || loading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg active:scale-95'
            }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Generating Data...
            </>
          ) : (
            <>
              Run Simulation Script
            </>
          )}
        </button>

        {/* Feedback Message */}
        {status && (
          <div className={`p-4 rounded-lg flex items-center gap-3 border ${
            status.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{status.msg}</span>
          </div>
        )}

      </div>
    </div>
  )
}