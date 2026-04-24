# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [7.1.0] - 2025-04-10

### Added

- **`extractMessageContent` — `nativeFlowResponseMessage` direct extraction**: Newer WhatsApp versions may send `nativeFlowResponseMessage` without wrapping it in `interactiveResponseMessage`. Added a dedicated handler that parses `paramsJson` and extracts `id`, `title`, or `description` as the conversation text. This ensures forward compatibility with upcoming WhatsApp client updates.

- **`extractMessageContent` — `carouselCardResponseMessage` extraction**: When a user taps a card in a carousel message, WhatsApp sends a `carouselCardResponseMessage` containing the card index and row ID. Added extraction handlers that return `card:<index>` or the raw `rowId` as the conversation text, allowing bots to detect and route carousel card interactions.

- **`extractMessageContent` — `interactiveResponseMessage` fallback parsing**: Enhanced the existing `interactiveResponseMessage` handler with a fallback path. When `body.text` is empty or missing (which can happen with certain button types in newer WhatsApp), the handler now attempts to parse `nativeFlowResponseMessage.paramsJson` to extract the button `id` or `title` as a fallback conversation value.

### Changed

- **`meMsg.messageContextInfo` — safer default for newer WhatsApp**: The `messageContextInfo` field on the device-sent message wrapper (`meMsg`) now defaults to an empty object (`{}`) instead of `undefined` when the incoming message has no `messageContextInfo`. This prevents proto serialization issues on newer WhatsApp versions that expect `messageContextInfo` to always be present on the outer message, particularly for AI/bot messages where `botMetadata` and `botMessageSecret` must be propagated through the `deviceSentMessage` wrapper.

- **Compiled JS cleanup — removed duplicate AI icon comments**: The compiled `lib/Utils/messages.js` file had three sets of duplicated AI icon support comments (a copy-paste artifact from incremental edits). Consolidated to a single clean comment block that documents the dual mechanism (proto layer + binary node layer).

### Technical Notes

- The `meMsg.messageContextInfo` change ensures that when `ai: true` is set, the `botMessageSecret` (random 32-byte cryptographic secret) and `botMetadata` (containing `personaId`) are properly present on both the inner message and the outer `deviceSentMessage` wrapper. Newer WhatsApp clients validate bot fields at the wrapper level during E2E decryption, so this fix is critical for AI icon display on WhatsApp versions released after mid-2024.

- The `nativeFlowResponseMessage` direct handler is a defensive measure. While current WhatsApp versions always wrap flow responses inside `interactiveResponseMessage`, the proto schema allows `nativeFlowResponseMessage` as a standalone top-level field. Adding this handler now ensures your bot will not break when WhatsApp eventually sends unwrapped responses.

---

## [7.0.0] - 2025-04-09

### Added

- **WhatsApp version auto-fetch**: Library automatically fetches the latest WhatsApp Web version from `web.whatsapp.com/sw.js` on startup. Falls back to the bundled version (`2.3000.1036833994`) if the fetch fails. Controlled by the `autoFetchVersion` config option (enabled by default).

- **AI Message Icon (Sparkle Badge)**: New `ai: true` parameter on any message type adds the AI sparkle icon. Uses a dual mechanism for maximum compatibility:
  - **Binary node layer**: `<bot biz_bot="1"/>` node appended to the message stanza
  - **Proto layer**: `botMetadata` (field 7) + `botMessageSecret` (field 6) set in `Message.messageContextInfo` (field 35)
  - Works in both private chats and group chats
  - Based on [nstar-y/bail](https://github.com/nstar-y/bail) implementation, enhanced with proto-level support

- **Group messages fix (Issue #58)**: Buttons, interactive messages, template messages, and list messages now display correctly in group chats. The fix addresses the `bizNode` construction logic by performing a comprehensive deep check across all possible message wrappers (`viewOnceMessage`, `viewOnceMessageV2`, `viewOnceMessageV2Extension`) and all relevant message types.

- **Button response extraction**: `extractMessageContent` now properly handles all response types:
  - `interactiveResponseMessage` — native flow / quick reply button responses
  - `buttonsResponseMessage` — classic button responses
  - `listResponseMessage` — list / row menu responses
  - `templateButtonReplyMessage` — template button responses

- **Carousel & shop extraction**: `extractMessageContent` now extracts text from `carouselMessage` (carousel cards) and `shopStorefrontMessage` (shop storefront) interactive sub-types.

- **Shop biz node**: Shop messages (`shopStorefrontMessage`) now correctly receive the `<biz>` binary node for proper WhatsApp rendering.

- **`additionalNodes` merge fix**: `ai: true` no longer overrides user-provided `additionalNodes`. Both sets of nodes are now merged together (user nodes first, then AI bot node).

- **ViewOnce wrapper detection**: The biz node detection now covers `listMessage` and `interactiveResponseMessage` wrapped in `viewOnceMessage`, `viewOnceMessageV2`, and `viewOnceMessageV2Extension`.

- **`templateMessage` biz node**: Template messages are now included in the biz node injection logic, ensuring they render correctly in groups.

### Changed

- **Package rename**: Published as `baileys-premod` to distinguish from the upstream Baileys package.

### New Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoFetchVersion` | `boolean` | `true` | Auto-fetch latest WhatsApp Web version on startup |
| `optimizeConnection` | `boolean` | `true` | Enable connection optimization features |
| `maxMediaUploadRetryCount` | `number` | `3` | Max retry attempts for media uploads |
| `debugMessageSend` | `boolean` | `false` | Verbose debug logging for message sending |
