import { SignJWT, jwtVerify } from 'jose'

export async function generateToken(payload: any, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h') // Valid for 2 hours
    .sign(encoder.encode(secret))
  return jwt
}

export async function verifyToken(token: string, secret: string): Promise<any> {
  const encoder = new TextEncoder()
  const { payload } = await jwtVerify(token, encoder.encode(secret))
  return payload
}
