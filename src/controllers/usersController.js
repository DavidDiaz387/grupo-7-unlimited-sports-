const fs = require('fs')
const path = require('path')
const bcrypt=require('bcrypt');
const { json } = require('express');//hacer un console .log

const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require('constants');
/**Aca esta la conversion de la B.D a un objeto de JS */
let usersJson = path.join(__dirname,'../data/usersDataBase.json');
let arrayUsers =JSON.parse(fs.readFileSync(usersJson,'utf-8')|| "[]");

let DB = require('../database/models')

 let controller ={
    register:(req,res)=>{ 
        res.render('createUser')
    },     
    store: async (req, res) =>{
        let error
        let password;
        if (req.body.contraseña == req.body.rcontraseña) {
            password = bcrypt.hashSync(req.body.contraseña, 10);
        
            await DB.clientes.create({
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                password: password,
                image: req.files[0].filename,
            })


        
            let user = await DB.clientes.findOne({
                where:{
                    email:req.body.email
                }
            })
         
            req.session.userId = user.id

        res.redirect("/users/profile");
        } else {
            error = "Su confirmacion de contraseña no coincide"
        res.render('createUser',{error})
        }
    },
    login: (req,res)=>{
        res.render('login')
    },  
     
   auth: async (req,res)=> {
    let error;
        
    let remenber = req.body.remenber
    let user = await DB.clientes.findOne({
        where:{
            email:req.body.email
        }
    })
    if(user && bcrypt.compareSync(req.body.password,user.password)){
        if(remenber){
            res.cookie("userCookie",user.id,{maxAge:100000000})
        }
        req.session.userId = user.id
        res.redirect("/users/profile")
    }else{
        error = "Contraseña incorrecta"
    res.render("login",{error}) 
    }
    },

    profile:(req,res) =>{
        res.render('profile')
    }
    
}  
module.exports = controller;
  
  //falto corroborar un poquito sobre el passwored q en el logeo se hasheo pero no en el login 

       
        
          
        
        
        
        

    
   
         


    
           
        
            
         
        
        

   
        
    
           
    
      




    





