// warning.js - Warning page functionality
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const url = urlParams.get('url');
    const riskScore = urlParams.get('risk');
    
    if (riskScore) {
        document.getElementById('riskScore').textContent = riskScore + '%';
    }
    
    // Simulate threats for demo
    const threats = [
        'Suspicious domain patterns',
        'Potential phishing content',
        'Unverified security certificate'
    ];
    
    const threatList = document.getElementById('threatList');
    threats.forEach(threat => {
        const li = document.createElement('li');
        li.textContent = threat;
        threatList.appendChild(li);
    });
    
    // Button event listeners
    document.getElementById('goBack').addEventListener('click', function() {
        window.history.back();
    });
    
    document.getElementById('proceedAnyway').addEventListener('click', function() {
        if (url) {
            window.location.href = url;
        } else {
            window.close();
        }
    });
});