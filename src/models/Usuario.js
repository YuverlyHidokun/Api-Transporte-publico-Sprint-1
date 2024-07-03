import {Schema, model} from 'mongoose'
import bcrypt from "bcryptjs"

const usuarioSchema = new Schema({
    nombre:{
        type:String,
        require:true,
        trim:true
    },
    apellido:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true,
				unique:true
    },
    password:{
        type:String,
        require:true
    },
    fecha_registro:{
        type:Date,
        require:true,
        trim:true,
        default: Date.now()
    },
    status:{
        type:Boolean,
        default:true
    },
    token:{
        type:String,
        default:null
    },
    ubicacion:{
        type:String,
        trim:true,
        default:null
    },
    confirmEmail:{
        type:Boolean,
        default:false
    },
    
},{
    timestamps:true
})


// Método para cifrar el password del veterinario
usuarioSchema.methods.encrypPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}

// Método para verificar si el password ingresado es el mismo de la BDD
usuarioSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}

// Método para crear un token 
usuarioSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2)
    return tokenGenerado
}

export default model('Usuario',usuarioSchema)