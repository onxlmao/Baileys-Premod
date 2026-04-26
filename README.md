<div align="center">

# Baileys Premod

**A feature-enhanced WhatsApp Web API library for Node.js**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.0.0-brightgreen?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?logo=whatsapp&logoColor=white)](https://web.whatsapp.com/)

Maintained by [onxlmao](https://github.com/onxlmao) · Based on [Baileys](https://github.com/WhiskeySockets/Baileys) by Adhiraj Singh

</div>

---

## Table of Contents

- [About](#about)
- [Changelog / What's New](#changelog--whats-new)
- [Detailed Changelog](./Changelog.md)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Features](#features)
  - [Auto WhatsApp Version Fetch](#-auto-whatsapp-version-fetch)
  - [Group Messages Fix (Issue #58)](#-group-messages-fix-issue-58)
  - [AI Message Icon (Sparkle Badge)](#-ai-message-icon-sparkle-badge)
  - [Button Messages](#-button-messages)
  - [Interactive Messages (Native Flow)](#-interactive-messages-native-flow)
  - [List / Row Messages](#-list--row-messages)
  - [Handling Button & Menu Responses](#-handling-button--menu-responses)
  - [Album Messages](#-album-messages)
  - [Newsletter (Channel) Management](#-newsletter-channel-management)
  - [Audio & Voice Messages in Channels](#-sending-audio--voice-messages-to-a-channel)
  - [Custom Pairing Codes](#-custom-pairing-codes)
  - [Connection Optimization](#-connection-optimization)
- [Full Example](#full-example)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)
- [Credits & License](#credits--license)

---

## About

**Baileys Premod** is an enhanced fork of the Baileys WhatsApp Web library. It brings a collection of new features, critical bug fixes, and quality-of-life improvements that make it easier than ever to build WhatsApp bots, automation tools, and integrations.

The original Baileys library was created by [Adhiraj Singh](https://github.com/adiwajshing) and later maintained by [WhiskeySockets](https://github.com/WhiskeySockets/Baileys). This premod version builds on that solid foundation by addressing long-standing community issues and introducing powerful new capabilities that the upstream library lacks.

### Key Highlights

- Works with the **latest WhatsApp Web versions** via automatic version detection
- **Buttons, interactive messages, and list menus** now render correctly in **groups** (fixes issue #58)
- **AI sparkle icon** support for messages in both **private chats and groups**
- Full **newsletter (channel)** management API
- **Album/media group** message sending
- **Custom pairing codes** for streamlined device linking
- **Panel-ready** installation — works on Pterodactyl and other hosting panels without errors
- Zero external WhatsApp API dependency — uses the official WhatsApp Web protocol directly

---

## Changelog / What's New

### v7.2.0 — Panel-Ready & Group AI Fix

| Change | Details |
|--------|---------|
| Panel-ready installation | Package now installs without errors on any panel (Pterodactyl, etc.) — removed hardcoded `jimp` import, fixed `package.json` exports, removed `packageManager` lock |
| `ai: true` works in groups | AI sparkle icon now works in **both private chats and groups** via dual-layer approach — stanza node + proto-level `botMetadata` |
| Removed `botMessageSecret` | Previous random 32-byte secret caused WhatsApp servers to silently reject/stript messages — removed for reliability |
| `jimp` is now fully optional | `generateProfilePicture` uses dynamic import via `getImageProcessingLibrary()` — works with `sharp`, `jimp`, or neither |
| Added `MessageTypeKeys` | Runtime array of all valid message type keys (85 keys) — `MessageType` type was erased at compile time, now available as a value |
| Fixed TypeScript build errors | Removed invalid `nativeFlowResponseMessage` and `carouselCardResponseMessage` direct access on `IMessage` |
| Simplified package exports | Flattened `exports` map for better CJS/ESM compatibility across all bundlers and panel environments |

### v7.1.0 — Newer WhatsApp Compatibility

| Change | Details |
|--------|---------|
| `nativeFlowResponseMessage` direct extraction | Handles unwrapped flow responses from newer WhatsApp clients |
| `carouselCardResponseMessage` extraction | Detects carousel card taps via card index and row ID |
| `interactiveResponseMessage` fallback | Parses `paramsJson` when `body.text` is missing |
| `meMsg.messageContextInfo` safer default | Prevents proto serialization issues on newer WhatsApp — defaults to `{}` instead of `undefined` |
| Duplicate comment cleanup | Removed 2x duplicate AI icon comments from compiled JS |
| See [Changelog.md](./Changelog.md) for full details |

### v7.0.0 — Major Premod Release

| Change | Details |
|--------|---------|
| WhatsApp version | Updated to `2.3000.1036833994` with auto-fetch on startup |
| Group messages fix | Buttons, interactive messages, template messages, and list messages now display correctly in group chats |
| AI Message Icon | New `ai` parameter adds the sparkle/bot badge to messages — works in groups and private chats *(based on [nstar-y/bail](https://github.com/nstar-y/bail))* |
| Connection optimization | New `optimizeConnection` and `maxMediaUploadRetryCount` config options |
| Package rename | Published as `baileys-premod` to distinguish from the upstream package |
| Debug mode | New `debugMessageSend` option for verbose message-sending logs |
| Button response fix | `extractMessageContent` now properly handles `interactiveResponseMessage`, `buttonsResponseMessage`, `listResponseMessage`, and `templateButtonReplyMessage` |
| Carousel & shop extraction | `extractMessageContent` now extracts text from `carouselMessage` and `shopStorefrontMessage` interactive sub-types |
| Shop biz node fix | Shop messages (`shopStorefrontMessage`) now correctly receive the `<biz>` node for proper rendering |
| AdditionalNodes merge fix | `ai: true` no longer overrides user-provided `additionalNodes` — they are now merged together |
| botMessageSecret for newer WhatsApp | `ai: true` embeds `botMetadata` in `Message.messageContextInfo` for group compatibility |
| ViewOnce wrapper detection | Biz node detection now covers `listMessage` and `interactiveResponseMessage` wrapped in viewOnce messages |

---

## Installation

### Via npm

```bash
npm install github:onxlmao/Baileys-Premod
```

### Via GitHub (latest source)

Add to your `package.json`:

```json
{
  "dependencies": {
    "baileys": "github:onxlmao/baileys-premod"
  }
}
```

Then run:

```bash
npm install
```

### Importing

**ES Modules:**

```ts
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from 'baileys'
```

**CommonJS:**

```js
const { makeWASocket, useMultiFileAuthState, DisconnectReason, proto } = require('baileys')
// or
const makeWASocket = require('baileys').default
```

### Requirements

- **Node.js** >= 20.0.0
- No WhatsApp account, phone number, or API key is required — everything runs through the WhatsApp Web protocol

---

## Quick Start

Here's a minimal example to get a WhatsApp bot up and running with QR code authentication:

```ts
import { Boom } from '@hapi/boom'
import makeWASocket, { useMultiFileAuthState } from 'baileys'

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info')

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,        // print QR code to terminal
        // autoFetchVersion is enabled by default in baileys-premod
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update

        if (connection === 'close') {
            const shouldReconnect =
                (lastDisconnect?.error as Boom)?.output?.statusCode !==
                DisconnectReason.loggedOut

            if (shouldReconnect) {
                start() // auto-reconnect
            }
        }

        if (connection === 'open') {
            console.log('Connected successfully!')
        }
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]

        if (!msg.message || msg.key.fromMe) return

        // Simple echo bot with AI icon
        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text: `You said: _"${msg.message.conversation || ''}"_`,
                ai: true  // shows the AI sparkle icon on the message
            },
            { quoted: msg }
        )
    })
}

start()
```

### Pairing Code Authentication (No QR Scan)

If you prefer linking via a pairing code instead of scanning a QR code:

```ts
import makeWASocket, { useMultiFileAuthState } from 'baileys'
import readline from 'readline'

const question = (text: string) =>
    new Promise<string>((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        rl.question(text, (answer) => {
            rl.close()
            resolve(answer)
        })
    })

async function startWithPairingCode() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info')

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
    })

    sock.ev.on('creds.update', saveCreds)

    if (!sock.authState.creds.registered) {
        const phoneNumber = await question('Enter your phone number (with country code): ')
        const code = await sock.requestPairingCode(phoneNumber)
        console.log(`Pairing Code: ${code?.match(/.{1,4}/g)?.join('-')}`)
    }
}

startWithPairingCode()
```

---

## Configuration

Baileys Premod supports all standard Baileys configuration options, plus several new ones:

### Standard Options (Inherited)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `auth` | `AuthenticationState` | *required* | Authentication state object (use `useMultiFileAuthState`) |
| `printQRInTerminal` | `boolean` | `false` | Print QR code in the terminal for scanning |
| `browser` | `[string, string, string]` | Ubuntu Chrome | Browser description for connection |
| `waWebSocketUrl` | `string` | `wss://web.whatsapp.com/ws/chat` | WebSocket URL |
| `connectTimeoutMs` | `number` | `20000` | Connection timeout in milliseconds |
| `keepAliveIntervalMs` | `number` | `30000` | Keep-alive ping interval |
| `defaultQueryTimeoutMs` | `number` | `60000` | Default timeout for IQ queries |
| `emitOwnEvents` | `boolean` | `true` | Emit events for own actions |
| `syncFullHistory` | `boolean` | `false` | Request full chat history from phone |
| `markOnlineOnConnect` | `boolean` | `true` | Set online status on connect |
| `generateHighQualityLinkPreview` | `boolean` | `false` | Generate high-quality link preview thumbnails |
| `logger` | `ILogger` | pino logger | Custom logger instance |
| `options` | `AxiosRequestConfig` | `{}` | Axios options for HTTP requests |
| `patchMessageBeforeSending` | `function` | identity | Hook to modify messages before sending |
| `getMessage` | `function` | no-op | Fetch message from store for retry |
| `cachedGroupMetadata` | `function` | no-op | Cache group metadata to speed up sending |

### New Premod Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoFetchVersion` | `boolean` | `true` | Automatically fetch the latest WhatsApp Web version on startup. Fetches from `web.whatsapp.com/sw.js` and falls back to the bundled version if it fails |
| `optimizeConnection` | `boolean` | `true` | Enable connection optimization features including improved retry logic and keep-alive tuning |
| `maxMediaUploadRetryCount` | `number` | `3` | Maximum number of retry attempts for media upload operations. Increase this value on unstable networks |
| `debugMessageSend` | `boolean` | `false` | Enable verbose debug logging for message sending operations. Useful for troubleshooting message delivery issues |

### Example with All Options

```ts
const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    // baileys-premod specific options:
    autoFetchVersion: true,
    optimizeConnection: true,
    maxMediaUploadRetryCount: 5,
    debugMessageSend: false,
    // standard options:
    logger: pino({ level: 'debug' }),
    browser: ['My Bot', 'Chrome', '120.0.0'],
    connectTimeoutMs: 30_000,
    keepAliveIntervalMs: 25_000,
})
```

---

## Features

### 🔄 Auto WhatsApp Version Fetch

One of the most common issues with WhatsApp Web libraries is version mismatches that lead to disconnections or banned sessions. Baileys Premod solves this by **automatically fetching the latest WhatsApp Web version** every time your bot starts up.

When `autoFetchVersion` is enabled (which it is by default), the library fetches the service worker file from `web.whatsapp.com/sw.js`, extracts the `client_revision` value, and constructs the proper version tuple `[2, 3000, <revision>]`. If the fetch fails for any reason (network error, blocked request, etc.), it silently falls back to the bundled version, so your bot will always start without crashing.

```ts
// This is enabled by default — no extra code needed!
const sock = makeWASocket({
    auth: state,
    // autoFetchVersion: true  // default behavior
})
```

You can also use the utility function directly if you need the version at a custom time:

```ts
import { fetchLatestWaWebVersion } from 'baileys-premod'

const { version, isLatest } = await fetchLatestWaWebVersion({})
console.log('Latest WA version:', version) // e.g. [2, 3000, 1036833994]
```

### 🐛 Group Messages Fix (Issue #58)

**This is a critical bug fix.** In the original Baileys library, button messages, interactive messages, template messages, and list messages would not render correctly when sent to WhatsApp groups. The buttons and interactive elements would simply not appear, or the message would fail to deliver entirely.

The root cause was in the `bizNode` construction logic within `messages-send.ts`. The original code only checked the top-level `contentType` of the message, completely missing messages that were wrapped inside `viewOnceMessage`, `viewOnceMessageV2`, or `viewOnceMessageV2Extension` wrappers. Additionally, `templateMessage` was not handled at all.

Baileys Premod fixes this by performing a comprehensive deep check across all possible message wrappers and message types:

- `interactiveMessage` (direct and wrapped)
- `buttonsMessage` (direct and wrapped)
- `templateMessage` (direct and wrapped)
- `listMessage` (now works in groups, not just private chats)
- `interactiveResponseMessage` (flow responses)

All these message types now work correctly in **both group chats and private chats** without any special handling required from your code.

```ts
// These all now work perfectly in groups:
await sock.sendMessage(groupId, {
    text: "Pick an option:",
    buttons: [
        { buttonId: 'opt1', buttonText: { displayText: 'Option 1' }, type: 1 },
        { buttonId: 'opt2', buttonText: { displayText: 'Option 2' }, type: 1 },
    ],
    footer: 'Please select',
    headerType: 1
})

await sock.sendMessage(groupId, {
    text: "Choose a section:",
    interactiveButtons: [
        {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
                title: "Menu",
                sections: [
                    {
                        title: "Category",
                        rows: [
                            { title: "Item 1", id: "item1" },
                            { title: "Item 2", id: "item2" }
                        ]
                    }
                ]
            })
        }
    ]
})
```

### 🤖 AI Message Icon (Sparkle Badge)

> **Based on [nstar-y/bail](https://github.com/nstar-y/bail)** — the AI sparkle badge implementation was originally developed in the Bail fork and adapted for Baileys Premod.

WhatsApp displays a small sparkle ✨ icon next to messages that are identified as AI-generated (similar to how Meta AI messages appear). Baileys Premod lets you add this badge to **any message type** with a single `ai: true` parameter.

The implementation uses a dual-layer approach for maximum compatibility:

1. **Binary stanza layer**: A `<bot biz_bot="1"/>` XML node is appended to the message stanza. This is the primary mechanism used by WhatsApp to identify bot messages. It works reliably in **private chats**.

2. **Proto message layer**: `botMetadata` is embedded in `Message.messageContextInfo` inside the encrypted message payload. This is critical for **group chats**, where WhatsApp servers only relay the encrypted sender-key payload to participants — the stanza-level `<bot>` node does not survive server-side relay in groups. By embedding `botMetadata` in the proto, it is preserved through encryption and available when participants decrypt the message.

> **Why two layers?** In private chats, the message stanza goes directly from sender to receiver, so the `<bot>` stanza node arrives intact. In group chats, messages are encrypted with a sender key (`skmsg`) and relayed through WhatsApp servers — only the encrypted payload survives. The proto-level `botMetadata` ensures the AI icon works in both scenarios.

The AI icon works in **both private chats and group chats**, and it can be combined with any message type — text, image, video, buttons, interactive messages, etc.

#### Basic Usage

```ts
// Simple text with AI icon
await sock.sendMessage(jid, { text: "Hello from AI!", ai: true })
```

#### With Media

```ts
// Image with AI icon
await sock.sendMessage(jid, {
    image: { url: "https://example.com/photo.jpg" },
    caption: "Generated by AI",
    ai: true
})

// Video with AI icon
await sock.sendMessage(jid, {
    video: { url: "https://example.com/demo.mp4" },
    caption: "AI-powered video",
    ai: true
})
```

#### With Buttons

```ts
// Button message with AI icon
await sock.sendMessage(jid, {
    text: "Choose your language:",
    buttons: [
        { buttonId: 'en', buttonText: { displayText: 'English' }, type: 1 },
        { buttonId: 'es', buttonText: { displayText: 'Spanish' }, type: 1 },
        { buttonId: 'fr', buttonText: { displayText: 'French' }, type: 1 },
    ],
    footer: "AI Assistant",
    headerType: 1,
    ai: true
})
```

#### With Interactive Messages

```ts
// Interactive message with AI icon
await sock.sendMessage(jid, {
    text: "What would you like to do?",
    title: "AI Assistant",
    footer: "Powered by baileys-premod",
    interactiveButtons: [
        {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
                display_text: "Generate Image",
                id: "gen_img"
            })
        },
        {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
                display_text: "Visit Website",
                url: "https://example.com"
            })
        }
    ],
    ai: true
})
```

#### Advanced — Custom Bot Metadata

For more control over how the AI badge appears, you can pass a full `BotMetadata` object instead of `true`:

```ts
import { proto } from 'baileys-premod'

await sock.sendMessage(jid, {
    text: "Custom AI persona message",
    ai: {
        personaId: 'my-custom-bot',
        // Add additional bot metadata fields as needed
    } as proto.IBotMetadata
})
```

#### In Groups

The AI icon works identically in group chats. There is no special handling needed — just include `ai: true` in your message object:

```ts
const groupJid = "123456789@g.us"

await sock.sendMessage(groupJid, {
    text: "Hello group! I'm an AI bot 🤖",
    ai: true
})
```

### 🔘 Button Messages

> **Note:** `buttons` (classic buttons) are a **legacy/deprecated format** by WhatsApp. For new bots, prefer [`interactiveButtons`](#-interactive-messages-native-flow) which support more button types and are actively maintained by WhatsApp.

Button messages display up to 3 action buttons below a text message. They are perfect for simple menus, confirmations, and quick user interactions.

#### Text with Buttons

```ts
const buttons = [
    { buttonId: 'id1', buttonText: { displayText: 'Button 1' }, type: 1 },
    { buttonId: 'id2', buttonText: { displayText: 'Button 2' }, type: 1 },
    { buttonId: 'id3', buttonText: { displayText: 'Button 3' }, type: 1 }
]

const buttonMessage = {
    text: "Hi it's button message",
    footer: 'Hello World',
    buttons,
    headerType: 1
}

await sock.sendMessage(jid, buttonMessage)
```

#### Image with Buttons

```ts
const buttons = [
    { buttonId: 'buy', buttonText: { displayText: 'Buy Now' }, type: 1 },
    { buttonId: 'info', buttonText: { displayText: 'More Info' }, type: 1 }
]

const buttonMessage = {
    image: { url: "https://example.com/product.jpg" },
    caption: "Check out this product!",
    footer: "Limited Offer",
    buttons,
    headerType: 4  // IMAGE header type
}

await sock.sendMessage(jid, buttonMessage)
```

#### Video with Buttons

```ts
const buttons = [
    { buttonId: 'subscribe', buttonText: { displayText: 'Subscribe' }, type: 1 },
    { buttonId: 'skip', buttonText: { displayText: 'Skip' }, type: 1 }
]

const buttonMessage = {
    video: { url: "https://example.com/preview.mp4" },
    caption: "Watch the full video",
    footer: "New Episode",
    buttons,
    headerType: 5  // VIDEO header type
}

await sock.sendMessage(jid, buttonMessage)
```

#### Handling Button Responses

When a user taps a button, you'll receive a `buttonsResponseMessage` in the incoming message event:

```ts
sock.ev.on('messages.upsert', ({ messages }) => {
    const msg = messages[0]
    const response = msg.message?.buttonsResponseMessage

    if (response) {
        console.log('Button clicked:', response.selectedButtonId)
        console.log('Display text:', response.selectedDisplayText)
    }
})
```

### 💡 Interactive Messages (Native Flow)

Interactive messages are the **current and recommended** WhatsApp message format for buttons. They support rich button types including quick replies, URL buttons, and copy-code buttons. They use the native flow protocol and are actively maintained by WhatsApp.

#### Quick Reply + URL + Copy Code

```ts
const interactiveButtons = [
    {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
            display_text: "Quick Reply",
            id: "ID"
        })
    },
    {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
            display_text: "Open Website",
            url: "https://www.example.com/"
        })
    },
    {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
            display_text: "Copy Promo Code",
            id: "promo_2024",
            copy_code: "SAVE20"
        })
    }
]

const interactiveMessage = {
    text: "Hello World!",
    title: "this is the title",
    footer: "this is the footer",
    interactiveButtons
}

await sock.sendMessage(jid, interactiveMessage)
```

#### Interactive Message with Image Header

```ts
const interactiveButtons = [
    {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
            display_text: "Approve",
            id: "approve"
        })
    },
    {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
            display_text: "Reject",
            id: "reject"
        })
    }
]

const interactiveMessage = {
    image: { url: "https://example.com/photo.jpg" },
    caption: "Review this image",
    title: "Image Review",
    footer: "AI Moderation Bot",
    interactiveButtons,
    ai: true  // combine with AI icon
}

await sock.sendMessage(jid, interactiveMessage)
```

#### Interactive Message with Video Header

```ts
const interactiveButtons = [
    {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
            display_text: "Watch Full Video",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        })
    },
    {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
            display_text: "Remind Me Later",
            id: "remind"
        })
    }
]

const interactiveMessage = {
    video: { url: "https://example.com/clip.mp4" },
    caption: "New video is out!",
    title: "Video Alert",
    footer: "Subscribe for more",
    interactiveButtons
}

await sock.sendMessage(jid, interactiveMessage)
```

### 📋 List / Row Messages

List messages (also called single-select or row messages) display a button that opens a menu with multiple sections and rows. They are ideal for displaying a large number of options in a compact format.

#### Single Select List

```ts
const interactiveButtons = [
    {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
            title: "Choose a Category",
            sections: [
                {
                    title: "Technology",
                    highlight_label: "Popular",
                    rows: [
                        {
                            header: "📱",
                            title: "Smartphones",
                            description: "Latest phone reviews and news",
                            id: "tech_phones"
                        },
                        {
                            header: "💻",
                            title: "Laptops",
                            description: "Best laptops of the year",
                            id: "tech_laptops"
                        }
                    ]
                },
                {
                    title: "Entertainment",
                    rows: [
                        {
                            header: "🎬",
                            title: "Movies",
                            description: "Movie recommendations",
                            id: "ent_movies"
                        },
                        {
                            header: "🎮",
                            title: "Gaming",
                            description: "Game reviews and news",
                            id: "ent_gaming"
                        }
                    ]
                }
            ]
        })
    }
]

const interactiveMessage = {
    text: "What are you interested in?",
    title: "Content Preferences",
    footer: "Customize your feed",
    interactiveButtons
}

await sock.sendMessage(jid, interactiveMessage)
```

#### Handling List Responses

```ts
sock.ev.on('messages.upsert', ({ messages }) => {
    const msg = messages[0]
    const listResponse = msg.message?.listResponseMessage

    if (listResponse) {
        console.log('Selected row:', listResponse.title)
        console.log('Row ID:', listResponse.singleSelectReply?.selectedRowId)
    }
})
```

### 📥 Handling Button & Menu Responses

When users interact with your bot's buttons, interactive menus, or list messages, WhatsApp sends back response messages. Baileys Premod now properly extracts text from **all** response types via the `extractMessageContent` utility, so your bot can detect and route button clicks without any manual parsing.

This section covers how to handle every type of button and menu response that WhatsApp can send back to your bot.

#### Overview of Response Types

| Message Type | WhatsApp Field | When It's Sent | Key Data |
|---|---|---|---|
| `buttonsResponseMessage` | `buttonsResponseMessage` | User taps a native button (up to 3) | `selectedButtonId`, `selectedDisplayText` |
| `interactiveResponseMessage` | `interactiveResponseMessage` | User taps a native flow / quick reply button | `nativeFlowResponseMessage.paramsJson`, `body.text` |
| `listResponseMessage` | `listResponseMessage` | User selects a row from a list menu | `title`, `singleSelectReply.selectedRowId` |
| `templateButtonReplyMessage` | `templateButtonReplyMessage` | User taps a template button | `selectedDisplayText`, `selectedId` |

#### Detecting the Message Type

Every incoming message has a `message` object. You can use `getContentType` to determine which type of response you received:

```ts
import { getContentType } from 'baileys'

sock.ev.on('messages.upsert', ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const type = getContentType(msg.message)
    console.log('Received message type:', type)
    // type === 'interactiveResponseMessage' | 'buttonsResponseMessage' | 'listResponseMessage' | ...
})
```

#### Handling Native Flow / Interactive Button Responses

When a user taps a **native flow button** (the newer interactive message format), WhatsApp sends an `interactiveResponseMessage`. This is the most common response type when using `interactiveButtons`.

The response contains two important pieces of data: `body.text` which is the display text shown to the user (e.g. the button label or category title), and `nativeFlowResponseMessage.paramsJson` which contains the raw button data you originally set in `buttonParamsJson`.

```ts
sock.ev.on('messages.upsert', ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const response = msg.message.interactiveResponseMessage

    if (response) {
        // The display text the user saw (button label or category title)
        console.log('Display text:', response.body?.text)

        // Parse the button params to get the ID and any custom data
        if (response.nativeFlowResponseMessage?.paramsJson) {
            const params = JSON.parse(response.nativeFlowResponseMessage.paramsJson)
            console.log('Button ID:', params.id)
            console.log('Description:', params.description)

            // Route based on the button ID
            switch (params.id) {
                case 'cat_owner':
                    // Show owner commands
                    break
                case 'cat_downloader':
                    // Show downloader commands
                    break
                case 'cat_group':
                    // Show group management commands
                    break
            }
        }
    }
})
```

> **Tip:** The `paramsJson` field contains the exact JSON object you passed in `buttonParamsJson` when creating the button. This means you can include custom fields like `id`, `description`, or any other data to help identify which button was clicked and what action to take.

#### Handling Classic Button Responses

Classic buttons (sent with the `buttons` parameter) produce a `buttonsResponseMessage`:

```ts
sock.ev.on('messages.upsert', ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const response = msg.message.buttonsResponseMessage

    if (response) {
        console.log('Button ID:', response.selectedButtonId)
        console.log('Display text:', response.selectedDisplayText)

        // Route based on button ID
        switch (response.selectedButtonId) {
            case 'red':
                await sock.sendMessage(msg.key.remoteJid, { text: 'You chose Red!' })
                break
            case 'green':
                await sock.sendMessage(msg.key.remoteJid, { text: 'You chose Green!' })
                break
        }
    }
})
```

#### Handling List / Menu Responses

When a user selects a row from a **list message** (created with `single_select`), WhatsApp sends a `listResponseMessage`:

```ts
sock.ev.on('messages.upsert', ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const listResponse = msg.message.listResponseMessage

    if (listResponse) {
        console.log('Selected title:', listResponse.title)
        console.log('Row ID:', listResponse.singleSelectReply?.selectedRowId)
        console.log('Description:', listResponse.description)

        // Route based on the row ID
        switch (listResponse.singleSelectReply?.selectedRowId) {
            case 'tech_phones':
                await sock.sendMessage(msg.key.remoteJid, {
                    text: 'Latest smartphone reviews coming up!'
                })
                break
            case 'ent_movies':
                await sock.sendMessage(msg.key.remoteJid, {
                    text: 'Here are today\'s movie recommendations!'
                })
                break
        }
    }
})
```

#### Handling Template Button Responses

Template buttons (sent with `templateButtons`) produce a `templateButtonReplyMessage`:

```ts
sock.ev.on('messages.upsert', ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const tmplResponse = msg.message.templateButtonReplyMessage

    if (tmplResponse) {
        console.log('Selected ID:', tmplResponse.selectedId)
        console.log('Display text:', tmplResponse.selectedDisplayText)
    }
})
```

#### Universal Text Extraction with `extractMessageContent`

Baileys Premod provides the `extractMessageContent` utility which automatically extracts the display text from any message type, including all button and menu responses. This is the simplest way to get the user-facing text from any interaction:

```ts
import { extractMessageContent } from 'baileys'

sock.ev.on('messages.upsert', ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const extracted = extractMessageContent(msg.message)
    if (extracted?.conversation) {
        console.log('User interacted with:', extracted.conversation)
        // e.g. "👑 Owner" for an interactive response
        // e.g. "Option 1" for a button response
        // e.g. "Smartphones" for a list response
    }
})
```

The following table shows what `extractMessageContent` returns for each response type:

| Input Message Type | Extracted Result | Source Field |
|---|---|---|
| `interactiveResponseMessage` | `{ conversation: body.text }` | `response.body.text` |
| `interactiveResponseMessage` (fallback) | `{ conversation: params.id }` | `nativeFlowResponseMessage.paramsJson.id` |
| `nativeFlowResponseMessage` (direct) | `{ conversation: params.id }` | `nativeFlowResponseMessage.paramsJson.id` |
| `carouselCardResponseMessage` | `{ conversation: rowId }` or `{ conversation: "card:<index>" }` | `carouselCardResponseMessage.rowId` / `.cardIndex` |
| `buttonsResponseMessage` | `{ conversation: selectedDisplayText }` | `response.selectedDisplayText` |
| `listResponseMessage` | `{ conversation: title }` | `response.title` |
| `templateButtonReplyMessage` | `{ conversation: selectedDisplayText }` | `response.selectedDisplayText` |
| `interactiveMessage` | `{ conversation: body.text }` | `interactive.body.text` |
| `buttonsMessage` | `{ conversation: contentText }` | `buttons.contentText` |

#### Complete Bot Example with All Response Types

Here is a full working example that demonstrates sending buttons, receiving responses, and routing actions based on what the user clicked:

```ts
import makeWASocket, { useMultiFileAuthState, getContentType } from 'baileys'

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info')
    const sock = makeWASocket({ auth: state, printQRInTerminal: true })
    sock.ev.on('creds.update', saveCreds)

    // Send a menu when the user types .menu
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return
        const from = msg.key.remoteJid

        const type = getContentType(msg.message)

        // User typed a text command
        if (msg.message.conversation === '.menu') {
            await sock.sendMessage(from, {
                text: 'Choose a category:',
                title: 'Bot Menu',
                footer: 'Powered by baileys-premod',
                interactiveButtons: [
                    {
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({
                            display_text: '👑 Owner',
                            id: 'cat_owner',
                            description: 'self, public, setprefix...'
                        })
                    },
                    {
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({
                            display_text: '📥 Downloader',
                            id: 'cat_downloader',
                            description: 'yt, tiktok, ig...'
                        })
                    },
                    {
                        name: 'cta_url',
                        buttonParamsJson: JSON.stringify({
                            display_text: '🌐 Website',
                            url: 'https://example.com'
                        })
                    }
                ]
            })
            return
        }

        // User clicked an interactive / native flow button
        if (type === 'interactiveResponseMessage') {
            const response = msg.message.interactiveResponseMessage
            const bodyText = response?.body?.text
            const params = response?.nativeFlowResponseMessage?.paramsJson
                ? JSON.parse(response.nativeFlowResponseMessage.paramsJson)
                : null

            console.log(`Button clicked: ${bodyText} (id: ${params?.id})`)

            if (params?.id === 'cat_owner') {
                await sock.sendMessage(from, {
                    text: '👑 *Owner Commands*\n\n.setpublic\n.self\n.setprefix'
                }, { quoted: msg })
            } else if (params?.id === 'cat_downloader') {
                await sock.sendMessage(from, {
                    text: '📥 *Downloader Commands*\n\n.yt <url>\n.tiktok <url>\n.ig <url>'
                }, { quoted: msg })
            } else {
                await sock.sendMessage(from, {
                    text: `You selected: ${bodyText}`
                }, { quoted: msg })
            }
            return
        }

        // User clicked a classic button
        if (type === 'buttonsResponseMessage') {
            const response = msg.message.buttonsResponseMessage
            console.log(`Button: ${response?.selectedButtonId}`)
            await sock.sendMessage(from, {
                text: `You clicked: ${response?.selectedDisplayText}`
            }, { quoted: msg })
            return
        }

        // User selected a list row
        if (type === 'listResponseMessage') {
            const response = msg.message.listResponseMessage
            console.log(`List: ${response?.title} (${response?.singleSelectReply?.selectedRowId})`)
            await sock.sendMessage(from, {
                text: `You selected: ${response?.title}`
            }, { quoted: msg })
            return
        }
    })
}

start()
```

#### Quick Reference: Message Type to Response Type Mapping

| How You Send It | Response Type User Sends Back |
|---|---|
| `buttons: [...]` | `buttonsResponseMessage` |
| `interactiveButtons: [{ name: 'quick_reply', ... }]` | `interactiveResponseMessage` |
| `interactiveButtons: [{ name: 'single_select', ... }]` | `listResponseMessage` |
| `interactiveButtons: [{ name: 'cta_url', ... }]` | *(no response — opens URL directly)* |
| `interactiveButtons: [{ name: 'cta_copy', ... }]` | `interactiveResponseMessage` |
| `templateButtons: [...]` | `templateButtonReplyMessage` |
| Carousel card tap | `carouselCardResponseMessage` |

### 🖼️ Album Messages

Album messages allow you to send multiple images and videos as a grouped carousel in a single message. The recipient can swipe through the media items, similar to WhatsApp's native album feature.

```ts
// Send a mixed album of images and videos
const media = [
    {
        image: { url: "https://example.com/photo1.jpg" }
    },
    {
        image: { url: "https://example.com/photo2.jpg" }
    },
    {
        image: await fs.readFile("./local_photo.jpg")
    },
    {
        video: { url: "https://example.com/video.mp4" }
    }
]

await sock.sendMessage(jid, {
    album: media,
    caption: "Check out these photos and videos!",
    ai: true  // optional: add AI icon
})
```

> **Note:** Album messages support both images and videos. The `caption` parameter is optional and applies to the entire album. Each media item can be specified as a URL (`{ url: "..." }`), a local file path (`{ url: "/path/to/file" }`), or a `Buffer`.

### 📢 Newsletter (Channel) Management

Baileys Premod provides a full API for creating, managing, and sending messages to WhatsApp Channels (newsletters).

#### Creating a Newsletter

```ts
const metadata = await sock.newsletterCreate("My Channel Name")
console.log(metadata)
```

#### Getting Newsletter Info

```ts
// By invite code
const metadata = await sock.newsletterMetadata("invite", "xxxxx")

// By JID
const metadata = await sock.newsletterMetadata("jid", "abcd@newsletter")
console.log(metadata)
```

#### Sending Messages to a Channel

```ts
// Text message
await sock.sendMessage("abcd@newsletter", {
    text: "Hello channel subscribers!"
})

// Image message
await sock.sendMessage("abcd@newsletter", {
    image: { url: "https://example.com/banner.jpg" },
    caption: "New announcement"
})
```

#### Sending Audio & Voice Messages to a Channel

Baileys Premod fully supports sending both **voice notes (PTT)** and **regular audio (music/files)** to WhatsApp Channels. Audio messages in channels are uploaded unencrypted to the WhatsApp newsletter media endpoint and relayed via the plaintext protocol.

##### Using `sendMessage` (Standard API)

You can use the standard `sendMessage` with `@newsletter` JIDs — audio is automatically routed through the correct newsletter media upload path:

```ts
// Voice note (PTT) — displays as a playable voice message in the channel
await sock.sendMessage("abcd@newsletter", {
    audio: { url: "./voice_note.ogg" },
    ptt: true,    // push-to-talk = voice note
    mimetype: "audio/ogg",
})

// Music/audio file — displays as a downloadable audio in the channel
await sock.sendMessage("abcd@newsletter", {
    audio: { url: "./podcast_episode.mp3" },
    ptt: false,   // regular audio (not a voice note)
    mimetype: "audio/mpeg",
    caption: "Episode 42: Building WhatsApp Bots",
})

// Voice note from URL
await sock.sendMessage("abcd@newsletter", {
    audio: { url: "https://example.com/announcement.mp3" },
    ptt: true,
})

// Voice note from Buffer
import fs from 'fs'

const audioBuffer = fs.readFileSync("./recording.ogg")
await sock.sendMessage("abcd@newsletter", {
    audio: audioBuffer,
    ptt: true,
    mimetype: "audio/ogg",
})
```

##### Using `newsletterSendAudio` (Convenience API)

For a simpler and more ergonomic API, use the dedicated `newsletterSendAudio` function which validates the JID and applies sensible defaults:

```ts
// Voice note to channel (PTT is true by default)
await sock.newsletterSendAudio("abcd@newsletter", {
    url: "./voice_note.ogg"
})

// Music file with caption (set ptt to false)
await sock.newsletterSendAudio("abcd@newsletter", {
    url: "./song.mp3"
}, {
    ptt: false,
    caption: "Now playing: Chill Vibes",
    mimetype: "audio/mpeg",
})

// Voice note with custom waveform color
await sock.newsletterSendAudio("abcd@newsletter", {
    url: "./announcement.ogg"
}, {
    ptt: true,
    backgroundColor: "#25D366",   // green waveform
    mimetype: "audio/ogg",
})

// Pre-computed duration and waveform (skip auto-detection)
await sock.newsletterSendAudio("abcd@newsletter", {
    url: "./clip.mp3"
}, {
    ptt: true,
    seconds: 45.2,
    waveform: Buffer.from(/* 64-byte waveform data */),
})
```

##### Audio Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ptt` | `boolean` | `true` | `true` = voice note (playable inline), `false` = regular audio file (downloadable) |
| `mimetype` | `string` | auto-detected | Audio MIME type. Common: `audio/ogg`, `audio/mpeg`, `audio/mp4`, `audio/aac` |
| `caption` | `string` | none | Text caption (only shown for non-PTT audio, ignored for voice notes) |
| `backgroundColor` | `string` | none | Hex color for the PTT waveform visualization (e.g. `"#FF0000"`) |
| `seconds` | `number` | auto-computed | Audio duration in seconds. Auto-detected via `music-metadata` if omitted |
| `waveform` | `Buffer` | auto-computed | 64-byte waveform data for PTT visualization. Auto-generated via `audio-decode` if omitted |

##### Supported Audio Formats

WhatsApp Channels support the following audio formats for both voice notes and regular audio files:

- **OGG (Opus)** — Recommended for voice notes. Best quality-to-size ratio and native WhatsApp format.
- **MP3 (MPEG)** — Widely supported, works well for music and podcast distribution.
- **AAC (M4A)** — Good quality, commonly used for iOS recordings.
- **MP4 Audio** — Container format, works for both voice notes and music.

##### Important Notes

- Audio duration and waveform are **automatically computed** from the audio file when not explicitly provided. This requires the optional `music-metadata` and `audio-decode` packages to be installed.
- Voice notes (`ptt: true`) display a **playable inline player** in the channel with a waveform visualization. Regular audio (`ptt: false`) displays as a **downloadable file** with a caption.
- WhatsApp Channels do **not** support quoting/replying to messages. The `quoted` option is silently ignored for `@newsletter` JIDs.
- Disappearing/ephemeral messages are **not supported** in channels and will be silently ignored.
- Audio files are uploaded **unencrypted** to WhatsApp's newsletter media endpoint (`/newsletter/newsletter-audio`), unlike regular chat messages which use AES-256-CBC encryption.

#### Managing Newsletter Properties

```ts
// Update name
await sock.newsletterUpdateName("abcd@newsletter", "New Channel Name")

// Update description
await sock.newsletterUpdateDescription("abcd@newsletter", "Updated description text")

// Update profile picture (pass a Buffer)
await sock.newsletterUpdatePicture("abcd@newsletter", imageBuffer)

// Remove profile picture
await sock.newsletterRemovePicture("abcd@newsletter")
```

#### Follow / Unfollow

```ts
await sock.newsletterFollow("abcd@newsletter")
await sock.newsletterUnfollow("abcd@newsletter")
```

#### Mute / Unmute Notifications

```ts
await sock.newsletterMute("abcd@newsletter")
await sock.newsletterUnmute("abcd@newsletter")
```

#### React to Channel Messages

```ts
// To find the message ID, copy the message URL from the channel
// Example: https://whatsapp.com/channel/xxxxx/175
// The last number (175) is the message ID
const messageId = "175"
await sock.newsletterReactMessage("abcd@newsletter", messageId, "🥳")
```

#### Delete a Newsletter

```ts
await sock.newsletterDelete("abcd@newsletter")
```

### 🔑 Custom Pairing Codes

WhatsApp's default pairing codes are randomly generated 8-character alphanumeric strings. Baileys Premod allows you to specify a **custom pairing code** of your choice, making it easier for users to link their device (especially useful for bots and automated systems).

```ts
if (usePairingCode && !sock.authState.creds.registered) {
    const phoneNumber = await question('Enter your phone number:\n')

    // Set your own custom 8-character pairing code
    const customCode = "MYBOT2024"
    const code = await sock.requestPairingCode(phoneNumber, customCode)

    console.log(`Pairing Code: ${code?.match(/.{1,4}/g)?.join('-') || code}`)
    // Output: Pairing Code: MYBO-T202-4
}
```

> **Important:** The pairing code must be exactly 8 characters and alphanumeric (A-Z, 0-9). It will be automatically uppercased. The `requestPairingCode` function accepts the phone number with or without the country code prefix.

### ⚡ Connection Optimization

When `optimizeConnection` is enabled (default: `true`), Baileys Premod applies several connection reliability improvements:

- **Improved retry logic** for failed WebSocket connections
- **Tuned keep-alive intervals** to reduce unnecessary disconnections
- **Enhanced media upload retries** controlled by `maxMediaUploadRetryCount`

```ts
const sock = makeWASocket({
    auth: state,
    optimizeConnection: true,          // enabled by default
    maxMediaUploadRetryCount: 5,       // default: 3
})
```

---

## Full Example

Here's a more complete example that demonstrates authentication, message handling, multiple message types, and the AI icon feature:

```ts
import { Boom } from '@hapi/boom'
import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestWaWebVersion
} from 'baileys-premod'
import pino from 'pino'

const logger = pino({ level: 'info' })

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_session')

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: logger.child({ class: 'bot' }),
        // baileys-premod options
        autoFetchVersion: true,
        optimizeConnection: true,
        maxMediaUploadRetryCount: 3,
    })

    // Save authentication credentials
    sock.ev.on('creds.update', saveCreds)

    // Handle connection events
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update

        if (connection === 'close') {
            const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode
            console.log('Connection closed, status:', statusCode)

            if (statusCode !== DisconnectReason.loggedOut) {
                console.log('Reconnecting...')
                start()
            }
        }

        if (connection === 'open') {
            console.log('Bot is online and ready!')

            // Fetch current version info
            const { version } = await fetchLatestWaWebVersion({})
            console.log('Using WhatsApp version:', version)
        }
    })

    // Handle incoming messages
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return

        const from = msg.key.remoteJid
        const isGroup = from?.endsWith('@g.us')

        // Extract text from various message types
        const text =
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text ||
            ''

        if (!text) return

        console.log(`Message from ${from}: ${text}`)

        // Route commands
        if (text === '/menu') {
            // Send interactive menu
            await sock.sendMessage(from, {
                text: "Welcome to the bot menu!",
                title: "Bot Menu",
                footer: "Choose an option below",
                interactiveButtons: [
                    {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                            display_text: "Get Info",
                            id: "info"
                        })
                    },
                    {
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "Visit GitHub",
                            url: "https://github.com/BF667-IDLE"
                        })
                    },
                    {
                        name: "cta_copy",
                        buttonParamsJson: JSON.stringify({
                            display_text: "Copy My JID",
                            id: "copy_jid",
                            copy_code: from || "unknown"
                        })
                    }
                ],
                ai: true  // AI sparkle icon
            }, { quoted: msg })
        } else if (text === '/buttons') {
            // Send button message
            await sock.sendMessage(from, {
                text: "Pick a color:",
                footer: "Color Picker",
                buttons: [
                    { buttonId: 'red', buttonText: { displayText: '🔴 Red' }, type: 1 },
                    { buttonId: 'green', buttonText: { displayText: '🟢 Green' }, type: 1 },
                    { buttonId: 'blue', buttonText: { displayText: '🔵 Blue' }, type: 1 },
                ],
                headerType: 1,
            }, { quoted: msg })
        } else {
            // Echo with AI icon
            await sock.sendMessage(from, {
                text: `You said: _${text}_\n\n${isGroup ? '(sent in group)' : '(sent in private)'}`,
                ai: true,
            }, { quoted: msg })
        }
    })
}

start()
```

---

## API Reference

### `makeWASocket(config: SocketConfig): WASocket`

Creates a new WhatsApp Web socket connection. Returns a socket object with all standard WhatsApp methods plus newsletter management.

### Key Methods

| Method | Description |
|--------|-------------|
| `sendMessage(jid, content, options?)` | Send a message to a chat. Supports text, media, buttons, interactive messages, albums, and more |
| `sendMessage(jid, content, options?)` with `ai: true` | Send a message with the AI sparkle icon |
| `requestPairingCode(phone, customCode?)` | Request a pairing code. Optionally pass a custom 8-char alphanumeric code |
| `groupMetadata(jid)` | Fetch group metadata |
| `groupCreate(name, participants)` | Create a new group |
| `groupLeave(jid)` | Leave a group |
| `newsletterCreate(name)` | Create a newsletter/channel |
| `newsletterMetadata(type, id)` | Get newsletter info |
| `newsletterUpdateName(jid, name)` | Update channel name |
| `newsletterUpdateDescription(jid, desc)` | Update channel description |
| `newsletterUpdatePicture(jid, buffer)` | Update channel profile picture |
| `newsletterRemovePicture(jid)` | Remove channel profile picture |
| `newsletterFollow(jid)` | Follow a channel |
| `newsletterUnfollow(jid)` | Unfollow a channel |
| `newsletterMute(jid)` | Mute channel notifications |
| `newsletterUnmute(jid)` | Unmute channel notifications |
| `newsletterReactMessage(jid, msgId, emoji)` | React to a channel message |
| `newsletterSendAudio(jid, audio, options?)` | Send voice note or audio file to a channel |
| `newsletterDelete(jid)` | Delete a newsletter |
| `readMessages(keys)` | Mark messages as read |
| `chatModify(mod, jid)` | Modify chat settings (mute, archive, etc.) |
| `profilePictureUrl(jid, type)` | Get profile picture URL |
| `fetchProfilePictureFromServer(jid)` | Fetch profile picture from server |
| `updateProfilePicture(jid, content)` | Update your profile picture |
| `updateProfileName(name)` | Update your display name |
| `onWhatsApp(jid)` | Check if a number is on WhatsApp |
| `presenceSubscribe(jid)` | Subscribe to presence updates |
| `sendPresenceUpdate(type)` | Update your presence (available, composing, etc.) |

### Key Events

| Event | Description |
|-------|-------------|
| `connection.update` | Connection state changes (connecting, open, close, QR) |
| `creds.update` | Authentication credentials updated (must save these!) |
| `messages.upsert` | New messages received |
| `messages.update` | Message status updates (delivered, read, deleted) |
| `messages.delete` | Messages deleted |
| `messages.reaction` | Message reactions |
| `group-participants.update` | Group member changes (join, leave, promote, demote) |
| `groups.update` | Group metadata updates (name, description, etc.) |
| `presence.update` | Contact presence/typing updates |

---

## Troubleshooting

### Connection Issues

**Problem:** `Connection was lost` or frequent disconnections

**Solution:** Enable auto version fetch and connection optimization:
```ts
const sock = makeWASocket({
    auth: state,
    autoFetchVersion: true,
    optimizeConnection: true,
})
```

### QR Code Not Loading

**Problem:** QR code never appears or auth state is corrupted

**Solution:** Delete the `auth_info` (or your configured auth directory) and restart. The auth state files may have become corrupted:
```bash
rm -rf ./auth_info
```

### Messages Not Showing Buttons in Groups

**Problem:** Buttons or interactive messages appear as plain text in groups

**Solution:** Make sure you're using baileys-premod v7.0.0 or later. This issue was the core fix of issue #58 and is resolved in this version.

### Button / Menu Responses Not Detected

**Problem:** Your bot does not detect when a user taps a button or selects a menu item. The debug log shows `type=interactiveResponseMessage` but `responseId=undefined` or the message is marked as `Unhandled`.

**Solution:** This was caused by `extractMessageContent` not handling response message types. Update to the latest version which includes the fix for `interactiveResponseMessage`, `buttonsResponseMessage`, `listResponseMessage`, and `templateButtonReplyMessage`. Make sure you are detecting responses by checking `getContentType(msg.message)`:

```ts
import { getContentType } from 'baileys'

const type = getContentType(msg.message)
if (type === 'interactiveResponseMessage') {
    // Handle native flow button click
    const params = JSON.parse(
        msg.message.interactiveResponseMessage
            .nativeFlowResponseMessage.paramsJson
    )
    console.log('Button ID:', params.id)
}
```

### Media Upload Failing

**Problem:** `Media upload failed` or `timeout` errors

**Solution:** Increase the retry count and timeout:
```ts
const sock = makeWASocket({
    auth: state,
    maxMediaUploadRetryCount: 5,
    defaultQueryTimeoutMs: 120_000,
})
```

### Libsignal Errors / Spam Logs

**Problem:** Excessive libsignal-related log output cluttering your console

**Solution:** This library includes cleaned-up libsignal logs. If you still see excessive output, adjust your logger level:
```ts
import pino from 'pino'
const logger = pino({ level: 'info' }) // or 'warn' to reduce output further
```

---

## Credits & Contributors

<table>
<tr>
<td align="center">
<a href="https://github.com/onxlmao">
<img src="https://github.com/onxlmao.png" width="110px" height="110px" alt="BF667-IDLE" style="border-radius:50%; border: 2px solid #25D366;" /><br/>
<img src="https://img.shields.io/badge/Maintainer-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" />
</a>
<h4><a href="https://github.com/onxlmao">onxlmao</a></h4>
<p><b>Baileys Premod</b><br/>Premod maintainer, features & bug fixes</p>
<a href="https://github.com/onxlmao?tab=repositories"><img src="https://img.shields.io/badge/Repos-25D366?style=flat-square&logo=github&logoColor=white" /></a>
<a href="https://github.com/BF667-IDLE?tab=followers"><img src="https://img.shields.io/badge/Followers-25D366?style=flat-square&logo=github&logoColor=white" /></a>
</td>
<td align="center">
<a href="https://github.com/nstar-y">
<img src="https://github.com/nstar-y.png" width="110px" height="110px" alt="nstar-y" style="border-radius:50%; border: 2px solid #6e5494;" /><br/>
<img src="https://img.shields.io/badge/Base Fork-6e5494?style=for-the-badge&logo=github&logoColor=white" />
</a>
<h4><a href="https://github.com/nstar-y">nstar-y</a></h4>
<p><b>Bail</b><br/>Newsletter, buttons, AI icon & libsignal</p>
<a href="https://github.com/nstar-y?tab=repositories"><img src="https://img.shields.io/badge/Repos-6e5494?style=flat-square&logo=github&logoColor=white" /></a>
<a href="https://github.com/nstar-y?tab=followers"><img src="https://img.shields.io/badge/Followers-6e5494?style=flat-square&logo=github&logoColor=white" /></a>
</td>
<td align="center">
<a href="https://github.com/WhiskeySockets">
<img src="https://github.com/WhiskeySockets.png" width="110px" height="110px" alt="WhiskeySockets" style="border-radius:50%; border: 2px solid #58a6ff;" /><br/>
<img src="https://img.shields.io/badge/Upstream-58a6ff?style=for-the-badge&logo=github&logoColor=white" />
</a>
<h4><a href="https://github.com/WhiskeySockets">WhiskeySockets</a></h4>
<p><b>Baileys</b><br/>Multi-device, groups & core lib</p>
<a href="https://github.com/WhiskeySockets?tab=repositories"><img src="https://img.shields.io/badge/Repos-58a6ff?style=flat-square&logo=github&logoColor=white" /></a>
<a href="https://github.com/WhiskeySockets?tab=followers"><img src="https://img.shields.io/badge/Followers-58a6ff?style=flat-square&logo=github&logoColor=white" /></a>
</td>
<td align="center">
<a href="https://github.com/adiwajshing">
<img src="https://github.com/adiwajshing.png" width="110px" height="110px" alt="adiwajshing" style="border-radius:50%; border: 2px solid #f0e68c;" /><br/>
<img src="https://img.shields.io/badge/Original Creator-f0e68c?style=for-the-badge&logoColor=000" />
</a>
<h4><a href="https://github.com/adiwajshing">Adhiraj Singh</a></h4>
<p><b>Baileys</b><br/>Creator of the original library</p>
<a href="https://github.com/adiwajshing?tab=repositories"><img src="https://img.shields.io/badge/Repos-f0e68c?style=flat-square&logo=github&logoColor=000" /></a>
<a href="https://github.com/adiwajshing?tab=followers"><img src="https://img.shields.io/badge/Followers-f0e68c?style=flat-square&logo=github&logoColor=000" /></a>
</td>
</tr>
</table>

<div align="center">
<h3>Chain of Contributions</h3>

<a href="https://github.com/adiwajshing"><img src="https://img.shields.io/badge/adiwajshing-Original_Creator-f0e68c?style=flat-square&logo=github&logoColor=000" /></a>
<img src="https://img.shields.io/badge/-→-333?style=flat-square" />
<a href="https://github.com/WhiskeySockets"><img src="https://img.shields.io/badge/WhiskeySockets-Multi_Device-58a6ff?style=flat-square&logo=github&logoColor=fff" /></a>
<img src="https://img.shields.io/badge/-→-333?style=flat-square" />
<a href="https://github.com/nstar-y"><img src="https://img.shields.io/badge/nstar--y-Bail_Fork-6e5494?style=flat-square&logo=github&logoColor=fff" /></a>
<img src="https://img.shields.io/badge/-→-333?style=flat-square" />
<a href="https://github.com/onxlmao"><img src="https://img.shields.io/badge/onxlmao-Baileys_Premod-25D366?style=flat-square&logo=whatsapp&logoColor=fff" /></a>

<br/><br/>
<p><b>Baileys Premod</b> builds upon the work of all contributors above.</p>
</div>

### License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

### Disclaimer

This library is not affiliated with, authorized, maintained, sponsored, or endorsed by WhatsApp or any of its affiliates or subsidiaries. This is an independent and unofficial software library. Use at your own risk. The developers assume no liability and are not responsible for any misuse or damage caused by this program.

---

<div align="center">

**Made with ❤️ by [BF667-IDLE](https://github.com/BF667-IDLE)**

[⭐ Star this repo](https://github.com/BF667-IDLE/baileys-premod) if you find it useful!

</div>
