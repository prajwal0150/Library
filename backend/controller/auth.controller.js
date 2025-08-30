import User from '../model/User.js';

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export async function Loginuser(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                password:user.password
            }
        });
    } catch (error) {
        console.error('Login Error:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}


export async function Register(req, res) {
    console.log("i am here")
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    if (role && !['borrower', 'librarian'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role. Must be "borrower" or "librarian".' });
    }
    try {
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: 'Email already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, name, role: role || 'borrower' });
        await user.save();
        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        return res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register Error:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}