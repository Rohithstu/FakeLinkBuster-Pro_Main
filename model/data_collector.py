# model/data_collector.py
import pandas as pd
import requests
import os
from datetime import datetime

class DataCollector:
    def __init__(self):
        self.data_dir = os.path.join("backend", "data", "training")
        os.makedirs(self.data_dir, exist_ok=True)
    
    def get_sample_malicious_urls(self):
        """Get sample malicious URLs for training"""
        return [
            "http://paypal-verify-security.xyz/login.php",
            "https://bank-account-secure.gq/update",
            "http://185.62.58.45/login/microsoft/authenticate",
            "https://facebook-password-reset.tk/confirm",
            "http://netflix-payment-update.cf/billing",
            "https://apple-id-verify-account.ga/confirm",
            "http://urgent-security-alert.top/verify",
            "https://google-account-recovery.club/login",
            "http://win-free-iphone.ml/claim",
            "https://account-suspended-alert.xyz/reactivate"
        ]
    
    def get_sample_safe_urls(self):
        """Get sample safe URLs for training"""
        return [
            "https://www.google.com",
            "https://github.com/python/cpython",
            "https://stackoverflow.com/questions/tagged/python",
            "https://www.wikipedia.org/wiki/Machine_learning",
            "https://www.nytimes.com/section/technology",
            "https://www.youtube.com/watch?v=educational",
            "https://www.amazon.com/gp/bestsellers",
            "https://www.facebook.com/marketplace",
            "https://www.instagram.com/explore/tags/nature",
            "https://www.linkedin.com/learning/machine-learning"
        ]
    
    def create_training_dataset(self, num_samples=200):
        """Create balanced training dataset"""
        print("📊 Creating training dataset...")
        
        # Get URLs
        malicious_urls = self.get_sample_malicious_urls() * (num_samples // 20)
        safe_urls = self.get_sample_safe_urls() * (num_samples // 20)
        
        # Balance the dataset
        min_samples = min(len(malicious_urls), len(safe_urls), num_samples // 2)
        malicious_urls = malicious_urls[:min_samples]
        safe_urls = safe_urls[:min_samples]
        
        # Combine and label
        all_urls = malicious_urls + safe_urls
        labels = [1] * len(malicious_urls) + [0] * len(safe_urls)
        
        # Create DataFrame
        df = pd.DataFrame({'url': all_urls, 'label': labels})
        
        # Save to CSV
        filename = f"training_dataset_{datetime.now().strftime('%Y%m%d')}.csv"
        filepath = os.path.join(self.data_dir, filename)
        df.to_csv(filepath, index=False)
        
        print(f"✅ Created dataset: {len(df)} URLs")
        print(f"   - Malicious: {len(malicious_urls)}")
        print(f"   - Safe: {len(safe_urls)}")
        print(f"   - Saved to: {filepath}")
        
        return df

if __name__ == "__main__":
    collector = DataCollector()
    dataset = collector.create_training_dataset(200)