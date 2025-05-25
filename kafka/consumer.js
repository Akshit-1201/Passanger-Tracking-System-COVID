const { Kafka } = require('kafkajs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const kafka = new Kafka({
    clientId: 'health-checker',
    brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: 'covid-checker-group' });

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ 
        topic: process.env.KAFKA_TOPIC,
        fromBeginning: true
    });

    await consumer.run({
        eachMessage: async ( {message} ) => {
            const passenger = JSON.parse(message.value.toString());
            
            if (passenger.temperature > 36 && passenger.hasOverseasHistory) {
                console.log(`⚠️ ALERT: ${passenger.name} may be infected! Quarantine required.`);
            } else {
                console.log(`✅ ${passenger.name} is safe to proceed.`);
            }
        }
    });
};

run();