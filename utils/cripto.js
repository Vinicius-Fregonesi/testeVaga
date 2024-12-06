const CryptoJS = require('crypto-js');

// Definindo chave secreta e IV
const ENCRYPTION_KEY = CryptoJS.enc.Base64.parse(process.env.SECRET_KEY);  // Chave de 256 bits (32 bytes)
const IV_LENGTH = 16;  // Tamanho do IV (16 bytes para AES-256-CBC)

function encrypt(text) {
  const iv = CryptoJS.lib.WordArray.random(IV_LENGTH);  // Gera IV aleatório
  const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY, { iv: iv });  // Criptografa com chave e IV

  return {
    iv: iv.toString(CryptoJS.enc.Base64),  
    content: encrypted.toString(),  
  };
}

function decrypt(encryptedData) {
  try {
    const iv = CryptoJS.enc.Base64.parse(encryptedData.iv);
    const decrypted = CryptoJS.AES.decrypt(encryptedData.content, ENCRYPTION_KEY, { iv: iv });

    const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedData) {
      console.error('Decryption failed: malformed data');
      throw new Error('Decryption failed: malformed data');
    }

    return decryptedData;
  } catch (error) {
    console.error('Erro ao decriptografar:', error);
    throw new Error('Decryption failed');
  }
}

module.exports = { encrypt, decrypt };
