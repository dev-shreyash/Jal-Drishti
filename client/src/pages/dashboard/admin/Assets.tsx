import { useReducer, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTanks, createTank, updateTank, deleteTank } from "../../../services/tank";
import { getPumps, createPump, updatePump, deletePump } from "../../../services/pump";
import {
  Plus, Edit2, Trash2, MapPin, Cylinder, Droplet, Activity, Check, X, Search, LayoutGrid, Scale
} from "lucide-react";

interface Asset {
  id: number;
  type: "PUMP" | "TANK";
  name: string;
  location: { lat: number; lng: number };
  village_id: number;
  village_name?: string;
  capacity?: number;
  flow_rate?: number;
  is_smart?: boolean;
  status?: string;
}

interface AssetForm {
  type: "PUMP" | "TANK";
  name: string;
  latitude: string;
  longitude: string;
  capacity_liters: string;
  flow_rate_lph: string;
  is_smart_pump: boolean;
  model_number: string;
}

interface State {
  filterType: "ALL" | "PUMP" | "TANK";
  search: string;
  isModalOpen: boolean;
  editAsset: Asset | null;
  form: AssetForm;
  newPumpQrCode?: string;
}

type Action =
  | { type: "SET_FILTER"; payload: "ALL" | "PUMP" | "TANK" }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "OPEN_CREATE" }
  | { type: "OPEN_EDIT"; payload: Asset }
  | { type: "CLOSE_MODAL" }
  | { type: "UPDATE_FORM"; payload: Partial<AssetForm> };

const initialForm: AssetForm = {
  type: "TANK", name: "", latitude: "", longitude: "",
  capacity_liters: "", flow_rate_lph: "", is_smart_pump: false, model_number: ""
};

const initialState: State = {
  filterType: "ALL",
  search: "",
  isModalOpen: false,
  editAsset: null,
  form: initialForm,
};

interface RawVillage {
  village_name: string;
}

interface RawTank {
  tank_id: number;
  tank_name: string;
  latitude: number;
  longitude: number;
  village_id: number;
  village?: RawVillage;
  capacity_liters: number;
}

interface RawPump {
  pump_id: number;
  pump_name: string;
  latitude: number;
  longitude: number;
  village_id: number;
  village?: RawVillage;
  flow_rate_lph: number;
  is_smart_pump: boolean;
  status?: string;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, filterType: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "OPEN_CREATE":
      return { ...state, isModalOpen: true, editAsset: null, form: initialForm, newPumpQrCode: `P-${Date.now()}` };
    case "OPEN_EDIT":
      return {
        ...state, isModalOpen: true, editAsset: action.payload, form: {
          type: action.payload.type, name: action.payload.name,
          latitude: action.payload.location.lat.toString(), longitude: action.payload.location.lng.toString(),
          capacity_liters: action.payload.capacity?.toString() || "", flow_rate_lph: action.payload.flow_rate?.toString() || "",
          is_smart_pump: action.payload.is_smart || false, model_number: ""
        }, newPumpQrCode: undefined
      };
    case "CLOSE_MODAL":
      return { ...state, isModalOpen: false, editAsset: null, form: initialForm, newPumpQrCode: undefined };
    case "UPDATE_FORM":
      return { ...state, form: { ...state.form, ...action.payload } };
    default:
      return state;
  }
}

const fetchAllAssets = async (): Promise<Asset[]> => {
  const [tanksData, pumpsData] = await Promise.all([getTanks(), getPumps()]);
  
  const normTanks: Asset[] = (tanksData as RawTank[]).map((t) => ({
    id: t.tank_id, type: "TANK", name: t.tank_name, location: { lat: t.latitude, lng: t.longitude },
    village_id: t.village_id, village_name: t.village?.village_name, capacity: t.capacity_liters
  }));

  const normPumps: Asset[] = (pumpsData as RawPump[]).map((p) => ({
    id: p.pump_id, type: "PUMP", name: p.pump_name, location: { lat: p.latitude, lng: p.longitude },
    village_id: p.village_id, village_name: p.village?.village_name, flow_rate: p.flow_rate_lph,
    is_smart: p.is_smart_pump, status: p.status || "Active"
  }));

  return [...normTanks, ...normPumps];
};

export default function Assets() {
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(reducer, initialState);

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAllAssets,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const commonData = {
        latitude: parseFloat(state.form.latitude) || 0,
        longitude: parseFloat(state.form.longitude) || 0,
      };

      if (state.form.type === "TANK") {
        const payload = { ...commonData, tank_name: state.form.name, capacity_liters: parseFloat(state.form.capacity_liters) || 0 };
        return state.editAsset ? updateTank(state.editAsset.id, payload) : createTank(payload);
      } else {
        const payload = { ...commonData, pump_name: state.form.name, flow_rate_lph: parseFloat(state.form.flow_rate_lph) || 0, is_smart_pump: state.form.is_smart_pump, model_number: state.form.model_number, qr_code: state.editAsset ? undefined : state.newPumpQrCode };
        return state.editAsset ? updatePump(state.editAsset.id, payload) : createPump(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      dispatch({ type: "CLOSE_MODAL" });
    },
    onError: () => alert("Failed to save asset. Check connection.")
  });

  const deleteMutation = useMutation({
    mutationFn: async (asset: Asset) => asset.type === "TANK" ? deleteTank(asset.id) : deletePump(asset.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assets"] }),
    onError: () => alert("Failed to delete asset.")
  });

  const filteredAssets = useMemo(() => {
    return assets.filter(a => {
      const matchesType = state.filterType === "ALL" || a.type === state.filterType;
      const matchesSearch = !state.search || a.name.toLowerCase().includes(state.search.toLowerCase()) || a.village_name?.toLowerCase().includes(state.search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [assets, state.filterType, state.search]);

  const handleSave = () => {
    if (!state.form.name || !state.form.latitude || !state.form.longitude) return alert("Please fill in Name and Location coordinates.");
    saveMutation.mutate();
  };

  const handleDelete = (asset: Asset) => {
    if (window.confirm(`Delete ${asset.name}? This action cannot be undone.`)) deleteMutation.mutate(asset);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-blue-600"/> Unified Asset Inventory
          </h1>
          <p className="text-gray-600 text-sm">Manage Pumps, Tanks, and Sensors in one place</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
             <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/>
             <input 
               placeholder="Search assets..." 
               className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
               value={state.search}
               onChange={e => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
             />
           </div>
           <button
             onClick={() => dispatch({ type: "OPEN_CREATE" })}
             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
           >
             <Plus className="h-4 w-4"/> Add Asset
           </button>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-gray-200">
        {(["ALL", "PUMP", "TANK"] as const).map((type) => (
          <button
            key={type}
            onClick={() => dispatch({ type: "SET_FILTER", payload: type })}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              state.filterType === type ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {type === "ALL" ? "All Assets" : `${type}S`}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Loading inventory...</div>
        ) : filteredAssets.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No assets found matching your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-3 px-4 font-semibold text-gray-700">Asset Name</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Specs</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Location</th>
                  <th className="py-3 px-4 font-semibold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAssets.map((asset) => (
                  <tr key={`${asset.type}-${asset.id}`} className="hover:bg-gray-50 group">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {asset.name}
                      <div className="text-xs text-gray-400">ID: #{asset.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        asset.type === "PUMP" ? "bg-blue-100 text-blue-700" : "bg-cyan-100 text-cyan-700"
                      }`}>
                        {asset.type === "PUMP" ? <Droplet className="h-3 w-3"/> : <Cylinder className="h-3 w-3"/>}
                        {asset.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {asset.type === "TANK" ? (
                        <div className="flex items-center gap-1">
                          <Scale className="h-3 w-3 text-gray-400"/>
                          <span><strong>{asset.capacity?.toLocaleString()}</strong> L</span>
                        </div>
                      ) : (
                        <span className="flex flex-col">
                           <span>Flow: <strong>{asset.flow_rate}</strong> LPH</span>
                           {asset.is_smart && <span className="text-xs text-green-600 flex items-center gap-1"><Activity className="h-3 w-3"/> IoT Active</span>}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3"/> {asset.location.lat.toFixed(4)}, {asset.location.lng.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => dispatch({ type: "OPEN_EDIT", payload: asset })} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="h-4 w-4"/></button>
                        <button disabled={deleteMutation.isPending} onClick={() => handleDelete(asset)} className="p-1.5 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"><Trash2 className="h-4 w-4"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {state.isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-gray-800">{state.editAsset ? "Edit Asset" : "Register New Asset"}</h2>
              <button onClick={() => dispatch({ type: "CLOSE_MODAL" })}><X className="h-5 w-5 text-gray-400"/></button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {!state.editAsset && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button 
                    onClick={() => dispatch({ type: "UPDATE_FORM", payload: { type: "TANK" } })}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${state.form.type === "TANK" ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-gray-100 hover:bg-gray-50"}`}
                  >
                    <Cylinder className="h-6 w-6"/> <span className="font-bold text-sm">Water Tank</span>
                  </button>
                  <button 
                    onClick={() => dispatch({ type: "UPDATE_FORM", payload: { type: "PUMP" } })}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${state.form.type === "PUMP" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-100 hover:bg-gray-50"}`}
                  >
                    <Droplet className="h-6 w-6"/> <span className="font-bold text-sm">Water Pump</span>
                  </button>
                </div>
              )}

              <div className="space-y-3">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                    <input 
                      placeholder="e.g. North Well Pump" 
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      value={state.form.name} onChange={e => dispatch({ type: "UPDATE_FORM", payload: { name: e.target.value } })}
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                      <input placeholder="0.00" type="number" className="w-full p-2 border rounded" value={state.form.latitude} onChange={e => dispatch({ type: "UPDATE_FORM", payload: { latitude: e.target.value } })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                      <input placeholder="0.00" type="number" className="w-full p-2 border rounded" value={state.form.longitude} onChange={e => dispatch({ type: "UPDATE_FORM", payload: { longitude: e.target.value } })} />
                    </div>
                 </div>
              </div>

              {state.form.type === "TANK" && (
                <div className="p-4 bg-cyan-50 rounded-lg space-y-3 border border-cyan-100">
                  <h3 className="text-xs font-bold text-cyan-800 uppercase">Tank Specifications</h3>
                  <div>
                    <label className="block text-xs font-medium text-cyan-700 mb-1">Capacity (Liters)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 50000" 
                      className="w-full p-2 border border-cyan-200 rounded"
                      value={state.form.capacity_liters} onChange={e => dispatch({ type: "UPDATE_FORM", payload: { capacity_liters: e.target.value } })}
                    />
                  </div>
                </div>
              )}

              {state.form.type === "PUMP" && (
                <div className="p-4 bg-blue-50 rounded-lg space-y-3 border border-blue-100">
                  <h3 className="text-xs font-bold text-blue-800 uppercase">Pump Specifications</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-blue-700 mb-1">Flow Rate (LPH)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 2000" 
                        className="w-full p-2 border border-blue-200 rounded"
                        value={state.form.flow_rate_lph} onChange={e => dispatch({ type: "UPDATE_FORM", payload: { flow_rate_lph: e.target.value } })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-blue-700 mb-1">Model No.</label>
                      <input 
                        placeholder="e.g. KSB-101" 
                        className="w-full p-2 border border-blue-200 rounded"
                        value={state.form.model_number} onChange={e => dispatch({ type: "UPDATE_FORM", payload: { model_number: e.target.value } })}
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer pt-2">
                    <input 
                      type="checkbox" 
                      checked={state.form.is_smart_pump} onChange={e => dispatch({ type: "UPDATE_FORM", payload: { is_smart_pump: e.target.checked } })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    Is this a Smart Pump? (IoT Enabled)
                  </label>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
              <button onClick={() => dispatch({ type: "CLOSE_MODAL" })} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
              <button disabled={saveMutation.isPending} onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50">
                <Check className="h-4 w-4"/> {saveMutation.isPending ? "Saving..." : "Save Asset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}