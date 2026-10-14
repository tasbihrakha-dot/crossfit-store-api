const { DataSource } = require('typeorm');
const User = require('./entities/user');
const Product = require('./entities/product');

const db = new DataSource({
type: 'postgres',
host: '127.0.0.1',
port: 5432,
username: 'postgres',
password: '22446688',
database: 'crossfit-store',
synchronize: true,
logging: false,
entities: [User, Product]
});

module.exports = db;