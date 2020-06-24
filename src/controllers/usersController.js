const fs = require('fs')
const path = require('path')
const bcrypt=require('bcrypt');
const { json } = require('express');//hacer un console .log
let {validationResult} = require('express-validator')
/**Aca esta la conversion de la B.D a un objeto de JS */
let usersJson = path.join(__dirname,'../data/usersDataBase.json');
let arrayUsers =JSON.parse(fs.readFileSync(usersJson,'utf-8')|| "[]");


 let controller ={
    register:(req,res)=> res.render('createUser'),
         
    store:(req, res,next) =>{
        let error = validationResult(req)

        if(error.errors == undefined){
            let newUser = {
                id:arrayUsers==""?1:arrayUsers.length+ 1,
                nombre:req.body.nombre,
                apellido:req.body.apellido,
                email: req.body.email,
                password:bcrypt.hashSync(req.body.contraseña,10),
                rcontraseña:bcrypt.hashSync(req.body.rcontraseña,10), 
                image:req.files[0].filename
            }  
            arrayUsers = [...arrayUsers,newUser];
            fs.writeFileSync(usersJson,JSON.stringify(arrayUsers,null,""))
            res.redirect('/users/profile')
        }else{
            res.render('createUser',{error:error.errors})
        }

        
 
             
        
    },
    login: (req,res)=>{
        res.render('login')
    },  
     
   auth:(req,res)=> {
        let error = validationResult(req);    

        let remember = req.body.remember
        let user = arrayUsers.find(user =>{
            return req.body.email == user.email
        })
        if(user && bcrypt.compareSync(req.body.password,user.password)){
            if(remember){
                res.cookie("userCookie",user.id,{maxAge:100000})
            }
            req.session.userId = user.id
            res.redirect("/users/profile")
        }else{
            res.render("login",{error:error.errors}) 
        }
    },

    profile:(req,res) =>{
        res.render('profile')
    }
    
}  
module.exports = controller;
  
  //falto corroborar un poquito sobre el passwored q en el logeo se hasheo pero no en el login 

       
        
          
        
        
        
        

    
   
         


    
           
        
            
         
        
        

   
        
    
           
    
      




    





