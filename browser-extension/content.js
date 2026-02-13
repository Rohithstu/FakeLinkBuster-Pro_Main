// Content script for LinkBuster AI
console.log('🔗 LinkBuster AI Content Script Loaded');

class ContentProtection {
    constructor() {
        this.currentWarning = null;
        this.init();
    }

    init() {
        this.setupMessageListener();
        this.scanCurrentPage();
        this.setupMutationObserver();
        this.startKeepAlive();
        
        console.log('✅ Content protection initialized');
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            console.log('📨 Content script received:', request.action);
            
            switch (request.action) {
                case 'showWarning':
                    this.showWarningOverlay(request.url, request.result);
                    sendResponse({ success: true });
                    break;
                    
                case 'updateWarning':
                    this.updateWarningOverlay(request.result);
                    sendResponse({ success: true });
                    break;
                    
                case 'ping':
                    sendResponse({ alive: true, content: 'active' });
                    break;
            }
            
            return true;
        });
    }

    setupMutationObserver() {
        // Watch for new links added dynamically
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        this.scanLinksInNode(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    scanLinksInNode(node) {
        const links = node.querySelectorAll ? node.querySelectorAll('a[href]') : [];
        links.forEach(link => {
            this.monitorLinkClick(link);
        });
    }

    monitorLinkClick(link) {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('http')) {
                this.prescanLink(href, event);
            }
        }, true);
    }

    prescanLink(url, event) {
        chrome.runtime.sendMessage({
            action: 'scanUrl',
            url: url
        }, (response) => {
            if (response && response.risk_score >= 70) {
                this.showLinkWarning(url, response, event);
            }
        });
    }

    showLinkWarning(url, result, event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #d32f2f;
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;

        warning.innerHTML = `
            <h3 style="margin: 0 0 10px 0;">🚨 Dangerous Link</h3>
            <p style="margin: 0 0 15px 0;">Risk Score: ${result.risk_score}%</p>
            <button id="proceed-link" style="background: white; color: #d32f2f; border: none; padding: 8px 15px; margin: 5px; border-radius: 5px; cursor: pointer;">
                Proceed Anyway
            </button>
            <button id="cancel-link" style="background: transparent; color: white; border: 1px solid white; padding: 8px 15px; margin: 5px; border-radius: 5px; cursor: pointer;">
                Stay Safe
            </button>
        `;

        document.body.appendChild(warning);

        document.getElementById('proceed-link').addEventListener('click', () => {
            warning.remove();
            window.location.href = url;
        });

        document.getElementById('cancel-link').addEventListener('click', () => {
            warning.remove();
        });

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (document.body.contains(warning)) {
                warning.remove();
            }
        }, 10000);
    }

    scanCurrentPage() {
        if (document.location.href.startsWith('http')) {
            chrome.runtime.sendMessage({
                action: 'scanUrl',
                url: document.location.href
            }, (response) => {
                if (response && response.risk_score >= 70) {
                    this.showWarningOverlay(document.location.href, response);
                }
            });
        }

        // Monitor all existing links
        this.monitorAllLinks();
    }

    monitorAllLinks() {
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            this.monitorLinkClick(link);
        });
    }

    showWarningOverlay(url, result) {
        this.removeExistingWarning();
        
        const warningDiv = document.createElement('div');
        warningDiv.id = 'linkbuster-warning-overlay';
        warningDiv.innerHTML = this.generateWarningHTML(url, result);
        
        document.body.prepend(warningDiv);
        this.setupWarningEvents(warningDiv, url);
        
        this.currentWarning = warningDiv;
    }

    generateWarningHTML(url, result) {
        return `
            <div style="position: fixed; top: 0; left: 0; width: 100%; background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%); color: white; padding: 15px; z-index: 10000; text-align: center; font-family: Arial, sans-serif; box-shadow: 0 2px 20px rgba(0,0,0,0.5);">
                <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;">
                    <div style="text-align: left;">
                        <strong style="font-size: 16px;">🚨 LinkBuster AI Warning</strong>
                        <div style="font-size: 12px; opacity: 0.9;">Risk Score: ${result.risk_score}% • ${this.getDomain(url)}</div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button id="linkbuster-leave" style="background: white; color: #d32f2f; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 12px;">
                            🏠 Leave Site
                        </button>
                        <button id="linkbuster-details" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.5); padding: 8px 16px; border-radius: 5px; cursor: pointer; font-size: 12px;">
                            📊 Details
                        </button>
                        <button id="linkbuster-dismiss" style="background: transparent; color: white; border: 1px solid rgba(255,255,255,0.5); padding: 8px 16px; border-radius: 5px; cursor: pointer; font-size: 12px;">
                            ✕ Dismiss
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupWarningEvents(warningDiv, url) {
        document.getElementById('linkbuster-leave').addEventListener('click', () => {
            window.location.href = 'https://www.google.com';
        });

        document.getElementById('linkbuster-details').addEventListener('click', () => {
            chrome.runtime.sendMessage({
                action: 'openDetails',
                url: url
            });
        });

        document.getElementById('linkbuster-dismiss').addEventListener('click', () => {
            this.removeExistingWarning();
        });

        // Auto-dismiss after 30 seconds
        setTimeout(() => {
            this.removeExistingWarning();
        }, 30000);
    }

    updateWarningOverlay(result) {
        if (this.currentWarning) {
            const riskElement = this.currentWarning.querySelector('strong');
            if (riskElement) {
                riskElement.innerHTML = `🚨 LinkBuster AI Warning • Risk: ${result.risk_score}%`;
            }
        }
    }

    removeExistingWarning() {
        if (this.currentWarning) {
            this.currentWarning.remove();
            this.currentWarning = null;
        }
        
        const existing = document.getElementById('linkbuster-warning-overlay');
        if (existing) existing.remove();
    }

    getDomain(url) {
        try {
            return new URL(url).hostname;
        } catch {
            return url;
        }
    }

    startKeepAlive() {
        setInterval(() => {
            chrome.runtime.sendMessage({action: 'ping'}, (response) => {
                if (chrome.runtime.lastError) {
                    console.log('Service worker might be inactive');
                }
            });
        }, 15000);
    }
}

// Initialize content protection when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ContentProtection();
    });
} else {
    new ContentProtection();
}