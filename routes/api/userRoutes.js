const router = require('express').Router();
const { Thought, User } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .select('username email') 
      .populate('thoughts', '_id') 
      .populate('friends', '_id') 
      .lean();

    const friendCount = users.map(user => ({
      ...user,
      friendCount: user.friends.length,
    }));

    res.json(friendCount);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('thoughts')
      .populate('friends');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Other routes for GET by ID, PUT, DELETE, etc.


module.exports = router;
