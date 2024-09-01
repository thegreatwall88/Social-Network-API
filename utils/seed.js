const connection = require('../config/connection');
const { User, Thought } = require('../models');
const data = require('./data');


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

  const users = await User.insertMany(data);
  
  const thoughts = await Thought.insertMany([
    { thoughtText: "This is Khoi thought. MongoDB is fun", username: users[0].username },
    { thoughtText: "This is Lan thought. Why am I doing this?", username: users[1].username },
    { thoughtText: "This is Sofia thought. This game is so much fun", username: users[2].username },
    { thoughtText: "This is Christina thought. Welcome to Avatar World!", username: users[3].username },
    { thoughtText: "This is Vietvuive thought. What is it all about?", username: users[4].username },
    { thoughtText: "This is Linhtroc thought. I live in Montana", username: users[5].username },
  ]);

  users[0].thoughts.push(thoughts[0]._id);
  users[1].thoughts.push(thoughts[1]._id);
  users[2].thoughts.push(thoughts[2]._id);
  users[3].thoughts.push(thoughts[3]._id);
  users[4].thoughts.push(thoughts[4]._id);
  users[5].thoughts.push(thoughts[5]._id);

  users[0].friends.push(users[1]._id, users[2]._id);
  users[1].friends.push(users[0]._id);
  users[2].friends.push(users[2]._id, users[0]._id);
  users[3].friends.push(users[5]._id, users[0]._id);
  users[4].friends.push(users[4]._id, users[2]._id);
  users[5].friends.push(users[3]._id, users[0]._id);

  // Save the updated users
  await Promise.all(users.map(user => user.save()));
  
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
