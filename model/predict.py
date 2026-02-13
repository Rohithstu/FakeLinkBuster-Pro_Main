# model/predict.py
import os
import joblib
import numpy as np
from feature_extraction import extract_features

# Fix the model path - point to correct location
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "backend", "model", "phishing_model.pkl")

# Lazy load model
_model = None

def _load_model():
    global _model
    if _model is None:
        print(f"🔍 Looking for model at: {MODEL_PATH}")
        print(f"🔍 File exists: {os.path.exists(MODEL_PATH)}")
        
        if not os.path.exists(MODEL_PATH):
            # Try alternative path
            alt_path = os.path.join("backend", "model", "phishing_model.pkl")
            print(f"🔍 Trying alternative path: {alt_path}")
            print(f"🔍 Alternative exists: {os.path.exists(alt_path)}")
            
            if os.path.exists(alt_path):
                MODEL_PATH = alt_path
            else:
                raise FileNotFoundError(f"Model file not found at {MODEL_PATH}. Run train_model.py first.")
        
        _model = joblib.load(MODEL_PATH)
        print("✅ ML Model loaded successfully!")
    return _model

def predict_url(url):
    """
    Predict if a URL is malicious using the trained ML model
    
    Returns:
        prediction: 1 (malicious) or 0 (safe)
        confidence: Probability score (0-100%)
        features: Extracted features for debugging
    """
    try:
        model = _load_model()
        features = extract_features(url)
        X = np.array(features).reshape(1, -1)
        
        # Get prediction
        prediction = model.predict(X)[0]
        
        # Get probability
        try:
            probability = model.predict_proba(X)[0]
            confidence = probability[1] if prediction == 1 else probability[0]
            confidence_percent = confidence * 100
        except:
            confidence_percent = 50.0  # Default if proba not available
        
        return {
            'prediction': int(prediction),
            'confidence': float(confidence_percent),
            'is_malicious': bool(prediction),
            'features_used': len(features)
        }
        
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return {
            'prediction': 0,
            'confidence': 0.0,
            'is_malicious': False,
            'error': str(e)
        }

def batch_predict_urls(urls):
    """Predict multiple URLs at once"""
    results = []
    for url in urls:
        result = predict_url(url)
        result['url'] = url
        results.append(result)
    return results

# Test the prediction
if __name__ == "__main__":
    print("🧪 Testing ML Model Prediction...")
    test_urls = [
        "https://www.google.com",
        "http://paypal-verify-security.xyz/login.php"
    ]
    
    for url in test_urls:
        result = predict_url(url)
        print(f"🔗 {url}")
        print(f"   Result: {'🚨 MALICIOUS' if result['is_malicious'] else '✅ SAFE'}")
        print(f"   Confidence: {result['confidence']:.1f}%")
        print(f"   Features: {result['features_used']}")
        print()