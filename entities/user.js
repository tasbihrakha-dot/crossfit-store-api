const { EntitySchema } = require('typeorm');

const User = new EntitySchema({
name: 'User',
tableName: 'users',

columns: {
    id: {
        primary: true,
        generated: true,
        type: 'int'
    },

    name: {
        type: 'varchar',
        length: 100
    },

    email: {
        type: 'varchar',
        length: 150,
        unique: true
    },

    password: {
        type: 'varchar',
        length: 255
    },

    role: {
        type: 'varchar',
        length: 20,
        default: 'user'
    }
}

});

module.exports = User;