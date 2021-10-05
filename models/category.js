import { Sequelize } from "sequelize";

import sequelize from "../utils/database.js";

const Category = sequelize.define("categories", {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  links: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

Category.removeAttribute("id");

export default Category;
