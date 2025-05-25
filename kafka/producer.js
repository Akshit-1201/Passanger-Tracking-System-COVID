const { Kafka } = require('kafkajs');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Preparing Kafka
const kafka = new Kafka({
    clientId: 'airport-producer',
    brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();
const inputJsonPath = path.join(__dirname, '../data/input.json');

const produceMessages = async () => {
    await producer.connect();

    const passengers = JSON.parse(fs.readFileSync(inputJsonPath));

    for (const passenger of passengers) {
        await producer.send({
            topic: process.env.KAFKA_TOPIC,
            messages: [{ value: JSON.stringify(passenger) }]
        });

        console.log(`🚀 Sent: ${passenger.name}`);
    }

    await producer.disconnect();
};

produceMessages();