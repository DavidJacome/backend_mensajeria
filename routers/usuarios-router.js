var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var usuario = require('../models/usuario');
var cloudinary = require('cloudinary').v2;
CLOUDINARY_URL='cloudinary://943391434926164:l14yENBGLuQ6HQRvnv7G5WShHaA@dalarapp2021'
cloudinary.config({ 
    cloud_name: 'dalarapp2021', 
    api_key: '943391434926164', 
    api_secret: 'l14yENBGLuQ6HQRvnv7G5WShHaA',
    secure: true
});

//Registrar Usuario
router.post('/registro', async function(req,res){
    // let imagen1 = await cloudinary.uploader.upload(req.files.imagen1.tempFilePath, { folder: 'mensajeria/perfil' }, function (err, image) {
    //     if (err) { console.warn(err); }
    //     console.log(image.url);
    // });
    let nuevoUsuario = new usuario(
        {
            nombre:req.body.nombre,
            foto:req.body.foto,
            estado:req.body.estado,
            telefono: req.body.telefono,
            contrasena:req.body.contrasena,
            contactos: [],
            conversaciones: []
        }
    );
    nuevoUsuario.save().then(result=>{
        res.send(result);
        res.end();
    }).catch(error=>{
        res.send(error);
        res.end();
    });
});

//Login usuario
router.post('/login',function(req,res){
    usuario.find(
        {
            telefono:req.body.telefono,
            contrasena:req.body.contrasena
        },
        {}
    ).then(result=>{
        res.send(result[0]);
        res.end();
    }).catch(error=>{
        res.send(error);
        res.end();
    });
});

//Actualizar información usuario
router.put('/:id',function(req,res){
    usuario.updateOne(
        {
            _id:req.params.id
        },
        {
            nombre:req.body.nombre,
            foto:req.body.foto,
            estado:req.body.estado,
            telefono: req.body.telefono,
            contrasena:req.body.contrasena,
        }
    ).then(result=>{
        res.send(result);
        res.end();
    }).catch(error=>{
        res.send(error);
        res.end();
    });
});

//Agregar Contactos
router.post('/:idUsuario/contactos',function(req,res){
    usuario.updateOne(
        {
            _id:req.params.idUsuario
        },
        {
            $push: {
                contactos: mongoose.Types.ObjectId(req.body.idContacto),
            }
        }
    ).then(result=>{
        res.send(result);
        res.end();
    }).catch(error=>{
        res.send(error);
        res.end();
    });
});

//Actualizar última conversación de un usuario de la lista de conversaciones
router.put("/:idUsuario/conversaciones/:idConversacion", (req, res) => {
	usuario
		.updateOne(
			{
				_id: mongoose.Types.ObjectId(req.params.idUsuario),
				"conversaciones._id": mongoose.Types.ObjectId(
					req.params.idConversacion
				),
			},
			{
				$set: {
					"conversaciones.$": {
						_id: mongoose.Types.ObjectId(req.params.idConversacion),
						ultimoMensaje: req.body.ultimoMensaje,
						horaUltimoMensaje: req.body.horaUltimoMensaje,
						nombreDestinatario: req.body.nombreDestinatario,
						imagenDestinatario: req.body.imagenDestinatario
					},
				},
			}
		)
		.then((result) => {
			res.send(result);
			res.end();
		})
		.catch((error) => {
			res.send(error);
			res.end();
		});
});

//Obtener lista de conversaciones de un usuario
router.get("/:idUsuario/conversaciones", (req, res) => {
	usuario
		.find(
			{_id: mongoose.Types.ObjectId(req.params.idUsuario)},
			{}
		)
		.then((result) => {
			res.send(result[0].conversaciones);
			res.end();
		})
		.catch((error) => {
			res.send(error);
			res.end();
		});
});

//Obtener busqueda chat 
router.get("/:idUsuario/conversaciones/:busqueda", (req, res) => {
    var conversacionesUsuario = [];
	usuario
		.find(
			{_id: mongoose.Types.ObjectId(req.params.idUsuario)},
			{}
		)
		.then((result) => {
            conversacionesUsuario = result[0].conversaciones;
            for (let i = 0; i < conversacionesUsuario.length; i++) {
                if (req.params.busqueda == conversacionesUsuario[i].nombreDestinatario) {
                    res.send(conversacionesUsuario[i]);res.end();
                }
            }
		})
		.catch((error) => {
			res.send(error);
			res.end();
		});
});

//Obtener un usuario
router.get('/:id',function(req,res){
    usuario.find(
        {
            _id:req.params.id
        },
        {}
    ).then(result=>{
        res.send(result[0]);
        res.end();
    }).catch(error=>{
        res.send(error);
        res.end();
    });
});
//Actualizar datos y foto
// router.post('/:idUsuario', async function(req, res){
// 	let imagenPerfil = await cloudinary.uploader.upload(req.files.imagenPerfil.tempFilePath, { folder: 'Mensajeria/perfil' }, function (err, image) {
//         if (err) { console.warn(err); }
//         console.log(image.url);
//     });
//     usuario.update(
//         {
//             _id : mongoose.Types.ObjectId(req.params.idUsuario)
//         },{
//             $push: {                
//                 foto:imagenPerfil.url,
//                 nombre:req.body.nombre,
//                 estado:req.body.estado,
//                 contrasena:req.body.contrasena
//             }
//         })
//     .then((result) => {
//         res.send(result);res.end();
//     })
//     .catch((error) => {
//         res.send(error);res.end();
//     });
// });

//Obtener id por telefono
router.post("/numeroTelefono", (req, res) => {
	usuario
		.find(
			{telefono: req.body.numeroTelefono},
			{_id:true}
		)
		.then((result) => {
			res.send(result[0]);
			res.end();
		})
		.catch((error) => {
			res.send(error);
			res.end();
		});
});



module.exports = router