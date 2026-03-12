import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../services/api'
import { Database, MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import type { AxiosError } from 'axios';

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
  taluka: string;
  district: string; 
  state: string;
  pincode: string;
  population?: number | null; 
  pumps: Pump[]; 
}

interface SimulationResponse {
  message: string;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const fetchAssets = async (): Promise<Village[]> => {
  const response = await api.get<Village[]>('/simulation/assets');
  return response.data;
};

const generateSimulation = async (payload: { pump_id: string; days: number }): Promise<SimulationResponse> => {
  const response = await api.post<SimulationResponse>('/simulation/generate', payload);
  return response.data;
};

export default function DataSimulation() {
  const [selectedVillageId, setSelectedVillageId] = useState<string>('')
  const [selectedPumpId, setSelectedPumpId] = useState<string>('')

  const { data: villages = [], isLoading: isLoadingAssets } = useQuery<Village[]>({
    queryKey: ['simulationAssets'],
    queryFn: fetchAssets,
  });

  const mutation = useMutation({
    mutationFn: generateSimulation,
  });

  const handleGenerate = () => {
    if (!selectedPumpId) return;
    mutation.mutate({ pump_id: selectedPumpId, days: 90 });
  };

  const activeVillage = villages.find(v => v.village_id.toString() === selectedVillageId)

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      
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
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Target Village</label>
          <div className="relative">
            <select 
              className="w-full p-3 pl-4 border border-gray-300 rounded-lg appearance-none bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50"
              value={selectedVillageId}
              disabled={isLoadingAssets}
              onChange={(e) => { 
                setSelectedVillageId(e.target.value); 
                setSelectedPumpId('');
                mutation.reset();
              }}
            >
              <option value="">{isLoadingAssets ? 'Loading assets...' : '-- Choose a Location --'}</option>
              {villages.map(v => (
                <option key={v.village_id} value={v.village_id}>
                  {v.village_name}, {v.district}
                </option>
              ))}
            </select>
            <MapPin className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
          </div>
        </div>

        <div className={`transition-all duration-300 ${selectedVillageId ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Pump Asset</label>
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
            value={selectedPumpId}
            onChange={(e) => {
              setSelectedPumpId(e.target.value);
              mutation.reset();
            }}
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

        <button
          onClick={handleGenerate}
          disabled={!selectedPumpId || mutation.isPending}
          className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-md
            ${!selectedPumpId || mutation.isPending
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg active:scale-95'
            }`}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="animate-spin" /> Generating Data...
            </>
          ) : (
            <>
              Run Simulation Script
            </>
          )}
        </button>

        {mutation.isSuccess && (
          <div className="p-4 rounded-lg flex items-center gap-3 border bg-green-50 text-green-800 border-green-200">
            <CheckCircle size={20} />
            <span className="font-medium">{mutation.data?.message || "Simulation generated successfully"}</span>
          </div>
        )}

        {mutation.isError && (
          <div className="p-4 rounded-lg flex items-center gap-3 border bg-red-50 text-red-800 border-red-200">
            <AlertCircle size={20} />
            <span className="font-medium">
              {(mutation.error as AxiosError<ApiErrorResponse>).response?.data?.message || 
               (mutation.error as AxiosError<ApiErrorResponse>).response?.data?.error || 
               "Connection Failed"}
            </span>
          </div>
        )}

      </div>
    </div>
  )
}