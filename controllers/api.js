const Categories = require('../models/Categories');
const Products = require('../models/Products');

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
  const categories = await Categories.find().exec();
  res.status(200).json({ categories });
};

exports.getProducts = async (req, res) => {
  const products = await Products.find({ }).limit(100).exec();
  res.status(200).json({ products });
};

exports.getProductGender = async (req, res) => {
  const { productId } = req.params;

  const maleReg = /(Men|men|Male|male)/g;
  const femaleReg = /(Women|women|Female|female)/g;

  let products = await Products.find({ product_id: productId }).exec();

  products = products.map((product) => {
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

  res.status(200).json({ products });
};
