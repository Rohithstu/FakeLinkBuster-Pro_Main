// popup.js - LinkBuster AI Popup Interface
class PopupInterface {
    constructor() {
        this.currentUrl = '';
        this.currentResult = null;
        this.init();
    }

    async init() {
        try {
            await this.initializePopup();
            this.setupEventListeners();
            this.startAutoRefresh();
            
            console.log('✅ Popup initialized successfully');
        } catch (error) {
            console.error('❌ Popup initialization failed:', error);
            this.showError('Failed to load extension data');
        }
    }

    async initializePopup() {
        // Load current tab info
        await this.loadCurrentTab();
        
        // Load statistics
        await this.loadStats();
        
        // Test connections
        await this.testConnections();
        
        // Update current time
        this.updateCurrentTime();
    }

    async loadCurrentTab() {
        try {
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            this.currentUrl = tab.url;
            
            if (tab.url.startsWith('http')) {
                document.getElementById('scanCurrent').disabled = false;
            } else {
                document.getElementById('scanCurrent').disabled = true;
                document.getElementById('scanCurrent').innerHTML = '<span>🔍</span> Cannot Scan This Page';
            }
        } catch (error) {
            console.log('Could not get current tab:', error);
        }
    }

    async loadStats() {
        try {
            const response = await chrome.runtime.sendMessage({action: 'getStats'});
            this.updateStatsDisplay(response);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    }

    updateStatsDisplay(stats) {
        document.getElementById('urlsScanned').textContent = this.formatNumber(stats.urlsScanned || 0);
        document.getElementById('threatsBlocked').textContent = this.formatNumber(stats.threatsBlocked || 0);
        
        if (stats.lastScan) {
            const time = new Date(stats.lastScan.timestamp).toLocaleTimeString();
            document.getElementById('lastScanTime').textContent = time;
            
            // Update risk meter
            const riskFill = document.getElementById('riskFill');
            const riskScore = stats.lastScan.risk_score || 0;
            riskFill.style.width = `${riskScore}%`;
            riskFill.style.background = this.getRiskColor(riskScore);
        }
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    getRiskColor(score) {
        if (score < 30) return '#4CAF50';
        if (score < 70) return '#ff9800';
        return '#f44336';
    }

    async testConnections() {
        try {
            // Test service worker
            const statusResponse = await chrome.runtime.sendMessage({action: 'getStatus'});
            this.updateStatusDisplay(statusResponse);
            
            // Test API connection
            const apiResponse = await chrome.runtime.sendMessage({action: 'testConnection'});
            this.updateApiStatus(apiResponse);
            
        } catch (error) {
            console.error('Connection test failed:', error);
            this.updateApiStatus({connected: false, error: 'Connection failed'});
        }
    }

    updateStatusDisplay(status) {
        const statusElement = document.getElementById('protectionStatus');
        if (status && status.status === 'active') {
            statusElement.textContent = 'Active';
            statusElement.className = 'status-badge status-active';
        } else {
            statusElement.textContent = 'Inactive';
            statusElement.className = 'status-badge status-inactive';
        }
    }

    updateApiStatus(apiResponse) {
        const apiStatus = document.getElementById('apiStatus');
        if (apiResponse.connected) {
            apiStatus.textContent = 'Connected';
            apiStatus.className = 'status-badge status-active';
        } else {
            apiStatus.textContent = 'Simulated';
            apiStatus.className = 'status-badge status-inactive';
        }
    }

    setupEventListeners() {
        // Scan Current Page button
        document.getElementById('scanCurrent').addEventListener('click', () => {
            this.scanCurrentPage();
        });

        // Open Dashboard button
        document.getElementById('openDashboard').addEventListener('click', () => {
            this.openDashboard();
        });

        // Test Protection button
        document.getElementById('testUrls').addEventListener('click', () => {
            this.showTestMenu();
        });

        console.log('✅ Event listeners setup complete');
    }

    async scanCurrentPage() {
        try {
            const button = document.getElementById('scanCurrent');
            const originalText = button.innerHTML;
            
            button.innerHTML = '<span>⏳</span> Scanning...';
            button.disabled = true;

            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            
            if (tab.url.startsWith('http')) {
                const response = await chrome.runtime.sendMessage({
                    action: 'scanUrl',
                    url: tab.url
                });
                
                this.showScanResult(response, tab.url);
                await this.loadStats(); // Refresh stats
                
            } else {
                this.showError('Cannot scan this type of page');
            }

        } catch (error) {
            console.error('Scan failed:', error);
            this.showError('Scan failed: ' + error.message);
        } finally {
            const button = document.getElementById('scanCurrent');
            button.innerHTML = '<span>🔍</span> Scan Current Page';
            button.disabled = false;
        }
    }

    showScanResult(result, url) {
        const domain = new URL(url).hostname;
        let message, icon, color;

        if (result.risk_score >= 70) {
            icon = '🚨';
            color = '#f44336';
            message = `High Risk Detected!\n\nDomain: ${domain}\nRisk Score: ${result.risk_score}%\nThreats: ${result.threats?.join(', ') || 'Suspicious activity'}`;
        } else if (result.risk_score >= 30) {
            icon = '⚠️';
            color = '#ff9800';
            message = `Medium Risk Detected\n\nDomain: ${domain}\nRisk Score: ${result.risk_score}%`;
        } else {
            icon = '✅';
            color = '#4CAF50';
            message = `Safe Website\n\nDomain: ${domain}\nRisk Score: ${result.risk_score}%`;
        }

        // Create a custom alert modal
        this.showModal(icon, message, color);
    }

    showModal(icon, message, color) {
        // Remove existing modal if any
        const existingModal = document.getElementById('linkbuster-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'linkbuster-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div style="background: white; color: #333; padding: 30px; border-radius: 15px; text-align: center; max-width: 300px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                <div style="font-size: 48px; margin-bottom: 15px;">${icon}</div>
                <h3 style="margin: 0 0 15px 0; color: ${color};">Scan Result</h3>
                <p style="margin: 0 0 20px 0; line-height: 1.4; white-space: pre-line;">${message}</p>
                <button id="modal-close" style="background: ${color}; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    OK
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('modal-close').addEventListener('click', () => {
            modal.remove();
        });

        // Auto-close after 5 seconds
        setTimeout(() => {
            if (document.body.contains(modal)) {
                modal.remove();
            }
        }, 5000);
    }

    openDashboard() {
        chrome.tabs.create({url: 'http://localhost:5000'});
    }

    showTestMenu() {
        const testUrls = [
            { name: 'Safe Site (Google)', url: 'https://www.google.com', risk: 5 },
            { name: 'Test Malicious Site', url: 'https://test-malicious.com/fake', risk: 95 },
            { name: 'Test Phishing Site', url: 'https://test-phishing.com/login', risk: 85 },
            { name: 'Test Suspicious Site', url: 'https://test-suspicious.com/download', risk: 65 }
        ];

        const modal = document.createElement('div');
        modal.id = 'linkbuster-test-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div style="background: white; color: #333; padding: 20px; border-radius: 15px; max-width: 350px; max-height: 80vh; overflow-y: auto;">
                <h3 style="margin: 0 0 15px 0; text-align: center;">🧪 Test Protection</h3>
                <p style="margin: 0 0 20px 0; text-align: center; opacity: 0.7;">Test the extension with these URLs</p>
                
                <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                    ${testUrls.map((test, index) => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f5f5f5; border-radius: 5px;">
                            <div>
                                <div style="font-weight: bold;">${test.name}</div>
                                <div style="font-size: 12px; opacity: 0.7;">${test.url}</div>
                            </div>
                            <button class="test-url-btn" data-url="${test.url}" style="background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 12px;">
                                Test
                            </button>
                        </div>
                    `).join('')}
                </div>
                
                <button id="test-modal-close" style="width: 100%; background: #666; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">
                    Close
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners to test buttons
        modal.querySelectorAll('.test-url-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const url = e.target.getAttribute('data-url');
                this.testSpecificUrl(url);
                modal.remove();
            });
        });

        document.getElementById('test-modal-close').addEventListener('click', () => {
            modal.remove();
        });
    }

    async testSpecificUrl(url) {
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'scanUrl',
                url: url
            });
            
            this.showScanResult(response, url);
            await this.loadStats(); // Refresh stats
            
        } catch (error) {
            this.showError('Test failed: ' + error.message);
        }
    }

    showError(message) {
        this.showModal('❌', message, '#f44336');
    }

    updateCurrentTime() {
        const now = new Date();
        document.getElementById('currentTime').textContent = now.toLocaleTimeString();
    }

    startAutoRefresh() {
        // Update time every second
        setInterval(() => {
            this.updateCurrentTime();
        }, 1000);

        // Refresh stats every 3 seconds
        setInterval(() => {
            this.loadStats();
        }, 3000);
    }
}

// Initialize the popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PopupInterface();
});