// Import the mongoose module
const mongoose = require('mongoose')

// Set up default mongoose connection
const mongoDB = process.env.MONGO_URL
mongoose.set('strictQuery', true);
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Get the default connection
var db = mongoose.connection

//Bind connection to error event (to get notification of connection errors)
// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

