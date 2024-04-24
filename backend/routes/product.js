const express = require('express');
const connection = require('../connection');
const router = express.Router();
const multipart = require('connect-multiparty');
const fs = require('fs')
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');
const path = require('path');

const multipartMiddleware = multipart({uploadDir:'./uploads'})


router.post('/add',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let product = req.body;
    var query = "insert into product (name,categoryId,description,price,status,discount) values(?,?,?,?,?,?)";
    var selectQuery = "SELECT * FROM product WHERE id = LAST_INSERT_ID()";
    connection.query(query,[product.name,product.categoryId,product.description,product.price,product.status,product.discount],(err,result)=>{
        if(!err){
            connection.query(selectQuery,(err, insertedProduct)=>{
                if (!err && insertedProduct.length > 0) {
                    return res.status(200).json({ product: insertedProduct[0] }); // Devuelve el último producto insertado como parte de la respuesta
                } else {
                    return res.status(500).send(err || "No se encontró el producto insertado");
                }
            });    
        }else{
            return res.status(500).send(err)
        }
    })
})

router.post('/addDescription',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let description = req.body;
    var query = "insert into product_description (product_id,description) values(?,?)"
    connection.query(query,[description.product_id,description.description],(err,result)=>{
        if(!err){
            return res.status(200).json({message:'descripcion agregado correctamente'})
        }else{return res.status(500).send(err)}
    })
})

router.post('/getDescription',(req,res)=>{
     let product = req.body;
     var query="select id,description from product_description where product_id =?"
     connection.query(query,[product.product_id],(err,result)=>{
        if(!err){
            return res.status(200).json(result)
        }else{ return res.status(500).send(err)}
     })
})

router.patch('/updateDescription',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let description = req.body;
    var query="update product_description set description=? where id=?"
    connection.query(query,[description.description,description.id],(err,result)=>{
        if(!err){
            if(result.affectedRows ==0){return res.status(404).json({message:"does not found"})}
            return res.status(200).send({message:"descripción actulizado correctamente"})
        }else{ return res.status(500).send(err)}
    })
});

router.delete('/deleteDescription/:id',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let id = req.params.id;
    var query = "delete from product_description where id=?"
    connection.query(query,[id],(err,result)=>{
        if(!err){
            if(result.affectedRows ==0){return res.status(404).json({message:"description id does not found"})}
            return res.status(200).send({message:"Descripción eliminado correactamente"})
        }else{
            return res.status(500).send(err)
        }
    })
});

router.delete('/delete/:id',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let id = req.params.id;
    var query = "delete from product where id=?"
    connection.query(query,[id],(err,result)=>{
        if(!err){
            if(result.affectedRows ==0){return res.status(404).json({message:"Product id does not found"})}
            return res.status(200).send({message:"Product Delete Successfully"})
        }else{
            return res.status(500).send(err)
        }
    })
});

router.patch('/updateStatus',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let user = req.body;
    var query = "update product set status=? where id=?"
    connection.query(query,[user.status,user.id],(err,result)=>{
    if(!err){
        if(result.affectedRows ==0){return res.status(404).json({message:"Product id does not found"})}
        return res.status(200).send({message:"Product Updated Successfully"})
    }else{ return res.status(500).send(err)}
})
});

router.get('/get',(req,res,next)=>{
     var query = "select p.id,p.name,p.description,p.price,p.status,p.discount,p.image,c.id as categoryId,c.name as categoryName from product as p INNER JOIN category as c where p.categoryId = c.id";
     connection.query(query,(err,result)=>{
        if(!err){
          return res.status(200).json(result);
        }else{return res.status(500).send(err)}
     })
})

router.get('/getByCategory/:name', (req, res, next) => {
    const categoryName = req.params.name;

    // Consulta para obtener la ID de la categoría
    const categoryQuery = "SELECT id FROM category WHERE name = ?";
    connection.query(categoryQuery, [categoryName], (err, categoryResult) => {
        if (err) {
            return res.status(500).json({ error: err });
        } else {
            if (categoryResult.length > 0) {
                const categoryId = categoryResult[0].id;

                // Consulta para obtener los productos basados en la ID de la categoría
                const productQuery = "SELECT id, name,price,status,image,discount FROM product WHERE categoryId = ?";
                connection.query(productQuery, [categoryId], (err, productResult) => {
                    if (err) {
                        return res.status(500).json({ error: err });
                    } else {
                        return res.status(200).json(productResult);
                    }
                });
            } else {
                return res.status(404).json({ message: 'Categoría no encontrada' });
            }
        }
    });
});

router.get('/getByName/:name', (req, res, next) => {
    const productName = `%${req.params.name}%`;
    const query = "Select id,name,price,status,image,discount FROM product WHERE name LIKE ?"
    connection.query(query,[productName],(err,productNameResult)=>{
        if (err) {
            return res.status(500).json({ error: err });
        }else{
            return res.status(200).json(productNameResult)
        }
    })
});

router.get('/getById/:id',(req,res)=>{
    const id = req.params.id;
    var query = "select p.id,p.name,p.description,p.price,p.status,p.discount,p.image,p.image2,p.image3,c.id as categoryId,c.name as categoryName from product as p INNER JOIN category as c on p.categoryId = c.id where p.id=?";
    connection.query(query,[id],(err,result)=>{
        if(!err){
            return res.status(200).json(result[0])
        }else{
            return res.status(500).json(err);
        }
    })
})

router.get('/favorites',(req,res)=>{
    var query = "select p.id,p.name,p.price,p.status,p.image,p.discount,c.id as categoryId, c.name as categoryName from product as p INNER JOIN category as c on p.categoryID = c.id where discount >= 10"
    connection.query(query,(err,result)=>{
        if(!err){
            return res.status(200).json(result)
        }else{
            return res.status(500).json(err);
        }
    })
});



router.patch('/update/:id',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    const id = req.params.id;
    let product = req.body;
    var query = "update product set name=?,categoryId=?,description=?,price=?,status=?,discount=? where id=?";
    var selectQuery = "SELECT * FROM product WHERE id = ?";
    connection.query(query,[product.name,product.categoryId,product.description,product.price,product.status,product.discount,id],(err,result)=>{
        if(!err){
            if(result.affectedRows ==0){return res.status(404).json({message:"Product id does not found"})}
            connection.query(selectQuery,[id],(err,updatedProduct)=>{
                if(!err&&updatedProduct.length > 0){
                    return res.status(200).json({product:updatedProduct[0]});
                }else{
                    return res.status(500).send(err)
                }
            })

        }else{
            return res.status(500).send(err)
        }
    })
})

router.delete('/delete/:id',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let id = req.params.id;
    var query = "delete from product where id=?"
    connection.query(query,[id],(err,result)=>{
        if(!err){
            if(result.affectedRows ==0){return res.status(404).json({message:"Product id does not found"})}
            return res.status(200).send({message:"Product Delete Successfully"})
        }else{
            return res.status(500).send(err)
        }
    })
});

const multiparty = require('multiparty');

router.post('/uploadImage/:id',(req, res) => {
    const form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).send('Error al procesar la solicitud');
        }

        const productId = req.params.id;

        // Validar extensiones de los archivos
        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

        const validateExtension = (fileName) => {
            const ext = fileName.split('.').pop().toLowerCase();
            return allowedExtensions.includes('.' + ext);
        };

        // Variables para nombres de archivo
        let fileName1 = 'Imagen 1 no subida...';
        let fileName2 = 'Imagen 2 no subida...';
        let fileName3 = 'Imagen 3 no subida...';

        // Función para actualizar imágenes del producto
        const updateProductImages = () => {
            const query = 'UPDATE product SET image=?, image2=?, image3=? WHERE id=?';
            const selectQuery = 'SELECT * FROM product WHERE id = ?';

            connection.query(query, [fileName1, fileName2, fileName3, productId], (err, result) => {
                if (!err) {
                    connection.query(selectQuery, [productId], (err, updatedProduct) => {
                        if (!err && updatedProduct.length > 0) {
                            return res.status(200).json({ product: updatedProduct });
                        } else {
                            return res.status(500).send(err || 'No se encontró el producto');
                        }
                    });
                } else {
                    return res.status(500).send('Error al actualizar las imágenes');
                }
            });
        };

        // Validar y asignar nombres de archivo
        if (files.image) {
            const filePath1 = files.image[0].path;
            fileName1 = files.image[0].originalFilename;

            if (!validateExtension(fileName1)) {
                fs.unlinkSync(filePath1); // Eliminar archivo
                return res.status(400).send('Extensión de archivo no válida');
            }else{
                const newPath1 = './uploads/'+ fileName1;
                fs.copyFileSync(filePath1, newPath1); // Copiar archivo
                fs.unlinkSync(filePath1); // Eliminar archivo original
            }
        }

        if (files.image2) {
            const filePath2 = files.image2[0].path;
            fileName2 = files.image2[0].originalFilename;

            if (!validateExtension(fileName2)) {
                fs.unlinkSync(filePath2); // Eliminar archivo
                return res.status(400).send('Extensión de archivo no válida');
            }else{
                const newPath2 = './uploads/'+ fileName2;
                fs.copyFileSync(filePath2, newPath2); // Copiar archivo
                fs.unlinkSync(filePath2); // Eliminar archivo original
            }
        }

        if (files.image3) {
            const filePath3 = files.image3[0].path;
            fileName3 = files.image3[0].originalFilename;

            if (!validateExtension(fileName3)) {
                fs.unlinkSync(filePath3); // Eliminar archivo
                return res.status(400).send('Extensión de archivo no válida');
            }else{
                const newPath3 = './uploads/'+ fileName3;
                fs.copyFileSync(filePath3, newPath3); // Copiar archivo
                fs.unlinkSync(filePath3); // Eliminar archivo original
            }
        }

        // Actualizar imágenes del producto
        updateProductImages();
    });
});




/* router.post('/uploadImage2/:id',multipartMiddleware,(req,res)=>{
    var productId = req.params.id;
    var fileName = 'Imagen no subida...';

    if(req.files && req.files.image){
        const filePath = req.files.image.path;
        const fileSplit = filePath.split('\\');
        var fileName = fileSplit[1];
        const extSplit = fileName.split('.');
        const fileExt = extSplit[1].toLowerCase();

        if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
            var query = 'update product set image=? where id=?'
            var selectQuery = "SELECT * FROM product WHERE id = ?";
            connection.query(query,[fileName,productId],(err,result)=>{
                if(!err){
                    connection.query(selectQuery,[productId],(err,updatedImage)=>{
                        if(!err && updatedImage.length >0){
                            return res.status(200).json({product:updatedImage})
                        }else{
                            return res.status(500).send(err||"no se encontró el producto")
                        }
                    })
                        
                }else{
                    return res.status(500).send('la imagen no se subió');
                }
            })
        }else{ fs.unlink(filePath,(err)=>{
            return res.status(405).send('la extensión no es válida');
        })
            
        }
    }else{
        return res.status(200).send({ message: 'Subido sin imagen' });
    }
}); */

router.get('/getImage/:image', (req, res) => {
    const file = req.params.image;
    const path_file = './uploads/' + file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            return res.sendFile(path.resolve(path_file));
        } else {
            // Si la imagen no existe, puedes enviar una imagen de "imagen no encontrada" o simplemente una respuesta de error.
            return res.status(404).send('Imagen no encontrada');
        }
    });
});


module.exports = router;