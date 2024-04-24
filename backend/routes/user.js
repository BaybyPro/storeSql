const express = require('express');
const connection = require('../connection');
const router = express.Router()
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
require('dotenv').config();
var auth = require('../services/authentication')
var checkRole = require('../services/checkRole')

router.post('/signup',(req,res)=>{
   let user = req.body;
   query = "select email,password,role,status from user where email=?";
   connection.query(query,[user.email],(err,results)=>{
    if(!err){
      if(results.length <= 0){
        query = "insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,'true','user')";
        connection.query(query,[user.name,user.contactNumber,user.email,user.password],(err,results)=>{
          if(!err){
               return res.status(200).json({message:"Registrado exitosamente"})
          }else{
            return res.status(500).json(err)
          }
        })
      }
      else{
        return res.status(400).json({message:"El email ya existe"})
      }
    }else{
        return res.status(500).json(err)
    }
   })
})


router.post('/login',(req,res)=>{
  const user = req.body;
  query = "select name,email,password,role,status,contactNumber,nombres,apellidos,points from user where email=?"
  connection.query(query,[user.email],(err,result)=>{
   if(!err){
    if(result.length <=0 || result[0].password !=user.password){
      return res.status(401).json({message:"Incorrect Email or password"})
    }else if(result[0].status === 'false'){
       return res.status(401).json({message:"wait for admin approval"})
    }else if(result[0].password == user.password){
         const response = {email:result[0].email,name:result[0].name, role:result[0].role,contactNumber:result[0].contactNumber,nombres:result[0].nombres,apellidos:result[0].apellidos,points:result[0].points};
         const accessToken = jwt.sign(response,process.env.ACCESS_TOKEN,{expiresIn:24 * 60 * 60})
         res.status(200).json({token:accessToken})
    }
   }else{
    return res.status(500).json(err)
   }
  })
})

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth:{
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
})
router.post('/forgotPassword',(req,res)=>{
  const user = req.body;
  query ="select email,password,role,status from user where email=?"
  connection.query(query,[user.email],(err,result)=>{
    if(!err){
      if(result.length <=0){
        return res.status(401).json({message:"email does not exist "})
      }else{
        var mailOptions ={
          from: process.env.EMAIL,
          to: result[0].email,
          subject: 'Password by Pro compu Manager',
          html:'<p><b>Your login details for PRO COMPU Management System</b><br><b>Email: </b>'+result[0].email+'<br><b>Password: </b>'+result[0].password+'<br><a href="http://localhost:4200/login">Click here to login</a></p>'
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
              console.error('Error sending email:', err);
              return res.status(500).send(err);
          } else {
              console.log('Email sent:', info.response);
              return res.status(200).json({ message: "Contraseña enviuado correctamente a su correo." });
          }
      });
      
        return res.status(200).json({message:"Contraseña enviuado correctamente a su correo."});
      }
    }else{
      return res.status(500).json(err)
    }
  })
})

router.get('/getUser',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
  var query = "select id,name,email,contactNumber,status from user where role='user'"
  connection.query(query,(err,result)=>{
    if(!err){
        return res.status(200).json(result)
    }else{
      return res.status(500).send(err)
    }
  })
})

router.patch('/update',auth.authenticateToken,(req,res)=>{
  let user = req.body
  var query = "update user set status=? where id=?"
  connection.query(query,[user.status,user.id],(err,result)=>{
    if(!err){
       if(result.affectedRows ==0){
        return res.status(404).json({message:"User does not exist"})
       }
       return res.status(200).json({message:"User Updated Successfully"})
    }else{
      return res.status(500).json(err)
    }
  })
})

router.patch('/updateDate',(req,res)=>{
  let user = req.body
  var query = "update user set name=?,nombres=?,apellidos=?,contactNumber=? where email=?"
  connection.query(query,[user.name,user.nombres,user.apellidos,user.contactNumber,user.email],(err,result)=>{
    if(!err){
      if(result.affectedRows ==0){
        return res.status(404).json({message:"Usuario no encontrado"})
      }
      return res.status(200).json({message:"Datos actualizados correctamente"})
    }
    else{
      return res.status(500).json(err)
    }
  })
})

router.post('/changePassword',auth.authenticateToken,(req,res)=>{
  const user = req.body;
  const email= res.locals.email;
  var query= "select *from user where email=? and password=?";
  connection.query(query,[email,user.oldPassword],(err,result)=>{
    if(!err){
        if(result.length <=0){
          return res.status(400).json({message:"incorrect Old Password"});
        }
        else if (result[0].password == user.oldPassword){
             query="update user set password=? where email=?";
             connection.query(query,[user.newPassword,email],(err,result)=>{
               if(!err){
                return res.status(200).json({message:"Password Updated Successfully"})

               }else{
                return res.status(500).send(err);
               }
             })
        }else{
          return res.status(400).json({message:"Something went wrong. Please try again later"})
        }
    }else{
      return res.status(500).send(err)
    }
  })
   
})

router.post('/sale',(req,res)=>{
  let sale = req.body;
  var query = "insert into sale (id_sale,names,lastnames,typeDocument,document,email,contactNumber,departamento,provincia,distrito,pay) values(?,?,?,?,?,?,?,?,?,?,'false')";
  var selectQuery = "SELECT id_sale FROM sale WHERE id_sale = ?";
  var id_code = generarRandom();
  connection.query(query,[id_code,sale.names,sale.lastnames,sale.typeDocument,sale.document,sale.email,sale.contactNumber,sale.departamento,sale.provincia,sale.distrito],(err,result)=>{
      if(!err){
          connection.query(selectQuery,[id_code],(err, insertedSale)=>{
              if (!err && insertedSale.length > 0) {
                  return res.status(200).json(insertedSale[0] ); // Devuelve el último producto insertado como parte de la respuesta
              } else {
                  return res.status(500).send(err || "No se encontró el producto insertado");
              }
          });    
      }else{
          return res.status(500).send(err)
      }
  })
})

router.post('/getSale',(req,res)=>{
  let sale = req.body;
  var query = "SELECT id_sale, pay FROM sale WHERE email=?";
  connection.query(query,[sale.email],(err,result)=>{
    if(!err){
      if(result.length > 0){
        return res.status(200).json(result)
      } else{
        return res.status(404).send("No se encontraron compras")
      }
    }else{
      return res.status(500).send(err)
    }
  })
})


router.post('/saleProduct',(req,res)=>{
  let sale = req.body;
  var query = "insert into sale_product (id_sale,product,count,price,image) values(?,?,?,?,?)";
  connection.query(query,[sale.id_sale,sale.product,sale.count,sale.price,sale.image],(err,result)=>{
      if(!err){
          return res.status(200).send({message:'guardado exitosamente'})  
      }else{
          return res.status(500).send(err)
      }
  })
})


router.post('/getSaleProduct',(req,res)=>{
  let sale = req.body;
  var query ="SELECT product, count, price, image FROM sale_product WHERE id_sale=?";
  connection.query(query,[sale.id_sale],(err,result)=>{
    if(!err){
      if(result.length > 0){
        return res.status(200).json(result)
      }
      return res.status(404).send("no se encontraron productos")
    }else{
      return res.status(500).send(err)
    }
  })
});


function generarRandom() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let result = "";
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

  return result;
}

module.exports = router