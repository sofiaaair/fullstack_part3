const mongoose = require('mongoose')
mongoose.set('strictQuery', false)


// eslint-disable-next-line no-unused-vars
const url = process.env.MONGODB_URI

mongoose.connect(process.env.MONGODB_URI)
  .then( () => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{2}-\d{6,16}/.test(v) |
        /\d{3}-\d{6,16}/.test(v)
      },
      message: props => `${props.value} is not a valid number!`
    }
  }

})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)