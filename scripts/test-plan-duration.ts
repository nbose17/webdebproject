
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

import { connectAdminDB, connectGymDB } from '../lib/db';
import { getGymModels } from '../lib/db-models';
import mongoose from 'mongoose';

async function testPlanClassConnection() {
    try {
        console.log('🧪 Testing Plan <-> Class Connection...');

        // Gym ID for Downtown Gym
        await connectAdminDB();
        const { getAdminModels } = await import('../lib/db-models');
        const AdminModels = await getAdminModels();

        const gym = await AdminModels.Gym.findOne({ name: 'FITNESS GYM - Downtown' });
        if (!gym) throw new Error('Gym not found');

        const gymId = gym._id.toString();
        console.log(`✅ Found Gym ID: ${gymId}`);

        // Connect to Gym DB
        await connectGymDB(gymId);
        const GymModels = await getGymModels(gymId);

        // 1. Create a Test Class
        console.log('📝 Creating test class...');
        const testClass = new GymModels.Class({
            name: 'Test Setup Class',
            durationMinutes: 60,
            numberOfClasses: 10,
            price: 150,
            gymId: gym._id,
            description: 'Class for testing plan connection'
        });
        await testClass.save();
        console.log(`✅ Created Class: ${testClass.name} (${testClass._id})`);

        // 2. Create a Test Plan with the Class
        console.log('📝 Creating test plan including the class...');
        const plan = new GymModels.Plan({
            name: 'Test Bundle Plan',
            durationMonths: 6,
            price: 500,
            gymId: gym._id,
            description: 'Plan including test class',
            includedClasses: [testClass._id]
        });

        await plan.save();
        console.log(`✅ Created Plan: ${plan.name} (${plan._id})`);

        // 3. Verify Connection
        console.log('🔍 Verifying connection...');
        const storedPlan = await GymModels.Plan.findById(plan._id).populate('includedClasses');

        if (!storedPlan) throw new Error('Could not find created plan');

        console.log('Stored Plan includedClasses:', storedPlan.includedClasses);

        if (storedPlan.includedClasses && storedPlan.includedClasses.length === 1) {
            const includedClassId = storedPlan.includedClasses[0]._id.toString();
            if (includedClassId === testClass._id.toString()) {
                console.log('✅ Verification Successful: Plan correctly includes the Class');
            } else {
                console.log(`❌ Verification Failed: Plan includes wrong class ${includedClassId}`);
            }
        } else {
            console.log(`❌ Verification Failed: includedClasses length is ${storedPlan.includedClasses?.length}`);
        }

        // 4. Cleanup
        await GymModels.Plan.findByIdAndDelete(plan._id);
        await GymModels.Class.findByIdAndDelete(testClass._id);
        console.log('🧹 Cleaned up test plan and class');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

testPlanClassConnection();
