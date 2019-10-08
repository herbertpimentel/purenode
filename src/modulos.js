const usuario = require("./modulos/usuario");

module.exports = app => {
  app.use("/usuario", usuario);
};
