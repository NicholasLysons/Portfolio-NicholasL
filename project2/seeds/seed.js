const sequelize = require('../config/connection');
const { User, Need, Inventory } = require('../models');

const userData = require('./userData.json');
const inventoryData = require('./inventoryData.json');
const needData = require('./needData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  for (const inventory of inventoryData) {
    await Inventory.create({
      ...inventory
      
    });
  }
  for (const need of needData) {
    await Need.create({
      ...need
      
    });
  }
  process.exit(0);
};

seedDatabase();
