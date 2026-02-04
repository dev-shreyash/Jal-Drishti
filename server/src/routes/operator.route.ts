import { Hono } from "hono";
// import { operatorLogin } from "../controllers/operator.controller";
// import getPumpByQr from "../controllers/pump.controller";
// import { operatorAuthMiddleware } from "../middleware/operator.auth.middleware";

const operatorRoutes = new Hono();

// operatorRoutes.post("/login", operatorLogin);
// operatorRoutes.get(
//   "/pump/:qrCode",
//   operatorAuthMiddleware,
//   getPumpByQr
// );
// operatorRoutes.post(
//   "/pump/change-request",
//   operatorAuthMiddleware,
//   createChangeRequest
// );



export default operatorRoutes;
