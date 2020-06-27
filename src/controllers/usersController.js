const fs = require('fs')
const path = require('path')
const bcrypt=require('bcrypt');
const { json } = require('express');//hacer un console .log
let {validationResult} = require('express-validator');
const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require('constants');
/**Aca esta la conversion de la B.D a un objeto de JS */
let usersJson = path.join(__dirname,'../data/usersDataBase.json');
let arrayUsers =JSON.parse(fs.readFileSync(usersJson,'utf-8')|| "[]");


 let controller ={
    register:(req,res)=> res.render('createUser'),
         
    store:(req, res) =>{
        let error
        let password;
        if (req.body.contraseña == req.body.rcontraseña) {
            password = bcrypt.hashSync(req.body.contraseña, 10);
        
        let newUser = {
            id: arrayUsers == "" ? 1 : arrayUsers.length + 1,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            password: password,
            image: req.files[0].filename,
        };
        arrayUsers = [...arrayUsers, newUser];
        fs.writeFileSync(usersJson, JSON.stringify(arrayUsers, null, ""));
         let user =  arrayUsers.find(user=>{return user.email == req.body.email})
         
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
     
   auth:(req,res)=> {
    let error;
        
    let remenber = req.body.remenber
    let user = arrayUsers.find(user =>{
        return req.body.email == user.email
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

       
        
          
        
        
        
        

    
   
         


    
           
        
            
         
        
        

   
        
    
           
    
      




    





