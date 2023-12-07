const customError = require("../../utils/errors/customError")
const { verifyRefreshToken } = require("../../utils/helpers/authHelpers/verifyRefreshToken")
const UpdateUserCommand = require('../commands/updateUserCommand')
const UpdateUserHandler = require('../commandHandlers/updateUserHandler')
const { hashPassword } = require("../../utils/helpers/hash")
const FetchUserByUsernameQuery = require("../queries/FetchUserByUsernameQuery")
const FetchUserByUsernameQueryHandler = require("../queryHandlers/fetchUserByUsernameHandler")

class ResetPasswordHandler {
    async handle(command){
        try{
            // incomplete input
            const resetToken = command.resetToken
            const username = command.username
            const password = command.password
            if(!resetToken || !username || !password){
                throw new customError("Missing required parameter. Expected resetToken, username and password", 400, 'warn')
            }
            //decode resetToken
            const decoded = await verifyRefreshToken(resetToken)
            if(decoded === false){
                throw new customError("Invalid username", 400, 'warn')
            }
            // if decoded username != input
            if(decoded !== username){
                throw new customError("Input data mismatch", 400, 'warn')
            }

            // if valid get user
            let user = undefined;
            const fetchByUsernameQuery = new FetchUserByUsernameQuery(decoded);
            const fetchByUsernameQueryHandler = new FetchUserByUsernameQueryHandler()
            user = await fetchByUsernameQueryHandler.handle(fetchByUsernameQuery);
            console.log("In handler",user)
            if(!user){
                throw new customError("User not found", 404, 'warn');
            }
            
            // hash pswd and remove resetToken
            const hashedPassword = await hashPassword(password);
            user.password = hashedPassword
            user.resetToken = ""

            // update user
            const updateUserCommand = new UpdateUserCommand(user)
            const updateUserHandler = new UpdateUserHandler()
            await updateUserHandler.handle(updateUserCommand)
            
            // return
            return {
                "message": "password reset successfully!"
            }
        }catch(error){
            console.log(error)
            throw error
        }
        

    }
}

module.exports=ResetPasswordHandler