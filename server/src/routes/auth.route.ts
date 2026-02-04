import { Hono } from "hono";
import { adminLogin, createAnnouncement } from "../controllers/auth.controller";
import { addPump } from "../controllers/pump.controller";
import { adminAuth } from "../middleware/auth.middleware";
import { addTank, getAllTanks } from "../controllers/tank.controller";
import { adminRegister } from "../controllers/auth.controller";


const authRoutes = new Hono();

authRoutes.post("/admin/login", adminLogin);
authRoutes.post("/admin/addpumps", adminAuth, addPump);
authRoutes.post("/admin/addtanks", adminAuth, addTank);
authRoutes.get("/admin/alltanks", adminAuth,getAllTanks );
authRoutes.post('/admin/announce', adminAuth, createAnnouncement);
authRoutes.post("/admin/register", adminRegister);


export default authRoutes;
