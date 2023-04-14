const router = require('express').Router();
const { Need } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newNeed = await Need.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newNeed);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const needsData = await Need.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!needsData) {
      res.status(404).json({ message: 'No Item Found!' });
      return;
    }

    res.status(200).json(needsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
