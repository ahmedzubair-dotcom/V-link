const mongoose = require('mongoose');

require('dotenv').config();
const User = require('./src/models/User');

const MONGO_URI = 'mongodb+srv://ahmadzubair16rouk_db_user:vlink1234@cluster0.axxw1cm.mongodb.net/?appName=Cluster0';
const API_URL = 'http://localhost:6000/api';

const runTest = async () => {
    console.log('--- Starting V-LINK Integration Test ---');
    try {
        await mongoose.connect(MONGO_URI);
        console.log('1. Connected to MongoDB.');

        // 1. Seed test users
        console.log('2. Seeding test users...');
        await User.deleteMany({ email: { $regex: '@test.com' } });

        const user1 = await User.create({
            name: 'Alice (Test)',
            email: 'alice@test.com',
            passwordHash: 'dummy',
            collegeId: 'C123',
            interests: ['coding', 'music', 'reading'],
            bio: 'Computer Science student.'
        });

        const user2 = await User.create({
            name: 'Bob (Test)',
            email: 'bob@test.com',
            passwordHash: 'dummy',
            collegeId: 'C124',
            interests: ['coding', 'sports'],
            bio: 'Loves hackathons.'
        });

        const user3 = await User.create({
            name: 'Charlie (Test)',
            email: 'charlie@test.com',
            passwordHash: 'dummy',
            collegeId: 'C125',
            interests: ['music', 'art'],
            bio: 'Creative arts.'
        });

        console.log(`Created test users: ${user1.name}, ${user2.name}, ${user3.name}`);

        // 2. We bypass login to just sign a token directly for the test using the same secret
        const jwt = require('jsonwebtoken');
        // Warning: This secret should match your .env
        const token = jwt.sign({ id: user1._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        console.log('\n3. Requesting Potential Matches for Alice using ML Service...');

        try {
            const fetchRes = await fetch(`${API_URL}/matches/potential`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await fetchRes.json();

            console.log('\n--- MATCHING RESULTS ---');
            console.log(`Alice's Interests: coding, music, reading\n`);

            data.forEach((match, index) => {
                console.log(`${index + 1}. Match: ${match.name}`);
                console.log(`   Email: ${match.email}`);
                console.log(`   Their Interests: ${match.interests.join(', ')}`);
                console.log(`   Common Interests: ${match.commonInterests?.join(', ') || 'none'}`);
                console.log(`   Compatibility Score: ${match.matchScore}%\n`);
            });

        } catch (apiError) {
            console.error('API Error:', apiError.message);
        }

    } catch (e) {
        console.error('Test script error:', e);
    } finally {
        await mongoose.connection.close();
        console.log('--- Test Complete ---');
        process.exit(0);
    }
};

runTest();
