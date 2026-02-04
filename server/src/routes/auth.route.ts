import { Hono } from "hono";
import { 
  adminLogin, 
  createAnnouncement,
  getVillagesForRegister, 
  // <--- Import this
} from "../controllers/auth.controller";
import { getVillageOptions } from "../controllers/village.controller"; // <--- Import this
import { createPump } from "../controllers/pump.controller";
import { adminAuth } from "../middleware/auth.middleware";
import { createTank, getTanks } from "../controllers/tank.controller";
import { registerAdmin } from "../controllers/admin.controller";

const authRoutes = new Hono();

// --- PUBLIC ROUTES (No Auth Required) ---
authRoutes.post("/admin/login", adminLogin);
authRoutes.post("/admin/register", registerAdmin);
authRoutes.post("/register", registerAdmin); // <--- New Register Route
authRoutes.get("/villages/options", getVillageOptions); // <--- For Dropdown
authRoutes.get("/villages", getVillagesForRegister);

// --- PROTECTED ROUTES (Requires Token) ---
authRoutes.post("/admin/addpumps", adminAuth, createPump);
authRoutes.post("/admin/addtanks", adminAuth, createTank);
authRoutes.get("/admin/alltanks", adminAuth, getTanks);
authRoutes.post('/admin/announce', adminAuth, createAnnouncement);

export default authRoutes;