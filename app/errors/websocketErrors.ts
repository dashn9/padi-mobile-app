export class WebSocketNotExistOrOpenError extends Error {
    constructor(message = 'Websocket might not exist or already closed') {
        super(message);
        this.name = 'WebSocketNotExistOrOpenError';
    }
}
