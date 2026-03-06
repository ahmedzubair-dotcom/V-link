from flask import Flask, request, jsonify
from flask_cors import CORS
from matching import calculate_match_scores
from moderation import analyze_message
from verification import detect_face

app = Flask(__name__)
CORS(app)

@app.route('/api/match', methods=['POST'])
def match_users():
    data = request.json
    user_id = data.get('userId')
    user_profile = data.get('userProfile')
    potential_matches = data.get('potentialMatches') # List of User objects
    
    if not user_profile or not potential_matches:
        return jsonify({'error': 'Missing profile or potential matches list'}), 400
        
    scored_matches = calculate_match_scores(user_profile, potential_matches)
    return jsonify(scored_matches)

@app.route('/api/moderate', methods=['POST'])
def moderate_message():
    data = request.json
    message_content = data.get('content', '')
    
    if not message_content:
        return jsonify({'error': 'Message content is empty', 'threatLevel': 0}), 400
        
    result = analyze_message(message_content)
    return jsonify(result)

@app.route('/api/verify-face', methods=['POST'])
def verify_face_endpoint():
    data = request.json
    image_str = data.get('image', '')
    
    if not image_str:
        return jsonify({'error': 'Image data is missing', 'hasFace': False}), 400
        
    has_face, message = detect_face(image_str)
    return jsonify({
        'hasFace': has_face,
        'message': message
    })

@app.route('/')
def index():
    return "V-LINK ML Service Running"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
