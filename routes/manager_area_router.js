const router = require('express').Router();
//Manager middleware for more authentication
const adminAuth = require('../middleware/users_auth/adminAuth')


//from manager_controller
const{deleteUser,updateUser,addUser,getSupportMsg,sendSupportMsg,changeStatus,deleteChat} = require('../controllers/manager_controller')


//Users management
router.delete('/delete_user',adminAuth,deleteUser)
router.post('/add_user',adminAuth,addUser)
router.put('/update_user/:user_id',adminAuth,updateUser)

//Costumer support
router.get('/support',getSupportMsg)
router.post('/support',sendSupportMsg)
router.put('/change_status',changeStatus) 
router.delete('/delete_chat',deleteChat)



module.exports = router