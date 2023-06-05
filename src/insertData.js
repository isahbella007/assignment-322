const db_connection = require("./connection")
const folderPaths = ['./mayo/' , './ratemds/']
const fs = require("fs")

folderPaths.forEach((folderPath) => { 
    const files = fs.readdirSync(folderPath)

    // console.log(files)

    // iterate through files 
    files.forEach((file) => { 
        // read every file
        const data = fs.readFileSync(`${folderPath}/${file}`)
        const doctors = JSON.parse(data)
        // console.log(doctors)

        doctors.forEach((doctor) => { 
            const {doctorImage, doctorName, doctorLink, doctorSpeciality, doctorLocation, doctorAOF} = doctor

            // Here I am checking if the speciality is an array, if it is, convert it to a string then check if it is empty
            const specialities = Array.isArray(doctorSpeciality) ? doctorSpeciality.join(', ') : doctorSpeciality;
            const docSpeciality = specialities === '' ? 'Not listed':specialities

            // Insert into the database 
            db_connection.query(`INSERT INTO doctors(name, speciality, location, image, link, area_of_interest) VALUES (?,?,?,?,?,?) `, 
            [doctorName, docSpeciality, doctorLocation, doctorImage, doctorLink, doctorAOF], (error, rows) => { 
                if(error){ 
                    console.log("Error entering data")
                }
            })

            // console.log(doctor)
        })
    })
})