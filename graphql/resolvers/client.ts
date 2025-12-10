import mongoose from 'mongoose';
import { getGymModels, getAdminModels } from '@/lib/db-models';

export const clientResolvers = {
  Query: {
    clients: async (_: any, args: any) => {
      // Clients are stored in gym-specific databases
      if (!args.gymId) {
        throw new Error('gymId is required to fetch clients');
      }

      try {
        const GymModels = await getGymModels(args.gymId);
        const filter: any = {};
        
        if (args.branchId) filter.branchId = new mongoose.Types.ObjectId(args.branchId);
        if (args.status) filter.status = args.status;

        const clients = await GymModels.Client.find(filter).lean();
        return clients.map(client => ({
          ...client,
          id: client._id.toString(),
          gymId: client.gymId.toString(),
          branchId: client.branchId?.toString(),
        }));
      } catch (error) {
        console.error(`Error fetching clients for gym ${args.gymId}:`, error);
        return [];
      }
    },
    client: async (_: any, { id, gymId }: { id: string; gymId: string }) => {
      if (!gymId) {
        throw new Error('gymId is required to fetch a client');
      }

      try {
        const GymModels = await getGymModels(gymId);
        const client = await GymModels.Client.findById(id).lean();
        if (!client) {
          throw new Error('Client not found');
        }
        return {
          ...client,
          id: client._id.toString(),
          gymId: client.gymId.toString(),
          branchId: client.branchId?.toString(),
        };
      } catch (error) {
        throw new Error('Client not found');
      }
    },
  },
  Mutation: {
    createClient: async (_: any, args: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const { gymId, branchId, ...clientData } = args;
      
      if (!gymId) {
        throw new Error('gymId is required to create a client');
      }

      // Verify user has access to this gym
      const userGymId = context.user.gymId?.toString();
      const userRole = context.user.role?.toUpperCase();
      const isAdmin = userRole === 'FITCONNECT_ADMIN';
      
      if (!isAdmin && userGymId !== gymId) {
        throw new Error('You do not have permission to create clients for this gym');
      }

      try {
        const GymModels = await getGymModels(gymId);
        const gymObjectId = new mongoose.Types.ObjectId(gymId);
        const branchObjectId = branchId ? new mongoose.Types.ObjectId(branchId) : undefined;
        
        const client = new GymModels.Client({
          ...clientData,
          gymId: gymObjectId,
          branchId: branchObjectId,
          joinDate: clientData.joinDate ? new Date(clientData.joinDate) : new Date(),
        });
        
        await client.save();
        
        return {
          id: client._id.toString(),
          gymId: client.gymId.toString(),
          branchId: client.branchId?.toString(),
          name: client.name,
          email: client.email,
          phone: client.phone,
          membershipType: client.membershipType,
          status: client.status,
          image: client.image,
          subscriptionEndDate: client.subscriptionEndDate,
          contractStartDate: client.contractStartDate,
          contractEndDate: client.contractEndDate,
          joinDate: client.joinDate,
          createdAt: client.createdAt,
          updatedAt: client.updatedAt,
        };
      } catch (error: any) {
        console.error('Error creating client:', error);
        throw new Error(`Failed to create client: ${error.message}`);
      }
    },
    updateClient: async (_: any, { id, gymId, branchId, ...args }: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      if (!gymId) {
        throw new Error('gymId is required to update a client');
      }

      // Verify user has access to this gym
      const userGymId = context.user.gymId?.toString();
      const userRole = context.user.role?.toUpperCase();
      const isAdmin = userRole === 'FITCONNECT_ADMIN';
      
      if (!isAdmin && userGymId !== gymId) {
        throw new Error('You do not have permission to update clients for this gym');
      }

      try {
        const GymModels = await getGymModels(gymId);
        
        const updateData: any = { ...args };
        if (branchId !== undefined) {
          updateData.branchId = branchId ? new mongoose.Types.ObjectId(branchId) : null;
        }
        if (args.joinDate) {
          updateData.joinDate = new Date(args.joinDate);
        }
        if (args.subscriptionEndDate) {
          updateData.subscriptionEndDate = new Date(args.subscriptionEndDate);
        }
        if (args.contractStartDate) {
          updateData.contractStartDate = new Date(args.contractStartDate);
        }
        if (args.contractEndDate) {
          updateData.contractEndDate = new Date(args.contractEndDate);
        }
        
        const client = await GymModels.Client.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true }
        ).lean();

        if (!client) {
          throw new Error('Client not found');
        }

        return {
          ...client,
          id: client._id.toString(),
          gymId: client.gymId.toString(),
          branchId: client.branchId?.toString(),
        };
      } catch (error: any) {
        console.error('Error updating client:', error);
        throw new Error(`Failed to update client: ${error.message}`);
      }
    },
    deleteClient: async (_: any, { id, gymId }: { id: string; gymId: string }, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      if (!gymId) {
        throw new Error('gymId is required to delete a client');
      }

      // Verify user has access to this gym
      const userGymId = context.user.gymId?.toString();
      const userRole = context.user.role?.toUpperCase();
      const isAdmin = userRole === 'FITCONNECT_ADMIN';
      
      if (!isAdmin && userGymId !== gymId) {
        throw new Error('You do not have permission to delete clients for this gym');
      }

      try {
        const GymModels = await getGymModels(gymId);
        const client = await GymModels.Client.findByIdAndDelete(id);
        
        if (!client) {
          throw new Error('Client not found');
        }
        
        return true;
      } catch (error: any) {
        console.error('Error deleting client:', error);
        throw new Error(`Failed to delete client: ${error.message}`);
      }
    },
  },
  Client: {
    gym: async (parent: any, _: any, context: any) => {
      const AdminModels = await getAdminModels();
      const gym = await AdminModels.Gym.findById(parent.gymId).lean();
      if (!gym) return null;
      
      return {
        id: gym._id.toString(),
        name: gym.name,
        location: gym.location,
        image: gym.image,
        featured: gym.featured,
        description: gym.description,
        ownerId: gym.ownerId.toString(),
        subscriptionStatus: gym.subscriptionStatus,
        paymentStatus: gym.paymentStatus,
        lastActive: gym.lastActive,
        createdAt: gym.createdAt,
        updatedAt: gym.updatedAt,
      };
    },
    branch: async (parent: any, _: any, context: any) => {
      if (!parent.branchId) return null;
      
      try {
        const GymModels = await getGymModels(parent.gymId);
        const branch = await GymModels.Branch.findById(parent.branchId).lean();
        if (!branch) return null;
        return {
          ...branch,
          id: branch._id.toString(),
          gymId: branch.gymId.toString(),
        };
      } catch (error) {
        return null;
      }
    },
  },
};

