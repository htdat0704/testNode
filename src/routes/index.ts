import siteAuth from "./auth.js";
import siteTest from "./test.js";

function route(app: any) {
  app.use("/test", siteTest);
  app.use("/auth", siteAuth);

  // app.get('/searchs', (req, res) => {
  //     res.render('searchs')
  // });
  // app.post('/searchs', (req, res) => {
  //     console.log(req.body);
  //     res.render('searchs')
  // });
}

export default route;
