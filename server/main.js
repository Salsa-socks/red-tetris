const WebsocketServer = require('ws').Server;

const server = new WebsocketServer({ port: 9000 });

const sessions = new Map;

class Session {
    constructor(id) {
        this.id = id;
    }
}

server.on('connection', conn => {
    console.log('Connected.');

    conn.on('message', msg => {
        console.log('MSG received:', msg);

        if (msg === 'Bobbers loves us all') {
            const session = new Session('bobbing');
        }
    });

    conn.on('close', () => {
        console.log('Connection ended.');
    });
});