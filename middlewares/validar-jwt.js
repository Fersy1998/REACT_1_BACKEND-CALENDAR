const {response} =require('express');
const jwt=require('jsonwebtoken');
const validarJWT=(req, res=response, next)=>{
    //x-tokem headers
    const token=req.header('x-token');
    if(!token){
        return res.status(401).json({
            Ok:false,
            msg:'No hay token en la autenticación'
    })
    }
    try {
        const payload=jwt.verify(token, process.env.SECRET_JWT_SEED);
        const {uid, name}=payload;
        req.uid=uid;
        req.name=name;
        
    } catch (error) {
        return res.status(400).json({
            Ok:false,
            msg:'Token no válido'
    })
    }
    next();

}

module.exports={validarJWT}