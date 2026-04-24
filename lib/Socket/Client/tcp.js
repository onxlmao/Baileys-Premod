"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCPSocketClient = void 0;
const net_1 = __importDefault(require("net"));
const types_1 = require("./types");
class TCPSocketClient extends types_1.AbstractSocketClient {
    constructor() {
        super(...arguments);
        this.socket = null;
        this.connected = false;
    }
    get isOpen() {
        var _a;
        return this.connected && !((_a = this.socket) === null || _a === void 0 ? void 0 : _a.destroyed);
    }
    get isClosed() {
        return !this.socket || this.socket.destroyed;
    }
    get isClosing() {
        return this.socket
            ? this.socket.destroying || this.socket.destroyed
            : true;
    }
    get isConnecting() {
        return !this.connected && !this.isClosed;
    }
    async connect() {
        if (this.socket && this.connected) {
            return;
        }
        const { hostname, port } = this.url;
        return new Promise((resolve, reject) => {
            const socket = net_1.default.connect(parseInt(port || '443'), hostname);
            socket.on('connect', () => {
                this.connected = true;
                this.socket = socket;
                this.emit('open');
                resolve();
            });
            socket.on('data', (data) => {
                this.emit('message', data);
            });
            socket.on('close', (hadError) => {
                this.connected = false;
                this.socket = null;
                this.emit('close', hadError);
            });
            socket.on('error', (err) => {
                if (!this.connected) {
                    reject(err);
                }
                else {
                    this.emit('error', err);
                }
            });
            socket.setMaxListeners(0);
            // timeout handling
            if (this.config.connectTimeoutMs) {
                socket.setTimeout(this.config.connectTimeoutMs, () => {
                    socket.destroy(new Error('Connection timed out'));
                });
            }
        });
    }
    async close() {
        if (!this.socket) {
            return;
        }
        this.socket.destroy();
        this.connected = false;
        this.socket = null;
    }
    async restart() {
        if (this.socket) {
            await new Promise(resolve => {
                this.socket.once('close', resolve);
                this.socket.destroy();
            });
            this.socket = null;
            this.connected = false;
        }
        await this.connect();
    }
    send(data, cb) {
        if (this.socket && this.connected) {
            const buffer = typeof data === 'string' ? Buffer.from(data) : data;
            const result = this.socket.write(buffer, cb);
            if (!result) {
                this.socket.once('drain', () => cb === null || cb === void 0 ? void 0 : cb());
            }
            return true;
        }
        cb === null || cb === void 0 ? void 0 : cb(new Error('Socket is not connected'));
        return false;
    }
}
exports.TCPSocketClient = TCPSocketClient;
