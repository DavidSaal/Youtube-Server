import Category from "../models/category.js";

const addCategory = (req, res) => {
  let categoryName = req.body.category;
  let email = req.body.email;
  if (!categoryName) {
    return res.status(400).json({ message: "Category name not provided" });
  } else if (!email) {
    return res.status(400).json({ message: "Email not provided" });
  } else {
    Category.findOne({
      where: {
        email: email,
        category: categoryName,
      },
    }).then((category) => {
      if (category) {
        return res.status(409).json({ message: "Category already exists" });
      } else {
        return Category.create({
          category: categoryName,
          email: email,
        })
          .then(() => {
            res.status(200).json({ message: "Category created" });
          })
          .catch((err) => {
            console.log("error", err);
            res.status(502).json({ message: "Error while creating category" });
          });
      }
    });
  }
};

const getCategories = (req, res) => {
  let email = req.body.email;
  if (!email) {
    return res.status(400).json({ message: "User not provided" });
  } else {
    Category.findAll({
      where: {
        email: email,
      },
    })
      .then((categories) => {
        res.status(200).json({ message: "Ok", categories: categories });
      })
      .catch((err) => {
        console.log("error", err);
        res.status(502).json({ message: "Error while getting categories" });
      });
  }
};

export { addCategory, getCategories };
