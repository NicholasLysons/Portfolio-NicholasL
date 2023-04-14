
const router = require('express').Router();
const { User, Need, Inventory } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const inventoryData = await Inventory.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const needData = await Need.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const inventory = inventoryData.map((inv) => inv.get({ plain: true }));
    const needs = needData.map((need) => need.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      inventory, 
      needs,
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [ Inventory, Need ]
    });

    const user = userData.get({ plain: true });
    console.log(user);

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});






module.exports = router;
