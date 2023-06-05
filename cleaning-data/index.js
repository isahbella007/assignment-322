const fs = require('fs')

// Read file: 
const data = fs.readFileSync('./ratemds/ratemds_1.json')
const doctors = JSON.parse(data)

doctors.forEach((doctor) => { 
    doctor.doctorName = doctor.doctorName.trim()
    doctor.doctorLocation = titleCase(doctor.doctorLocation)
    console.log(doctor.doctorLocation)
})

const cleanedData = JSON.stringify(doctors, null, 2);
fs.writeFileSync('./ratemds/ratemds_1.json', cleanedData);


function titleCase(str) {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
}