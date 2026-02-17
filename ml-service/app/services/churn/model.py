import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

class ChurnPredictor:
    def __init__(self):
        self.model_path = "churn_rf_model.pkl"
        self.data_path = "churn_training_data.csv"
        self.model = None
        
        # Load or Train
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            print("✅ Loaded existing Churn Model.")
        else:
            print("⚠️ Model not found. Starting training pipeline...")
            self.train_model()

    def generate_synthetic_data(self):
        """
        Simulates fetching 1 year of historical user data from a Data Warehouse.
        We create 5000 users with realistic patterns to train our model.
        
        Placement Tip: Tell the interviewer you solved the 'Cold Start Problem' 
        by simulating data based on industry benchmarks.
        """
        np.random.seed(42)
        n_samples = 5000
        
        # Feature 1: Days Since Last Login (0 to 60 days)
        # Mix of active users (0-7 days) and inactive ones (30+ days)
        days_since_login = np.concatenate([
            np.random.normal(3, 2, 2500),   # Active users
            np.random.normal(45, 10, 2500)  # Inactive users
        ])
        days_since_login = np.clip(days_since_login, 0, 100).astype(int)

        # Feature 2: Sessions Attended (0 to 50)
        # Active users usually attend more sessions
        sessions_attended = []
        for days in days_since_login:
            if days < 7:
                sessions_attended.append(np.random.randint(5, 50))
            else:
                sessions_attended.append(np.random.randint(0, 5))
        
        # Feature 3: Profile Completion Score (0 to 100)
        profile_score = np.random.randint(20, 100, n_samples)
        
        # Create DataFrame
        df = pd.DataFrame({
            'days_since_login': days_since_login,
            'sessions_attended': sessions_attended,
            'profile_score': profile_score
        })
        
        # LABEL GENERATION (Ground Truth)
        # Logic: If inactive > 20 days OR (inactive > 14 days AND low sessions), they Churn (1)
        churn_labels = []
        for _, row in df.iterrows():
            churn = 0
            # High Risk Rule
            if row['days_since_login'] > 21:
                churn = 1
            # Medium Risk Rule
            elif row['days_since_login'] > 14 and row['sessions_attended'] < 2:
                churn = 1
            # Profile Completion Rule
            elif row['profile_score'] < 30 and row['days_since_login'] > 10:
                churn = 1
                
            # Add some noise (Real life isn't perfect)
            if np.random.random() < 0.05: # 5% random flip
                churn = 1 - churn
                
            churn_labels.append(churn)
            
        df['churn'] = churn_labels
        
        # Save to CSV (Simulating Data Lake)
        df.to_csv(self.data_path, index=False)
        print(f"📊 Generated {n_samples} historical records in '{self.data_path}'")
        return df

    def train_model(self):
        """
        Trains the Random Forest model using the CSV dataset.
        """
        # 1. Load Data
        if os.path.exists(self.data_path):
            df = pd.read_csv(self.data_path)
        else:
            df = self.generate_synthetic_data()

        # 2. Preprocessing
        X = df[['days_since_login', 'sessions_attended', 'profile_score']]
        y = df['churn']

        # 3. Train/Test Split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # 4. Initialize Random Forest
        # n_estimators=100 -> 100 Decisions Trees (Standard)
        clf = RandomForestClassifier(n_estimators=100, random_state=42)
        
        # 5. Fit
        clf.fit(X_train, y_train)

        # 6. Evaluate
        y_pred = clf.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        print(f"🚀 Model Trained! Accuracy: {acc*100:.2f}%")
        print(classification_report(y_test, y_pred))

        # 7. Save
        self.model = clf
        joblib.dump(self.model, self.model_path)

    def predict(self, days_since_login: int, sessions_attended: int, profile_score: int):
        if not self.model:
            self.train_model()
            
        input_data = pd.DataFrame([[days_since_login, sessions_attended, profile_score]], 
                                columns=['days_since_login', 'sessions_attended', 'profile_score'])
        
        return self.model.predict_proba(input_data)[0][1]

# Singleton instance
churn_model = ChurnPredictor()
