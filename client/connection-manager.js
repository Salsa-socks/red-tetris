class ConnectionManager {
    constructor(tetris_manager) {
        this.conn = null;
        this.peers = new Map;
        this.tetris_manager = tetris_manager;
        this.localtetris = [...tetris_manager.instances][0];
    }

    connect(address) {
        this.conn = new WebSocket(address);

        this.conn.addEventListener('open', () => {
            console.log('connection est.');
            this.init_session();
            this.watch_events();
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

    watch_events() {
        const local = this.localtetris;
        const player = local.player;
        ['pos', 'matrix', 'score'].forEach(prop => {
            player.events.listen(prop, value => {
                this.send({
                    type: 'state-update',
                    fragment: 'player',
                    state: [prop, value],
                });
            });
        });

        const arena = local.arena;
        ['matrix'].forEach(prop => {
            arena.events.listen(prop, value => {
                this.send({
                    type: 'state-update',
                    fragment: 'arena',
                    state: [prop, value],
                });
            });
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

    update_peer(id, frag, [key, prop]) {
        if (!this.peers.has(id)) {
            console.error('Client does not exist: ', id);
            return;
        }

        const tetris = this.peers.get(id);
        tetris[fragment][prop] = value;

        if (prop === 'score') {
            tetris.update_score(value);
        } else {
            tetris.draw();
        }
    }

    receive(msg) {
        const data = JSON.parse(msg);
        if (data.type === 'session-created') {
            window.location.hash = data.id;
        } else if (data.type === 'session-broadcast') {
            this.update_manager(data.peers);
        } else if (data.type === 'state-update') {
            this.update_peer(data.clientid, data.fragment, data.state);
        }
    }
    send(data) {
        const msg = JSON.stringify(data);
        console.log('Sending msg: ' + msg);
        this.conn.send(msg);
    }

}