const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
  categoryid: Number,
  name: String,
  options: {
    attribute_canonicals_to_self: Number,
    display_at_related: Number,
    hide_parent_in_meta: Number,
    noindex: Number
  },
  rules: [
    {
      basis: String,
      refer: String,
      value: String,
      scope: Number
    }
  ],
  left_nav: [
    {
      name: String,
      children: [
        {
          altText: String,
          name: String,
          url: String
        }
      ]
    }
  ]
}, { timestamps: Boolean });

const Categories = mongoose.model('Categories', categoriesSchema);

module.exports = Categories;
