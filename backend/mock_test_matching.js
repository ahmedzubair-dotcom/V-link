const runMockTest = async () => {
    console.log('--- Starting V-LINK ML Matching Test ---\n');

    // Mock user data since MongoDB Atlas IP Whitelist blocks our local test script connection
    const alice = {
        _id: 'user_alice_123',
        name: 'Alice (Test)',
        interests: ['coding', 'music', 'reading'],
        bio: 'Computer Science student.'
    };

    const potentialMatches = [
        {
            _id: 'user_bob_124',
            name: 'Bob (Test)',
            interests: ['coding', 'sports'],
            bio: 'Loves hackathons.'
        },
        {
            _id: 'user_charlie_125',
            name: 'Charlie (Test)',
            interests: ['music', 'art', 'coding'],
            bio: 'Creative arts.'
        },
        {
            _id: 'user_diana_126',
            name: 'Diana (Test)',
            interests: ['sports', 'travel'],
            bio: 'Athlete.'
        }
    ];

    console.log(`Target User: ${alice.name}`);
    console.log(`Interests: ${alice.interests.join(', ')}\n`);
    console.log('Calculating similarity scores using the Python ML service...');

    try {
        const mlRes = await fetch('http://localhost:5001/api/match', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: alice._id,
                userProfile: alice,
                potentialMatches: potentialMatches
            })
        });

        const scoredMatchesInfo = await mlRes.json();

        console.log('\n--- ML MATCHING RESULTS ---');

        const scoredUsers = scoredMatchesInfo.map(info => {
            const userObj = potentialMatches.find(u => u._id === info.userId);
            if (userObj) {
                return {
                    ...userObj,
                    matchScore: info.score,
                    commonInterests: info[' wspólneZainteresowania']
                };
            }
            return null;
        }).filter(u => u !== null);

        scoredUsers.forEach((match, index) => {
            console.log(`${index + 1}. Peer: ${match.name}`);
            console.log(`   Their Interests: ${match.interests.join(', ')}`);
            console.log(`   Common Interests: ${match.commonInterests?.join(', ') || 'none'}`);
            console.log(`   Compatibility Score: ${match.matchScore}%\n`);
        });

    } catch (e) {
        console.error('ML Service Error. Ensure python app.py is running on port 5001.', e.message);
    }
};

runMockTest();
