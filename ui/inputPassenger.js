const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // Load env variables
console.log('🔍 ENV USER:', process.env.DB_PASSWORD); // should now print "root"

const inquirer = require('inquirer');
const fs = require('fs');
const { insertPassenger } = require('../db/dbManager.js');

const inputJsonPath = path.join(__dirname, '../data/input.json');


const main = async () => {
    const answers = await inquirer.prompt([
        {name: 'name', message: 'Passenger Name:'},
        {name: 'passportNumber', message: 'Passport ID:'},
        {name: 'temperature', message: 'Temperature:'},
        {name: 'hasOverseasHistory', type: 'confirm', message: 'Overseas Travel History ?:'},
        {name: 'airport', message: 'Airport Code:'}
    ]);

    const passenger = {
        ...answers,
        temperature: parseFloat(answers.temperature),
        hasOverseasHistory: answers.hasOverseasHistory ? 1 : 0
    };

    // Insert into MySQL
    await insertPassenger(passenger);

    // Append to input.json
    let data = []
    if (fs.existsSync(inputJsonPath)) {
        data = JSON.parse(fs.readFileSync(inputJsonPath));
    }

    data.push(passenger);
    fs.writeFileSync(inputJsonPath, JSON.stringify(data, null, 2));

    console.log('✅ Passenger added to MySQL and input.json.');
};

main();