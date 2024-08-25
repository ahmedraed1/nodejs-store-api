const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const price = { $gte: 20 };
  const products = await Product.find({}).sort("price");
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  const {
    featured,
    company,
    name,
    price,
    sort,
    fields,
    limit,
    skip,
    pages,
    numericFilter,
  } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
    // queryObject.name = name;
  }
  if (price) {
    queryObject.price = { $gte: price };
    // queryObject.price = price;
  }

  if (numericFilter) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilter.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    const options = ["price", "rating"];

    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");

      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  if (fields) {
    const filedList = fields.split(",").join(" ");
    result = result.select(filedList);
  }

  // if (limit) {
  //   const limitList = parseInt(limit);
  //   result = result.limit(limitList);
  // }

  // if (skip) {
  //   const skipList = parseInt(skip);
  //   result = result.skip(skipList);
  // }

  const page = Number(req.query.pages) || 1;
  const limitCards = 6;
  const skipCards = (page - 1) * limitCards;

  result = result.skip(skipCards).limit(limitCards);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
