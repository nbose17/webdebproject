import mongoose from 'mongoose';
import { getGymModels } from '@/lib/db-models';

export const planResolvers = {
  Query: {
    plans: async (_: any, { gymId }: { gymId: string }) => {
      try {
        const GymModels = await getGymModels(gymId);
        const plans = await GymModels.Plan.find({ gymId }).lean();
        return plans.map(plan => ({
          ...plan,
          id: plan._id.toString(),
          gymId: plan.gymId.toString(),
        }));
      } catch (error) {
        console.error(`Error fetching plans for gym ${gymId}:`, error);
        return [];
      }
    },
    plan: async (_: any, { id, gymId }: { id: string; gymId: string }) => {
      try {
        const GymModels = await getGymModels(gymId);
        const plan = await GymModels.Plan.findById(id).lean();
        if (!plan) {
          throw new Error('Plan not found');
        }
        return {
          ...plan,
          id: plan._id.toString(),
          gymId: plan.gymId.toString(),
        };
      } catch (error) {
        throw new Error('Plan not found');
      }
    },
  },
  Mutation: {
    createPlan: async (_: any, args: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const { gymId, ...planData } = args;
      
      // Verify user has access to this gym
      const userGymId = context.user.gymId?.toString();
      const userRole = context.user.role?.toUpperCase();
      const isAdmin = userRole === 'FITCONNECT_ADMIN';
      
      if (!isAdmin && userGymId !== gymId) {
        throw new Error('You do not have permission to create plans for this gym');
      }

      try {
        const GymModels = await getGymModels(gymId);
        const gymObjectId = new mongoose.Types.ObjectId(gymId);
        
        const plan = new GymModels.Plan({
          ...planData,
          gymId: gymObjectId,
        });
        
        await plan.save();
        
        return {
          id: plan._id.toString(),
          gymId: plan.gymId.toString(),
          name: plan.name,
          duration: plan.duration,
          price: plan.price,
          description: plan.description,
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
        };
      } catch (error: any) {
        console.error('Error creating plan:', error);
        throw new Error(`Failed to create plan: ${error.message}`);
      }
    },
    updatePlan: async (_: any, { id, gymId, ...updateData }: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      // Verify user has access to this gym
      const userGymId = context.user.gymId?.toString();
      const userRole = context.user.role?.toUpperCase();
      const isAdmin = userRole === 'FITCONNECT_ADMIN';
      
      if (!isAdmin && userGymId !== gymId) {
        throw new Error('You do not have permission to update plans for this gym');
      }

      try {
        const GymModels = await getGymModels(gymId);
        const plan = await GymModels.Plan.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true }
        ).lean();
        
        if (!plan) {
          throw new Error('Plan not found');
        }
        
        return {
          ...plan,
          id: plan._id.toString(),
          gymId: plan.gymId.toString(),
        };
      } catch (error: any) {
        console.error('Error updating plan:', error);
        throw new Error(`Failed to update plan: ${error.message}`);
      }
    },
    deletePlan: async (_: any, { id, gymId }: { id: string; gymId: string }, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      // Verify user has access to this gym
      const userGymId = context.user.gymId?.toString();
      const userRole = context.user.role?.toUpperCase();
      const isAdmin = userRole === 'FITCONNECT_ADMIN';
      
      if (!isAdmin && userGymId !== gymId) {
        throw new Error('You do not have permission to delete plans for this gym');
      }

      try {
        const GymModels = await getGymModels(gymId);
        const plan = await GymModels.Plan.findByIdAndDelete(id);
        
        if (!plan) {
          throw new Error('Plan not found');
        }
        
        return true;
      } catch (error: any) {
        console.error('Error deleting plan:', error);
        throw new Error(`Failed to delete plan: ${error.message}`);
      }
    },
  },
  Plan: {
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
