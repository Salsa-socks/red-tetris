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

function create_client(conn, id = create_id()) {
    return new Client(conn, id);
}

function broadcast_session(session) {
    const clients = [...session.clients];
    clients.forEach(client => {
        client.send({
            type: 'session-broadcast',
            peers: {
                you: client.id,
                clients: clients.map(client => client.id),
            },
        });
    })
}

function create_session(id = create_id()) {
    if (sessions.has(id)) {
        throw new Error('Session' + id + ' already exists.');
    }

    const session = new Session(id);
    console.log('Creating Session ', session);

    sessions.set(id, session);

    return session;
}

function get_session(id) {
    return sessions.get(id);
}

server.on('connection', conn => {
    console.log('Connected.');
    const client = create_client(conn);

    conn.on('message', msg => {
        console.log('MSG received:', msg);
        const data = JSON.parse(msg);

        if (data.type === 'create-session') {
            const session = create_session();
            session.join(client);
            client.send({
                type: 'session-created',
                id: session.id
            });
        } else if (data.type === 'join-session') {
            const session = get_session(data.id) || create_session(data.id);
            session.join(client);

            broadcast_session(session);
        } else if (data.type === 'state-update') {
            client.broadcast(data);
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
        broadcast_session(session);
    });
});