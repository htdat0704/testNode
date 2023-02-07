const siteTest = require("./test");

function route(app) {
  app.use("/test", siteTest);

  // app.get('/searchs', (req, res) => {
  //     res.render('searchs')
  // });
  // app.post('/searchs', (req, res) => {
  //     console.log(req.body);
  //     res.render('searchs')
  // });
}

module.exports = route;
