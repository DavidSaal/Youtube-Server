import express from "express";
import cors from "cors";
import sequelize from "./utils/database.js";
import router from "./routes/routes.js";

const port = process.env.PORT || 80;

const app = express();
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json({ limit: "10mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(router);

sequelize.sync();

app.listen(port, () => {
  console.log(`CORS-enabled web server listening on port ${port}`);
});
