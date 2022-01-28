const router = require('express').Router();
const bcrypt = require('bcryptjs/dist/bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {
    // Validate data before we add user 
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if user already exists 
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists'); 

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt); 

    // Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    });

    try {
        const savedUser = await user.save(); 
        res.send({ user: user._id }); 
    } catch(err) {
        res.status(400).send(err); 
    }
});

// LOGIN 
router.post('/login', async (req, res) => {
    // Validate data before we login 
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if user already exists 
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email doesn\'t exist'); 

    // Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

    // Create and assign a token 
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token); 
})

module.exports = router; 