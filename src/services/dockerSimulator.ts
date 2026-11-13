import { ContainerStatus } from '../types';
import { INITIAL_CONTAINERS } from '../data/sampleData';

class DockerLabSimulator {
  private containers: ContainerStatus[] = JSON.parse(JSON.stringify(INITIAL_CONTAINERS));
  private listeners: ((containers: ContainerStatus[]) => void)[] = [];
  private logInterval: any = null;

  constructor() {
    this.startBackgroundLogStream();
  }

  getContainers(): ContainerStatus[] {
    return this.containers;
  }

  subscribe(callback: (containers: ContainerStatus[]) => void) {
    this.listeners.push(callback);
    callback(this.containers);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb([...this.containers]));
  }

  startLab(): Promise<boolean> {
    return new Promise(resolve => {
      this.containers.forEach(c => {
        c.status = 'restarting';
      });
      this.notify();

      setTimeout(() => {
        this.containers.forEach(c => {
          c.status = 'running';
          c.uptime = 'Just now';
          c.cpu = Number((Math.random() * 2 + 0.8).toFixed(1));
          c.logs.push(`[system] Container ${c.name} started cleanly with Docker Compose`);
          if (c.role === 'onion-service') {
            c.logs.push(`[tor] Bootstrapped 100%: Hidden service ${c.onionAddress} published to Tor network`);
          }
        });
        this.notify();
        resolve(true);
      }, 1200);
    });
  }

  stopLab(): Promise<boolean> {
    return new Promise(resolve => {
      this.containers.forEach(c => {
        c.status = 'stopped';
        c.cpu = 0;
        c.memory = 0;
        c.uptime = 'Stopped';
        c.logs.push(`[system] SIGTERM received - Container ${c.name} stopped gracefully`);
      });
      this.notify();
      resolve(true);
    });
  }

  resetLab(): Promise<boolean> {
    return new Promise(resolve => {
      this.stopLab().then(() => {
        setTimeout(() => {
          this.containers = JSON.parse(JSON.stringify(INITIAL_CONTAINERS));
          this.startLab().then(() => {
            resolve(true);
          });
        }, 500);
      });
    });
  }

  addCustomLog(containerId: string, message: string) {
    const container = this.containers.find(c => c.id === containerId);
    if (container) {
      container.logs.push(message);
      if (container.logs.length > 200) container.logs.shift();
      this.notify();
    }
  }

  private startBackgroundLogStream() {
    const dummyLogs = [
      { id: 'c-onion1', msg: '[apache2] 127.0.0.1 - "GET /api/v1/heartbeat HTTP/1.1" 200 84' },
      { id: 'c-onion1', msg: '[tor] Circuit 4819 established via Middle Relay 185.107.56.21' },
      { id: 'c-onion2', msg: '[c2-server] Heartbeat ACK from agent 0x4819 (AES-256-GCM)' },
      { id: 'c-clearnet', msg: '[nginx] "GET /tracker.js?id=RG_PROD_442 HTTP/1.1" 200 1208' },
      { id: 'c-onion1', msg: '[apache2] 185.220.101.45 - "GET /server-status?auto HTTP/1.1" 200 4890' }
    ];

    setInterval(() => {
      const runningContainers = this.containers.filter(c => c.status === 'running');
      if (runningContainers.length > 0) {
        const randomLog = dummyLogs[Math.floor(Math.random() * dummyLogs.length)];
        const target = this.containers.find(c => c.id === randomLog.id && c.status === 'running');
        if (target) {
          const timestamp = new Date().toLocaleTimeString();
          target.logs.push(`[${timestamp}] ${randomLog.msg}`);
          if (target.logs.length > 200) target.logs.shift();
          // Slightly jitter CPU
          target.cpu = Number(Math.max(0.5, Math.min(5.0, target.cpu + (Math.random() * 0.4 - 0.2))).toFixed(1));
          this.notify();
        }
      }
    }, 4000);
  }
}

export const dockerSimulator = new DockerLabSimulator();
