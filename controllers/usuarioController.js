import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";

const registrar = async (req, res) => {

    const {email} = req.body;
    const usuarioExiste = await Usuario.findOne({email});

    if(usuarioExiste){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({mensaje: error.message});
    }

    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        const usuarioAlmacenado = await usuario.save();

        res.status(200).json(usuarioAlmacenado);

    } catch (error) {
        console.log(error)
    }

    res.json({mensaje: 'Creando el Usuario'})
}

const autenticar = async (req, res) => {
    const {email, password} = req.body;

    const usuario = await Usuario.findOne({email});

    //si no existe el usuario
    if(!usuario){
        const error = new Error('Usuario no existe');
        res.status(404).json({mensaje: error.message});
    }

    //comprobar si el usuario existe y esta confirmado
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada');
        res.status(404).json({mensaje: error.message});
    }

    //comprobar us password
    if(await usuario.conprobarPassword(password)){
        res.status(200).json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    }else{
        const error = new Error('El password es incorrecto');
        res.status(404).json({mensaje: error.message});
    }

}

const confirmar = async (req, res) => {
    const {token} = req.params;
    const usuarioConfirmar = await Usuario.findOne({token})

    if(!usuarioConfirmar){
        const error = new Error('Token no valido');
        res.status(404).json({mensaje: error.message});
    }

    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = "";
        await usuarioConfirmar.save();
        res.json({mensaje: "Usuario Confirmado Correctamente"});
    } catch (error) {
        console.log(error)
    }
}

const olvidarPassword = async (req, res) => {
    const {email} = req.body;

    const usuario = await Usuario.findOne({email});

    //si no existe el usuario
    if(!usuario){
        const error = new Error('Usuario no existe');
        res.status(404).json({mensaje: error.message});
    }

    try {
        usuario.token = generarId();
        await usuario.save();
        res.json({mensaje: "Hemos enviado un email con las instrucciones"})
    } catch (error) {
        console.log(error)
    }
}

export { registrar, autenticar, confirmar, olvidarPassword};