import mongoose from 'mongoose';
import { getGymModels } from '@/lib/db-models';

export const trainerResolvers = {
  Query: {
    trainers: async (_: any, { gymId }: { gymId: string }) => {
      try {
        const GymModels = await getGymModels(gymId);
        const trainers = await GymModels.Trainer.find({ gymId }).lean();
        return trainers.map(trainer => ({
          ...trainer,
          id: trainer._id.toString(),
          gymId: trainer.gymId.toString(),
        }));
      } catch (error) {
        console.error(`Error fetching trainers for gym ${gymId}:`, error);
        return [];
      }
    },
    trainer: async (_: any, { id, gymId }: { id: string; gymId: string }) => {
      try {
        const GymModels = await getGymModels(gymId);
        const trainer = await GymModels.Trainer.findById(id).lean();
        if (!trainer) {
          throw new Error('Trainer not found');
        }
        return {
          ...trainer,
          id: trainer._id.toString(),
          gymId: trainer.gymId.toString(),
        };
      } catch (error) {
        throw new Error('Trainer not found');
      }
    },
  },
  Mutation: {
    createTrainer: async (_: any, args: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const { gymId, ...trainerData } = args;
      
      // Verify user has access to this gym
      const userGymId = context.user.gymId?.toString();
      const userRole = context.user.role?.toUpperCase();
      const isAdmin = userRole === 'FITCONNECT_ADMIN';
      
      if (!isAdmin && userGymId !== gymId) {
        throw new Error('You do not have permission to create trainers for this gym');
      }

      try {
        const GymModels = await getGymModels(gymId);
        const gymObjectId = new mongoose.Types.ObjectId(gymId);
        
        const trainer = new GymModels.Trainer({
          ...trainerData,
          gymId: gymObjectId,
          image: trainerData.image || '/images/trainer-placeholder.jpg',
        });
        
        await trainer.save();
        
        return {
          id: trainer._id.toString(),
          gymId: trainer.gymId.toString(),
          name: trainer.name,
          experience: trainer.experience,
          image: trainer.image,
          bio: trainer.bio,
          createdAt: trainer.createdAt,
          updatedAt: trainer.updatedAt,
        };
      } catch (error: any) {
        console.error('Error creating trainer:', error);
        throw new Error(`Failed to create trainer: ${error.message}`);
      }
    },
    updateTrainer: async (_: any, { id, gymId, ...updateData }: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      // Verify user has access to this gym
      const userGymId = context.user.gymId?.toString();
      const userRole = context.user.role?.toUpperCase();
      const isAdmin = userRole === 'FITCONNECT_ADMIN';
      
      if (!isAdmin && userGymId !== gymId) {
        throw new Error('You do not have permission to update trainers for this gym');
      }

      try {
        const GymModels = await getGymModels(gymId);
        const trainer = await GymModels.Trainer.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true }
        ).lean();
        
        if (!trainer) {
          throw new Error('Trainer not found');
        }
        
        return {
          ...trainer,
          id: trainer._id.toString(),
          gymId: trainer.gymId.toString(),
        };
      } catch (error: any) {
        console.error('Error updating trainer:', error);
        throw new Error(`Failed to update trainer: ${error.message}`);
      }
    },
    deleteTrainer: async (_: any, { id, gymId }: { id: string; gymId: string }, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      // Verify user has access to this gym
      const userGymId = context.user.gymId?.toString();
      const userRole = context.user.role?.toUpperCase();
      const isAdmin = userRole === 'FITCONNECT_ADMIN';
      
      if (!isAdmin && userGymId !== gymId) {
        throw new Error('You do not have permission to delete trainers for this gym');
      }

      try {
        const GymModels = await getGymModels(gymId);
        const trainer = await GymModels.Trainer.findByIdAndDelete(id);
        
        if (!trainer) {
          throw new Error('Trainer not found');
        }
        
        return true;
      } catch (error: any) {
        console.error('Error deleting trainer:', error);
        throw new Error(`Failed to delete trainer: ${error.message}`);
      }
    },
  },
  Trainer: {
    gym: async (parent: any, _: any, context: any) => {
      const { getAdminModels } = await import('@/lib/db-models');
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
  },
};

