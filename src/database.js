//!Importar moongose
import mongoose from 'mongoose'
//!Establecer una regla
mongoose.set('strictQuery', true)
//!Crear una funcion
const connection = async()=>{
    try {
        //todo:Desetructuracion del método connect
        const {connection} = await mongoose.connect(process.env.MONGODB_URI_LOCAL)
        //todo:Imprimir en consola a la variable
        console.log(`Database is connected on ${connection.host} - ${connection.port}`)
    } catch (error) {
        //todo:Imprimir erroes
        console.log(error);
    }
}
//!Exportar la funcion
export default  connection