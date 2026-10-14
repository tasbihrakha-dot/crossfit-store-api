const jwt = require('jsonwebtoken');

// التحقق من هوية المستخدم
function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        // التأكد إن المستخدم بعت التوكن
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Access denied. Token is required'
            });
        }

        // استخراج التوكن
        const token = authHeader.split(' ')[1];

        // التحقق من صحة التوكن
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // حفظ بيانات المستخدم في الطلب
        req.user = decoded;

        // السماح باستكمال الطلب
        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
}

module.exports = verifyToken;