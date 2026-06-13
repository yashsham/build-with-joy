import { NextRequest } from "next/server";

const DEFAULT_SECRET = "hermosa_mock_super_secret_luxe_key_128_bits_min_length_for_safety";
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_SECRET;

function arrayBufferToBase64Url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToArrayBuffer(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signJWT(payload: Record<string, any>, expiresInSeconds = 86400 * 30): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const encoder = new TextEncoder();
  
  const issuedAt = Math.floor(Date.now() / 1000);
  const expirationTime = issuedAt + expiresInSeconds;
  
  const jwtPayload = {
    ...payload,
    iat: issuedAt,
    exp: expirationTime,
  };
  
  const headerStr = arrayBufferToBase64Url(encoder.encode(JSON.stringify(header)));
  const payloadStr = arrayBufferToBase64Url(encoder.encode(JSON.stringify(jwtPayload)));
  const signatureInput = `${headerStr}.${payloadStr}`;
  
  const cryptoKey = await getCryptoKey(JWT_SECRET);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(signatureInput)
  );
  const signatureStr = arrayBufferToBase64Url(signatureBuffer);
  
  return `${headerStr}.${payloadStr}.${signatureStr}`;
}

export async function verifyJWT(token: string): Promise<any | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const [headerStr, payloadStr, signatureStr] = parts;
    const encoder = new TextEncoder();
    const signatureInput = `${headerStr}.${payloadStr}`;
    
    const cryptoKey = await getCryptoKey(JWT_SECRET);
    const signatureBuffer = base64UrlToArrayBuffer(signatureStr);
    
    const isValid = await crypto.subtle.verify(
      "HMAC",
      cryptoKey,
      signatureBuffer as any,
      encoder.encode(signatureInput)
    );
    
    if (!isValid) return null;
    
    const decoder = new TextDecoder();
    const payloadObj = JSON.parse(decoder.decode(base64UrlToArrayBuffer(payloadStr)));
    
    const now = Math.floor(Date.now() / 1000);
    if (payloadObj.exp && now > payloadObj.exp) {
      console.warn("[JWT auth] Token expired");
      return null;
    }
    
    return payloadObj;
  } catch (e) {
    console.error("[JWT auth] Verification exception:", e);
    return null;
  }
}

export async function getSessionUser(request: Request | NextRequest) {
  try {
    let token = "";
    
    // 1. Try to read from cookie header
    if ("cookies" in request && typeof request.cookies.get === "function") {
      // NextRequest pattern
      const cookieObj = request.cookies.get("hermosa_session");
      if (cookieObj) {
        token = cookieObj.value;
      }
    } else {
      // Standard Request pattern
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const cookies = cookieHeader.split(";").map((c) => c.trim());
        const sessionCookie = cookies.find((c) => c.startsWith("hermosa_session="));
        if (sessionCookie) {
          token = sessionCookie.split("=")[1];
        }
      }
    }
    
    if (!token) return null;
    
    return await verifyJWT(token);
  } catch (e) {
    console.error("[Session retrieval error]:", e);
    return null;
  }
}
