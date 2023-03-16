const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')


app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('body', function(req) {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const CreateId =() => {
    const number = Math.random(1000)
    return(
        Math.round(number*1000)
    )
}
let persons = [
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



app.get('/', (req, res) => {
    res.send('<h1>Hello!</h1>')
})

app.get('/api/persons', (req,res)=> {
    res.json(persons)

})

app.get('/api/persons/:id',(req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    
    if(person){
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    const exist = persons.find(person => person.name === body.name ) 

    if(exist) {
        return res.status(400).json({error: "Name must be unique"})
    }
    
    if (!body.name) {
        return res.status(400).json({error:"name is missing"})
    }

    if (!body.number) {
        return res.status(400).json({error: 'number is missing'})
    }
    
    const person = {
        id : CreateId(),
        name : req.body.name,
        number : req.body.number
    }

    persons.push(person)
    res.json(person)



    
})



app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.get('/info', (req,res) => {
    res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date(Date.now())}</p>`)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
