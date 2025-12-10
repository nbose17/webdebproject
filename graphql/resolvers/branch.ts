import { getAdminModels, getGymModels } from '@/lib/db-models';
import { dbRoleToGraphQL } from '@/lib/role-mapper';

export const branchResolvers = {
  Query: {
    branches: async (_: any, { gymId }: { gymId: string }) => {
      // Branches are stored in gym-specific databases
      try {
        const GymModels = await getGymModels(gymId);
        const branches = await GymModels.Branch.find({ gymId }).lean();
        return branches.map(branch => ({ ...branch, id: branch._id.toString() }));
      } catch (error) {
        // Gym database might not exist yet
        console.error(`Error fetching branches for gym ${gymId}:`, error);
        return [];
      }
    },
    branch: async (_: any, { id, gymId }: { id: string; gymId: string }) => {
      try {
        const GymModels = await getGymModels(gymId);
        const branch = await GymModels.Branch.findById(id).lean();
        if (!branch) {
          throw new Error('Branch not found');
        }
        return { ...branch, id: branch._id.toString() };
      } catch (error) {
        throw new Error('Branch not found');
      }
    },
  },
  Mutation: {
    createBranch: async (_: any, args: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const { gymId, ...branchData } = args;
      
      if (!gymId) {
        throw new Error('gymId is required to create a branch');
      }

      try {
        // Store branch in gym-specific database
        const GymModels = await getGymModels(gymId);
        
        // Also store metadata in admin database for quick access
        const AdminModels = await getAdminModels();
        
        const gymBranch = new GymModels.Branch({
          ...branchData,
          gymId,
          status: branchData.status || 'active',
        });
        await gymBranch.save();
        
        // Store metadata copy in admin DB
        const adminBranch = new AdminModels.Branch({
          _id: gymBranch._id,
          ...branchData,
          gymId,
          status: branchData.status || 'active',
        });
        await adminBranch.save();
        
        const populated = await GymModels.Branch.findById(gymBranch._id).lean();
        return { ...populated!, id: populated!._id.toString() };
      } catch (error: any) {
        console.error('Error creating branch:', error);
        throw new Error(`Failed to create branch: ${error.message}`);
      }
    },
    updateBranch: async (_: any, { id, gymId, ...args }: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      if (!gymId) {
        throw new Error('gymId is required to update a branch');
      }

      try {
        const GymModels = await getGymModels(gymId);
        const branch = await GymModels.Branch.findByIdAndUpdate(
          id,
          { ...args },
          { new: true, runValidators: true }
        ).lean();

        if (!branch) {
          throw new Error('Branch not found');
        }

        // Also update metadata in admin DB
        const AdminModels = await getAdminModels();
        await AdminModels.Branch.findByIdAndUpdate(id, { ...args }, { runValidators: false });

        return { ...branch, id: branch._id.toString() };
      } catch (error: any) {
        console.error('Error updating branch:', error);
        throw new Error(`Failed to update branch: ${error.message}`);
      }
    },
    deleteBranch: async (_: any, { id, gymId }: { id: string; gymId?: string }, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      if (!gymId) {
        throw new Error('gymId is required to delete a branch');
      }

      try {
        const GymModels = await getGymModels(gymId);
        const branch = await GymModels.Branch.findByIdAndDelete(id);
        
        // Also delete from admin DB
        const AdminModels = await getAdminModels();
        await AdminModels.Branch.findByIdAndDelete(id);
        
        return !!branch;
      } catch (error: any) {
        console.error('Error deleting branch:', error);
        throw new Error(`Failed to delete branch: ${error.message}`);
      }
    },
  },
  Branch: {
    gym: async (parent: any) => {
      const AdminModels = await getAdminModels();
      const gym = await AdminModels.Gym.findById(parent.gymId).lean();
      if (!gym) return null;
      return { ...gym, id: gym._id.toString() };
    },
    manager: async (parent: any) => {
      if (!parent.managerId || !parent.gymId) return null;
      try {
        // Manager might be in gym-specific database
        const GymModels = await getGymModels(parent.gymId);
        const user = await GymModels.User.findById(parent.managerId).lean();
        if (user) {
          return { 
            ...user, 
            id: user._id.toString(),
            role: dbRoleToGraphQL(user.role) as any, // Convert to GraphQL enum format
          };
        }
      } catch (error) {
        // Try admin DB instead
      }
      
      // Try admin database
      const AdminModels = await getAdminModels();
      const user = await AdminModels.User.findById(parent.managerId).lean();
      if (!user) return null;
      return { 
        ...user, 
        id: user._id.toString(),
        role: dbRoleToGraphQL(user.role) as any, // Convert to GraphQL enum format
      };
    },
    staff: async (parent: any) => {
      if (!parent.gymId) return [];
      try {
        const GymModels = await getGymModels(parent.gymId);
        const users = await GymModels.User.find({ branchId: parent.id }).lean();
        return users.map(user => ({ 
          ...user, 
          id: user._id.toString(),
          role: dbRoleToGraphQL(user.role) as any, // Convert to GraphQL enum format
        }));
      } catch (error) {
        return [];
      }
    },
    clients: async (parent: any) => {
      if (!parent.gymId) return [];
      try {
        const GymModels = await getGymModels(parent.gymId);
        const clients = await GymModels.Client.find({ branchId: parent.id }).lean();
        return clients.map(client => ({ ...client, id: client._id.toString() }));
      } catch (error) {
        return [];
      }
    },
  },
};

