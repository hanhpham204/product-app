const Product = require('../models/productModel');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

exports.index = async (req, res) => {
  const products = await Product.getAll();
  res.render('products/index', { products });
};

exports.createForm = (req, res) => {
  res.render('products/create');
};

exports.create = async (req, res) => {
  const errors = validateProduct(req.body);

  if (errors.length > 0) {
    return res.render('products/create', { errors });
  }
  const file = req.file;
  const product = {
    id: uuidv4(),
    name: req.body.name,
    price: Number(req.body.price),
    unit_in_stock: Number(req.body.unit_in_stock),
    url_image: "/uploads/" + file.filename
  };

  await Product.create(product);
  res.redirect('/?msg=add_success');
};

exports.editForm = async (req, res) => {
  const product = await Product.getById(req.params.id);
  res.render('products/edit', { product });
};

exports.update = async (req, res) => {
  const { name, price, unit_in_stock } = req.body;

  try {
    // 1. Lấy dữ liệu cũ
    const old = await Product.getById(req.params.id);

    let imagePath = old.url_image;

    // 2. Nếu có upload ảnh mới
    if (req.file) {
      // 👉 XÓA ẢNH CŨ (fix lỗi path)
      if (old.url_image) {
        const oldPath = path.join(
          __dirname,
          '../public',
          old.url_image.replace(/^\//, '') // 🔥 fix lỗi dấu /
        );

        console.log("Deleting old image:", oldPath);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // 👉 LƯU ẢNH MỚI
      imagePath = 'uploads/' + req.file.filename;
    }

    // 3. Tạo object update
    const product = {
      id: req.params.id,
      name,
      price: Number(price),
      unit_in_stock: Number(unit_in_stock),
      url_image: imagePath
    };

    // 4. Update DB
    await Product.update(product);

    // 5. Redirect
    res.redirect('/?msg=update_success');

  } catch (err) {
    console.error(err);
    res.send("Lỗi update sản phẩm");
  }
};

exports.delete = async (req, res) => {
  try {
    // 1. Lấy sản phẩm từ DB
    const product = await Product.getById(req.params.id);

    // 2. Nếu có ảnh → xóa file trong public
    if (product && product.url_image) {
      const filePath = path.join(
        __dirname,
        '../public',
        product.url_image.replace(/^\//, '') // 🔥 fix lỗi dấu /
      );

      console.log("Deleting image:", filePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.log("File không tồn tại:", filePath);
      }
    }

    // 3. Xóa dữ liệu trong DynamoDB
    await Product.delete(req.params.id);

    // 4. Redirect
    res.redirect('/?msg=delete_success');

  } catch (err) {
    console.error(err);
    res.send("Lỗi khi xóa sản phẩm");
  }
};

exports.detail = async (req, res) => {
  const product = await Product.getById(req.params.id);
  res.render('products/detail', { product });
};

exports.index = async (req, res) => {
  const keyword = req.query.keyword;

  let products;

  if (keyword) {
    products = await Product.search(keyword);
  } else {
    products = await Product.getAll();
  }

  res.render('products/index', { products });
};

function validateProduct(data) {
  let errors = [];

  if (!data.name || data.name.trim() === "") {
    errors.push("Tên không được để trống");
  }

  if (!data.price || isNaN(data.price) || Number(data.price) <= 0) {
    errors.push("Giá phải là số > 0");
  }

  if (!data.unit_in_stock || isNaN(data.unit_in_stock)) {
    errors.push("Số lượng phải là số");
  }

  return errors;
}
