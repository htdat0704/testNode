const TestService = require("../services/TestServices");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

class TestController {
  getOneUser = catchAsyncErrors(async (req, res, next) => {
      res.json({
        users: await TestService.searchDetail(req.params.id),
        success: true,
      });
  });
}

module.exports = new TestController();
