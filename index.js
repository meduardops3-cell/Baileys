import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";

async function startBot() {
const { state, saveCreds } = await useMultiFileAuthState("auth_info");

const sock = makeWASocket({
auth: state,
printQRInTerminal: true,
});

sock.ev.on("creds.update", saveCreds);

sock.ev.on("messages.upsert", async ({ messages }) => {
const msg = messages[0];
if (!msg.message) return;

const text = msg.message.conversation || "";

if (text.toLowerCase().includes("hola")) {
await sock.sendMessage(msg.key.remoteJid, {
text: "Hola 👋 Soy el asistente de la inmobiliaria. ¿Buscás comprar o alquilar?"
});
}
});
}

startBot();
