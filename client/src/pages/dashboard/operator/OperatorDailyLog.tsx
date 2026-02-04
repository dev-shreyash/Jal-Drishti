// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft, Save, Clock, Droplets, AlertCircle, Check } from "lucide-react";

// export default function OperatorDailyLog() {
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [pumpOptions] = useState([
//     { id: "pump_1", name: "Pump 1 - Main Reservoir" },
//     { id: "pump_2", name: "Pump 2 - Backup System" },
//     { id: "pump_3", name: "Pump 3 - Distribution Line" },
//     { id: "pump_4", name: "Pump 4 - Storage Tank" },
//   ]);

//   const [form, setForm] = useState({
//     pump_id: "",
//     start_time: "",
//     end_time: "",
//     usage_liters: "",
//     chlorine_added: false,
//     chlorine_ppm: "",
//   });

//   // Set default times
//   useEffect(() => {
//     const now = new Date();
//     const endTime = now.toISOString().slice(0, 16);
//     const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
//     const startTime = oneHourAgo.toISOString().slice(0, 16);
    
//     setForm(prev => ({
//       ...prev,
//       start_time: startTime,
//       end_time: endTime,
//     }));
//   }, []);

//   const handleChange = (e: any) => {
//     const { name, value, type, checked } = e.target;
//     setForm({
//       ...form,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const token = localStorage.getItem("token");

//     try {
//       const res = await fetch("http://localhost:3000/operator/daily-logs", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(form),
//       });

//       if (!res.ok) {
//         const error = await res.json();
//         throw new Error(error.message || "Failed to save log");
//       }

//       alert("✅ Daily log saved successfully!");
//       navigate("/operator/dashboard");
//     } catch (err: any) {
//       alert(err.message || "Something went wrong");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const calculateDuration = () => {
//     if (!form.start_time || !form.end_time) return "0";
//     const start = new Date(form.start_time);
//     const end = new Date(form.end_time);
//     const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
//     return hours >= 0 ? hours.toFixed(1) : "Invalid";
//   };

//   const formatTime = (timeString: string) => {
//     if (!timeString) return "";
//     const date = new Date(timeString);
//     return date.toLocaleString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <div style={styles.container}>
//       {/* Header */}
//       <div style={styles.header}>
//         <button 
//           onClick={() => navigate("/operator/dashboard")}
//           style={styles.backButton}
//         >
//           <ArrowLeft size={20} />
//           Back to Dashboard
//         </button>
//         <div style={styles.headerContent}>
//           <h1 style={styles.title}>Add Daily Water Log</h1>
//           <p style={styles.subtitle}>Record pump operations and water supply data</p>
//         </div>
//         <div style={styles.dateBadge}>
//           {new Date().toLocaleDateString('en-US', { 
//             weekday: 'long',
//             month: 'long',
//             day: 'numeric' 
//           })}
//         </div>
//       </div>

//       <div style={styles.content}>
//         <form onSubmit={handleSubmit} style={styles.form}>
//           <div style={styles.formGrid}>
//             {/* Pump Selection */}
//             <div style={styles.formGroup}>
//               <label style={styles.label}>
//                 <Droplets size={18} />
//                 <span>Pump Selection</span>
//               </label>
//               <select
//                 name="pump_id"
//                 value={form.pump_id}
//                 onChange={handleChange}
//                 required
//                 style={styles.select}
//               >
//                 <option value="">Select a pump...</option>
//                 {pumpOptions.map((pump) => (
//                   <option key={pump.id} value={pump.id}>
//                     {pump.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Time Range */}
//             <div style={styles.formGroup}>
//               <label style={styles.label}>
//                 <Clock size={18} />
//                 <span>Operation Time Range</span>
//               </label>
//               <div style={styles.timeContainer}>
//                 <div style={styles.timeInputGroup}>
//                   <div style={styles.timeLabel}>Start Time</div>
//                   <input
//                     type="datetime-local"
//                     name="start_time"
//                     value={form.start_time}
//                     onChange={handleChange}
//                     required
//                     style={styles.timeInput}
//                   />
//                   <div style={styles.timeDisplay}>{formatTime(form.start_time)}</div>
//                 </div>
//                 <div style={styles.durationDisplay}>
//                   <div style={styles.durationLabel}>Duration</div>
//                   <div style={styles.durationValue}>{calculateDuration()} hours</div>
//                 </div>
//                 <div style={styles.timeInputGroup}>
//                   <div style={styles.timeLabel}>End Time</div>
//                   <input
//                     type="datetime-local"
//                     name="end_time"
//                     value={form.end_time}
//                     onChange={handleChange}
//                     required
//                     style={styles.timeInput}
//                   />
//                   <div style={styles.timeDisplay}>{formatTime(form.end_time)}</div>
//                 </div>
//               </div>
//             </div>

//             {/* Water Usage */}
//             <div style={styles.formGroup}>
//               <label style={styles.label}>
//                 💧
//                 <span>Water Usage (Liters)</span>
//               </label>
//               <input
//                 name="usage_liters"
//                 type="number"
//                 placeholder="Enter water usage in liters"
//                 value={form.usage_liters}
//                 onChange={handleChange}
//                 required
//                 min="0"
//                 step="100"
//                 style={styles.input}
//               />
//               {form.usage_liters && (
//                 <div style={styles.hint}>
//                   Approximately {Math.round(Number(form.usage_liters) / 1000)} cubic meters
//                 </div>
//               )}
//             </div>

//             {/* Chlorine Treatment */}
//             <div style={styles.formGroup}>
//               <label style={styles.label}>
//                 ⚗️
//                 <span>Chlorine Treatment</span>
//               </label>
//               <div style={styles.checkboxContainer}>
//                 <label style={styles.checkboxLabel}>
//                   <input
//                     type="checkbox"
//                     name="chlorine_added"
//                     checked={form.chlorine_added}
//                     onChange={handleChange}
//                     style={styles.checkbox}
//                   />
//                   <span>Chlorine was added to water</span>
//                 </label>
//               </div>
              
//               {form.chlorine_added && (
//                 <div style={styles.chlorineGroup}>
//                   <input
//                     name="chlorine_ppm"
//                     type="number"
//                     placeholder="Enter chlorine concentration (PPM)"
//                     value={form.chlorine_ppm}
//                     onChange={handleChange}
//                     required
//                     min="0"
//                     max="5"
//                     step="0.1"
//                     style={styles.input}
//                   />
//                   <div style={styles.hint}>
//                     Safe drinking water range: 0.2 - 4.0 PPM
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Information Alert */}
//             <div style={styles.alertBox}>
//               <AlertCircle size={20} color="#856404" />
//               <div style={styles.alertText}>
//                 <strong>Important:</strong> Please verify all information before submission. 
//                 This log will be permanently recorded in the system.
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div style={styles.buttonGroup}>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               style={styles.submitButton}
//             >
//               {isSubmitting ? (
//                 <>
//                   <div style={styles.spinner}></div>
//                   <span>Saving...</span>
//                 </>
//               ) : (
//                 <>
//                   <Save size={20} />
//                   <span>Save Daily Log</span>
//                 </>
//               )}
//             </button>
//             <button
//               type="button"
//               onClick={() => navigate("/operator/dashboard")}
//               style={styles.cancelButton}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     minHeight: "100vh",
//     background: "linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%)",
//   },
//   header: {
//     background: "#ffffff",
//     padding: "20px 32px",
//     borderBottom: "1px solid #e0e0e0",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//   },
//   backButton: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     background: "transparent",
//     border: "none",
//     color: "#1a237e",
//     fontSize: "15px",
//     fontWeight: "500",
//     cursor: "pointer",
//     padding: "8px 16px",
//     borderRadius: "6px",
//     transition: "background 0.3s ease",
//   },
//   headerContent: {
//     textAlign: "center" as const,
//   },
//   title: {
//     margin: "0",
//     color: "#1a237e",
//     fontSize: "24px",
//     fontWeight: "700",
//   },
//   subtitle: {
//     margin: "4px 0 0 0",
//     color: "#666",
//     fontSize: "14px",
//   },
//   dateBadge: {
//     background: "#e3f2fd",
//     color: "#1a237e",
//     padding: "8px 16px",
//     borderRadius: "20px",
//     fontSize: "14px",
//     fontWeight: "500",
//     border: "1px solid #bbdefb",
//   },
//   content: {
//     padding: "32px",
//     maxWidth: "800px",
//     margin: "0 auto",
//   },
//   form: {
//     background: "#ffffff",
//     borderRadius: "12px",
//     padding: "32px",
//     boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//   },
//   formGrid: {
//     display: "flex",
//     flexDirection: "column" as const,
//     gap: "24px",
//   },
//   formGroup: {
//     display: "flex",
//     flexDirection: "column" as const,
//     gap: "8px",
//   },
//   label: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     fontSize: "16px",
//     fontWeight: "600",
//     color: "#000000", // Black text
//   },
//   select: {
//     padding: "12px 16px",
//     fontSize: "15px",
//     borderRadius: "8px",
//     border: "2px solid #e0e0e0",
//     background: "#ffffff",
//     color: "#000000", // Black text
//     outline: "none",
//     transition: "border-color 0.3s ease",
//   },
//   input: {
//     padding: "12px 16px",
//     fontSize: "15px",
//     borderRadius: "8px",
//     border: "2px solid #e0e0e0",
//     background: "#ffffff",
//     color: "#000000", // Black text
//     outline: "none",
//     transition: "border-color 0.3s ease",
//     width: "100%",
//   },
//   timeContainer: {
//     display: "flex",
//     alignItems: "flex-end",
//     gap: "20px",
//   },
//   timeInputGroup: {
//     flex: 1,
//   },
//   timeLabel: {
//     fontSize: "14px",
//     fontWeight: "500",
//     color: "#555",
//     marginBottom: "8px",
//   },
//   timeInput: {
//     padding: "12px 16px",
//     fontSize: "15px",
//     borderRadius: "8px",
//     border: "2px solid #e0e0e0",
//     background: "#ffffff",
//     color: "#000000", // Black text
//     outline: "none",
//     width: "100%",
//   },
//   timeDisplay: {
//     fontSize: "12px",
//     color: "#666",
//     marginTop: "4px",
//     fontStyle: "italic",
//   },
//   durationDisplay: {
//     background: "#f8f9fa",
//     padding: "16px",
//     borderRadius: "8px",
//     textAlign: "center" as const,
//     minWidth: "120px",
//   },
//   durationLabel: {
//     fontSize: "12px",
//     color: "#666",
//     marginBottom: "4px",
//   },
//   durationValue: {
//     fontSize: "20px",
//     fontWeight: "700",
//     color: "#1a237e",
//   },
//   checkboxContainer: {
//     marginTop: "8px",
//   },
//   checkboxLabel: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     fontSize: "15px",
//     color: "#000000", // Black text
//     cursor: "pointer",
//   },
//   checkbox: {
//     width: "18px",
//     height: "18px",
//     cursor: "pointer",
//   },
//   chlorineGroup: {
//     marginTop: "12px",
//   },
//   hint: {
//     fontSize: "13px",
//     color: "#666",
//     marginTop: "4px",
//     fontStyle: "italic",
//   },
//   alertBox: {
//     background: "#fff3cd",
//     border: "1px solid #ffeaa7",
//     borderRadius: "8px",
//     padding: "16px",
//     display: "flex",
//     alignItems: "flex-start",
//     gap: "12px",
//     marginTop: "8px",
//   },
//   alertText: {
//     fontSize: "14px",
//     color: "#856404",
//     lineHeight: "1.5",
//   },
//   buttonGroup: {
//     display: "flex",
//     justifyContent: "center",
//     gap: "16px",
//     marginTop: "32px",
//     paddingTop: "24px",
//     borderTop: "1px solid #e0e0e0",
//   },
//   submitButton: {
//     background: "linear-gradient(135deg, #1e3c72, #2a5298)",
//     color: "#ffffff",
//     border: "none",
//     padding: "14px 32px",
//     fontSize: "16px",
//     fontWeight: "600",
//     borderRadius: "8px",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     transition: "all 0.3s ease",
//     minWidth: "180px",
//   },
//   cancelButton: {
//     background: "transparent",
//     color: "#666",
//     border: "2px solid #e0e0e0",
//     padding: "14px 32px",
//     fontSize: "16px",
//     fontWeight: "600",
//     borderRadius: "8px",
//     cursor: "pointer",
//     transition: "all 0.3s ease",
//   },
//   spinner: {
//     width: "18px",
//     height: "18px",
//     border: "2px solid rgba(255,255,255,0.3)",
//     borderTop: "2px solid #ffffff",
//     borderRadius: "50%",
//     animation: "spin 1s linear infinite",
//   },
// };

// // Add CSS animation
// const styleSheet = document.styleSheets[0];
// styleSheet.insertRule(`
//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }
// `);



export default function OperatorDailyLog() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Operator Daily Log Page</h2>
      <p>This page is under construction.</p>
    </div>
  );
}