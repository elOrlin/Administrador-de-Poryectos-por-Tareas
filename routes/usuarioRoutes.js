import express  from "express";
const router = express.Router();
import {registrar, autenticar, confirmar} from '../controllers/usuarioController';

router.post("/usuarios", registrar);
router.post("/login", autenticar);
router.get("/confirmar/:token", confirmar)
export default router;