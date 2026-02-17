import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

class ChurnPredictor:
    def __init__(self):
        self.model_path = "churn_rf_model.pkl"
        self.data_path = "churn_training_data.csv"
        self.pipeline = None
        
        # Load or Train
        if os.path.exists(self.model_path):
            self.pipeline = joblib.load(self.model_path)
            print("✅ Loaded existing Churn Pipeline (Scaler + RF).")
        else:
            print("⚠️ Model not found. Starting training pipeline...")
            self.train_model()

    def generate_synthetic_data(self):
        """
        Simulates fetching 1 year of historical user data from a Data Warehouse.
        """
        np.random.seed(42)
        n_samples = 5000
        
        # Feature 1: Days Since Last Login (0 to 60 days)
        days_since_login = np.concatenate([
            np.random.normal(3, 2, 2500),   # Active users
            np.random.normal(45, 10, 2500)  # Inactive users
        ])
        days_since_login = np.clip(days_since_login, 0, 100).astype(int)

        # Feature 2: Sessions Attended (0 to 50)
        sessions_attended = []
        for days in days_since_login:
            if days < 7:
                sessions_attended.append(np.random.randint(5, 50))
            else:
                sessions_attended.append(np.random.randint(0, 5))
        
        # Feature 3: Profile Completion Score (0 to 100)
        # Introduce some missing values (NaNs) to test Imputer
        profile_score = np.random.randint(20, 100, n_samples).astype(float)
        profile_score[np.random.choice(n_samples, 50, replace=False)] = np.nan # 50 missing values
        
        df = pd.DataFrame({
            'days_since_login': days_since_login,
            'sessions_attended': sessions_attended,
            'profile_score': profile_score
        })
        
        # LABEL GENERATION
        churn_labels = []
        for _, row in df.iterrows():
            churn = 0
            if row['days_since_login'] > 21: churn = 1
            elif row['days_since_login'] > 14 and row['sessions_attended'] < 2: churn = 1
            elif row['profile_score'] < 30 and row['days_since_login'] > 10: churn = 1
                
            if np.random.random() < 0.05: churn = 1 - churn
            churn_labels.append(churn)
            
        df['churn'] = churn_labels
        df.to_csv(self.data_path, index=False)
        print(f"📊 Generated {n_samples} historical records (with missing values) in '{self.data_path}'")
        return df

    def train_model(self):
        """
        Trains the Production Pipeline: Imputer -> Scaler -> Balanced Random Forest.
        """
        if os.path.exists(self.data_path):
            df = pd.read_csv(self.data_path)
        else:
            df = self.generate_synthetic_data()

        X = df[['days_since_login', 'sessions_attended', 'profile_score']]
        y = df['churn']

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # PRODUCTION PIPELINE DESIGN
        # 1. SimpleImputer: Fills missing values (e.g., avg profile score) so model doesn't crash.
        # 2. StandardScaler: Normalizes features to standard scale.
        # 3. RandomForest (Balanced): Handles Class Imbalance (e.g., if Churn is only 10% of users).
        pipeline = Pipeline([
            ('imputer', SimpleImputer(strategy='mean')),
            ('scaler', StandardScaler()), 
            ('rf', RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42))
        ])
        
        pipeline.fit(X_train, y_train)

        y_pred = pipeline.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        print(f"🚀 Production Pipeline Trained! Accuracy: {acc*100:.2f}%")
        print(classification_report(y_test, y_pred))

        self.pipeline = pipeline
        joblib.dump(self.pipeline, self.model_path)

    def predict(self, days_since_login: int, sessions_attended: int, profile_score: int):
        if not self.pipeline:
            self.train_model()
            
        input_data = pd.DataFrame([[days_since_login, sessions_attended, profile_score]], 
                                columns=['days_since_login', 'sessions_attended', 'profile_score'])
        
        return self.pipeline.predict_proba(input_data)[0][1]

# Singleton instance
churn_model = ChurnPredictor()
