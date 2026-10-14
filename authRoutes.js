const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('./db');
const User = require('./entities/user');

const router = express.Router();

// Register: تسجيل حساب جديد
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (
            typeof name !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: 'Name, email and password are required'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters'
            });
        }

        const repository = db.getRepository(User);
        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await repository.findOneBy({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = repository.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: 'user'
        });

        const savedUser = await repository.save(user);

        const token = jwt.sign(
            {
                id: savedUser.id,
                role: savedUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: savedUser.id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role
            }
        });
    } catch (error) {
        next(error);
    }
});

// Login: تسجيل الدخول
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // التحقق من البيانات
        if (
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const repository = db.getRepository(User);

        const user = await repository.findOneBy({
            email: email.trim().toLowerCase()
        });

        // التأكد من وجود الحساب وصحة كلمة المرور
        if (
            !user ||
            !(await bcrypt.compare(password, user.password))
        ) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // إنشاء Token للمستخدم
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;