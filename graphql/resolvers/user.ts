import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { getAdminModels, getGymModels } from '@/lib/db-models';
import { getRolePermissions } from '@/lib/roles';
import { dbRoleToGraphQL, graphQLRoleToDb } from '@/lib/role-mapper';
import { UserRole } from '@/lib/types';

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      
      const userId = context.user.userId;
      const userGymId = context.user.gymId;
      
      console.log('🔍 GET_ME query called:', { userId, userGymId, email: context.user.email, role: context.user.role });
      
      // First, try admin database
      const AdminModels = await getAdminModels();
      let user = await AdminModels.User.findById(userId)
        .populate('gymId')
        .populate('branchId')
        .lean();
      
      console.log('📋 User from database:', { 
        found: !!user, 
        userId: user?._id?.toString(), 
        role: user?.role, 
        gymId: user?.gymId 
      });
      
      let finalGymId = userGymId || null;
      
      // Extract gymId from user if it exists
      if (user) {
        // If gymId is populated as an object, extract its _id
        if (user.gymId && typeof user.gymId === 'object' && (user.gymId as any)._id) {
          finalGymId = (user.gymId as any)._id.toString();
        } else if (user.gymId && typeof user.gymId === 'object') {
          finalGymId = (user.gymId as any).toString();
        } else if (user.gymId) {
          finalGymId = user.gymId.toString();
        }
      }
      
      // If not found in admin DB and we have a gymId from context, check gym database
      if (!user && userGymId) {
        try {
          const GymModels = await getGymModels(userGymId);
          user = await GymModels.User.findById(userId)
            .populate('branchId')
            .lean();
          if (user) {
            finalGymId = userGymId;
          }
        } catch (error) {
          // Gym database might not exist
        }
      }
      
      // If still not found, search all gym databases
      if (!user) {
        const gyms = await AdminModels.Gym.find({}).lean();
        for (const gym of gyms) {
          try {
            const gymId = gym._id.toString();
            const GymModels = await getGymModels(gymId);
            const gymUser = await GymModels.User.findById(userId).lean();
            if (gymUser) {
              user = gymUser;
              finalGymId = gymId;
              break;
            }
          } catch (error) {
            continue;
          }
        }
      }
      
      // For gym owners, try to find their gym by ownerId
      if (user && !finalGymId) {
        const userRole = user.role?.toLowerCase();
        
        // Check if user is a gym owner (case-insensitive comparison)
        const isGymOwner = userRole === 'gym_owner' || userRole === UserRole.GYM_OWNER?.toLowerCase();
        
        if (isGymOwner) {
          // Convert userId to ObjectId for the query (ownerId is stored as ObjectId in Gym schema)
          const userIdObjectId = mongoose.Types.ObjectId.isValid(userId) 
            ? new mongoose.Types.ObjectId(userId) 
            : userId;
          
          const gym = await AdminModels.Gym.findOne({ ownerId: userIdObjectId }).lean();
          
          if (gym) {
            finalGymId = gym._id.toString();
            console.log(`✅ Found gym ${finalGymId} for gym owner ${userId}`);
          } else {
            // Also try searching with string comparison in case ownerId is stored as string
            const gymByString = await AdminModels.Gym.findOne({ 
              ownerId: { $in: [userId, userIdObjectId] } 
            }).lean();
            if (gymByString) {
              finalGymId = gymByString._id.toString();
              console.log(`✅ Found gym ${finalGymId} for gym owner ${userId} (string match)`);
            } else {
              console.log(`⚠️ No gym found for gym owner ${userId}. User role: ${userRole}`);
            }
          }
        }
      }
      
      if (!user) {
        throw new Error('User not found');
      }

      const result = {
        ...user,
        id: user._id.toString(),
        role: dbRoleToGraphQL(user.role) as any, // Convert to GraphQL enum format
        permissions: user.permissions || getRolePermissions(user.role),
        gymId: finalGymId,
        branchId: user.branchId ? (typeof user.branchId === 'object' ? (user.branchId as any)._id?.toString() || (user.branchId as any).toString() : user.branchId.toString()) : null,
      };
      
      console.log('🎯 GET_ME returning user data:', {
        id: result.id,
        email: result.email,
        role: result.role,
        gymId: result.gymId,
        branchId: result.branchId,
      });

      return result;
    },
    users: async (_: any, args: any) => {
      const AdminModels = await getAdminModels();
      const filter: any = {};
      if (args.role) filter.role = args.role;
      if (args.gymId) filter.gymId = args.gymId;
      if (args.branchId) filter.branchId = args.branchId;
      if (args.isActive !== undefined) filter.isActive = args.isActive;

      let users = await AdminModels.User.find(filter)
        .populate('gymId')
        .populate('branchId')
        .lean();
      
      // If gymId is specified, also fetch gym-specific users
      if (args.gymId) {
        const GymModels = await getGymModels(args.gymId);
        const gymUsers = await GymModels.User.find(filter)
          .populate('branchId')
          .lean();
        users = [...users, ...gymUsers];
      }

      return users.map(user => ({
        ...user,
        id: user._id.toString(),
        role: dbRoleToGraphQL(user.role) as any, // Convert to GraphQL enum format
        permissions: user.permissions || getRolePermissions(user.role),
      }));
    },
    user: async (_: any, { id }: { id: string }, context: any) => {
      const AdminModels = await getAdminModels();
      let user = await AdminModels.User.findById(id)
        .populate('gymId')
        .populate('branchId')
        .lean();
      
      if (!user) {
        throw new Error('User not found');
      }

      return {
        ...user,
        id: user._id.toString(),
        role: dbRoleToGraphQL(user.role) as any, // Convert to GraphQL enum format
        permissions: user.permissions || getRolePermissions(user.role),
      };
    },
  },
  Mutation: {
    createUser: async (_: any, args: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const hashedPassword = await bcrypt.hash(args.password, 10);
      
      // If gymId is provided, create user in gym-specific database
      if (args.gymId) {
        const GymModels = await getGymModels(args.gymId);
        // Convert GraphQL enum to database format
        const user = new GymModels.User({
          ...args,
          role: args.role ? graphQLRoleToDb(args.role) : args.role,
          password: hashedPassword,
        });
        await user.save();
        const populated = await GymModels.User.findById(user._id)
          .populate('branchId')
          .lean();
        return {
          ...populated!,
          id: populated!._id.toString(),
          role: populated!.role.toUpperCase().replace(/-/g, '_') as any, // Convert to GraphQL enum format
          permissions: populated!.permissions || getRolePermissions(populated!.role),
        };
      }
      
      // Otherwise create in admin database
      const AdminModels = await getAdminModels();
      // Convert GraphQL enum to database format
      const user = new AdminModels.User({
        ...args,
        role: args.role ? graphQLRoleToDb(args.role) : args.role,
        password: hashedPassword,
      });

      await user.save();
      
      const populated = await AdminModels.User.findById(user._id)
        .populate('gymId')
        .populate('branchId')
        .lean();

      return {
        ...populated!,
        id: populated!._id.toString(),
        permissions: populated!.permissions || getRolePermissions(populated!.role),
      };
    },
    updateUser: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      if (args.password) {
        args.password = await bcrypt.hash(args.password, 10);
      }

      // Convert GraphQL enum to database format if role is being updated
      const updateData: any = { ...args };
      if (args.role) {
        updateData.role = graphQLRoleToDb(args.role);
      }

      // Try to find user in admin DB first
      const AdminModels = await getAdminModels();
      let user = await AdminModels.User.findById(id).lean();
      
      if (user) {
        // Update in admin DB
        const updated = await (
          AdminModels.User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
          )
            .populate('gymId')
            .populate('branchId')
            .lean()
        );
        return {
          ...updated!,
          id: updated!._id.toString(),
          role: updated!.role.toUpperCase().replace(/-/g, '_') as any, // Convert to GraphQL enum format
          permissions: updated!.permissions || getRolePermissions(updated!.role),
        };
      }
      
      // If not found, check gym databases (would need gymId context)
      // For now, throw error if not found
      throw new Error('User not found');
    },
    deleteUser: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const AdminModels = await getAdminModels();
      let user = await AdminModels.User.findByIdAndDelete(id);
      
      // If not found in admin DB, would need to check gym DBs
      // This would require gymId context - simplified for now
      return !!user;
    },
  },
  User: {
    gym: async (parent: any) => {
      if (!parent.gymId) return null;
      const AdminModels = await getAdminModels();
      const gym = await AdminModels.Gym.findById(parent.gymId).lean();
      return gym ? { ...gym, id: gym._id.toString() } : null;
    },
    branch: async (parent: any) => {
      if (!parent.branchId) return null;
      const AdminModels = await getAdminModels();
      let branch = await AdminModels.Branch.findById(parent.branchId).lean();
      if (!branch && parent.gymId) {
        const GymModels = await getGymModels(parent.gymId);
        branch = await GymModels.Branch.findById(parent.branchId).lean();
      }
      return branch ? { ...branch, id: branch._id.toString() } : null;
    },
  },
};

