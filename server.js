require('dotenv').config();

const express = require('express');
const db = require('./db');

const productsRoutes = require('./productsRoutes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');

const verifyToken = require('./middleware/auth.middleware');
const errorHandler = require('./middleware/error.middleware');

const app = express();

app.use(express.json());

// مسارات المنتجات
app.use('/products', productsRoutes);

// مسارات المصادقة
app.use('/auth', authRoutes);

// مسارات المستخدم
app.use('/user', userRoutes);

// مسار محمي لاختبار التوكن
app.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({
        message: 'Access granted',
        user: req.user
    });
});

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.send('Welcome to CrossFit Store API!');
});

// مسار غير موجود
app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.statusCode = 404;
    next(error);
});

// معالج الأخطاء: يجب أن يكون بعد جميع المسارات
app.use(errorHandler);

const PORT = 5000;

async function startServer() {
    try {
        await db.initialize();

        console.log('Database connected successfully');

        app.listen(PORT, () => {
            console.log('Server is running on port ' + PORT);
        });
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
}

startServer();