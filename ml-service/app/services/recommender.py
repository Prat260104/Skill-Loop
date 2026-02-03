import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RecommenderSystem:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')

    def _prepare_text_features(self, user):
        """
        Combines relevant user fields into a single text string for TF-IDF.
        
        For a STUDENT (Target), we care about what they WANT.
        For a MENTOR (Candidate), we care about what they OFFER + their BIO.
        """
        if not user:
            return ""

        # Extract fields safely
        skills_offered = " ".join(user.get("skills_offered", []) or [])
        skills_wanted = " ".join(user.get("skills_wanted", []) or [])
        bio = user.get("bio", "") or ""
        role = user.get("role", "") or ""
        
        # If the user is the one LOOKING for a match (e.g. Student), 
        # we want to match their "Wanted" skills against others' "Offered" skills.
        # But for generic profile similarity, we normally combine everything.
        
        # Strategy: Combine everything into a "Semantic Soup"
        # We emphasize skills by repeating them? (Optional, maybe later)
        
        features = f"{skills_offered} {skills_wanted} {bio} {role}"
        return features.strip()

    def recommend_mentors(self, target_user, candidates, top_k=5):
        """
        Ranks candidates based on similarity to the target_user.
        
        Args:
            target_user (dict): The user looking for a mentor.
            candidates (list[dict]): List of potential mentors.
            top_k (int): Number of top matches to return.
            
        Returns:
            list[dict]: Top k candidates with 'match_score' added.
        """
        if not candidates:
            return []

        # 1. Prepare Text Data
        # For Target User: We mostly care about what they WANT (`skills_wanted`) and their `bio`.
        # (Assuming the target user is a student looking for a mentor)
        target_features = " ".join(target_user.get("skills_wanted", []) or []) + " " + (target_user.get("bio", "") or "")
        print(f"DEBUG: Target Features: '{target_features}'") # DEBUG
        
        # For Candidates: We care about what they OFFER (`skills_offered`) and their `bio`.
        candidate_features = []
        for cand in candidates:
            feats = " ".join(cand.get("skills_offered", []) or []) + " " + (cand.get("bio", "") or "")
            print(f"DEBUG: Candidate Features (ID: {cand.get('id')}): '{feats}'") # DEBUG
            candidate_features.append(feats)

        # 2. Vectorization (TF-IDF)
        all_documents = [target_features] + candidate_features
        try:
            tfidf_matrix = self.vectorizer.fit_transform(all_documents)
        except ValueError:
            # Handle empty vocabulary or stop words issues
            logger.warning("Empty vocabulary for TF-IDF. Returning empty list.")
            return []

        # 3. Compute Cosine Similarity
        # The first vector (index 0) is the Target User.
        # The rest (indices 1 to N) are Candidates.
        
        # cosine_similarity returns a matrix. We want row 0 (target) vs all others.
        cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

        # 4. Rank Candidates
        ranked_indices = cosine_sim.argsort()[::-1] # Indices sorting by score descending
        
        results = []
        for idx in ranked_indices:
            score = float(cosine_sim[idx])
            
            # Use a threshold? Maybe return all and let frontend decide?
            # Let's return non-zero matches primarily, but if top_k is requested, just give top_k.
            
            if score > 0.0:  # Only meaningful matches
                candidate = candidates[idx].copy()
                candidate['match_score'] = round(score * 100, 1) # Percentage 0-100
                results.append(candidate)
            
            if len(results) >= top_k:
                break
                
        return results

# Singleton instance
recommender = RecommenderSystem()
