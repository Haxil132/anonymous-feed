import { appendFileSync } from 'fs';
import { join } from 'path';

const LOG_FILE = join(process.cwd(), 'ip-logs.txt');

export function logIP(ipAddress: string, action: string, details?: string) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] IP: ${ipAddress} | Action: ${action}${details ? ` | ${details}` : ''}\n`;
  
  try {
    appendFileSync(LOG_FILE, logEntry, 'utf8');
  } catch (error) {
    console.error('[IP Logger] Failed to write log:', error);
  }
}

export function getClientIP(req: any): string {
  // Check various headers that might contain the real IP
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = forwarded.split(',');
    return ips[0].trim();
  }
  
  return req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress || 
         'unknown';
}
