const ColorThief = require('colorthief');

const Categories = require('../models/Categories');
const Products = require('../models/Products');
const { rgbToHex } = require('../utils/helper');

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (req, res) => {
  res.status(200).json({
    message: 'success',
  });
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Categories.find().exec();
    res.status(200).json({ categories });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Products.find().limit(100).exec();
    res.status(200).json({ products });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getColor = async (product) => ColorThief.getColor(product.image)
  .then((colors) => ({
    ...product,
    color: rgbToHex(colors[0], colors[1], colors[2]),
  }))
  .catch((err) => {
    console.log(`Image(${product.image}) color get error: `, err);
    return {
      ...product,
      color: null,
    };
  });

exports.getProductGender = async (req, res) => {
  try {
    const { productId } = req.params;

    const maleReg = /(Men|men|Male|male)/g;
    const femaleReg = /(Women|women|Female|female)/g;

    let products = await Products.find({ product_id: productId }).exec();

    const data = products.map((product) => {
      // if (product.gender) return product;

      delete product.gender;

      const productStr = JSON.stringify(product);

      if (femaleReg.exec(productStr) !== null) {
        product.gender = 'Female';
      } else if (maleReg.exec(productStr) !== null) {
        product.gender = 'Male';
      } else {
        product.gender = 'Unisex';
      }

      return {
        breadcrumbs: product.breadcrumbs,
        breadcrumb: product.breadcrumb,
        category_root: product.category_root,
        gender: product.gender,
        pid: product.pid,
        name: product.name,
        displayName: product.displayName,
        image: product.image,
        keywords: product.keywords,
        description: product.description,
        summary: product.summary,
        features: product.features,
        features_parsed: product.features_parsed,
      };
    });

    products = await Promise.all(data.map((product) => getColor(product)));

    res.status(200).json({ products });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
