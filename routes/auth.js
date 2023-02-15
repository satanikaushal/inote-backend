const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
let obj = {
    a: 'kaushal',
    number: 44,
}
res.json(obj);
})

module.exports = router;