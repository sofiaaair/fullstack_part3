const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@clusteroidi.pjyqale.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then( () => {

    const personSchema = new mongoose.Schema({
      name: String,
      number: String
    })

    const Person = mongoose.model('Person', personSchema)

    if (process.argv.length === 5){

      const person = new Person({
        name: name,
        number: number,
      })

      person.save().then(() => {
        console.log(`added ${name} ${number} to phonebook`)
        mongoose.connection.close()
      })} else {
      Person.find({}).then(
        data => {
          console.log('Phonebook: ')
          data.forEach(person => {
            console.log(`${person.name} ${person.number}`)})
          mongoose.connection.close()
        }
      )

    }



  })
