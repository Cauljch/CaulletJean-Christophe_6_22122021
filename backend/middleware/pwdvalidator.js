const passwordSchema = require('../models/pwdvalidator');

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json(
        {error : 'Un mot de passe doit comporter :' 
        + passwordSchema.validate(req.body.password, {list : true })
    });
    }  else {
    next();
    }
}; 
