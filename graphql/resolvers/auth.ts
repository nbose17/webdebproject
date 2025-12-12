import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getAdminModels, getGymModels } from '@/lib/db-models';
import { getRolePermissions } from '@/lib/roles';
import { UserRole } from '@/lib/types';
import { dbRoleToGraphQL } from '@/lib/role-mapper';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const authResolvers = {
  Mutation: {
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      try {
        // First, check admin database for users (gym owners, admins, etc.)
        const AdminModels = await getAdminModels();
        let user = await AdminModels.User.findOne({ email }).lean();
        let isAdminUser = false;

        // If not found in admin DB, check all gym databases
        if (!user) {
          // Get all gyms from admin DB
          const gyms = await AdminModels.Gym.find({}).lean();

          // Search each gym database
          for (const gym of gyms) {
            try {
              const gymId = gym._id.toString();
              const GymModels = await getGymModels(gymId);
              const gymUser = await GymModels.User.findOne({ email }).lean();

              if (gymUser) {
                user = gymUser;
                isAdminUser = false;
                // Store gymId for context
                (user as any).gymId = gymId;
                break;
              }
            } catch (error) {
              // Gym database might not exist, continue to next
              continue;
            }
          }
        } else {
          // User found in admin DB
          isAdminUser = user.role === UserRole.FITCONNECT_ADMIN;

          // For gym owners in admin DB, find their gym
          const userRole = user.role?.toLowerCase();
          const isGymOwner = userRole === 'gym_owner' || userRole === UserRole.GYM_OWNER?.toLowerCase();

          if (isGymOwner && !user.gymId) {
            console.log(`🔍 Finding gym for owner: ${user._id.toString()}`);

            // Convert userId to ObjectId for the query
            const userIdObjectId = new mongoose.Types.ObjectId(user._id.toString());

            // Try to find gym by ownerId
            const gym = await AdminModels.Gym.findOne({ ownerId: userIdObjectId }).lean();

            if (gym) {
              (user as any).gymId = gym._id.toString();
              console.log(`✅ Associated gym ${gym._id.toString()} with owner ${user._id.toString()}`);
            } else {
              console.warn(`⚠️ No gym found for gym owner ${user._id.toString()}`);
            }
          }
        }

        if (!user) {
          return {
            success: false,
            message: 'Invalid email or password',
          };
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return {
            success: false,
            message: 'Invalid email or password',
          };
        }

        // Check if user is active
        if (user.isActive === false) {
          return {
            success: false,
            message: 'Your account has been deactivated. Please contact support.',
          };
        }

        const token = jwt.sign(
          {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            gymId: (user as any).gymId || user.gymId?.toString(),
          },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return {
          success: true,
          token,
          user: {
            ...user,
            id: user._id.toString(),
            role: dbRoleToGraphQL(user.role) as any, // Convert to GraphQL enum format
            permissions: user.permissions || getRolePermissions(user.role),
            gymId: (user as any).gymId || user.gymId?.toString(),
          },
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || 'Login failed',
        };
      }
    },
    logout: () => {
      // In a stateless JWT system, logout is handled client-side
      // You could implement token blacklisting here if needed
      return true;
    },
  },
};


