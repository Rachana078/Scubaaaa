export const SCUBA_PASSWORD_HASH = 'pbkdf2$200000$22c0dd52cd99c70418b244ac613f899d$939369c79e1f822a860629c18f969604a85ed5d4c166aeaa3144d10045711417'

const encoder = new TextEncoder()

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function hexToBuffer(hex: string): ArrayBuffer {
  return new Uint8Array(hex.match(/.{2}/g)!.map((byte) => parseInt(byte, 16))).buffer
}

function constantTimeEquals(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) return false
  let diff = 0
  for (let i = 0; i < a.byteLength; i += 1) {
    diff |= a[i] ^ b[i]
  }
  return diff === 0
}

async function deriveKey(password: string, salt: ArrayBuffer, iterations: number, keyLength = 32): Promise<ArrayBuffer> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )

  return crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    keyLength * 8
  )
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const derivedKey = await deriveKey(password, salt.buffer, 200000)
  return `pbkdf2$200000$${bufferToHex(salt.buffer)}$${bufferToHex(derivedKey)}`
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [algorithm, iterationsString, saltHex, expectedHex] = storedHash.split('$')
  if (algorithm !== 'pbkdf2' || !iterationsString || !saltHex || !expectedHex) {
    return false
  }

  const iterations = Number(iterationsString)
  if (!Number.isFinite(iterations) || iterations <= 0) {
    return false
  }

  const salt = hexToBuffer(saltHex)
  const expected = new Uint8Array(hexToBuffer(expectedHex))
  const derivedKey = new Uint8Array(await deriveKey(password, salt, iterations, expected.byteLength))
  return constantTimeEquals(derivedKey, expected)
}
