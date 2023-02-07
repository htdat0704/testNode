const TestService = require("../services/TestServices");
const ErrorHandler = require("../../utils/errorHandler");

class TestController {
  getOneUser = async (req, res, next) => {
    try {
      res.json({
        users: await TestService.searchDetail(req.params.id),
        success: true,
      });
    } catch (e) {
      return next(new ErrorHandler(e, 400));
    }
  };
}

module.exports = new TestController();
