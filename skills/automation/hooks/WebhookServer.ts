// Webhook Server - HTTP server for external integrations
// Author: Tentacle OS

import { Logger } from '../../../../src/core/utils/Logger';
import { Metrics } from '../../../../src/core/utils/Metrics';
import { createServer, IncomingMessage, ServerResponse } from 'http';

const logger = new Logger('WebhookServer');
const metrics = new Metrics();

export class WebhookServer {
  private port: number;
  private server: any;
  private handlers: Map<string, WebhookHandler> = new Map();

  constructor(port: number = 9090) {
    this.port = port;
  }

  setPort(port: number): void {
    this.port = port;
  }

  /**
   * Start the webhook server
   */
  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = createServer(this.handleRequest.bind(this));

      this.server.listen(this.port, (err?: Error) => {
        if (err) {
          logger.error(`Failed to start webhook server on port ${this.port}`, err);
          reject(err);
        } else {
          logger.info(`Webhook server listening on port ${this.port}`);
          metrics.increment('webhook.started', 1, { port: this.port.toString() });
          resolve();
        }
      });

      this.server.on('error', (err: Error) => {
        logger.error('Webhook server error', err);
        metrics.increment('webhook.error', 1);
      });
    });
  }

  /**
   * Handle incoming request
   */
  private handleRequest(req: IncomingMessage, res: ServerResponse): void {
    if (req.method === 'POST') {
      this.handlePost(req, res);
    } else if (req.method === 'GET') {
      this.handleGet(req, res);
    } else {
      res.writeHead(405);
      res.end('Method not allowed');
    }

    metrics.increment('webhook.request', 1, { method: req.method });
  }

  /**
   * Handle POST request
   */
  private handlePost(req: IncomingMessage, res: ServerResponse): void {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const path = req.url?.split('?')[0] || '/';

        // Find handler for this path
        const handler = this.handlers.get(path);
        if (handler) {
          handler(data);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ received: true, timestamp: Date.now() }));

        metrics.increment('webhook.post', 1, { path });
      } catch (err) {
        logger.error('Webhook POST parsing failed', err);
        res.writeHead(400);
        res.end('Bad request');
      }
    });
  }

  /**
   * Handle GET request
   */
  private handleGet(req: IncomingMessage, res: ServerResponse): void {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: Date.now(),
      port: this.port
    }));
  }

  /**
   * Register webhook handler
   */
  register(path: string, handler: WebhookHandler): void {
    this.handlers.set(path, handler);
    logger.info(`Registered webhook handler for ${path}`);
  }

  /**
   * Close server
   */
  close(): void {
    if (this.server) {
      this.server.close();
      logger.info('Webhook server closed');
    }
    this.handlers.clear();
  }
}

export type WebhookHandler = (data: any) => void;