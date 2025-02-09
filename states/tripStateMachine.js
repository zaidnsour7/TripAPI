const { createMachine, createActor } = require('xstate');
const {States} = require("../enums/states")

const tripMachine = createMachine({
    id: 'trip',
    initial: States.CREATED, 
    states: {
        created: {
            on: {
                ACCEPT: States.ACCEPTED,
                NO_DRIVER: States.NO_DRIVER_FOUND,
            },
        },
        accepted: {
            on: {
                ARRIVE: States.ARRIVED,
                CANCEL: States.CANCELED, 
            },
        },
        no_driver_found: {
            type: 'final',
        },
        arrived: {
            on: {
                START: States.STARTED, 
                CANCEL: States.CANCELED
            },
        },
        started: {
            on: {
                COMPLETE: States.COMPLETED, 
                CANCEL: States.CANCELED, 
            },
        },
        completed: {
            type: 'final', 
        },
        canceled: {
            type: 'final', 
        },
    },
});

const tripActor = createActor(tripMachine);


module.exports = { tripActor };
