const passwordvalidator = require('passwordvalidator');

const passwordSchema = new passwordvalidator();

passwordSchema
    .is().min(8)
    .is().max(20)
    .has().lowercase()
    .has().uppercase()
    .has().digits(1)
    .has().not().spaces()

module.exports = passwordSchema;
