import {Router} from 'express'
import {
    login,
    registro,
    confirmEmail,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword
} from "../controllers/usuario_controller.js";
import verificarAutenticacion from '../middlewares/autenticacion.js'
const router=Router()

router.post("/login", login);
router.post("/registro", registro);
router.get("/confirmar/:token", confirmEmail);
router.get("/recuperar-password",verificarAutenticacion, recuperarPassword);
router.get('/recuperar-password/:token',verificarAutenticacion,comprobarTokenPasword)
router.post('/nuevo-password/:token',verificarAutenticacion, nuevoPassword)

export default routers