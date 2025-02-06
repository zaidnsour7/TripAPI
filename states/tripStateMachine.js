const { createMachine, createActor } = require('xstate');


const tripMachine = createMachine({
    id: 'trip',
    initial: 'created', 
    states: {
        created: {
            on: {
                ACCEPT: 'accepted',
                NO_DRIVER: 'no_driver_found',
            },
        },
        accepted: {
            on: {
                ARRIVE: 'arrived',
                CANCEL: 'canceled', 
            },
        },
        no_driver_found: {
            type: 'final',
        },
        arrived: {
            on: {
                START: 'started', 
                CANCEL: 'canceled'
            },
        },
        started: {
            on: {
                COMPLETE: 'completed', 
                CANCEL: 'canceled', 
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
