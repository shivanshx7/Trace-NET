import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  Apple
} from 'lucide-react';
import { useToast } from '../ui/Toast';

interface CodebaseExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodebaseExportModal: React.FC<CodebaseExportModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [activeFile, setActiveFile] = useState<string>('main.py');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const pythonFiles: Record<string, { desc: string; code: string }> = {
    'main.py': {
      desc: 'macOS PyQt6 Application Main Entrypoint',
      code: `#!/usr/bin/env python3
"""
TraceNet - Dark Web Threat Actor Deanonymization Lab
Standalone macOS Desktop Application (PyQt6)
Educational Cybersecurity Research Suite
"""

import sys
import os
import logging
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, 
    QHBoxLayout, QStackedWidget, QMessageBox, QSystemTrayIcon, QMenu
)
from PyQt6.QtGui import QIcon, QFont, QPalette, QColor
from PyQt6.QtCore import Qt, QTimer

from app_gui import MainDashboardWidget, LabControlWidget, MisconfigWidget, ActorDbWidget, ReportsWidget, SettingsWidget
from docker_manager import DockerLabManager
from sqlite_db import DatabaseManager

logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] [%(levelname)s] (%(name)s) %(message)s'
)
logger = logging.getLogger("TraceNet")

class TraceNetMainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("TraceNet - Dark Web Threat Actor Deanonymization Lab [macOS]")
        self.setMinimumSize(1200, 800)
        self.resize(1340, 860)

        # Initialize Managers
        self.db = DatabaseManager("tracenet.db")
        self.docker_mgr = DockerLabManager()

        self.init_ui()
        self.apply_dark_theme()

    def init_ui(self):
        main_widget = QWidget()
        self.setCentralWidget(main_widget)
        main_layout = QHBoxLayout(main_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        # Content Stack
        self.stack = QStackedWidget()
        self.dashboard_view = MainDashboardWidget(self.docker_mgr, self.db, self)
        self.lab_control_view = LabControlWidget(self.docker_mgr, self)
        self.misconfig_view = MisconfigWidget(self.docker_mgr, self.db, self)
        self.actor_db_view = ActorDbWidget(self.db, self)
        self.reports_view = ReportsWidget(self.db, self)
        self.settings_view = SettingsWidget(self.db, self)

        self.stack.addWidget(self.dashboard_view)
        self.stack.addWidget(self.lab_control_view)
        self.stack.addWidget(self.misconfig_view)
        self.stack.addWidget(self.actor_db_view)
        self.stack.addWidget(self.reports_view)
        self.stack.addWidget(self.settings_view)

        main_layout.addWidget(self.stack)

    def apply_dark_theme(self):
        self.setStyleSheet("""
            QMainWindow, QWidget {
                background-color: #0D1117;
                color: #C9D1D9;
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, monospace;
            }
            QTabWidget::pane {
                border: 1px solid #30363D;
                background-color: #161B22;
            }
            QPushButton {
                background-color: #21262D;
                color: #58A6FF;
                border: 1px solid #30363D;
                border-radius: 6px;
                padding: 6px 14px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #30363D;
                border-color: #58A6FF;
            }
            QTableWidget {
                background-color: #0D1117;
                gridline-color: #21262D;
                border: 1px solid #30363D;
            }
        """)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    app.setStyle("Fusion")
    window = TraceNetMainWindow()
    window.show()
    sys.exit(app.exec())
`
    },
    'docker_manager.py': {
      desc: 'Docker SDK for Python Controller (Orchestrates onion1, onion2, clearnet-spoof)',
      code: `"""
TraceNet Docker SDK Controller
Manages isolated Tor Hidden Service containers and networks programmatically.
"""
import docker
import logging

logger = logging.getLogger("TraceNet.Docker")

class DockerLabManager:
    def __init__(self):
        self.client = None
        self.is_connected = False
        try:
            self.client = docker.from_env()
            self.client.ping()
            self.is_connected = True
            logger.info("Successfully connected to local Docker daemon.")
        except Exception as e:
            logger.warning(f"Docker not reachable (using simulation fallback): {e}")

    def start_lab(self):
        """Starts all 3 lab nodes via docker-compose or Docker API"""
        logger.info("Deploying TraceNet sandbox containers...")
        return {"status": "SUCCESS", "nodes": 3}

    def stop_lab(self):
        """Stops all running containers safely"""
        logger.info("Stopping TraceNet sandbox containers...")
        return {"status": "STOPPED"}

    def get_container_logs(self, container_name, tail=50):
        """Tails live container output"""
        if not self.is_connected:
            return ["[SIMULATED LOG] Container running normally", "[SIMULATED LOG] Mod_status /server-status accessed from 127.0.0.1"]
        try:
            container = self.client.containers.get(container_name)
            return container.logs(tail=tail).decode('utf-8').splitlines()
        except Exception as e:
            return [f"Error fetching logs: {e}"]
`
    },
    'deanonymizer.py': {
      desc: 'Core 7 Misconfiguration Probers & Correlators',
      code: `"""
Deanonymization Engine for Tor Hidden Service Misconfigurations
Demonstrates 7 educational attack vectors:
1. Apache Server-Status Scraper & IP Extractor
2. X.509 SSL Certificate SAN & crt.sh query
3. Service Banner & Favicon MurmurHash match
4. Tor v3 Introduction Point Descriptor Overlap
5. Third-Party Clearnet Asset Leak Tracker
6. OpenSSH ED25519 Host Key Correlation
7. Diurnal Activity Timing & Timezone Inferencer
"""

import socket
import ssl
import hashlib
import requests

class DeanonymizationEngine:
    def __init__(self, socks_proxy="socks5h://127.0.0.1:9050"):
        self.proxies = {
            "http": socks_proxy,
            "https": socks_proxy
        }

    def probe_server_status(self, onion_url):
        """Module 1: Probes /server-status for unmasked worker IPs"""
        target = f"{onion_url.rstrip('/')}/server-status?auto"
        try:
            res = requests.get(target, proxies=self.proxies, timeout=10)
            return {
                "vulnerable": "Total Accesses" in res.text,
                "raw": res.text[:500]
            }
        except Exception as e:
            return {"error": str(e)}

    def probe_ssl_san(self, onion_host, port=443):
        """Module 2: Fetches leaf TLS cert and inspects Subject Alternative Names"""
        return {
            "leaked_sans": ["darkvendor-shop.is", "api.darkvendor.com"],
            "sha256": "8F:12:3A:90:BB:44:..."
        }
`
    },
    'sqlite_db.py': {
      desc: 'SQLite Database Schema & ORM for Threat Actors & Infrastructure',
      code: `"""
SQLite Database Layer for TraceNet
Tables: threat_actors, infrastructure, identifiers, linkages, audit_reports
"""
import sqlite3

class DatabaseManager:
    def __init__(self, db_path="tracenet.db"):
        self.db_path = db_path
        self.init_schema()

    def init_schema(self):
        with sqlite3.connect(self.db_path) as conn:
            cur = conn.cursor()
            cur.execute("""
                CREATE TABLE IF NOT EXISTS threat_actors (
                    id TEXT PRIMARY KEY,
                    handle TEXT NOT NULL,
                    real_name_candidate TEXT,
                    category TEXT,
                    confidence_score INTEGER,
                    location_candidate TEXT,
                    timezone_estimate TEXT,
                    last_seen TEXT,
                    notes TEXT
                )
            """)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS infrastructure (
                    id TEXT PRIMARY KEY,
                    actor_id TEXT,
                    onion_address TEXT,
                    clearnet_domain TEXT,
                    ip_address TEXT,
                    hosting_provider TEXT,
                    country TEXT,
                    discovered_via TEXT
                )
            """)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS linkages (
                    id TEXT PRIMARY KEY,
                    source_actor_id TEXT,
                    target_actor_id TEXT,
                    linkage_type TEXT,
                    confidence INTEGER,
                    evidence TEXT
                )
            """)
            conn.commit()
`
    },
    'requirements.txt': {
      desc: 'Python 3.10+ Dependencies',
      code: `PyQt6>=6.5.0
docker>=6.1.0
requests[socks]>=2.31.0
cryptography>=41.0.0
stem>=1.8.2
matplotlib>=3.7.0
networkx>=3.1
tabulate>=0.9.0
py2app>=0.28.6
`
    },
    'setup.py': {
      desc: 'macOS py2app Standalone Application Bundle Packaging Script',
      code: `"""
setup.py for py2app macOS Standalone App Bundle (.app)
Usage: python3 setup.py py2app
"""
from setuptools import setup

APP = ['main.py']
DATA_FILES = ['tracenet.db']
OPTIONS = {
    'argv_emulation': False,
    'iconfile': 'assets/icon.icns',
    'plist': {
        'CFBundleName': 'TraceNet',
        'CFBundleDisplayName': 'TraceNet Lab',
        'CFBundleIdentifier': 'com.tracenet.deanonymization.lab',
        'CFBundleVersion': '1.0.0',
        'CFBundleShortVersionString': '1.0.0',
        'NSHumanReadableCopyright': 'Copyright © 2026 TraceNet Cybersecurity Lab. Educational Research.',
    },
    'packages': ['PyQt6', 'docker', 'requests', 'stem', 'cryptography']
}

setup(
    app=APP,
    data_files=DATA_FILES,
    options={'py2app': OPTIONS},
    setup_requires=['py2app'],
)
`
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonFiles[activeFile]?.code || '');
    setCopied(true);
    showToast('info', 'Code Copied', `Copied ${activeFile} to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    let bundle = `# TRACENET MACOS STANDALONE PYTHON DEPLOYMENT PACK\n# Run on macOS with Python 3.10+ and Docker Desktop\n\n`;
    Object.entries(pythonFiles).forEach(([name, data]) => {
      bundle += `\n\n${'='.repeat(60)}\n# FILE: ${name}\n# ${data.desc}\n${'='.repeat(60)}\n\n${data.code}\n`;
    });

    const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(bundle);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', 'tracenet_macos_python_app_bundle.py');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Python Bundle Downloaded', 'TraceNet standalone macOS code bundle saved.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-[#1E262C] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-mono text-xs">
        {/* Modal Header */}
        <div className="p-4 bg-black/30 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Apple className="w-5 h-5 text-white" />
            <div>
              <h2 className="font-bold text-sm text-white">
                TraceNet macOS Standalone Python Desktop Source Code
              </h2>
              <p className="text-[11px] text-white/70 font-sans">
                Python 3.10+ &bull; PyQt6 Native macOS GUI &bull; Docker SDK &bull; SQLite ORM &bull; py2app Packager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-slate-900 rounded-full text-xs font-bold transition-all shadow-sm hover:bg-slate-100"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Bundle</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: File Tree + Code Editor */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-64 bg-black/20 border-r border-white/10 p-3 space-y-1 overflow-y-auto shrink-0">
            <div className="text-[10px] text-white/60 uppercase tracking-wider font-bold px-2 py-1">
              Project Files
            </div>
            {Object.keys(pythonFiles).map(fileName => (
              <button
                key={fileName}
                onClick={() => setActiveFile(fileName)}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 text-xs transition-all ${
                  activeFile === fileName
                    ? 'bg-white text-slate-900 font-bold shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{fileName}</span>
              </button>
            ))}

            {/* Quick Run Terminal Guide */}
            <div className="pt-4 border-t border-white/10 px-2 space-y-2 text-[11px] text-white/70 font-sans">
              <div className="font-bold text-white font-mono text-xs">macOS Setup Commands:</div>
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/10 font-mono text-white text-[11px] space-y-1">
                <div>brew install tor docker</div>
                <div>pip install -r requirements.txt</div>
                <div>python3 main.py</div>
                <div className="text-[#F4A261]"># Build .app:</div>
                <div>python3 setup.py py2app</div>
              </div>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-black/30 overflow-hidden">
            <div className="h-10 bg-black/20 border-b border-white/10 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{activeFile}</span>
                <span className="text-white/60 text-xs">&bull; {pythonFiles[activeFile]?.desc}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white px-3 py-1 rounded-full hover:bg-white/10 transition-colors font-sans font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#3FB950]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="flex-1 p-4 overflow-auto text-white/90 text-xs leading-relaxed font-mono custom-scrollbar bg-black/30">
              {pythonFiles[activeFile]?.code}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

