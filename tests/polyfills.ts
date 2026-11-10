const { TextDecoder, TextEncoder } = require("node:util");
const { ReadableStream, WritableStream, TransformStream } = require("node:stream/web");

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
global.ReadableStream = ReadableStream;
global.WritableStream = WritableStream;
global.TransformStream = TransformStream;

const { BroadcastChannel, MessageChannel, MessagePort } = require("node:worker_threads");
global.BroadcastChannel = BroadcastChannel;
global.MessageChannel = MessageChannel;
global.MessagePort = MessagePort;

const { fetch, Headers, Request, Response, FormData } = require("undici");

global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;
global.FormData = FormData;

export {};
