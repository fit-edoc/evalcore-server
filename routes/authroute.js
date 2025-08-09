const expess = require("express")
const { register, login } = require("../controller/authController")


const router = expess.Router()



router.post("/register",register)
router.post("/login",login)


module.exports = router




