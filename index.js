require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')
const morgan = require('morgan')



app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('body', function(req) {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



/*let persons = [
    {
        id : 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id : 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"        
    },
    {
        id : 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id : 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]
*/


app.get('/', (req, res) => {
    res.send('<h1>Hello!</h1>')
})

app.get('/api/persons', (req,res)=> {
    Person.find({}).then(
        person => {
            res.json(person)
        }
    )

})

app.get('/api/persons/:id',(req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person){
        res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))

})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({error:"name is missing"})
    }

    if (!body.number) {
        return res.status(400).json({error: 'number is missing'})
    }
    
    const person = new Person({
        name : body.name,
        number : body.number
    })
    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
    .catch(error => next(error))
    
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
      .then(updatedPerson => {
        res.json(updatedPerson)
      })
      .catch(error => next(error))
  })


app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (req,res) => {
    Person.find({}).then(data => {
    res.send(`
    <p>Phonebook has info for ${data.length} people</p>
    <p>${new Date(Date.now())}</p>`)
}).catch(error => next(error))
})



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if(error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }
  
    next(error)
  }
app.use(errorHandler)
  
