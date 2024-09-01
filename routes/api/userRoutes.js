const router = require('express').Router();
const { Thought, User } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .select('username email') // Select only the username and email fields
      .populate('thoughts', '_id') // Populate thoughts, selecting only the content field
      .populate('friends', 'username') // Populate friends, selecting only the username field
      .lean(); // Converts the Mongoose document to a plain JavaScript object
  
    // Add friendCount to each user
    const usersWithFriendCount = users.map(user => ({
      ...user,
      friendCount: user.friends.length, // Count of friends
    }));

    res.json(usersWithFriendCount);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a new user
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
