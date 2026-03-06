import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer

try:
    sia = SentimentIntensityAnalyzer()
except LookupError:
    # Fallback to download at runtime if needed
    nltk.download('vader_lexicon')
    sia = SentimentIntensityAnalyzer()

# Basic keyword lists for rule-based moderation
BANNED_WORDS = ['kill', 'die', 'murder', 'rape'] # Severe threats
WARNING_WORDS = ['idiot', 'stupid', 'dumb', 'loser'] # Mild toxicity

def analyze_message(content):
    """
    GuardianShield Moderation Logic
    Returns: { 'threatLevel': 0-3, 'reason': '', 'score': float }
    """
    
    content_lower = content.lower()
    
    # 1. Check for severe banned words first (Level 3 - Perm Ban)
    for word in BANNED_WORDS:
        if word in content_lower:
            return {
                'threatLevel': 3,
                'reason': f'Severe violation: Used banned word "{word}"',
                'score': -1.0 # Max negative severity
            }
            
    # 2. VADER Sentiment Analysis
    sentiment = sia.polarity_scores(content)
    compound_score = sentiment['compound']
    
    # 3. Check for warning words (Level 1 - Warning)
    has_warning_words = any(word in content_lower for word in WARNING_WORDS)
    
    if compound_score <= -0.8:
        # High negative sentiment (Level 2 - Temp Ban)
        return {
            'threatLevel': 2,
            'reason': 'Highly toxic sentiment detected.',
            'score': compound_score
        }
    elif compound_score <= -0.5 or has_warning_words:
        # Moderate negative sentiment or warning words (Level 1 - Warning)
        return {
            'threatLevel': 1,
            'reason': 'Mildly toxic language detected. Warning issued.',
            'score': compound_score
        }
    else:
        # Clean (Level 0)
        return {
            'threatLevel': 0,
            'reason': 'Clean',
            'score': compound_score
        }
