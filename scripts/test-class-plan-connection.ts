
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { getAdminModels, getGymModels } from '../lib/db-models';
import { formatClassDuration } from '../lib/utils';

dotenv.config({ path: '.env.local' });

async function testClassUpdateAndLink() {
    console.log('🚀 Starting Class Duration and Plan Link Test...');

    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ Connected to MongoDB');

        // 1. Authenticate / Setup (Mocking or finding an owner)
        const AdminModels = await getAdminModels();
        const owner = await AdminModels.User.findOne({ email: 'owner@fitnessgym.com' });

        if (!owner || !owner.gymId) {
            throw new Error('Owner not found or has no gymId');
        }

        const gymId = owner.gymId.toString();
        console.log(`ℹ️ Using Gym ID: ${gymId}`);

        const GymModels = await getGymModels(gymId);

        // 2. Create a Class with duration 90 minutes (1h 30m)
        console.log('Testing Class Creation with Duration (Minutes)...');

        const newClass = new GymModels.Class({
            name: 'Test Yoga Flow',
            durationMinutes: 90,
            numberOfClasses: 10,
            price: 15.00,
            gymId: owner.gymId,
            description: 'A test class for verification'
        });

        await newClass.save();
        console.log(`✅ Class Created: ${newClass.name} (ID: ${newClass._id})`);
        console.log(`   Duration Stored: ${newClass.durationMinutes} minutes`);
        console.log(`   Formatted Duration: ${formatClassDuration(newClass.durationMinutes)} (Expected: 1h 30m)`);

        // 3. Create a Plan that includes this class
        console.log('\nTesting Plan Creation with Included Class...');

        const newPlan = new GymModels.Plan({
            name: 'Yoga Mastery Plan',
            durationMonths: 6,
            price: 299.99,
            gymId: owner.gymId,
            description: 'Includes unlimited Yoga',
            includedClasses: [newClass._id]
        });

        await newPlan.save();
        console.log(`✅ Plan Created: ${newPlan.name} (ID: ${newPlan._id})`);
        console.log(`   Included Classes IDs: ${newPlan.includedClasses}`);

        // 4. Verify Retrieval (Check includedClasses population logic if we were testing resolvers, 
        //    but here we verify DB content directly)
        const retrievedPlan = await GymModels.Plan.findById(newPlan._id).populate('includedClasses');
        if (!retrievedPlan) throw new Error('Failed to retrieve plan');

        console.log(`\n🔍 Verification:`);
        console.log(`   Plan Name: ${retrievedPlan.name}`);
        // @ts-ignore
        console.log(`   Included Class Name: ${retrievedPlan.includedClasses[0].name}`);
        // @ts-ignore
        console.log(`   Included Class Duration: ${retrievedPlan.includedClasses[0].durationMinutes}m`);

        // Cleanup
        await GymModels.Class.findByIdAndDelete(newClass._id);
        await GymModels.Plan.findByIdAndDelete(newPlan._id);
        console.log('\n🧹 Cleanup complete');

    } catch (error) {
        console.error('❌ Test Failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected');
    }
}

testClassUpdateAndLink();
