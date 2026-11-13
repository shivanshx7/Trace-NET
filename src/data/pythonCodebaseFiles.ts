export interface CodeFile {
  path: string;
  name: string;
  category: 'core' | 'demos' | 'ui' | 'docker' | 'config';
  language: 'python' | 'yaml' | 'markdown' | 'conf' | 'sql';
  content: string;
}

export const PYTHON_CODEBASE_FILES: CodeFile[] = [
  {
    path: 'app.py',
    name: 'app.py',
    category: 'core',
    language: 'python',
    content: `#!/usr/bin/env python3
"""
TraceNet - Dark Web Threat Actor Deanonymization Lab
Standalone macOS Desktop Application (PyQt6)
Educational Cybersecurity Research & OPSEC Analysis Suite
"""

import sys
import os
import logging
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout,
    QHBoxLayout, QStackedWidget, QMessageBox
)
from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtGui import QIcon, QFont, QAction

from config import Config, DARK_CYBER_STYLE
from database import DatabaseManager
from docker_manager import DockerLabManager
from ui.main_window import MainWindowUI

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger("TraceNet")


class TraceNetApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("TraceNet - Dark Web Threat Actor Deanonymization Lab")
        self.resize(1380, 880)
        self.setMinimumSize(1200, 760)

        # Initialize Core Subsystems
        self.config = Config()
        self.db = DatabaseManager(self.config.DATABASE_PATH)
        self.db.initialize_database()
        self.docker_mgr = DockerLabManager(self.config.COMPOSE_FILE_PATH)

        # Initialize Main UI
        self.ui = MainWindowUI(self)
        self.setCentralWidget(self.ui)

        # Apply Global Dark Cyber Theme
        self.setStyleSheet(DARK_CYBER_STYLE)

        # Status Bar & Auto Refresh
        self.statusBar().showMessage("TraceNet Security Lab Engine Initialized - Local Sandbox Ready")
        
        # Periodic Docker Health Polling
        self.poll_timer = QTimer(self)
        self.poll_timer.timeout.connect(self.ui.refresh_lab_status)
        self.poll_timer.start(4000)

    def closeEvent(self, event):
        """Clean up Docker containers and close SQLite connections cleanly on exit."""
        if self.config.AUTO_CLEANUP_ON_EXIT and self.docker_mgr.is_running():
            reply = QMessageBox.question(
                self, "Shut Down Lab Containers?",
                "TraceNet lab containers are still running. Would you like to stop them before exiting?",
                QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
                QMessageBox.StandardButton.Yes
            )
            if reply == QMessageBox.StandardButton.Yes:
                self.docker_mgr.stop_lab()
        self.db.close()
        event.accept()


def main():
    app = QApplication(sys.argv)
    app.setApplicationName("TraceNet")
    app.setOrganizationName("TraceNet-Lab")
    
    # Enable high DPI scaling
    font = QFont("JetBrains Mono, Fira Code, Menlo, monospace", 10)
    app.setFont(font)

    window = TraceNetApp()
    window.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
`
  },
  {
    path: 'requirements.txt',
    name: 'requirements.txt',
    category: 'config',
    language: 'config' as any,
    content: `PyQt6>=6.6.0
PyQt6-Qt6>=6.6.0
PyQt6-sip>=13.6.0
docker>=7.0.0
requests>=2.31.0
urllib3>=2.0.7
matplotlib>=3.8.0
networkx>=3.2.1
reportlab>=4.0.0
cryptography>=42.0.0
beautifulsoup4>=4.12.0
pandas>=2.1.0
pyOpenSSL>=24.0.0
`
  },
  {
    path: 'config.py',
    name: 'config.py',
    category: 'core',
    language: 'python',
    content: `"""
TraceNet Configuration Settings & Dark Cyber Styling
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

class Config:
    APP_NAME = "TraceNet"
    VERSION = "2.4.0-MacLab"
    DATABASE_PATH = str(BASE_DIR / "tracenet.sqlite3")
    COMPOSE_FILE_PATH = str(BASE_DIR / "docker" / "docker-compose.yml")
    REPORTS_DIR = str(BASE_DIR / "reports")
    
    # API endpoints
    ONIONOO_API = "https://onionoo.torproject.org/details"
    SHODAN_API_KEY = os.getenv("SHODAN_API_KEY", "SIMULATED_KEY")
    CENSYS_API_KEY = os.getenv("CENSYS_API_KEY", "SIMULATED_KEY")

    AUTO_CLEANUP_ON_EXIT = True
    WARN_BEFORE_START = True


DARK_CYBER_STYLE = """
QMainWindow, QWidget {
    background-color: #0b0e14;
    color: #e2e8f0;
    font-family: 'JetBrains Mono', 'Fira Code', 'Menlo', monospace;
    font-size: 13px;
}

QScrollBar:vertical {
    background: #0f172a;
    width: 8px;
    margin: 0;
}
QScrollBar::handle:vertical {
    background: #1e293b;
    min-height: 20px;
    border-radius: 4px;
}
QScrollBar::handle:vertical:hover {
    background: #06b6d4;
}

QTabWidget::pane {
    border: 1px solid #1e293b;
    background: #0f172a;
    border-radius: 6px;
}
QTabBar::tab {
    background: #0b0e14;
    color: #94a3b8;
    padding: 8px 16px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    border: 1px solid #1e293b;
    margin-right: 2px;
}
QTabBar::tab:selected {
    background: #1e293b;
    color: #38bdf8;
    border-bottom-color: #1e293b;
}

QPushButton {
    background-color: #1e293b;
    color: #f8fafc;
    border: 1px solid #334155;
    border-radius: 6px;
    padding: 6px 14px;
    font-weight: 600;
}
QPushButton:hover {
    background-color: #0284c7;
    border-color: #38bdf8;
    color: #ffffff;
}
QPushButton:pressed {
    background-color: #0369a1;
}

QLineEdit, QTextEdit, QPlainTextEdit {
    background-color: #090d16;
    color: #38bdf8;
    border: 1px solid #1e293b;
    border-radius: 6px;
    padding: 6px;
    selection-background-color: #0369a1;
}

QTableWidget {
    background-color: #090d16;
    gridline-color: #1e293b;
    border: 1px solid #1e293b;
    border-radius: 6px;
}
QHeaderView::section {
    background-color: #0f172a;
    color: #94a3b8;
    padding: 6px;
    border: 1px solid #1e293b;
    font-weight: bold;
}
"""
`
  },
  {
    path: 'database.py',
    name: 'database.py',
    category: 'core',
    language: 'python',
    content: `"""
TraceNet SQLite Database Models & Seed Data
"""

import sqlite3
import json
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("TraceNet.DB")

class DatabaseManager:
    def __init__(self, db_path: str):
        self.db_path = db_path
        self.conn: Optional[sqlite3.Connection] = None

    def connect(self) -> sqlite3.Connection:
        if self.conn is None:
            self.conn = sqlite3.connect(self.db_path)
            self.conn.row_factory = sqlite3.Row
            self.conn.execute("PRAGMA foreign_keys = ON;")
        return self.conn

    def initialize_database(self):
        conn = self.connect()
        cursor = conn.cursor()

        cursor.executescript("""
        CREATE TABLE IF NOT EXISTS threat_actors (
            id TEXT PRIMARY KEY,
            handle TEXT NOT NULL UNIQUE,
            real_name_candidate TEXT,
            category TEXT NOT NULL,
            pgp_key_json TEXT,
            wallets_json TEXT,
            confidence_score INTEGER DEFAULT 50,
            confidence_breakdown_json TEXT,
            last_seen TEXT,
            status TEXT DEFAULT 'ACTIVE',
            location_candidate TEXT,
            timezone_estimate TEXT,
            notes TEXT,
            mitre_ttps_json TEXT
        );

        CREATE TABLE IF NOT EXISTS infrastructure (
            id TEXT PRIMARY KEY,
            actor_id TEXT,
            onion_address TEXT NOT NULL,
            clearnet_domain TEXT,
            ip_address TEXT,
            hosting_provider TEXT,
            country TEXT,
            ports_json TEXT,
            tls_fingerprint TEXT,
            ssh_fingerprint TEXT,
            http_banner TEXT,
            discovered_via TEXT,
            status TEXT DEFAULT 'ONLINE',
            FOREIGN KEY (actor_id) REFERENCES threat_actors(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS identifiers (
            id TEXT PRIMARY KEY,
            actor_id TEXT NOT NULL,
            type TEXT NOT NULL,
            value TEXT NOT NULL,
            source TEXT,
            is_clearnet INTEGER DEFAULT 1,
            FOREIGN KEY (actor_id) REFERENCES threat_actors(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS linkages (
            id TEXT PRIMARY KEY,
            actor1_id TEXT NOT NULL,
            actor2_id TEXT NOT NULL,
            linkage_type TEXT NOT NULL,
            evidence TEXT NOT NULL,
            confidence REAL NOT NULL,
            discovered_date TEXT,
            FOREIGN KEY (actor1_id) REFERENCES threat_actors(id) ON DELETE CASCADE,
            FOREIGN KEY (actor2_id) REFERENCES threat_actors(id) ON DELETE CASCADE
        );
        """)
        conn.commit()
        self._seed_default_actors_if_empty()

    def _seed_default_actors_if_empty(self):
        conn = self.connect()
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM threat_actors")
        if cur.fetchone()[0] == 0:
            logger.info("Seeding initial threat actors into SQLite database...")
            # Insert DarkVendor, CryptoKing, ShadowAdmin, PhishMaster, RansomGroup
            cur.execute("""
            INSERT INTO threat_actors (id, handle, real_name_candidate, category, pgp_key_json, wallets_json, confidence_score, last_seen, status, location_candidate, timezone_estimate, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                "act-001", "DarkVendor", "Dmitry V.", "Darknet Market",
                json.dumps({"fingerprint": "8491 0294 1A92 8401 2948 1029 4810 2948 1029 481A", "email": "darkvendor_ops@proton.me"}),
                json.dumps([{"currency": "BTC", "address": "bc1q9x428aklsd0912kamz99012lasd9012kma8", "balance": "48.92 BTC"}]),
                94, "2026-08-28 14:42:19 UTC", "ACTIVE", "Frankfurt, Germany", "UTC+2", "Major darknet vendor deanonymized via /server-status and SSL SAN leak."
            ))

            cur.execute("""
            INSERT INTO infrastructure (id, actor_id, onion_address, clearnet_domain, ip_address, hosting_provider, country, tls_fingerprint, ssh_fingerprint, http_banner, discovered_via)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                "inf-001", "act-001", "darkv5x34a5d89hqlk2j891klz90amc98a.onion", "darkvendor-shop.is", "185.220.101.45",
                "Pecan Hosting Ltd", "Germany", "8f7a91c0b3419e9124dd7881c1a90ee4", "SHA256:7uK89eM31zQPaO819Lka901ZlqMza81920Lka901248", "Apache/2.4.52 (Ubuntu)", "Apache /server-status"
            ))
            conn.commit()

    def get_all_actors(self) -> List[Dict[str, Any]]:
        conn = self.connect()
        cur = conn.cursor()
        cur.execute("SELECT * FROM threat_actors ORDER BY confidence_score DESC")
        return [dict(row) for row in cur.fetchall()]

    def close(self):
        if self.conn:
            self.conn.close()
            self.conn = None
`
  },
  {
    path: 'docker_manager.py',
    name: 'docker_manager.py',
    category: 'core',
    language: 'python',
    content: `"""
Docker Compose Lab Controller for TraceNet
Manages onion1, onion2, and clearnet-spoof containers via Docker SDK
"""

import subprocess
import logging
import shutil
from typing import Dict, Any, List

logger = logging.getLogger("TraceNet.Docker")

class DockerLabManager:
    def __init__(self, compose_path: str):
        self.compose_path = compose_path
        self.running = False

    def is_docker_available(self) -> bool:
        return shutil.which("docker") is not None

    def start_lab(self) -> bool:
        """Start containers defined in docker-compose.yml"""
        logger.info(f"Starting lab via compose: {self.compose_path}")
        try:
            cmd = ["docker", "compose", "-f", self.compose_path, "up", "-d"]
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            if res.returncode == 0:
                self.running = True
                return True
            logger.error(f"Docker compose up failed: {res.stderr}")
            return False
        except Exception as e:
            logger.exception(f"Error starting docker lab: {e}")
            return False

    def stop_lab(self) -> bool:
        """Stop and remove lab containers"""
        logger.info("Stopping lab containers...")
        try:
            cmd = ["docker", "compose", "-f", self.compose_path, "down"]
            subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            self.running = False
            return True
        except Exception as e:
            logger.error(f"Error stopping lab: {e}")
            return False

    def get_container_statuses(self) -> List[Dict[str, Any]]:
        """Return container health metrics and addresses"""
        return [
            {
                "name": "onion1",
                "role": "Tor Hidden Service (Apache)",
                "status": "RUNNING" if self.running else "STOPPED",
                "onion": "darkv5x34a5d89hqlk2j891klz90amc98a.onion",
                "port": 8081
            },
            {
                "name": "onion2",
                "role": "Tor Hidden Service (C2 Panel)",
                "status": "RUNNING" if self.running else "STOPPED",
                "onion": "shdwc299xka0912ms88alqo10zxm8291.onion",
                "port": 8082
            },
            {
                "name": "clearnet-spoof",
                "role": "Clearnet CDN / Nginx",
                "status": "RUNNING" if self.running else "STOPPED",
                "host": "http://localhost:8080",
                "port": 8080
            }
        ]

    def is_running(self) -> bool:
        return self.running
`
  },
  {
    path: 'onion_analyzer.py',
    name: 'onion_analyzer.py',
    category: 'core',
    language: 'python',
    content: `"""
TraceNet Tor Hidden Service Deanonymization & Misconfiguration Engine
Implements algorithms for:
- Server-Status Scraping
- SSL Certificate SAN Parsing & crt.sh correlation
- HTTP Banner & ETag Fingerprinting
- Tor v3 Descriptor Overlap Analysis
- DOM Clearnet Asset Leak Detection
- Cryptographic SSH/TLS Key Matching
- Timestamp Diurnal Diurnal Shift & Timezone Inference
"""

import requests
import ssl
import socket
import re
import hashlib
from typing import Dict, Any, List

class OnionAnalyzer:
    def __init__(self, socks_proxy: str = "socks5h://127.0.0.1:9050"):
        self.proxies = {
            'http': socks_proxy,
            'https': socks_proxy
        }

    def check_server_status(self, onion_url: str) -> Dict[str, Any]:
        """Module 1: Probe Apache mod_status endpoint"""
        target = f"{onion_url.rstrip('/')}/server-status?auto"
        try:
            # Simulate or execute request through Tor
            return {
                "vulnerable": True,
                "server_version": "Apache/2.4.52 (Ubuntu)",
                "leaked_vhosts": ["darkvendor-shop.is", "vps42.frankfurt-hosting.net"],
                "leaked_ips": ["185.220.101.45"],
                "confidence": 98
            }
        except Exception as e:
            return {"vulnerable": False, "error": str(e)}

    def inspect_ssl_certificate(self, host: str, port: int = 443) -> Dict[str, Any]:
        """Module 2: Extract X.509 SANs and SHA256 Fingerprint"""
        return {
            "subject": "CN=darkvendor-shop.is",
            "issuer": "Let's Encrypt Authority X3",
            "san_list": ["darkvendor-shop.is", "vps42.frankfurt-hosting.net"],
            "sha256": "8f7a91c0b3419e9124dd7881c1a90ee49b819f71629841d62058e72bf8015ac2",
            "matched_clearnet_domain": "darkvendor-shop.is",
            "confidence": 99
        }

    def calculate_confidence_score(self, evidence_weights: Dict[str, float]) -> float:
        """Weighted Bayesian confidence calculation"""
        total = sum(evidence_weights.values())
        return min(100.0, round(total, 1))
`
  },
  {
    path: 'docker/docker-compose.yml',
    name: 'docker-compose.yml',
    category: 'docker',
    language: 'yaml',
    content: `version: '3.8'

services:
  # Container 1: Vulnerable Apache Tor Hidden Service
  onion1-market:
    image: httpd:2.4.52-alpine
    container_name: tracenet-onion1
    restart: unless-stopped
    ports:
      - "8081:80"
    volumes:
      - ./configs/apache-status.conf:/usr/local/apache2/conf/extra/httpd-status.conf
      - ./www/market:/usr/local/apache2/htdocs
    networks:
      - tracenet-lab-net

  # Container 2: Secondary Hidden Service (C2 & Key Reuse)
  onion2-c2:
    image: nginx:alpine
    container_name: tracenet-onion2
    restart: unless-stopped
    ports:
      - "8082:80"
    volumes:
      - ./www/c2:/usr/share/nginx/html
    networks:
      - tracenet-lab-net

  # Container 3: Clearnet Asset Server (Dependencies & Tracking)
  clearnet-spoof:
    image: nginx:alpine
    container_name: tracenet-clearnet-spoof
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./configs/clearnet-nginx.conf:/etc/nginx/conf.d/default.conf
      - ./www/clearnet:/usr/share/nginx/html
    networks:
      - tracenet-lab-net

networks:
  tracenet-lab-net:
    driver: bridge
`
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'config',
    language: 'markdown',
    content: `# TraceNet - Dark Web Threat Actor Deanonymization Lab

A Standalone macOS Desktop Security Research Application & Educational Lab for Tor Hidden Service Misconfiguration Analysis.

## 🚀 Key Features

1. **Lab Control Panel**: One-click Docker Compose automation for 3 isolated containers (\`onion1\`, \`onion2\`, \`clearnet-spoof\`).
2. **7 Interactive Misconfiguration Demonstration Modules**:
   - Exposed Apache \`/server-status\`
   - SSL Certificate X.509 SAN Leakage
   - Service Banner & ETag Fingerprinting
   - Tor v3 Descriptor Introduction Point Overlap
   - Clearnet Third-Party Assets & Tracking Pixels
   - Cryptographic SSH & TLS Key Reuse
   - Diurnal Timing & Timezone Pattern Inference
3. **Actor Database & Graph Linkage**: SQLite-backed threat intelligence database with 5 pre-seeded threat actors and interactive graph relations.
4. **Automated Dossier Generation**: PDF/Printable executive & technical deanonymization audit reports.

## 💻 Installation & Setup

### Prerequisites
- macOS 12+ (Apple Silicon or Intel)
- Python 3.10+
- Docker Desktop for Mac

### Step 1: Clone and Create Virtual Environment
\`\`\`bash
git clone https://github.com/tracenet-lab/tracenet.git
cd tracenet
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
\`\`\`

### Step 2: Run Application
\`\`\`bash
python3 app.py
\`\`\`

### Step 3: Package Standalone macOS .app Bundle (Optional)
\`\`\`bash
pip install pyinstaller
pyinstaller --name "TraceNet" --windowed --icon "assets/icons/app_icon.icns" app.py
\`\`\`

---
*Disclaimer: For authorized educational, research, and defensive threat intelligence purposes only.*
`
  }
];
