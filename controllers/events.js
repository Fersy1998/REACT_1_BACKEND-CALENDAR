
const {response}=require('express');


const Evento=require('../models/Evento');

const getEventos= async(req, res=response)=>{
    //console.log(req);
    const eventos=await Evento.find().populate('user', 'name').lean().exec();

    console.log("estos son los eventos ", eventos);
       
        return res.json({
            Ok:true,
            msg:'eventos',
            eventos: [...eventos]
        })
   
        //console.log(eventos);
   
}
const crearEvento= async(req, res=response)=>{
    //console.log(req.body);
    const evento=new Evento(req.body);

    try {
        evento.user=req.uid;
       await evento.save();
       
       res.status(201).json({
        Ok:true,
        msg:'event created',
        evento:evento.id
    })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            Ok:false,
            msg:'Por favor hable con el administrador'
        })
    }
}
const actualizarEvento=async (req, res=response)=>{
    console.log(req.params.id);
    const eventoId=req.params.id;
    const uid=req.uid;
    try {
        const evento=await Evento.findById(eventoId);
        if(!evento){
            res.status(404).json({
                Ok:false,
                msg:'Evento no encontrado'
            }) 
        }
        if(evento.user.toString()!==uid){
            res.status(400).json({
                Ok:false,
                msg:'No es posible editar eventos de otros usuarios'
            }) 
        }
        const nuevoEvento={
            ...req.body,
            user:uid
        }
        const elementoActualizado= await Evento.findByIdAndUpdate(eventoId, nuevoEvento);
        res.status(201).json({
            Ok:true,
            msg:'event updated'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            Ok:false,
            msg:'Por favor hable con el administrador'
        })
    }
}
const eliminarEvento=async (req, res=response)=>{
    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            return res.status(404).json({
                Ok: false,
                msg: 'No existe el evento'
            });
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                Ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            });
        }

        await Evento.findByIdAndDelete( eventoId );

        res.json({ Ok: true,
            msg:'Evento eliminado' });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            Ok:false,
            msg:'Por favor hable con el administrador'
        })
    }
}
module.exports={
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}