const express = require('express')
const path = require('path');
const productController = require('./controllers/productController')


const app = express();

app.set('view engine', 'pug')
app.get('/', productController.getData)
app.use(express.static(path.join(__dirname, './public')));

app.listen('2000', ()=>{
  console.log('started')
})