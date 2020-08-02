class ConnectionManager {
    constructor() {
        this.conn = null;
    }

    connect(address) {
        this.con = new WebSocket(address);
    }
}