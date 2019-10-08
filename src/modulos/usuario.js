const router = require("express-promise-router")();
const db = require("../db");

const multer = require("multer");

module.exports = router;

router.get("/", async (req, res) => {
  // throw new Error("this cant be hapenning");
  const { rows } = await db.query("select * from pessoas limit 100");
  res.json(rows);
});

router.post("/upload-image", multer.single("campo_image"), async (req, res) => {
  //req.body
  //req.file

  // redimensiona a imagem
  await sharp(req.file.path)
    .resize(500)
    .jpeg({ quality: 70 })
    .toFile(
      path.resolve(req.file.destination, "resized", req.file.originalname)
    );

  // apagar a img do upload orignal
  //fs.unlinkSync(req.file.path)

  res.json(rows);
});
