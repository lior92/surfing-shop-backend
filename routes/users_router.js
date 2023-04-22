const router = require('express').Router();
const registeredAuth = require('../middleware/users_auth/registeredAuth');
const adminAuth = require('../middleware/users_auth/adminAuth');

const {registerUser,loginUser,getUser,getAllUsers,updateUser,deleteUser,authToken} = require('../controllers/user_controller')


router.post('/register',registerUser );
router.post('/login',loginUser);
router.get('/get_user/:user_id',registeredAuth,getUser)
//only admin can get all users
router.get('/all_users',adminAuth,getAllUsers)
router.put('/update_user',registeredAuth,updateUser)
router.delete('/delete_user',registeredAuth,deleteUser)
router.get('/auth',authToken);

module.exports = router;
