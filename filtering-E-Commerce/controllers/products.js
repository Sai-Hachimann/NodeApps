const Product = require('../models/product');

const getAllProductsStatic = async (req, res, next) => {
  const products = await Product.find({}).sort('name');
  res
    .status(200)
    .json({ products: products, numberOfProducts: products.length });
};

const getAllProducts = async (req, res, next) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  let queryParameters = {};

  if (featured) {
    queryParameters.featured = featured === 'true' ? true : false;
  }
  if (company) {
    queryParameters.company = company;
  }
  if (name) {
    queryParameters.name = { $regex: name, $options: 'i' };
  }

  if (numericFilters) {
    const operatorsMap = {
      '>': '$gt',
      '<': '$lt',
      '=': '$eq',
      '<=': '$lte',
      '>=': '$gte',
    };
    const regex = /\b(<|>|<=|>=|=)\b/g;
    let filter = numericFilters.replace(
      regex,
      (match) => `-${operatorsMap[match]}-`
    );

    const options = ['price', 'rating'];
    filter = filter.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryParameters[field] = { [operator]: Number(value) };
      }
    });
    console.log(queryParameters);
  }

  let result = Product.find(queryParameters);
  if (sort) {
    const sortedParameters = sort.split(',').join(' ');
    // console.log(sortedParameters);
    result = result.sort(sortedParameters);
  } else {
    result = result.sort('createdAt');
  }
  if (fields) {
    const selectedFields = fields.split(',').join(' ');
    result = result.select(selectedFields);
  }

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const products = await result;
  res
    .status(200)
    .json({ products: products, numberOfProducts: products.length });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
