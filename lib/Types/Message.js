"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageTypeKeys = exports.WAMessageStatus = exports.WAMessageStubType = exports.WAProto = void 0;
const WAProto_1 = require("../../WAProto");
Object.defineProperty(exports, "WAProto", { enumerable: true, get: function () { return WAProto_1.proto; } });
exports.WAMessageStubType = WAProto_1.proto.WebMessageInfo.StubType;
exports.WAMessageStatus = WAProto_1.proto.WebMessageInfo.Status;
/** Runtime object containing all valid message type keys as an array */
const PROTO_METHODS = new Set(['create', 'encode', 'encodeDelimited', 'decode', 'decodeDelimited', 'verify', 'fromObject', 'toObject', 'getTypeUrl']);
exports.MessageTypeKeys = Object.keys(WAProto_1.proto.Message).filter((k) => !PROTO_METHODS.has(k));
