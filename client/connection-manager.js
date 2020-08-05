class ConnectionManager {
    constructor() {
        this.conn = null;
    }

    connect(address) {
        this.conn = new WebSocket(address);

        this.conn.addEventListener('open', () => {
            console.log('connection est.');

            this.send({
                type: 'Bobbers',
            });
        });

        this.conn.addEventListener('message', event => {
            console.log('Received msg: ', event.data);
        });
    }
    receive(msg) {
        const data = JSON.parse(msg);
        if (data.type === 'Bobbers') {
            window.location.hash = data.id;
        }
    }
    send(data) {
        const msg = JSON.stringify(data);
        console.log('Sending msg: ' + msg);
        this.conn.send(msg);
    }
}