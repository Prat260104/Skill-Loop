import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def jaccard_similarity(list1, list2):
    """
    Calculate Jaccard similarity between two lists.
    Used for experience matching.
    
    Returns: float (0.0 to 1.0)
    """
    set1 = set(list1 or [])
    set2 = set(list2 or [])
    
    if not set1 or not set2:
        return 0.0
    
    intersection = len(set1 & set2)
    union = len(set1 | set2)
    
    return intersection / union if union > 0 else 0.0


def normalize_activity_score(skill_points, max_points=500):
    """
    Normalize skill points to 0-1 range.
    Assumes max_points is a reasonable upper bound.
    
    Returns: float (0.0 to 1.0)
    """
    return min(skill_points / max_points, 1.0) if skill_points > 0 else 0.0


class RecommenderSystem:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')

    def _calculate_skill_similarity(self, target_skills, candidate_skills):
        """
        Calculate TF-IDF cosine similarity between skill sets.
        
        Args:
            target_skills (list): Skills the target user wants
            candidate_skills (list): Skills the candidate offers
            
        Returns:
            float: Similarity score (0.0 to 1.0)
        """
        if not target_skills or not candidate_skills:
            return 0.0
        
        # Convert to text
        target_text = " ".join(target_skills)
        candidate_text = " ".join(candidate_skills)
        
        try:
            tfidf_matrix = self.vectorizer.fit_transform([target_text, candidate_text])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return float(similarity)
        except ValueError:
            # Empty vocabulary
            return 0.0

    def recommend_mentors(self, target_user, candidates, top_k=5):
        """
        Ranks candidates using WEIGHTED MULTI-FACTOR SCORING:
        - Skill Match: 50%
        - Experience Match: 30%
        - Activity Score: 20%
        
        Args:
            target_user (dict): The user looking for a mentor.
            candidates (list[dict]): List of potential mentors.
            top_k (int): Number of top matches to return.
            
        Returns:
            list[dict]: Top k candidates with 'match_score' and breakdown.
        """
        if not candidates:
            return []

        results = []
        
        for candidate in candidates:
            # ========================================
            # FACTOR 1: Skill Similarity (50% weight)
            # ========================================
            target_wants = target_user.get("skills_wanted", []) or []
            candidate_offers = candidate.get("skills_offered", []) or []
            
            skill_similarity = self._calculate_skill_similarity(
                target_wants,
                candidate_offers
            )
            
            # ========================================
            # FACTOR 2: Experience Match (30% weight)
            # ========================================
            target_exp = target_user.get("experience", []) or []
            candidate_exp = candidate.get("experience", []) or []
            
            experience_match = jaccard_similarity(target_exp, candidate_exp)
            
            # ========================================
            # FACTOR 3: Activity Score (20% weight)
            # ========================================
            skill_points = candidate.get("skill_points", 0) or 0
            activity_score = normalize_activity_score(skill_points)
            
            # ========================================
            # WEIGHTED COMBINATION
            # ========================================
            final_score = (
                skill_similarity * 0.50 +
                experience_match * 0.30 +
                activity_score * 0.20
            )
            
            # Add to results
            candidate_copy = candidate.copy()
            candidate_copy['match_score'] = round(final_score * 100, 1)  # 0-100
            
            # Optional: Add breakdown for debugging/transparency
            candidate_copy['score_breakdown'] = {
                'skill_similarity': round(skill_similarity * 100, 1),
                'experience_match': round(experience_match * 100, 1),
                'activity_score': round(activity_score * 100, 1)
            }
            
            results.append(candidate_copy)
        
        # Sort by final score (descending)
        results.sort(key=lambda x: x['match_score'], reverse=True)
        
        # Return top K with non-zero scores
        filtered_results = [r for r in results if r['match_score'] > 0]
        
        return filtered_results[:top_k]


# Singleton instance
recommender = RecommenderSystem()
