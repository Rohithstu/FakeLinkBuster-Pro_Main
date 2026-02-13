# model/train_model.py
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import os
from feature_extraction import extract_features, FEATURE_NAMES
from data_collector import DataCollector

def train_ml_model():
    """Train the ML model with enhanced features"""
    print("🚀 Starting ML Model Training...")
    
    # Step 1: Get or create training data
    collector = DataCollector()
    
    # Check if we have existing data, else create sample data
    data_dir = os.path.join("backend", "data", "training")
    csv_files = [f for f in os.listdir(data_dir) if f.endswith('.csv')]
    
    if csv_files:
        # Use latest training data
        latest_file = sorted(csv_files)[-1]
        csv_path = os.path.join(data_dir, latest_file)
        df = pd.read_csv(csv_path)
        print(f"📂 Using existing dataset: {latest_file}")
    else:
        # Create new training data
        df = collector.create_training_dataset(200)
        csv_path = os.path.join(data_dir, f"training_dataset_{pd.Timestamp.now().strftime('%Y%m%d')}.csv")
    
    print(f"📊 Dataset: {len(df)} URLs")
    print(f"🎯 Labels: {sum(df['label'])} malicious, {len(df)-sum(df['label'])} safe")
    
    # Step 2: Extract features
    print("🔧 Extracting features...")
    features_list = []
    labels_list = []
    
    for idx, row in df.iterrows():
        try:
            features = extract_features(row['url'])
            features_list.append(features)
            labels_list.append(row['label'])
        except Exception as e:
            print(f"❌ Error processing URL {idx}: {e}")
            continue
    
    X = np.array(features_list)
    y = np.array(labels_list)
    
    print(f"✅ Features extracted: {X.shape[1]} features")
    
    # Step 3: Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Step 4: Train model
    print("🤖 Training Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=15,
        min_samples_split=5,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    # Step 5: Evaluate model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"✅ Model trained successfully!")
    print(f"🎯 Test Accuracy: {accuracy:.2%}")
    print("\n📊 Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Safe', 'Malicious']))
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': FEATURE_NAMES,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\n🔍 Feature Importance:")
    print(feature_importance.head(10))
    
    # Step 6: Save model
    model_dir = os.path.join("backend", "model")
    os.makedirs(model_dir, exist_ok=True)
    
    model_path = os.path.join(model_dir, "phishing_model.pkl")
    joblib.dump(model, model_path)
    
    print(f"💾 Model saved to: {model_path}")
    
    return model, accuracy

if __name__ == "__main__":
    model, accuracy = train_ml_model()
    print(f"\n🎉 Training completed! Accuracy: {accuracy:.2%}")