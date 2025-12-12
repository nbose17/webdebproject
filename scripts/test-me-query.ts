import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

import { apolloClient } from '../lib/apollo-client';
import { GET_ME } from '../graphql/queries/admin';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function testMeQuery() {
    try {
        console.log('🧪 Testing GET_ME query with fresh token...\n');

        // First, create a fresh token (simulating login)
        const userPayload = {
            userId: '693bbcd38ccf8a1c90a3f91d',
            email: 'owner@fitnessgym.com',
            role: 'gym_owner',
            gymId: '693bbcd38ccf8a1c90a3f938',
        };

        const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

        console.log('🔑 Created test token with payload:', userPayload);
        console.log('Token:', token.substring(0, 50) + '...\n');

        // Now test the GET_ME query
        const { data, errors } = await apolloClient.query({
            query: GET_ME,
            fetchPolicy: 'network-only',
            context: {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            },
        });

        if (errors && errors.length > 0) {
            console.error('❌ GraphQL Errors:', errors);
            return;
        }

        if (data?.me) {
            console.log('✅ GET_ME Query Response:');
            console.log(JSON.stringify(data.me, null, 2));

            if (data.me.gymId) {
                console.log('\n✅ GymId is present:', data.me.gymId);
            } else {
                console.log('\n❌ GymId is missing!');
            }
        } else {
            console.log('❌ No user data in response');
        }

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        if (error.graphQLErrors) {
            console.error('GraphQL Errors:', error.graphQLErrors);
        }
    } finally {
        process.exit(0);
    }
}

testMeQuery();
