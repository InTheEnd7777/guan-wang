// 十六位十六进制数作为密钥
let secret_key = ''
// 十六位十六进制数作为密钥偏移量
let secret_iv = ''
const setCryptoKey = (iv, key) => {
  // secret_iv = CryptoJS.enc.Utf8.parse(iv)
  // secret_key = CryptoJS.enc.Utf8.parse(key)
  secret_iv = CryptoJS.enc.Base64.parse(iv)
  secret_key = CryptoJS.enc.Base64.parse(key)
}

const md5Encrypt = str => CryptoJS.MD5(str).toString()
const base64Encrypt = str => CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str)).toString()
const base64Decrypt = str => CryptoJS.enc.Base64.parse(str).toString(CryptoJS.enc.Utf8)
const aesEncrypt = str => {
  const src = CryptoJS.enc.Utf8.parse(typeof str == 'string' || typeof str == 'number' ? str : JSON.stringify(str))
  const encrypted = CryptoJS.AES.encrypt(src, secret_key, {
    iv: secret_iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
}

const aesDecrypt = str => {
  let decrypt = CryptoJS.AES.decrypt(str, secret_key, {
    iv: secret_iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  decrypt = decrypt.toString(CryptoJS.enc.Utf8)
  const jsonObj = decrypt.indexOf('{') === 0 || decrypt.indexOf('[') === 0 ? JSON.parse(decrypt) : decrypt
  return jsonObj || decrypt
}