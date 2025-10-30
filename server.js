const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

// Configuración del servidor
const PORT_HTTP = 3000;
const PORT_HTTPS = 3443;

// MIME types
const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

// Función para servir archivos
function serveFile(req, res) {
  let filePath = path.join(
    __dirname,
    req.url === "/" ? "index.html" : req.url
  );

  // Verificar si el archivo existe
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - Archivo no encontrado");
    return;
  }

  // Obtener la extensión del archivo
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || "application/octet-stream";

  // Leer y servir el archivo
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 - Error interno del servidor");
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods":
        "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    res.end(data);
  });
}

// Crear servidor HTTP
const httpServer = http.createServer(serveFile);

// Usar tus certificados SSL reales
let httpsOptions;
try {
  httpsOptions = {
    key: fs.readFileSync(
      path.join(__dirname, "certs", "localhost+2-key.pem")
    ),
    cert: fs.readFileSync(
      path.join(__dirname, "certs", "localhost+2.pem")
    ),
  };
  console.log("✅ Certificados SSL cargados correctamente");
} catch (error) {
  console.error(
    "❌ Error al cargar certificados SSL:",
    error.message
  );
  console.log("🔄 Usando certificados autofirmados de respaldo...");

  // Certificados de respaldo (autofirmados)
  httpsOptions = {
    key: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB
wQNfFmupadqGqUxFcrE6bVRUVBs9j2C2aVKtTLiLiTKxZY2ukdv2YEf76+2fcNyA
2NyKG9Qbinlq66anms+ksrmFUyx6weEgNSOKLrYNNrTDqez15eNqLiRSqp3xibxc
FzXuLWV35BSCv1dcbcwRXuWVKuIp5ZZAplMSHTxTurLtVeecJySERftWDNDnBxHu
SBUn4LjjcWN4kAEhqx+5dPjbSLBdJaJeqj2artLat+StiKnzR001U2CfpwPi4hHD
DKEVV52+PcdhPd8s4slUYHyTliY/fXXS+zG40OlrfgKOyuZBqssoChxN92b/HczV
G7rsQaLLAgMBAAECggEBALveAIFzTdpfy21qpRuLiMqU3NOzfFMlxxXy5VkSMBFl
TZRSWWuS5W5Qx+t60x4iVWI9/Q1ITviubzMx/Lb/hBxUWVZePdf93KHavnigUb4s
BwjZgHoFwqNvbeJ2hxCc/zAjrUqoatFjaTxVgHhUR03ea+qEAx6dDn0hZpNWDD6k
jchtwYy5KVa7SLSxT7GdDsF7P3jjCaRK+gQYNjmi5ukmjrrw3H+7C9ZsABBRThws
IDUHp5M7PtWhHkgKuKzNaaMdh+3Xb5F/ZtmI2/Sa/JDhuAqJiWyr7yuuomp9Edkw
6qinDKuGLHmtVgqBfF+L2hN6bbRBq+qQiHNGBdqUvkECgYEA6vgWwk5W1lxfKuEK
zMzjZpFswQfvLSqcUnoGHZ2pgdqtzxNprxmtNuzh4+BjMQlzUR1s1UkdWkMRZfeE
IcGjRMRlNOjqfzuEekw3g8dqiM6EM8hB/rKzjNwfpEiayXiTxMhpXGBY4TdC2kOq
NHwvHrIjO9cRSyumtvZkJVCr5NsCgYEAy0Ho2U69QQjKDz4kqKbMiMnWAFHADyIw
8YdnzZxfTOUFSCHXFuZ29IS2AT67JdEJLSEYdHdLG/7dUc58OuuukPiHFXetcrTp
xQV/H7Rqh8m5sI2q4j+oA8LSRlHk8hhBNNzHRrfVmaTTzK9jx27T0j8WBjRPlMAp
IDjJWPM5c0ECgYBzFSz7h1+s34Ycgxe8FleeL4mMBrMiDFXJ2WorxjS7pOa9HZ2Z
1/PS2WQREYR/xBcRLR9WZpM+VRQBUqE7dDHzAHVLX5VqJVFNRb+FewSuKNiZdDgl
6JHVmSdK+nSHE3gLBzOiIUHKpR2Bt4pRzOkwLwYRmA/fVvBjgVBOBtjVQwKBgGqI
kU4sWjrjmFXGCO6YGAYrGqfwllxOHKyIrLZpnIBjdqgRdQkWKRHtgPpEhvJpLm7j
ixDdK4riJCoB0VGBydIoYc4wjuEKKrjsmuVqVQHBanHZWrYfCEDLLGsB0c6YVuJZ
XK+npHsrmMZHo1yrxsiMkQJ5fMrJXvEtD3TlFSHBAoGAT3+iwlGfNbmHdDuVE6+5
iryeudnzhW5hsXnlXCOWEg4i7wYvs4I9urpyDBFzckz4s4UqguZduGpXiH/XuDUt
6LdhqKNcxn2F9lx7cn1sZ2kQdFYSBOhT65Hs/vI3tmw3vuUUBZXommCKMnkKGX
0SLb1bgY4ChZlnkVfaaVWPT0=
-----END PRIVATE KEY-----`,
    cert: `-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAJC1HiIAZAiIMA0GCSqGSIb3DQEBBQUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMTIwOTEyMjE1MjAyWhcNMTUwOTEyMjE1MjAyWjBF
MQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50
ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEAu1SU1L7VLPHCgcEDXxZrqWnahqlMRXKxOm1UVFQbPY9gtmlSrUy4i4ky
sWWNrpHb9mBH++vtn3DcgNjcihvUG4p5auump5rPpLK5hVMsesHhIDUjii62DTa0
w6ns9eXjai4kUqqd8Ym8XBc17i1ld+QUgr9XXG3MEV7llSriKeWWQKZTEh08U7qy
7VXnnCckhEX7VgzQ5wcR7kgVJ+C443FjeJABIasfuXT420iwXSWiXqo9mq7S2rfk
rYip80dNNVNgn6cD4uIRwwyhFVedvj3HYT3fLOLJVGB8k5YmP3110vsxuNDpa34C
jsrmQarLKAocTfdm/x3M1Ru67EGiywIDAQABo1AwTjAdBgNVHQ4EFgQUU3m/Wqor
Ss9UgOHYm8Cd8rIDZsswHwYDVR0jBBgwFoAUU3m/WqorSs9UgOHYm8Cd8rIDZssw
DAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQUFAAOCAQEAWjsHVQQqm5CE6Ro7k6id
qBiJ4l5676VWxaGLYdUhOjmXYQYd/dIhTW5uZSMZrqYppkbz0PlZWs83X2lXdKNt
+TjAi7IN3O_2Wr1WIP8pt+zohMi4sBXT7biOkgF/ZjmFAdlAIm7aovkBmS7f7VGK
zQSJ+y5AJXVCS+Jzt8parWRiaSuVxAfOlKpQ32RV3iaTlAzZGzGCCr9BUCEBPonN
c2vQY7bGunF4O7UoNzO3qAJMa+vnbAaWDt5AiNYbRjVBzWRgZi+d6UpE9w8AdhfF
t2esZ4bCprMIpamLlJOlnUPZtOjYSUUGlUtBpGY9TuMoUgWqn2DKQvEMp9VUhkY
-----END CERTIFICATE-----`,
  };
}

// Crear servidor HTTPS
const httpsServer = https.createServer(httpsOptions, serveFile);

// Iniciar servidores
httpServer.listen(PORT_HTTP, () => {
  console.log(
    `🌐 Servidor HTTP ejecutándose en: http://localhost:${PORT_HTTP}`
  );
});

// httpsServer.listen(PORT_HTTPS, () => {
//   console.log(`🔒 Servidor HTTPS ejecutándose en: https://localhost:${PORT_HTTPS}`);
//   console.log('✅ Usando certificados SSL válidos (mkcert)');
// });

console.log(
  "\n📋 Instrucciones para probar el widget de Doctoralia:"
);
console.log(
  "1. 🔒 Abre https://localhost:3443 (RECOMENDADO - SSL válido)"
);
console.log("2. 🌐 O abre http://localhost:3000 (HTTP básico)");
console.log("3. 👀 Observa los mensajes de estado del widget");
console.log("4. ⌨️  Presiona Ctrl+C para detener los servidores");
console.log(
  "\n🎯 El widget debería funcionar correctamente con HTTPS!"
);
