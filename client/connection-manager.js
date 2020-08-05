class ConnectionManager {
    constructor(tetris_manager) {
        this.conn = null;
        this.peers = new Map;
        this.tetris_manager = tetris_manager;
    }

    connect(address) {
        this.conn = new WebSocket(address);

        this.conn.addEventListener('open', () => {
            console.log('connection est.');
            this.init_session();

        });

        this.conn.addEventListener('message', event => {
            console.log('Received msg: ', event.data);
            this.receive(event.data);
        });
    }

    update_manager(peers) {
        const me = peers.you;
        const clients = peers.clients.filter(id => me !== id);
        clients.forEach(id => {
            if (!this.peers.has(id)) {
                const tetris = this.tetris_manager.create_player();
                this.peers.set(id, tetris);
            }
        });
    }

    init_session() {
        const sessionid = window.location.hash.split('#')[1];
        if (sessionid) {
            this.send({
                type: 'join-session',
                id: sessionid,
            });
        } else {
            this.send({
                type: 'create-session',
            });
        }
    }

    receive(msg) {
        const data = JSON.parse(msg);
        if (data.type === 'session-created') {
            window.location.hash = data.id;
        } else if (data.type === 'session-broadcast') {
            this.update_manager(data.peers);
        }
    }
    send(data) {
        const msg = JSON.stringify(data);
        console.log('Sending msg: ' + msg);
        this.conn.send(msg);
    }
}