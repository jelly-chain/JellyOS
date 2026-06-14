/**
 * IrysService — TypeScript client for Irys permanent storage.
 * Communicates with irys-uploader microservice.
 */

import { spawn } from "node:child_process";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface IrysTag { name: string; value: string }
export interface IrysUploadResult { id: string; timestamp: number; size: number }
export interface IrysHealth { status: string; address: string; token: string }
export interface IrysBalance { balance: string; address: string }

export class IrysService {
  private uploaderPath: string;
  private port: number;
  private process: ReturnType<typeof spawn> | null = null;

  constructor(port = 8083) {
    this.port = port;
    this.uploaderPath = join(__dirname, "..", "..", "..", "bin", "irys-uploader", "server.js");
  }

  async start(): Promise<void> {
    if (this.process || !existsSync(this.uploaderPath)) return;
    this.process = spawn(process.execPath, [this.uploaderPath], {
      stdio: "ignore",
      env: {
        ...process.env,
        PORT: String(this.port),
      },
    });
  }

  async stop(): Promise<void> {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const base = process.env.IRYS_NODE_URL || `http://localhost:${this.port}`;
    const url = `${base}${endpoint}`;
    const resp = await fetch(url, options as any);
    if (!resp.ok) throw new Error(`Irys error: ${resp.status} ${await resp.text()}`);
    return resp.json() as T;
  }

  async health(): Promise<IrysHealth> {
    return this.fetch<IrysHealth>("/health");
  }

  async balance(): Promise<IrysBalance> {
    return this.fetch<IrysBalance>("/balance");
  }

  async upload(data: Buffer, tags: IrysTag[] = []): Promise<IrysUploadResult> {
    const base64 = data.toString("base64");
    const base = process.env.IRYS_UPLOADER_URL || `http://localhost:${this.port}`;
    const resp = await fetch(`${base}/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: base64, tags }),
    });
    if (!resp.ok) throw new Error(`Upload failed: ${resp.status} ${await resp.text()}`);
    const json = (await resp.json()) as { id: string; timestamp: number; size: number };
    return { id: json.id, timestamp: json.timestamp, size: json.size };
  }

  // Fetch data from Irys gateway
  async fetchTx(txId: string): Promise<Buffer> {
    const gateway = process.env.IRYS_GATEWAY_URL || `https://gateway.irys.xyz`;
    const resp = await fetch(`${gateway}/${txId}`);
    if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
    return Buffer.from(await resp.arrayBuffer());
  }
}

export const irys = new IrysService();