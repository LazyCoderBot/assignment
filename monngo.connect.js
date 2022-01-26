const mongoose = require('mongoose');
const mongoUri = `<<MONGO URL>>`;
try {
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    readPreference: 'secondaryPreferred'
  }, (err) => {
    if (err) {
      console.error('Not able to connect to MongoDB ❌', err);
    } else {
      console.info('Mongo Connected 💾');
    }
  });
} catch (e) {
  process.exit();
}

const mongoConnection = mongoose.connection;
module.exports = mongoConnection;