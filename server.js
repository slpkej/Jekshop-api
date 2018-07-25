//variables referencing all the node apps we downloaded through npm
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/jek-shop');

//Referencing the two objects we created in the Model folder
var Product = require('./model/product');
var WishList = require('./model/wishlist');

//bodyParser is going to be used in JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//the app posting to the product directory
app.post('/product', function(request, response){
    //creates new Product from the producs objects
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    //Catches error if there was one, else it sends the product
    product.save(function(err, savedProduct){
        if(err){
            response.status(500).send({error:"could not save product"});
        }
        else{
            response.send(savedProduct);
        }
    })
});

app.get('/wishlist', function(request, response){
    wishList.find({}).populate({path:'products', model: 'Product'}).exec(function(err, wishLists){
        if(err){
            response.status(500).send({error:"could not fetch wishLists"});
        } else{
            response.status(200).send(wishLists);
        }
    })
});

app.post('/wishlist', function(request, response) {
        var wishList = new WishList();
        wishList.title = request.body.title;

        wishList.save(function(err, newWishList){
            if(err){
                response.status(500).send({error: "Could not be created"});
            } else {
                response.send(newWishList);
            }
        });
    });

app.put('/wishList/product/add', function(request, response){
    Product.findOne({_id: request.body.productId}, function(err, product){
        if(err){
            response.status(500).send({error: "Could not add item to wishList"});

        } else{
            WishList.update({_id:request.body.wishListId}, {$addToSet:
                {products: product._id}}, function(err, wishList){
                    if(err){
                        response.status(500).send({error: "Could not add item to wishList"});
            
                    } else{
                        response.send(wishList);
                    }         
            });
        }
    })
});

app.get('/product', function(request, response){
    Product.find({}, function(err, products){
        if(err){
            response.status(500).send({error:"Could not find product"});
        }
        else{
            response.send(products);
        }
    });
});

//Makes the know in the console that it is running on PORT 3000.
app.listen(3000, function(){
    console.log("Jeks shop API running on Port 3000...");
});

//We are also using nodemon so we don't have to constantly update the server when adjusting the code