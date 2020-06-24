var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var {check} = require('express-validator');

/**requiriendo el controller y un middleware Session */
let sessionUser = require('../middlewares/sessionUser');
let userController = require ('../controllers/usersController');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images') 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
  }
})
 
var upload = multer({ storage: storage })


/* User register */
router.get('/register',userController.register);
router.post('/register',[
  check('nombre','Este campo no puede estar vacio').isLength({min:2}).trim(),
  check('apellido','Este campo no puede estar vacio').isLength({min:2}).trim(),
  check('email','Este campo require un E-mail').isEmail().trim(),
  check('password','La contraseña debe ser de 8 caracteres o mas').isLength({min:8}).trim()
],upload.any(),userController.store);

/* Log In */
router.get('/login',userController.login);
router.post('/auth',[
  check('email','El campo requiere un E-mail').isEmail().trim(),
  check('password','Debe ingresar su contraseña').not().isEmpty().isLength().trim()
],userController.auth);

/* User Profile */
router.get('/profile',sessionUser,userController.profile);


module.exports = router;
