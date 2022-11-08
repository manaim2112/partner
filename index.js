const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()

app.use(cors())
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use('/static', express.static('public'))

const abyanjihaz = require('./controllers/abyanjihaz')

app.use('/abyan-jihaz', abyanjihaz)


app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname, '/views', '/index.html'))
})


app.listen(3000, () => console.log(`http://localhost:3000`))