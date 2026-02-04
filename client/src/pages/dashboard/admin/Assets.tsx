import { useEffect, useState } from "react";
// Services
import { getTanks, createTank, updateTank, deleteTank } from "../../../services/tank";
import { getPumps, createPump, updatePump, deletePump } from "../../../services/pump";

// Icons
import {
  Plus, Edit2, Trash2, MapPin, 
  Cylinder, // Tank Icon
  Droplet,  // Pump Icon
  Activity, // Sensor Icon
  Check, X, Search,
  LayoutGrid,
  Scale
} from "lucide-react";

// --- Types ---
// Unified Asset Type
interface Asset {
  id: number;          // Common ID (pump_id or tank_id)
  type: "PUMP" | "TANK"; 
  name: string;        // pump_name or tank_name
  location: { lat: number; lng: number };
  village_id: number;
  village_name?: string;
  
  // Type Specific
  capacity?: number;   // Tank only
  flow_rate?: number;  // Pump only
  is_smart?: boolean;  // Pump only
  status?: string;     // Active/Inactive
}

interface AssetForm {
  type: "PUMP" | "TANK";
  name: string;
  latitude: string;
  longitude: string;
  // Specifics
  capacity_liters: string;
  flow_rate_lph: string;
  is_smart_pump: boolean;
  model_number: string; // Pump only
}

export default function Assets() {
  // State
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [filterType, setFilterType] = useState<"ALL" | "PUMP" | "TANK">("ALL");
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [editAsset, setEditAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [form, setForm] = useState<AssetForm>({
    type: "TANK", // Default
    name: "",
    latitude: "",
    longitude: "",
    capacity_liters: "",
    flow_rate_lph: "",
    is_smart_pump: false,
    model_number: ""
  });
  const [newPumpQrCode, setNewPumpQrCode] = useState<string | undefined>(undefined);

  // 1. LOAD ALL DATA (Pumps + Tanks)
  const load = async (refresh = false) => {
    if (refresh) setLoading(true);
    try {
      const [tanksData, pumpsData] = await Promise.all([
        getTanks(),
        getPumps()
      ]);

      // Normalize Tanks
      const normTanks: Asset[] = tanksData.map((t: any) => ({
        id: t.tank_id,
        type: "TANK",
        name: t.tank_name,
        location: { lat: t.latitude, lng: t.longitude },
        village_id: t.village_id,
        village_name: t.village?.village_name,
        capacity: t.capacity_liters
      }));

      // Normalize Pumps
      const normPumps: Asset[] = pumpsData.map((p: any) => ({
        id: p.pump_id,
        type: "PUMP",
        name: p.pump_name,
        location: { lat: p.latitude, lng: p.longitude },
        village_id: p.village_id,
        village_name: p.village?.village_name,
        flow_rate: p.flow_rate_lph,
        is_smart: p.is_smart_pump,
        status: p.status || "Active"
      }));

      const combined = [...normTanks, ...normPumps];
      setAssets(combined);
      setFilteredAssets(combined);
    } catch (error) {
      console.error("Failed to load assets:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    load(false);
  }, []);

  // 2. FILTERING LOGIC
  useEffect(() => {
    let result = assets;
    
    // Type Filter
    if (filterType !== "ALL") {
      result = result.filter(a => a.type === filterType);
    }

    // Search Filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(q) || 
        a.village_name?.toLowerCase().includes(q)
      );
    }
    setFilteredAssets(result);
  }, [filterType, search, assets]);

  // 3. SAVE (Create/Update)
  const save = async () => {
    // Basic Validation
    if (!form.name || !form.latitude || !form.longitude) {
      alert("Please fill in Name and Location coordinates.");
      return;
    }

    try {
      const commonData = {
        latitude: parseFloat(form.latitude) || 0,
        longitude: parseFloat(form.longitude) || 0,
        // village_id is handled by Backend Token
      };

      if (form.type === "TANK") {
        const payload = {
          ...commonData,
          tank_name: form.name,
          capacity_liters: parseFloat(form.capacity_liters) || 0
        };
        
        if (editAsset) await updateTank(editAsset.id, payload);
        else await createTank(payload);
      } 
      else {
        // PUMP
        const payload = {
          ...commonData,
          pump_name: form.name,
          flow_rate_lph: parseFloat(form.flow_rate_lph) || 0,
          is_smart_pump: form.is_smart_pump,
          model_number: form.model_number,
          qr_code: editAsset ? undefined : newPumpQrCode // Send QR only on create
        };

        if (editAsset) await updatePump(editAsset.id, payload);
        else await createPump(payload);
      }

      setOpen(false);
      setEditAsset(null);
      resetForm();
      load(true);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save asset. Check connection.");
    }
  };

  const handleDelete = async (asset: Asset) => {
    if (!window.confirm(`Delete ${asset.name}? This action cannot be undone.`)) return;
    try {
      if (asset.type === "TANK") await deleteTank(asset.id);
      else await deletePump(asset.id);
      load(true);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete asset.");
    }
  };

  const resetForm = () => {
    setForm({
      type: "TANK", name: "", latitude: "", longitude: "",
      capacity_liters: "", flow_rate_lph: "", is_smart_pump: false, model_number: ""
    });
    setNewPumpQrCode(undefined);
  };

  // Helper to open edit modal
  const handleEdit = (asset: Asset) => {
    setEditAsset(asset);
    setForm({
      type: asset.type,
      name: asset.name,
      latitude: asset.location.lat.toString(),
      longitude: asset.location.lng.toString(),
      capacity_liters: asset.capacity?.toString() || "",
      flow_rate_lph: asset.flow_rate?.toString() || "",
      is_smart_pump: asset.is_smart || false,
      model_number: "" 
    });
    setNewPumpQrCode(undefined);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER & ACTIONS */}
      <div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-blue-600"/>
            Unified Asset Inventory
          </h1>
          <p className="text-gray-600 text-sm">Manage Pumps, Tanks, and Sensors in one place</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
             <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/>
             <input 
               placeholder="Search assets..." 
               className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
               value={search}
               onChange={e => setSearch(e.target.value)}
             />
           </div>
           <button
             onClick={() => {
               resetForm();
               setEditAsset(null);
               setOpen(true);
               setNewPumpQrCode(`P-${Date.now()}`); // Generate QR
             }}
             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
           >
             <Plus className="h-4 w-4"/> Add Asset
           </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex space-x-2 border-b border-gray-200">
        {["ALL", "PUMP", "TANK"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filterType === type 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {type === "ALL" ? "All Assets" : `${type}S`}
          </button>
        ))}
      </div>

      {/* ASSETS TABLE */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
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
                        <button onClick={() => handleEdit(asset)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="h-4 w-4"/></button>
                        <button onClick={() => handleDelete(asset)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- UNIFIED MODAL --- */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-gray-800">{editAsset ? "Edit Asset" : "Register New Asset"}</h2>
              <button onClick={() => setOpen(false)}><X className="h-5 w-5 text-gray-400"/></button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Asset Type Selector (Only visible on create) */}
              {!editAsset && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button 
                    onClick={() => setForm({...form, type: "TANK"})}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${form.type === "TANK" ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-gray-100 hover:bg-gray-50"}`}
                  >
                    <Cylinder className="h-6 w-6"/> <span className="font-bold text-sm">Water Tank</span>
                  </button>
                  <button 
                    onClick={() => setForm({...form, type: "PUMP"})}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${form.type === "PUMP" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-100 hover:bg-gray-50"}`}
                  >
                    <Droplet className="h-6 w-6"/> <span className="font-bold text-sm">Water Pump</span>
                  </button>
                </div>
              )}

              {/* Common Fields */}
              <div className="space-y-3">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                    <input 
                      placeholder="e.g. North Well Pump" 
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                      <input placeholder="0.00" type="number" className="w-full p-2 border rounded" value={form.latitude} onChange={e => setForm({...form, latitude: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                      <input placeholder="0.00" type="number" className="w-full p-2 border rounded" value={form.longitude} onChange={e => setForm({...form, longitude: e.target.value})} />
                    </div>
                 </div>
              </div>

              {/* Conditional Fields: TANK */}
              {form.type === "TANK" && (
                <div className="p-4 bg-cyan-50 rounded-lg space-y-3 border border-cyan-100">
                  <h3 className="text-xs font-bold text-cyan-800 uppercase">Tank Specifications</h3>
                  <div>
                    <label className="block text-xs font-medium text-cyan-700 mb-1">Capacity (Liters)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 50000" 
                      className="w-full p-2 border border-cyan-200 rounded"
                      value={form.capacity_liters} onChange={e => setForm({...form, capacity_liters: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {/* Conditional Fields: PUMP */}
              {form.type === "PUMP" && (
                <div className="p-4 bg-blue-50 rounded-lg space-y-3 border border-blue-100">
                  <h3 className="text-xs font-bold text-blue-800 uppercase">Pump Specifications</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-blue-700 mb-1">Flow Rate (LPH)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 2000" 
                        className="w-full p-2 border border-blue-200 rounded"
                        value={form.flow_rate_lph} onChange={e => setForm({...form, flow_rate_lph: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-blue-700 mb-1">Model No.</label>
                      <input 
                        placeholder="e.g. KSB-101" 
                        className="w-full p-2 border border-blue-200 rounded"
                        value={form.model_number} onChange={e => setForm({...form, model_number: e.target.value})}
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer pt-2">
                    <input 
                      type="checkbox" 
                      checked={form.is_smart_pump} onChange={e => setForm({...form, is_smart_pump: e.target.checked})}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    Is this a Smart Pump? (IoT Enabled)
                  </label>
                </div>
              )}

            </div>
            
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
              <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
                <Check className="h-4 w-4"/> Save Asset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}