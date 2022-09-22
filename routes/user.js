const router = require('express').Router()
const {
    userResgister,
    userLogin,
    userAuth,
    serializeUser,
    checkRole
} = require('../utils/Auth')
/* ...Details
    User Registration
    Admin Registration
    Super Admin Registeration 

    User Login
    Admin Login
    Super Admin Login 

    User Protected Route
    Admin Protected Route
    Super Admin Protected Route


*/

//Register routes
router.post('/register-user', async (req, res) => {
    await userResgister(req.body, 'seller', res)
})

router.post('/register-admin', async (req, res) => {
    await userResgister(req.body, 'admin', res)
})

router.post('/register-super-admin', async (req, res) => {
    await userResgister(req.body, 'SuperAdmin', res)
})


//Login Routes
router.post('/login-user', async (req, res) => {
    await userLogin(req.body, "seller", res)
})

router.post('/login-admin', async (req, res) => {
    await userLogin(req.body, "admin", res)
})

router.post('/login-super-admin', async (req, res) => {
    await userLogin(req.body, "SuperAdmin", res)
})

router.get("/profile", userAuth, async (req, res) => {
    console.log(req)

    return res.json(serializeUser(req.user))
})

//Protected Route
router.get('/seller-route',userAuth, checkRole(["seller"]), async (req, res) => {
    return res.json("Welcome Seller")
 
})

router.get('/admin-route', userAuth, checkRole(['admin']), async (req, res) => {
    return res.json("Welcome to Admin Page")
})


router.get('/super-admin-route', userAuth, checkRole(['SuperAdmin']), async (req, res) => {
    return res.json("Welcome Super Admin Page")


})

router.get('/super-admin-and-admin-route',userAuth, checkRole(['SuperAdmin','admin']), async (req, res) => {
    return res.json(serializeUser(req.user))
})

router.get('/test', (req, res) => {
    res.send("Test route")

})

module.exports = router;