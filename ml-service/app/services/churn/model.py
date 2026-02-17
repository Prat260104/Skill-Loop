import random

class ChurnPredictor:
    def __init__(self):
        # In a real scenario, we would load a trained model here
        # self.model = joblib.load("churn_rf_model.pkl")
        pass

    def predict(self, days_since_login: int, sessions_attended: int, profile_score: int):
        """
        Predicts churn probability using heuristic logic mimicking a Random Forest model.
        
        Features:
        - days_since_login: High impact
        - sessions_attended: Medium impact
        - profile_score: Low impact
        """
        
        # 1. Base Score (Start with 0 risk)
        churn_risk = 0.0

        # 2. Factor: Inactivity (Most critical)
        if days_since_login > 30:
            churn_risk += 0.8  # Very high risk
        elif days_since_login > 15:
            churn_risk += 0.5  # Moderate risk
        elif days_since_login > 7:
            churn_risk += 0.2  # Low risk

        # 3. Factor: Engagement (Sessions)
        if sessions_attended == 0:
            churn_risk += 0.1
        elif sessions_attended > 5:
            churn_risk -= 0.1  # Highly engaged users are safe

        # 4. Factor: Profile Completion
        if profile_score < 50:
            churn_risk += 0.05
        
        # 5. Random Noise (To simulate ML variability)
        churn_risk += random.uniform(-0.05, 0.05)

        # Clamp between 0 and 1
        return max(0.0, min(1.0, churn_risk))

# Singleton instance
churn_model = ChurnPredictor()
