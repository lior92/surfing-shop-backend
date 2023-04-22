const router = require('express').Router();

const {sendMsg,getMessage,deleteMsg} = require('../controllers/client_support_controller')


router.post('/send_msg',sendMsg)
router.get('/get_msg',getMessage)
router.delete('/delete_chat',deleteMsg)

module.exports = router