const fs = require('fs')
const path = require('path');

//**Aca esta la conversion de la B.D a un objeto de JS */
let productsJson = path.join(__dirname,'../data/sportDataBase.json');
let arrayProducts = JSON.parse(fs.readFileSync(productsJson, 'utf-8')|| "[]");

let DB = require('../database/models')

const toThousand = n => n.toString().replace( /\B(?=(\d{3})+(?!\d))/g,"." );

let checkOut = []

const controller={
    home:(req,res)=>{ 
        res.render('home',{arrayProducts,toThousand})
    },
    //res.send(arrayProducts),
    product:(req,res)=>{
        res.render('listaDeProductos',{arrayProducts})
    },
    create: async (req,res)=>{
        let categorias = await DB.categorias.findAll()
        res.render('createProducts',{categorias})
    },
    created: async (req,res)=>{
        await DB.products.create({
            nombre:req.body.name,
            precio:req.body.price,
            descuento:req.body.discount,
            deporte:req.body.sport,
            descripcion:req.body.description,
            image:req.files[0].filename,
            categoriaId:req.body.marca
        })
       res.redirect('/')
    },

    detail: async (req,res)=>{
        let id = req.params.id;
        let product = await DB.products.findByPk(id,{
            include:["categoria"]
        });
        if(id == product.id){
            res.render('detailProduct',{
                toThousand,
                product,
                precioConDescuento:toThousand(productoEncontrado.price - (productoEncontrado.price * productoEncontrado.discount / 100))
            })
            }else{
                res.send('producto no esta añadido')
            }

    },
    edit: async (req,res)=>{
    let id= req.params.id
    
    let product = await DB.products.findByPk(id,{
        include:["categoria"]
    })
    let marcas = await DB.categorias.findAll()
    res.render('edit',{product,marcas})
    },
    edited: async (req,res)=>{
        let id = req.params.id;
           
        await DB.products.update({
            nombre:req.body.name,
            precio:req.body.price,
            descuento:req.body.discount,
            deporte:req.body.sport,
            descripcion:req.body.description,
            categoriaId:req.body.marca
        },{
            where:{
                id:id
            }
        })  
            
    },
    delete: async (req,res)=>{
        let id = req.params.id;
        await DB.products.destroy({
            where:{
                id:id
            }
        });
           res.redirect('/products')
    },
    checkOut:(req,res)=>{
        let product = arrayProducts.find(product =>{
            let checkId = checkOut.find(check =>{
                return product.id == check
            })
                return checkId == product.id
        })
        console.log(product)
        console.log(checkOut)
        res.render('checkOut',{product})
    },
    checkOutData:(req,res)=>{
           let id = req.params.id
        checkOut.push(id)
        res.redirect('/check')
        
    }
}
module.exports = controller;