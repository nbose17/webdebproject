import { connectGymDB } from './db';
import { getGymModels } from './db-models';

/**
 * Initialize a gym database by creating a connection and ensuring collections exist
 * This is called automatically when a gym is created
 * Note: getGymModels already handles initialization, so this is mainly for explicit initialization
 */
export async function initializeGymDatabase(gymId: string): Promise<void> {
  try {
    console.log(`🔄 Initializing gym database for gym: ${gymId}`);

    // Get gym models - this will automatically create the database and collections if they don't exist
    const GymModels = await getGymModels(gymId);

    // Ensure all indexes are created
    await Promise.all([
      GymModels.User.createIndexes().catch(() => { }),
      GymModels.Client.createIndexes().catch(() => { }),
      GymModels.Branch.createIndexes().catch(() => { }),
      GymModels.CMS.createIndexes().catch(() => { }),
      GymModels.Plan.createIndexes().catch(() => { }),
      GymModels.Class.createIndexes().catch(() => { }),
      GymModels.Trainer.createIndexes().catch(() => { }),
    ]);

    console.log(`✅ Gym database initialized: fc_gym_${gymId}`);
  } catch (error) {
    console.error(`❌ Failed to initialize gym database for ${gymId}:`, error);
    throw error;
  }
}

/**
 * Verify that a gym database exists
 * Returns true if the database exists and is accessible
 */
export async function verifyGymDatabase(gymId: string): Promise<boolean> {
  try {
    await connectGymDB(gymId);
    const GymModels = await getGymModels(gymId);
    // Try to access a collection to verify the database exists
    await GymModels.User.db.db?.listCollections().toArray();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Sync all gyms in fitconnect_admin to ensure each has a corresponding database
 * This is useful for migrations or ensuring consistency
 */
export async function syncGymDatabases(): Promise<{ created: string[]; existing: string[]; errors: string[] }> {
  const { getAdminModels } = await import('./db-models');
  const AdminModels = await getAdminModels();

  const gyms = await AdminModels.Gym.find({}).lean();
  const result = {
    created: [] as string[],
    existing: [] as string[],
    errors: [] as string[],
  };

  for (const gym of gyms) {
    const gymId = gym._id.toString();
    try {
      const exists = await verifyGymDatabase(gymId);
      if (!exists) {
        await initializeGymDatabase(gymId);
        result.created.push(gymId);
        console.log(`✅ Created database for gym: ${gym.name} (${gymId})`);
      } else {
        result.existing.push(gymId);
        console.log(`✓ Database already exists for gym: ${gym.name} (${gymId})`);
      }
    } catch (error: any) {
      result.errors.push(gymId);
      console.error(`❌ Error syncing database for gym ${gym.name} (${gymId}):`, error.message);
    }
  }

  return result;
}


