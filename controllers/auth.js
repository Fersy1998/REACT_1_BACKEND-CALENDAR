
//const express=require('express');
const {response}=require('express');

const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const {generateJWT} = require('../helpers/jws')
const createUser= async(req, res=express.response)=>{
    const {email, password}=req.body;
    try {
    ///Validación de nuevo usuario
        let usuario= await Usuario.findOne({email});
        if(usuario){
            return res.status(400).json({
                Ok:false,
                msg:'Ya existe un usuario con ese correo'
        })}
        
        //encriptación de contraseña
        usuario=new Usuario(req.body);
        const salt=bcrypt.genSaltSync();//Num aleatorio(10) para generar contraseña
        usuario.password=bcrypt.hashSync(password, salt);//hash a la contraseña

        await usuario.save();
        //Generar token
        const token=await generateJWT(usuario.id, usuario.name);
        
        /*const errors=validationResult(req) //esto lo pasamos a Field validator ya que se repite, 
        if(!errors.isEmpty()){                 //lugo se importa en las rutas de auth en los middlewares
            return res.status(400).json({
                Ok:false,
                error:errors.mapped()
            })
        }*/
        res.status(201).json({
            Ok:true,
            msg:'Register',
            uid:usuario.id,
            name:usuario.name,
            token:token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            Ok:false,
            msg:'Por favor hable con el administrador'
            
        })
    }
    
  
    

}
const loginUser=async (req, res=response)=>{
    const {email, password}=req.body;
    try {//comprobación de email
        let usuario= await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({
                Ok:false,
                msg:'No existe ningún usuario con ese correo'
        })}
        //comprobación de password
        const validPassword=bcrypt.compareSync(password, usuario.password)
        if(!validPassword){
            return res.status(400).json({
                Ok:false,
                msg:'Contraseña incorrecta'
        })
        }
          //Generar token
          const token=await generateJWT(usuario.id, usuario.name);
        res.json({
            Ok:true,
            msg:'Login',
            uid:usuario.id,
            name:usuario.name,
            token:token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            Ok:false,
            msg:'Por favor hable con el administrador'
        })
    }
}

const revalidarToken= async(req, res=response)=>{
    const uid=req.uid;
    const name=req.name;
    const token=await generateJWT(uid, name);
    res.json({
        Ok:true,
        msg:'Revalidar token',
        token:token
    })

}



module.exports={createUser, loginUser, revalidarToken};