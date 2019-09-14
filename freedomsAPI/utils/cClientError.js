const HttpStatus = require('http-status-codes');

class ClientError extends Error {

    constructor(message, clientMessage, status = HttpStatus.INTERNAL_SERVER_ERROR) {
        super(message);
        this.clientMessage = clientMessage;
        this.status = status;
    }

}

module.exports = ClientError;