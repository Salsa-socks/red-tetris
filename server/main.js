const WebsocketServer = require('ws').Server;
const Session = require('./session');
const Client = require('./client');

const server = new WebsocketServer({ port: 9000 });

const sessions = new Map;

function create_id(len = 7, chars = 'abcdefghijklmnpqrstwxyz0123456789') {
    let id = '';
    while (len--) {
        id += chars[Math.random() * chars.length | 0];
    }
    return id;
}

server.on('connection', conn => {
    console.log('Connected.');
    const client = new Client(conn);

    conn.on('message', msg => {
        console.log('MSG received:', msg);
        const data = JSON.parse(msg);

        if (data.type === 'Bobbers') {
            const id = create_id();
            const session = new Session(id);
            session.join(client);
            sessions.set(session.id, session);
            client.send({
                type: 'Bobbers',
                id: session.id
            });
        }
    });

    conn.on('close', () => {
        console.log('Connection ended.');
        const session = client.session;
        if (session) {
            session.leave(client);
            if (session.clients.size === 0) {
                sessions.delete(session.id);
            }
        }
    });
});