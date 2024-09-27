const getAllProductsStatic = async (req, res, next) => {
  res.status(200).send('All Products Route static');
};

const getAllProducts = async (req, res, next) => {
  res.status(200).send('All Products Route');
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
