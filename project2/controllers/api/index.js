const router = require('express').Router();
const userRoutes = require('./userRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const needsRoutes = require('./needsRoutes');

router.use('/users', userRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/needs', needsRoutes);
module.exports = router;
