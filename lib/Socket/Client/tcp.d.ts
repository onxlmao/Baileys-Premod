import { AbstractSocketClient } from './types';
export declare class TCPSocketClient extends AbstractSocketClient {
    private socket;
    private connected;
    get isOpen(): boolean;
    get isClosed(): boolean;
    get isClosing(): boolean;
    get isConnecting(): boolean;
    connect(): Promise<void>;
    close(): Promise<void>;
    restart(): Promise<void>;
    send(data: Uint8Array | string, cb?: (err?: Error) => void): boolean;
}
