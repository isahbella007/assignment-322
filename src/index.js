const express = require('express')
const cors = require('cors')
const env = require('dotenv')
const db_connection = require('./connection')

env.config({path: "././.env"})

const app = express()
app.use(express.json())
app.use(cors())

app.listen(process.env.PORT, () => console.log('Server up and running'))

app.get("/api/assignment", (req,res) => { 
    const {speciality, location} = req.body
    console.log(speciality)

    db_connection.query(`select * from doctors where speciality LIKE '%${speciality}%' AND location LIKE '%${location}%' `, (err, rows) => { 
        if(err){ 
            console.log(err)
        }else{ 
            res.send(rows)
        }
    })
})