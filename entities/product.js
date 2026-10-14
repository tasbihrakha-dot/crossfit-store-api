const { EntitySchema } = require('typeorm');

const product = new EntitySchema({
name: 'product',
tableName: 'products',

columns: {
    id: {
        primary: true,
        generated: true,
        type: 'int'
    },

    name: {
        type: 'varchar',
        length: 150
    },

    description: {
        type: 'text',
        nullable: true
    },

    price: {
        type: 'decimal',
        precision: 10,
        scale: 2
    },

    quantity: {
        type: 'int',
        default: 0
    },

    category: {
        type: 'varchar',
        length: 50
    }
}

});

module.exports = product;