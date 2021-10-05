import Category from "../models/category.js";

const validYoutubeLink = (url) => {
  var p =
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/;
  return url.match(p) ? RegExp.$1 : false;
};

const addNewLink = (req, res) => {
  let categoryName = req.body.category;
  let email = req.body.email;
  let link = req.body.link;
  if (!categoryName) {
    return res.status(400).json({ message: "Category name not provided" });
  } else if (!email) {
    return res.status(400).json({ message: "Email not provided" });
  } else if (!link) {
    return res.status(400).json({ message: "Link not provided" });
  } else if (!validYoutubeLink(req.body.link)) {
    return res
      .status(400)
      .json({ message: "Please enter a valid youtube link" });
  } else {
    Category.findOne({
      where: {
        email: email,
        category: categoryName,
      },
    }).then((category) => {
      if (category) {
        if (category.links.includes(link)) {
          return res.status(409).json({ message: "Link already exists" });
        } else {
          Category.update(
            { links: category.links ? category.links + "," + link : link },
            {
              where: {
                email: email,
                category: categoryName,
              },
            }
          )
            .then(() => {
              res.status(200).json({
                message: "Link added successfully",
              });
            })
            .catch((err) => {
              console.log("error", err);
              res.status(502).json({ message: "Error while adding link" });
            });
        }
      } else {
        return Category.create({
          category: categoryName,
          email: email,
          links: link,
        })
          .then(() => {
            res.status(200).json({
              message: "Category created and link added successfully",
            });
          })
          .catch((err) => {
            console.log("error", err);
            res.status(502).json({ message: "Error while creating category" });
          });
      }
    });
  }
};

const deleteLink = (req, res) => {
  let categoryName = req.body.category;
  let email = req.body.email;
  let link = req.body.link;
  if (!categoryName) {
    return res.status(400).json({ message: "Category name not provided" });
  } else if (!email) {
    return res.status(400).json({ message: "Email not provided" });
  } else if (!link) {
    return res.status(400).json({ message: "Link not provided" });
  } else {
    Category.findOne({
      where: {
        email: email,
        category: categoryName,
      },
    }).then((category) => {
      if (category) {
        Category.update(
          {
            links: category.links
              .replace(link, "")
              .replace(/,+/g, ",")
              .replace(/^,|,$/g, ""),
          },
          {
            where: {
              email: email,
              category: categoryName,
            },
          }
        )
          .then(() => {
            res.status(200).json({
              message: "Link deleted successfully",
            });
          })
          .catch((err) => {
            console.log("error", err);
            res.status(502).json({ message: "Error while deleting link" });
          });
      }
    });
  }
};

export { addNewLink, deleteLink };
