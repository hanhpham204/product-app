const express = require('express');
const path = require('path');
const app = express();


app.use((req, res, next) => {
  res.locals.query = req.query;
  next();
});

const productRoutes = require('./routes/productRoutes');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', productRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});