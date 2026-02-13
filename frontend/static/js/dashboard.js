class Dashboard {
    constructor() {
        this.init();
        this.loadRealTimeData();
        this.setupEventListeners();
    }

    init() {
        this.initCharts();
        this.initThreatMap();
        this.startLiveUpdates();
    }

    setupEventListeners() {
        // URL scanning
        document.getElementById('scanBtn').addEventListener('click', () => this.scanURL());
        document.getElementById('urlInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.scanURL();
        });

        // Quick test buttons
        document.querySelectorAll('.quick-urls button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.getElementById('urlInput').value = e.target.dataset.url;
                this.scanURL();
            });
        });

        // Batch scan modal
        document.getElementById('batchScanBtn').addEventListener('click', () => {
            this.showBatchScanModal();
        });

        // Schedule scan modal
        document.getElementById('scheduleScanBtn').addEventListener('click', () => {
            this.showScheduleModal();
        });
    }

    async scanURL() {
        const url = document.getElementById('urlInput').value.trim();
        if (!url) return;

        const scanBtn = document.getElementById('scanBtn');
        const originalText = scanBtn.innerHTML;
        
        // Show loading state
        scanBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>AI Analyzing...';
        scanBtn.disabled = true;

        try {
            const response = await fetch('/ai-scan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `url=${encodeURIComponent(url)}`
            });

            if (response.ok) {
                this.showScanResults();
                this.updateDashboardStats();
                this.addToScanHistory(url, 85, 'Suspicious'); // Mock data
            }
        } catch (error) {
            console.error('Scan failed:', error);
            this.showError('Scan failed. Please try again.');
        } finally {
            scanBtn.innerHTML = originalText;
            scanBtn.disabled = false;
        }
    }

    showScanResults() {
        const resultsDiv = document.getElementById('scanResults');
        resultsDiv.style.display = 'block';

        // Simulate AI analysis animation
        this.animateRiskMeter(85);
        this.showAIInsights();
        this.updateThreatIndicators();
    }

    animateRiskMeter(score) {
        const riskFill = document.getElementById('riskFill');
        const riskScore = document.getElementById('riskScore');
        
        let currentScore = 0;
        const interval = setInterval(() => {
            if (currentScore >= score) {
                clearInterval(interval);
                return;
            }
            currentScore += 1;
            riskFill.style.width = `${currentScore}%`;
            riskScore.textContent = `${currentScore}%`;
            
            // Update color based on score
            if (currentScore < 30) {
                riskFill.style.background = 'var(--success-gradient)';
            } else if (currentScore < 70) {
                riskFill.style.background = 'var(--warning-gradient)';
            } else {
                riskFill.style.background = 'var(--danger-gradient)';
            }
        }, 20);
    }

    showAIInsights() {
        const insights = [
            '🔍 URL structure analysis completed',
            '🤖 AI pattern recognition active',
            '🌐 Domain reputation checked',
            '⚠️ Suspicious keywords detected',
            '📊 Behavioral analysis in progress'
        ];

        const insightsList = document.getElementById('aiInsightsList');
        insightsList.innerHTML = '';

        insights.forEach((insight, index) => {
            setTimeout(() => {
                const li = document.createElement('li');
                li.textContent = insight;
                li.style.opacity = '0';
                li.style.transform = 'translateX(-20px)';
                insightsList.appendChild(li);
                
                // Animate in
                setTimeout(() => {
                    li.style.opacity = '1';
                    li.style.transform = 'translateX(0)';
                    li.style.transition = 'all 0.3s ease';
                }, 100);
            }, index * 300);
        });
    }

    updateThreatIndicators() {
        const indicators = ['phishingIndicator', 'malwareIndicator', 'suspiciousIndicator'];
        
        indicators.forEach((id, index) => {
            setTimeout(() => {
                const indicator = document.getElementById(id);
                indicator.style.background = 'var(--warning-gradient)';
                indicator.style.transform = 'scale(1.1)';
                indicator.style.transition = 'all 0.3s ease';
            }, index * 500);
        });
    }

    initCharts() {
        // Threat trend chart
        this.threatTrendChart = new ApexCharts(document.getElementById('threatTrendChart'), {
            series: [{
                name: 'Threats Detected',
                data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
            }],
            chart: {
                height: 350,
                type: 'line',
                zoom: { enabled: false },
                foreColor: '#fff'
            },
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth' },
            title: { text: 'Threat Detection Trend', align: 'left' },
            grid: { borderColor: '#555' },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
            }
        });
        this.threatTrendChart.render();

        // Predictive analysis chart
        this.predictiveChart = new ApexCharts(document.getElementById('predictiveChart'), {
            series: [44, 55, 41],
            chart: {
                type: 'donut',
                height: 300
            },
            labels: ['Low Risk', 'Medium Risk', 'High Risk'],
            colors: ['#4CAF50', '#FF9800', '#F44336'],
            legend: { position: 'bottom' }
        });
        this.predictiveChart.render();
    }

    initThreatMap() {
        // Simplified threat map visualization
        const threatMap = document.getElementById('threatMap');
        threatMap.innerHTML = `
            <div class="threat-map-container">
                <div class="map-point" style="top: 20%; left: 30%" data-threats="15"></div>
                <div class="map-point" style="top: 40%; left: 60%" data-threats="8"></div>
                <div class="map-point" style="top: 70%; left: 45%" data-threats="23"></div>
                <div class="map-point" style="top: 55%; left: 25%" data-threats="5"></div>
            </div>
        `;
    }

    loadRealTimeData() {
        // Simulate real-time data updates
        setInterval(() => {
            this.updateLiveThreats();
            this.updateThreatFeed();
        }, 5000);
    }

    updateLiveThreats() {
        const threats = ['Phishing campaign detected', 'New malware variant', 'Suspicious domain registered'];
        const feed = document.getElementById('threatFeed');
        
        const newThreat = document.createElement('div');
        newThreat.className = 'threat-item';
        newThreat.innerHTML = `
            <i class="fas fa-exclamation-circle text-warning"></i>
            <span>${threats[Math.floor(Math.random() * threats.length)]}</span>
            <small class="text-muted">Just now</small>
        `;
        
        feed.insertBefore(newThreat, feed.firstChild);
        if (feed.children.length > 5) {
            feed.removeChild(feed.lastChild);
        }
    }

    updateDashboardStats() {
        // Animate stat counters
        this.animateCounter('protectedCount', 1247);
        this.animateCounter('safeCount', 893);
        this.animateCounter('suspiciousCount', 254);
        this.animateCounter('threatsBlocked', 100);
    }

    animateCounter(elementId, target) {
        const element = document.getElementById(elementId);
        let current = parseInt(element.textContent) || 0;
        const increment = target > current ? 1 : -1;
        const step = Math.abs(target - current) / 50;

        const updateCounter = () => {
            current += increment * step;
            if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                element.textContent = target;
                return;
            }
            element.textContent = Math.round(current);
            requestAnimationFrame(updateCounter);
        };
        updateCounter();
    }

    showBatchScanModal() {
        // Implement batch scan modal logic
        console.log('Batch scan modal opened');
    }

    showScheduleModal() {
        // Implement schedule modal logic
        console.log('Schedule modal opened');
    }

    showError(message) {
        // Show error notification
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.container-fluid').insertBefore(alert, document.querySelector('.row'));
    }

    startLiveUpdates() {
        // Start live data updates
        setInterval(() => {
            this.updateGlobalThreats();
        }, 10000);
    }

    updateGlobalThreats() {
        document.getElementById('globalThreats').textContent = 
            (1247 + Math.floor(Math.random() * 10)).toLocaleString();
        document.getElementById('activeAttacks').textContent = 
            (89 + Math.floor(Math.random() * 5)).toLocaleString();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});