class Events {
    constructor() {
        this._listeners = new Set;
    }

    listen(name, callbk) {
        this._listeners.add({
            name,
            callbk,
        });
    }

    emit(name, ...data) {
        this._listeners.forEach(listener => {
            if (listener.name === name) {
                listener.callbk(...data);
            }
        });
    }
}