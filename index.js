import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'

const clasificarUrgencia = (mensaje) => {
mensaje = mensaje.toLowerCase()

if (mensaje.includes("fuego") || mensaje.includes("gas") || mensaje.includes("explosión")) {
return "URGENTE 🔴"
}
if (mensaje.includes("agua") || mensaje.includes("luz") || mensaje.includes("roto")) {
return "MEDIA 🟠"
}
return "BAJA 🟢"
}

const detectarIntencion = (mensaje) => {
mensaje = mensaje.toLowerCase()

if (mensaje.includes("comprar") || mensaje.includes("lote")) return "COMPRA"
if (mensaje.includes("alquilar")) return "ALQUILER"
if (mensaje.includes("problema") || mensaje.includes("roto")) return "PROBLEMA"

return "GENERAL"
}

async function startBot() {
const { state, saveCreds } = await useMultiFileAuthState('auth')

const sock = makeWASocket({
auth: state
})

sock.ev.on('creds.update', saveCreds)

sock.ev.on('messages.upsert', async ({ messages }) => {
const msg = messages[0]

if (!msg.message) return

const texto = msg.message.conversation || msg.message.extendedTextMessage?.text

if (!texto) return

const intencion = detectarIntencion(texto)
const urgencia = clasificarUrgencia(texto)

let respuesta = ""

if (intencion === "COMPRA") {
respuesta = "Perfecto 😊 ¿Qué tipo de lote estás buscando y en qué zona?"
} else if (intencion === "ALQUILER") {
respuesta = "Genial 👍 ¿Buscás alquilar casa, departamento o terreno?"
} else if (intencion === "PROBLEMA") {
respuesta = `Gracias por avisar 🙏 Ya registramos el problema.\nNivel: ${urgencia}\nNuestro equipo lo revisa en breve.`

console.log("📋 NUEVO PROBLEMA:")
console.log("Mensaje:", texto)
console.log("Urgencia:", urgencia)
} else {
respuesta = "Hola 👋 ¿Estás buscando comprar, alquilar o tenés algún problema con una propiedad?"
}

await sock.sendMessage(msg.key.remoteJid, { text: respuesta })
})
}

startBot()
