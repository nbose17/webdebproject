import mongoose from 'mongoose';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local BEFORE any other imports
config({ path: resolve(process.cwd(), '.env.local') });

// Verify MONGODB_URI is loaded
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  console.log('💡 Make sure .env.local exists with MONGODB_URI set');
  process.exit(1);
}

import { connectAdminDB } from '../lib/db';
import { syncGymDatabases } from '../lib/gym-db-utils';

async function sync() {
  try {
    console.log('🔄 Starting gym database synchronization...\n');

    // Connect to admin database
    await connectAdminDB();
    console.log('✅ Connected to Admin Database (fitconnect_admin)\n');

    // Sync all gym databases
    const result = await syncGymDatabases();

    console.log('\n✨ Synchronization completed!');
    console.log('\n📊 Summary:');
    console.log(`   ✅ Created: ${result.created.length} new database(s)`);
    console.log(`   ✓ Existing: ${result.existing.length} database(s)`);
    if (result.errors.length > 0) {
      console.log(`   ❌ Errors: ${result.errors.length} gym(s) failed`);
      console.log(`      Failed gym IDs: ${result.errors.join(', ')}`);
    }

    console.log('\n📦 Database naming convention:');
    console.log('   - Admin DB: fitconnect_admin');
    console.log('   - Gym DBs: fc_gym_<gymId>');
    console.log('\n   Each gym in fitconnect_admin.gyms should have a corresponding fc_gym_<gymId> database.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing gym databases:', error);
    process.exit(1);
  }
}

// Run sync function
sync();

