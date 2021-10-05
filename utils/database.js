import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "db_a7a5b7_davidsa",
  "a7a5b7_davidsa",
  "davidsaal1",
  {
    dialect: "mysql",
    host: "mysql5031.site4now.net",
    define: {
      timestamps: false,
    },
  }
);

export default sequelize;
