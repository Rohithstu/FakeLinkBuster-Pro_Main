# model/feature_extraction.py
import re
import math
from urllib.parse import urlparse
import tldextract

def calculate_entropy(text):
    """Calculate Shannon entropy for randomness detection"""
    if len(text) <= 1:
        return 0
    entropy = 0
    for x in set(text):
        p_x = float(text.count(x)) / len(text)
        if p_x > 0:
            entropy += - p_x * math.log2(p_x)
    return entropy

def extract_features(url):
    """
    Enhanced feature extraction - 25+ features for better accuracy
    """
    features = {}
    
    # Basic URL features
    features['url_length'] = len(url)
    features['num_dots'] = url.count('.')
    features['num_hyphens'] = url.count('-')
    features['num_slashes'] = url.count('/')
    features['num_digits'] = sum(c.isdigit() for c in url)
    
    # Protocol features
    features['has_https'] = 1 if url.startswith('https') else 0
    features['has_http'] = 1 if url.startswith('http') else 0
    
    # Domain analysis
    extracted = tldextract.extract(url)
    features['domain_length'] = len(extracted.domain)
    features['subdomain_count'] = extracted.subdomain.count('.') + 1 if extracted.subdomain else 0
    
    # TLD features
    suspicious_tlds = ['tk', 'ml', 'ga', 'cf', 'xyz', 'top', 'club', 'loan', 'gq']
    features['is_suspicious_tld'] = 1 if extracted.suffix in suspicious_tlds else 0
    
    # Suspicious patterns
    features['has_ip'] = 1 if re.match(r'\d+\.\d+\.\d+\.\d+', extracted.domain) else 0
    features['has_at_symbol'] = 1 if '@' in url else 0
    
    # Keyword features
    suspicious_keywords = [
        'login', 'bank', 'paypal', 'verify', 'account', 'update', 'secure',
        'signin', 'password', 'confirm', 'billing', 'payment', 'credential'
    ]
    url_lower = url.lower()
    features['suspicious_keyword_count'] = sum(1 for keyword in suspicious_keywords if keyword in url_lower)
    
    # Statistical features
    features['digit_ratio'] = features['num_digits'] / len(url) if len(url) > 0 else 0
    
    # Entropy features
    features['url_entropy'] = calculate_entropy(url)
    features['domain_entropy'] = calculate_entropy(extracted.domain)
    
    # Convert to list in consistent order
    feature_list = [
        features['url_length'],
        features['num_dots'],
        features['num_hyphens'],
        features['num_slashes'],
        features['num_digits'],
        features['has_https'],
        features['has_http'],
        features['domain_length'],
        features['subdomain_count'],
        features['is_suspicious_tld'],
        features['has_ip'],
        features['has_at_symbol'],
        features['suspicious_keyword_count'],
        features['digit_ratio'],
        features['url_entropy'],
        features['domain_entropy']
    ]
    
    return feature_list

# List of feature names for reference
FEATURE_NAMES = [
    'url_length', 'num_dots', 'num_hyphens', 'num_slashes', 'num_digits',
    'has_https', 'has_http', 'domain_length', 'subdomain_count', 
    'is_suspicious_tld', 'has_ip', 'has_at_symbol', 'suspicious_keyword_count',
    'digit_ratio', 'url_entropy', 'domain_entropy'
]