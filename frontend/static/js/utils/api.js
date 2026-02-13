// API utility functions
class API {
    static async getDashboardStats() {
        const response = await fetch('/api/dashboard-stats');
        return await response.json();
    }
    
    static async scanBatch(urls) {
        const response = await fetch('/api/scan-batch', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({urls: urls})
        });
        return await response.json();
    }
    
    static async getScanHistory() {
        const response = await fetch('/api/scan-history');
        return await response.json();
    }
}