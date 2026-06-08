const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const signup = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });
        
        const token = jwt.sign({ id: newUser._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' });

        res.status(201).json({ 
            message: 'User created successfully',
            user: newUser,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
            message: 'Login successful',
            user,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Validate new password
        // const passwordValidation = AuthService.validatePassword(newPassword);
        // if (!passwordValidation.isValid) {
        //     return res.status(400).json({ message: passwordValidation.message });
        // }

        // Find user
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { password: hashedNewPassword },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(500).json({ message: 'Failed to update password' });
        }

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    try {
       const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : authHeader;

        if (!token) {
            return res.status(400).json({
                status: "failed",
                message: "No token provided"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        

        res.status(200).json({
            status: "success",
            message: "Logout successful. Please delete the token from your client storage."
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    signup,
    login,
    getProfile,
    changePassword,
    logout
};