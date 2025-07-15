const express = require('express');
const router = express.Router();
const { addMember, deleteMember, getMember,updateMember,packageEnding,packageExpired,getOnlyMember, renewMember,appendRenewalHistory } = require('../controllers/memberController');




router.post('/AddMember', addMember);
router.post('/deleteMember/:id', deleteMember);
router.post('/updateMember/:id',updateMember);
router.post('/renewMember/:id',renewMember);
router.post('/appendRenewalHistory/:id', appendRenewalHistory);

router.get('/getMember', getMember);
router.get('/getOnlyMember', getOnlyMember);
router.get('/packageEnding',packageEnding)
router.get('/packageExpired',packageExpired)

module.exports = router;
