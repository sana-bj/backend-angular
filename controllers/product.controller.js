const productModel = require('../models/product.model')
const Product = require('../models/product.model')

const fs = require('fs')
const { json } = require('express/lib/response')
const jsforce = require("jsforce");

exports.list = (req, res) => {

    console.log('ooooooooooooooooooooo');
    var pwd = req.query.password
    var email = req.query.email;
    console.log(pwd);
    const conn = new jsforce.Connection({

        loginUrl: "https://login.salesforce.com/"
    });
    var token = 'Y25QT45SVi3rQ2Luu17mrMz51';


    var auth = true;
    conn.login(email, pwd + token,
        (err, result) => {
            if (err) {
                auth = false;
                return res.status(400).json({
                    status: 400,
                    message: 'user not foun'

                })
            }
            //console.log(res);
            console.log("Successfully logged in!");
            conn.query("SELECT Id, Name,price__c,image__c,Description__c FROM product_shop__c LIMIT 30", (err, result) => {
                if (err) {
                    return console.error("Failed to run SOQL query: ", err);
                }
                // Display query results
                const { records } = result;

                console.log(`Fetched ${records.length} records:`);
                records.forEach(record => {
                    console.log(`- ${record.Name} (${record.image__c})`);
                });
                return res.status(200).json(records);
            });

        }
    );

}


exports.list1 = (req, res, next) => {
    Product.find()
        .then((product) => {
            //res.render('index', { title: 'products' ,'products' : product}); // renvoie articles vers twig
            res.status(200).json({
                status: 200,
                result: product
            })

        })
        .catch((err) => {
            res.status(500).json(err)
        })

    //res.render('index', { title: 'Express' });
}

exports.show = (req, res) => {
    //console.log(req.params.id);
    Product.findOne({ _id: req.params.id })
        .then((product) => {
            if (!product) {
                res.status(404).json({
                    status: 404,
                    message: 'No product'
                })
            }
            // console.log(article)
            res.status(200).json({
                status: 200,
                result: product
            })
        })
        .catch((err) => {
            res.status(500).json({
                status: 500,
                message: 'EROOR when getting it'
            })
        })
}

exports.create = (req, res) => {
    // console.log(req.body);
    if (!req.file) {
        return;
    }
    const product = JSON.parse(req.body.product)
    delete product._id;
    var Product = new productModel({
        // ...req.body,
        ...product,
        image: `${req.protocol}://${req.get('host')}/images/products/${req.file.filename}`
    })

    Product.save()
        .then((product) => {
            res.status(200).json({
                status: 200,
                message: 'produit created'
            })

        })
        .catch((err) => {
            res.status(500).json({
                status: 500,
                message: 'produit not created'
            })

        })
}

exports.update = (req, res) => {
    const id = req.params.id
    var product = JSON.parse(req.body.product)
    if (req.file) {
        product.image = `${req.protocol}://${req.get('host')}/images/products/${req.file.filename}`
        productModel.findOne({ _id: id }, { image: true }, (err, product) => {
            if (err) {
                console.log(err)
                return;
            }
            const filename = product.image.split('/products')[1];
            fs.unlink(`public/images/products/${filename}`, (err) => {
                if (err) {
                    console.log(err.message)
                    return;
                }

            })

        })
    }
    productModel.updateOne({ _id: id }, {...product, _id: id }, (err, data) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: 'ERROR WHEN UPadted',
                error: err
            })

        }

        return res.status(200).json({
            status: 200,
            message: 'is UPadted',

        })
    })
}



exports.delete = (req, res) => {
    const id = req.params.id
    productModel.findByIdAndDelete({ _id: id })

    .then((product) => {
            //console.log(product)

            if (!product) {
                res.status(404).json({
                    status: 404,
                    message: 'no such product'
                })
            }
            res.status(200).json({
                status: 200,
                message: 'product delted'
            })



        })
        .catch((err) => {
            res.status(500).json({
                status: 500,
                message: 'no deleting  product'
            })

        })
}