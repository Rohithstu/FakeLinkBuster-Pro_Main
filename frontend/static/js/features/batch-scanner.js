// Batch scanning functionality
class BatchScanner {
    constructor() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const batchScanBtn = document.getElementById('startBatchScan');
        if (batchScanBtn) {
            batchScanBtn.addEventListener('click', () => this.startBatchScan());
        }
    }
    
    async startBatchScan() {
        const urlsText = document.getElementById('batchUrls').value;
        const urls = urlsText.split('\n').filter(url => url.trim() !== '');
        
        if (urls.length === 0) {
            alert('Please enter at least one URL');
            return;
        }
        
        try {
            const results = await API.scanBatch(urls);
            this.displayBatchResults(results);
        } catch (error) {
            console.error('Batch scan failed:', error);
            alert('Batch scan failed. Please try again.');
        }
    }
    
    displayBatchResults(results) {
        // Display batch scan results
        console.log('Batch results:', results);
    }
}