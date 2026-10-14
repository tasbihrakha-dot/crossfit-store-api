const express = require('express');
const router = express.Router();

const db = require('./db');
const User = require('./entities/user');

const verifyToken = require('./middleware/auth.middleware');
const allowRoles = require('./middleware/role.middleware');

// عرض بيانات المستخدم المسجل دخوله
router.get('/me', verifyToken, async (req, res, next) => {
    try {
        const user = await db.getRepository(User).findOneBy({
            id: req.user.id
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        next(error);
    }
});

// مسار خاص بالمستخدم العادي فقط
router.get(
    '/dashboard',
    verifyToken,
    allowRoles('user'),
    (req, res) => {
        res.status(200).json({
            message: 'Welcome to the user dashboard',
            user: req.user
        });
    }
);

module.exports = router;