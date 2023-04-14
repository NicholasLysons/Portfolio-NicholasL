const User = require('./User');
const Need = require('./Need');
const Inventory = require('./Inventory');


User.hasMany(Need, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Need.belongsTo(User, {
    foreignKey: 'user_id'
});

User.hasMany(Inventory, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Inventory.belongsTo(User, {
    foreignKey: 'user_id'
});

module.exports = { User, Need, Inventory };