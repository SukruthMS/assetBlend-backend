const customError = require('../../utils/errors/customError')
const UserService = require('../models/users/users.model');

class CreateUserHandler {
  async handle(command) {
    try {
      const user = await UserService.createUser(command.userPayload)
      return user;
    } catch (error) {
        throw new customError('Failed to add user', 400, 'warn');
    }
  }
}

module.exports = CreateUserHandler;