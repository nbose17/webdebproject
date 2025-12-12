import mongoose from 'mongoose';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

import { connectAdminDB } from '../lib/db';
import { getAdminModels } from '../lib/db-models';
import { UserRole } from '../lib/types';

async function debug() {
    try {
        console.log('🔍 Starting debug...');

        await connectAdminDB();
        const AdminModels = await getAdminModels();

        // 1. Find the user
        const email = 'owner@fitnessgym.com';
        const user = await AdminModels.User.findOne({ email }).lean();

        if (!user) {
            console.log('❌ User not found:', email);
            process.exit(1);
        }

        console.log('✅ User found:', {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            gymId: user.gymId
        });

        const userId = user._id.toString();

        // 2. Try to find gym by ownerId (as ObjectId)
        const userIdObjectId = new mongoose.Types.ObjectId(userId);
        console.log('🔍 Searching for gym with ownerId (ObjectId):', userIdObjectId.toString());

        const gymByObjectId = await AdminModels.Gym.findOne({ ownerId: userIdObjectId }).lean();

        if (gymByObjectId) {
            console.log('✅ Found Gym (by ObjectId):', {
                id: gymByObjectId._id.toString(),
                name: gymByObjectId.name,
                ownerId: gymByObjectId.ownerId.toString()
            });
        } else {
            console.log('❌ Gym NOT found (by ObjectId)');
        }

        // 3. Try to find gym by ownerId (as String)
        console.log('🔍 Searching for gym with ownerId (String):', userId);
        // @ts-ignore
        const gymByString = await AdminModels.Gym.findOne({ ownerId: userId }).lean();

        if (gymByString) {
            console.log('✅ Found Gym (by String):', {
                id: gymByString._id.toString(),
                name: gymByString.name,
                ownerId: gymByString.ownerId.toString()
            });
        } else {
            console.log('❌ Gym NOT found (by String)');
        }

        // 4. List all gyms and their owners
        console.log('📋 Listing all gyms to check ownerIds:');
        const gyms = await AdminModels.Gym.find({}).lean();
        gyms.forEach((g: any) => {
            console.log(`- Gym: ${g.name}, ID: ${g._id}, OwnerID: ${g.ownerId} (Type: ${typeof g.ownerId})`);
        });

    } catch (error) {
        console.error('❌ Error during debug:', error);
    } finally {
        process.exit(0);
    }
}

debug();
