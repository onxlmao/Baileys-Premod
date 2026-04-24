import net from 'net'
import { AbstractSocketClient } from './types'

export class TCPSocketClient extends AbstractSocketClient {

        private socket: net.Socket | null = null
        private connected = false

        get isOpen(): boolean {
                return this.connected && !this.socket?.destroyed
        }
        get isClosed(): boolean {
                return !this.socket || this.socket.destroyed
        }
        get isClosing(): boolean {
                return this.socket
                        ? (this.socket as any).destroying || this.socket.destroyed
                        : true
        }
        get isConnecting(): boolean {
                return !this.connected && !this.isClosed
        }

        async connect(): Promise<void> {
                if (this.socket && this.connected) {
                        return
                }

                const { hostname, port } = this.url

                return new Promise((resolve, reject) => {
                        const socket = net.connect(parseInt(port || '443'), hostname)

                        socket.on('connect', () => {
                                this.connected = true
                                this.socket = socket
                                this.emit('open')
                                resolve()
                        })

                        socket.on('data', (data: Buffer) => {
                                this.emit('message', data)
                        })

                        socket.on('close', (hadError: boolean) => {
                                this.connected = false
                                this.socket = null
                                this.emit('close', hadError)
                        })

                        socket.on('error', (err: Error) => {
                                if (!this.connected) {
                                        reject(err)
                                } else {
                                        this.emit('error', err)
                                }
                        })

                        socket.setMaxListeners(0)

                        // timeout handling
                        if (this.config.connectTimeoutMs) {
                                socket.setTimeout(this.config.connectTimeoutMs, () => {
                                        socket.destroy(new Error('Connection timed out'))
                                })
                        }
                })
        }

        async close(): Promise<void> {
                if (!this.socket) {
                        return
                }

                this.socket.destroy()
                this.connected = false
                this.socket = null
        }

        async restart(): Promise<void> {
                if (this.socket) {
                        await new Promise(resolve => {
                                this.socket!.once('close', resolve)
                                this.socket!.destroy()
                        })
                        this.socket = null
                        this.connected = false
                }

                await this.connect()
        }

        send(data: Uint8Array | string, cb?: (err?: Error) => void): boolean {
                if (this.socket && this.connected) {
                        const buffer = typeof data === 'string' ? Buffer.from(data) : data
                        const result = this.socket.write(buffer, cb)

                        if (!result) {
                                this.socket.once('drain', () => cb?.())
                        }

                        return true
                }

                cb?.(new Error('Socket is not connected'))
                return false
        }
}
