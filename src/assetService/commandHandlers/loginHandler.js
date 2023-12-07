const customError = require('../../utils/errors/customError')
const ValidateUserLogin = require('../commands/validateUserLogin')
const ValidateUserLoginHandler = require('../commandHandlers/validateUserLoginHandler')
const { getAuthTokens } = require('../../utils/helpers/authHelpers/getTokens')
const UpdateUserCommand = require('../commands/updateUserCommand')
const UpdateUserHandler = require('../commandHandlers/updateUserHandler')

class LoginCommandHandler {
    async handle(command){
        try{
            console.log("Inside handler")
            const payload = command.payload

            // check if all fields are available - username and pswd
            if(!payload.username || !payload.password){
                throw new customError("Missing required parameter. Expecting username and password", 400, 'warn')
            }
            // check valid user - DB query
            const validateUserLogin = new ValidateUserLogin(payload)
            const validateUserLoginHandler = new ValidateUserLoginHandler()
            const userData = await validateUserLoginHandler.handle(validateUserLogin)
            if(userData === false){
                throw new customError("Invalid username/password", 401, 'warn')
            }
            // get auth tokens
            const {accessToken, refreshToken} = getAuthTokens(userData)
            // set refreshToken
            userData.refreshToken = refreshToken
            
            // update userData(refreshToken)
            const updateUserCommand = new UpdateUserCommand(userData)
            const updateUserHandler = new UpdateUserHandler()
            await updateUserHandler.handle(updateUserCommand)

            // return accessToken with username
            return {
                username : userData.username,
                accessToken : accessToken,
                refreshToken: refreshToken
            }

        }catch(error){
            throw error
        }
    }
}


module.exports = LoginCommandHandler;