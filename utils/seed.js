const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { users, thoughts } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');
    // Delete the collections if they exist
    let usersCheck = await connection.db.listCollections({ name: 'users' }).toArray();
    if (usersCheck.length) {
      await connection.dropCollection('users');
    }

    let thoughtsCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
    if (thoughtsCheck.length) {
      await connection.dropCollection('thoughts');
    }

  const createdUsers = await User.insertMany(users);
  for (let i = 0; i < thoughts.length; i++) {
    const user = createdUsers.find((user) => user.username === thoughts[i].username);
    thoughts[i].userId = user._id;
  }
  const createdThoughts = await Thought.insertMany(thoughts);

  for (let thought of createdThoughts) {
    await User.findByIdAndUpdate(thought.userId, { $push: { thoughts: thought._id } });
  }

  

  // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.table(thoughts);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
