class Client {
    constructor(conn, id) {
        this.conn = conn;
        this.id = id;
        this.session = null;
    }

    broadcast(data) {
        if (!this.session) {
            throw new Error('Cannot braodcast moves outside of session');
        }

        data.clientid = this.id;

        this.session.clients.forEach(client => {
            if (this === client) {
                return;
            }
            client.send(data);
        });
    }

    send(data) {
        const msg = JSON.stringify(data);
        console.log('sending msg: ' + msg);
        this.conn.send(msg, function callbk(err) {
            if (err) {
                console.error('Message failed: ', msg, err);
            }
        });
    }
}

module.exports = Client;