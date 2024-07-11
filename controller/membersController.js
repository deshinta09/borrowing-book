class MembersController {
  static async login(req, res, next) {
    try {
      let { email, password } = req.body;
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MembersController;
