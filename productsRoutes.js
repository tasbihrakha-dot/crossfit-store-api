const express = require('express');
const router = express.Router();

const db = require('./db');
const Product = require('./entities/product');

const verifyToken = require('./middleware/auth.middleware');
const allowRoles = require('./middleware/role.middleware');

// عرض كل المنتجات: للمستخدم المسجل والأدمن
router.get('/', verifyToken, allowRoles('user', 'admin'), async (req, res, next) => {
    try {
        const products = await db.getRepository(Product).find();

        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
});

// إضافة منتج: للأدمن فقط
router.post('/', verifyToken, allowRoles('admin'), async (req, res, next) => {
    try {
        const { name, description, price, quantity, category } = req.body;

        if (
            typeof name !== 'string' ||
            !name.trim() ||
            price === undefined ||
            price === null ||
            price === '' ||
            !Number.isFinite(Number(price)) ||
            Number(price) < 0
        ) {
            return res.status(400).json({
                message: 'Valid name and price are required'
            });
        }

        if (
            quantity !== undefined &&
            (!Number.isInteger(Number(quantity)) || Number(quantity) < 0)
        ) {
            return res.status(400).json({
                message: 'Quantity must be a non-negative integer'
            });
        }

        const repository = db.getRepository(Product);

        const product = repository.create({
            name: name.trim(),
            description,
            price: Number(price),
            quantity: quantity === undefined ? 0 : Number(quantity),
            category
        });

        const savedProduct = await repository.save(product);

        res.status(201).json({
            message: 'Product added successfully',
            product: savedProduct
        });
    } catch (error) {
        next(error);
    }
});

// عرض منتج محدد: للمستخدم المسجل والأدمن
router.get('/:id', verifyToken, allowRoles('user', 'admin'), async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                message: 'Invalid product ID'
            });
        }

        const product = await db.getRepository(Product).findOneBy({ id });

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
});

// تعديل منتج: للأدمن فقط
router.put('/:id', verifyToken, allowRoles('admin'), async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                message: 'Invalid product ID'
            });
        }

        const repository = db.getRepository(Product);
        const product = await repository.findOneBy({ id });

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        const { name, description, price, quantity, category } = req.body;

        if (name !== undefined) {
            if (typeof name !== 'string' || !name.trim()) {
                return res.status(400).json({
                    message: 'Name must not be empty'
                });
            }

            product.name = name.trim();
        }

        if (price !== undefined) {
            if (
                price === '' ||
                !Number.isFinite(Number(price)) ||
                Number(price) < 0
            ) {
                return res.status(400).json({
                    message: 'Price must be a valid non-negative number'
                });
            }

            product.price = Number(price);
        }

        if (quantity !== undefined) {
            if (
                !Number.isInteger(Number(quantity)) ||
                Number(quantity) < 0
            ) {
                return res.status(400).json({
                    message: 'Quantity must be a non-negative integer'
                });
            }

            product.quantity = Number(quantity);
        }

        if (description !== undefined) {
            product.description = description;
        }

        if (category !== undefined) {
            product.category = category;
        }

        const updatedProduct = await repository.save(product);

        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        next(error);
    }
});

// حذف منتج: للأدمن فقط
router.delete('/:id', verifyToken, allowRoles('admin'), async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                message: 'Invalid product ID'
            });
        }

        const repository = db.getRepository(Product);
        const product = await repository.findOneBy({ id });

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        await repository.remove(product);

        res.status(200).json({
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;