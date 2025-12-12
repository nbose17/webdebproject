import { config } from 'dotenv';
import { resolve } from 'path';
import bcrypt from 'bcryptjs';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

import { connectAdminDB } from '../lib/db';
import { getAdminModels } from '../lib/db-models';
import { authResolvers } from '../graphql/resolvers/auth';

async function testLogin() {
    try {
        console.log('🧪 Testing login flow...');

        await connectAdminDB();
        const AdminModels = await getAdminModels();

        // Test login for gym owner
        const email = 'owner@fitnessgym.com';
        const password = 'owner123';

        console.log(`\n🔐 Attempting login for: ${email}`);

        const result = await authResolvers.Mutation.login(
            null,
            { email, password },
            {}
        );

        if (result.success) {
            console.log('\n✅ Login successful!');
            console.log('User data:', {
                id: result.user.id,
                email: result.user.email,
                role: result.user.role,
                gymId: result.user.gymId,
            });

            if (result.user.gymId) {
                console.log('\n✅ GymId is properly set:', result.user.gymId);
            } else {
                console.log('\n❌ GymId is still missing!');
            }
        } else {
            console.log('\n❌ Login failed:', result.message);
        }

    } catch (error) {
        console.error('❌ Error during test:', error);
    } finally {
        process.exit(0);
    }
}

testLogin();
