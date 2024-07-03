import {sendMailToUser, sendMailToRecoveryPassword} from "../config/nodemailer.js"
import generarJWT from "../helpers/crearJWT.js"
import Usuario from "../models/Usuario.js"
import mongoose from "mongoose"


const login = async(req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const TransportesBDD = await Usuario.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
    if(TransportesBDD?.confirmEmail===false) return res.status(403).json({msg:"Lo sentimos, debe verificar su cuenta"})
    if(!TransportesBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const verificarPassword = await TransportesBDD.matchPassword(password)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
    const token = generarJWT(TransportesBDD._id,"Usuario")
    const {nombre,apellido,ubicacion,telefono,_id,} = TransportesBDD
    res.status(200).json({

        nombre,
        apellido,
        ubicacion,
        telefono,
        _id,
        token,
        email:TransportesBDD.email
    })
}

const registro =async (req,res)=>{
    //todo ACTIVIDAD 1
    const {email,password} = req.body 
    //todo ACTIVIDAD 2
    if(Object.values(req.body).includes("")) return res.status(400).json
    ({msg: "Lo sentimos, debes llenar todos los campos"})
    
    const verificarEmailBDD = await Usuario.findOne({email})
    if(verificarEmailBDD) return res.status(400).json
    ({msg: "Lo sentimos, el email ya se encuentra registrado"})

    const nuevoUsuario = new Usuario(req.body)
    nuevoUsuario.password = await nuevoUsuario.encrypPassword(password)
    nuevoUsuario.crearToken()
    await nuevoUsuario.save()
    //todo ACTIVIDAD 3
    const token = nuevoUsuario.crearToken()
    await sendMailToUser(email,token)
    await nuevoUsuario.save()

//todo ACTIVIDAD 4
res.status(200).json({msg: "revisa tu correo electronico"})
}


const confirmEmail = async (req,res)=>{
    // Actividad 1 - 2
    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const UsuarioBDD = await Usuario.findOne({token:req.params.token})
    if(!UsuarioBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
    // Actividad 3
    UsuarioBDD.token = null
    UsuarioBDD.confirmEmail=true
    await UsuarioBDD.save()
    // Actividad 4
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesion"}) 
}

const recuperarPassword = async(req,res)=>{
    const {email} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const UsuarioBDD = await Usuario.findOne({email})
    if(!UsuarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const token = UsuarioBDD.crearToken()
    UsuarioBDD.token=token
    await sendMailToRecoveryPassword(email,token)
    await UsuarioBDD.save()
    res.status(200).json({msg:"Revisa tu correo electronico para reestablecer tu cuenta"})
}

const comprobarTokenPasword = async (req,res)=>{
    if(!(req.params.token)) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const UsuarioBDD = await Usuario.findOne({token:req.params.token})
    if(UsuarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    await UsuarioBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}

const nuevoPassword = async (req,res)=>{
    const{password,confirmpassword} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if(password != confirmpassword) return res.status(404).json({msg:"Lo sentimos, los passwords no coinciden"})
    const UsuarioBDD = await Usuario.findOne({token:req.params.token})
    if(UsuarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    UsuarioBDD.token = null
    UsuarioBDD.password = await UsuarioBDD.encrypPassword(password)
    await UsuarioBDD.save()
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesion con tu nuevo password"}) 
}


export {
    login,
    registro,
    confirmEmail,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword
}