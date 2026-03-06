def calculate_match_scores(user_profile, potential_matches):
    """
    Very basic matching algorithm for V-LINK.
    Calculates score based on shared interests.
    In a real-world scenario, you would use TF-IDF, BERT embeddings, etc.
    """
    user_interests = set(user_profile.get('interests', []))
    
    results = []
    
    for match in potential_matches:
        match_interests = set(match.get('interests', []))
        
        # Calculate Jaccard similarity between interest sets
        intersection = len(user_interests.intersection(match_interests))
        union = len(user_interests.union(match_interests))
        
        score = 0
        if union > 0:
            score = intersection / union
            
        results.append({
            'userId': match.get('_id'),
            'score': round(score * 100, 2), # Percentage 0-100
            ' wspólneZainteresowania': list(user_interests.intersection(match_interests)) # common interests
        })
        
    # Sort descending by score
    results.sort(key=lambda x: x['score'], reverse=True)
    return results
