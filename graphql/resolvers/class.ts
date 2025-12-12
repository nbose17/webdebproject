import mongoose from 'mongoose';
import { getGymModels } from '@/lib/db-models';

export const classResolvers = {
  Query: {
    classes: async (_: any, { gymId }: { gymId: string }) => {
      try {
        const GymModels = await getGymModels(gymId);
        const classes = await GymModels.Class.find({ gymId }).lean();
        return classes.map(classItem => ({
          ...classItem,
          id: classItem._id.toString(),
          gymId: classItem.gymId.toString(),
        }));
      } catch (error) {
        console.error(`Error fetching classes for gym ${gymId}:`, error);
        return [];
      }
    },
    class: async (_: any, { id, gymId }: { id: string; gymId: string }) => {
      try {
        const GymModels = await getGymModels(gymId);
        const classItem = await GymModels.Class.findById(id).lean();
        if (!classItem) {
          throw new Error('Class not found');
        }
        return {
          ...classItem,
          id: classItem._id.toString(),
          gymId: classItem.gymId.toString(),
        };
      } catch (error) {
        throw new Error('Class not found');
      }
    },
  },
  Mutation: {
    createClass: async (_: any, args: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const { gymId, ...classData } = args;

      // Verify user has access to this gym
      const userGymId = context.user.gymId?.toString();
      const userRole = context.user.role?.toUpperCase();
      const isAdmin = userRole === 'FITCONNECT_ADMIN';

      if (!isAdmin && userGymId !== gymId) {
        throw new Error('You do not have permission to create classes for this gym');
      }

      try {
        const GymModels = await getGymModels(gymId);
        const gymObjectId = new mongoose.Types.ObjectId(gymId);

        const classItem = new GymModels.Class({
          ...classData,
          gymId: gymObjectId,
        });

        await classItem.save();

        return {
          id: classItem._id.toString(),
          gymId: classItem.gymId.toString(),
          name: classItem.name,
          durationMinutes: classItem.durationMinutes,
          numberOfClasses: classItem.numberOfClasses,
          price: classItem.price,
          description: classItem.description,
          createdAt: classItem.createdAt,
          updatedAt: classItem.updatedAt,
        };
      } catch (error: any) {
        console.error('Error creating class:', error);
        throw new Error(`Failed to create class: ${error.message}`);
      }
    },
    updateClass: async (_: any, { id, gymId, ...updateData }: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      // Verify user has access to this gym
      const userGymId = context.user.gymId?.toString();
      const userRole = context.user.role?.toUpperCase();
      const isAdmin = userRole === 'FITCONNECT_ADMIN';

      if (!isAdmin && userGymId !== gymId) {
        throw new Error('You do not have permission to update classes for this gym');
      }

      try {
        const GymModels = await getGymModels(gymId);
        const classItem = await GymModels.Class.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true }
        ).lean();

        if (!classItem) {
          throw new Error('Class not found');
        }

        return {
          ...classItem,
          id: classItem._id.toString(),
          gymId: classItem.gymId.toString(),
        };
      } catch (error: any) {
        console.error('Error updating class:', error);
        throw new Error(`Failed to update class: ${error.message}`);
      }
    },
    deleteClass: async (_: any, { id, gymId }: { id: string; gymId: string }, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      // Verify user has access to this gym
      const userGymId = context.user.gymId?.toString();
      const userRole = context.user.role?.toUpperCase();
      const isAdmin = userRole === 'FITCONNECT_ADMIN';

      if (!isAdmin && userGymId !== gymId) {
        throw new Error('You do not have permission to delete classes for this gym');
      }

      try {
        const GymModels = await getGymModels(gymId);
        const classItem = await GymModels.Class.findByIdAndDelete(id);

        if (!classItem) {
          throw new Error('Class not found');
        }

        return true;
      } catch (error: any) {
        console.error('Error deleting class:', error);
        throw new Error(`Failed to delete class: ${error.message}`);
      }
    },
  },
  Class: {
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

