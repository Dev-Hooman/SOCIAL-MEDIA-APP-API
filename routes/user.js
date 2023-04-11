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
    SubscribedUser Registeration 

    User Login
    Admin Login
    SubscribedUser Login 

    User Protected Route
    Admin Protected Route
    SubscribedUser Protected Route


*/

//Register routes
router.post('/register-user', async (req, res) => {
    await userResgister(req.body, 'user', res)
})

router.post('/register-admin', async (req, res) => {
    await userResgister(req.body, 'admin', res)
})

router.post('/register-subscribed-user', async (req, res) => {
    await userResgister(req.body, 'SubscribedUser', res)
})

//Login Routes
router.post('/login-user', async (req, res) => {
    await userLogin(req.body, "user", res)
})

router.post('/login-admin', async (req, res) => {
    await userLogin(req.body, "admin", res)
})

router.post('/login-subscribed-user', async (req, res) => {
    await userLogin(req.body, "SubscribedUser", res)
})

router.get("/profile", userAuth, async (req, res) => {
    console.log(req)

    return res.json(serializeUser(req.user))
})

//Protected Route
router.get('/user-route',userAuth, checkRole(["user"]), async (req, res) => {
    return res.json("Welcome user")
 
})

router.get('/admin-route', userAuth, checkRole(['admin']), async (req, res) => {
    return res.json("Welcome to Admin Page")
})


router.get('/subscribed-user-route', userAuth, checkRole(['SubscribedUser']), async (req, res) => {
    return res.json("Welcome SubscribedUser Page")


})

router.get('/super-admin-and-admin-route',userAuth, checkRole(['SubscribedUser','admin']), async (req, res) => {
    return res.json(serializeUser(req.user))
})

router.get('/test', (req, res) => {
    res.send("Test route")

})

module.exports = router;