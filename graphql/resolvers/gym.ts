import { getAdminModels, getGymModels } from '@/lib/db-models';
import { initializeGymDatabase } from '@/lib/gym-db-utils';

export const gymResolvers = {
  Query: {
    gyms: async (_: any, args: any) => {
      const AdminModels = await getAdminModels();
      const filter: any = {};
      if (args.featured !== undefined) filter.featured = args.featured;
      if (args.subscriptionStatus) filter.subscriptionStatus = args.subscriptionStatus;
      if (args.paymentStatus) filter.paymentStatus = args.paymentStatus;

      const gyms = await AdminModels.Gym.find(filter).lean();
      return gyms.map(gym => ({ ...gym, id: gym._id.toString() }));
    },
    gym: async (_: any, { id }: { id: string }) => {
      console.log('🔍 GET_GYM resolver called with ID:', id);

      const AdminModels = await getAdminModels();
      const gym = await AdminModels.Gym.findById(id).lean();

      console.log('🔍 Gym lookup result:', {
        found: !!gym,
        id: gym?._id?.toString(),
        name: gym?.name
      });

      if (!gym) {
        console.log('❌ Gym not found for ID:', id);
        // Let's also check all gyms to see what IDs we have
        const allGyms = await AdminModels.Gym.find({}).select('_id name').lean();
        console.log('📋 Available gym IDs:', allGyms.map(g => ({ id: g._id.toString(), name: g.name })));
        throw new Error(`Gym not found for ID: ${id}`);
      }

      return { ...gym, id: gym._id.toString() };
    },
    dashboardStats: async (_: any, __: any, context: any) => {
      if (!context.user || !context.user.gymId) {
        throw new Error('Not authenticated or no gym associated');
      }

      const gymId = context.user.gymId;
      const GymModels = await getGymModels(gymId);
      const AdminModels = await getAdminModels();

      // 1. Total Clients
      const totalClients = await GymModels.Client.countDocuments({ gymId });

      // 2. Active Plans & Classes count
      const activePlans = await GymModels.Plan.countDocuments({ gymId });
      const activeClasses = await GymModels.Class.countDocuments({ gymId });

      // 3. Plan Distribution & Revenue Estimation
      // We need to fetch all clients to group by plan, and also need plan prices to calc revenue.
      // Optimization: aggregate on db
      const clients = await GymModels.Client.find({ gymId }).lean();
      const plans = await GymModels.Plan.find({ gymId }).lean();

      const planMap = new Map<string, number>(); // planName -> count
      let totalRevenue = 0;

      // Create a lookup for plan prices
      const planPriceMap = new Map<string, number>();
      plans.forEach(p => planPriceMap.set(p.name, p.price));

      console.log('📊 Calculating dashboard stats for gym:', gymId);

      clients.forEach(client => {
        const planName = client.membershipType;
        if (planName) {
          planMap.set(planName, (planMap.get(planName) || 0) + 1);
          // Add price to revenue if plan exists. 
          const planPrice = planPriceMap.get(planName);
          // console.log(`💰 Adding revenue for plan ${planName}: ${planPrice}`);
          totalRevenue += planPrice || 0;
        }
      });

      const planDistribution = Array.from(planMap.entries()).map(([name, value]) => ({
        name,
        value
      }));

      console.log('✅ Dashboard Stats:', {
        totalClients,
        totalRevenue,
        activePlans,
        activeClasses,
        planDistributionCount: planMap.size
      });

      return {
        totalClients: totalClients || 0,
        totalRevenue: totalRevenue || 0,
        activePlans: activePlans || 0,
        activeClasses: activeClasses || 0,
        planDistribution
      };
    },
  },
  Mutation: {
    createGym: async (_: any, args: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const AdminModels = await getAdminModels();

      // Enum values from GraphQL are already lowercase
      const gym = new AdminModels.Gym({
        name: args.name,
        location: args.location,
        image: args.image || '/images/gym-placeholder.jpg',
        description: args.description || '',
        ownerId: args.ownerId,
        featured: args.featured || false,
        subscriptionStatus: args.subscriptionStatus || 'active',
        paymentStatus: args.paymentStatus || 'current',
      });
      await gym.save();

      // Automatically create the gym-specific database
      const gymId = gym._id.toString();
      try {
        await initializeGymDatabase(gymId);
        console.log(`✅ Created gym database: fc_gym_${gymId}`);
      } catch (error: any) {
        console.error(`⚠️ Failed to initialize gym database for ${gymId}:`, error.message);
        // Don't fail the gym creation if database init fails - it can be fixed later
      }

      const populated = await AdminModels.Gym.findById(gym._id).lean();
      return { ...populated!, id: populated!._id.toString() };
    },
    updateGym: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const AdminModels = await getAdminModels();

      // Build update object (enum values are already lowercase from GraphQL)
      const updateData: any = {};
      if (args.name !== undefined) updateData.name = args.name;
      if (args.location !== undefined) updateData.location = args.location;
      if (args.image !== undefined) updateData.image = args.image;
      if (args.featured !== undefined) updateData.featured = args.featured;
      if (args.description !== undefined) updateData.description = args.description;
      if (args.ownerId !== undefined) updateData.ownerId = args.ownerId;

      // Enum values from GraphQL are already lowercase, use directly
      if (args.subscriptionStatus !== undefined) {
        updateData.subscriptionStatus = args.subscriptionStatus;
      }
      if (args.paymentStatus !== undefined) {
        updateData.paymentStatus = args.paymentStatus;
      }

      const gym = await AdminModels.Gym.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).lean();

      if (!gym) {
        throw new Error('Gym not found');
      }

      return { ...gym, id: gym._id.toString() };
    },
    deleteGym: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const AdminModels = await getAdminModels();
      const gym = await AdminModels.Gym.findByIdAndDelete(id);
      return !!gym;
    },
  },
  Gym: {
    owner: async (parent: any) => {
      const AdminModels = await getAdminModels();
      const user = await AdminModels.User.findById(parent.ownerId).lean();
      if (!user) return null;
      return { ...user, id: user._id.toString() };
    },
    branches: async (parent: any) => {
      const AdminModels = await getAdminModels();
      const branches = await AdminModels.Branch.find({ gymId: parent.id }).lean();
      return branches.map(branch => ({ ...branch, id: branch._id.toString() }));
    },
    users: async (parent: any) => {
      // Get users from admin database (gym owner)
      const AdminModels = await getAdminModels();
      const adminUsers = await AdminModels.User.find({ gymId: parent.id }).lean();

      // Also get users from gym-specific database (staff)
      try {
        const GymModels = await getGymModels(parent.id);
        const gymUsers = await GymModels.User.find({ gymId: parent.id }).lean();
        const allUsers = [...adminUsers, ...gymUsers];
        return allUsers.map(user => ({
          ...user,
          id: user._id.toString(),
          role: user.role ? user.role.toUpperCase().replace(/-/g, '_') : user.role, // Convert to GraphQL enum format
        }));
      } catch (error) {
        // Gym database might not exist yet, return only admin users
        return adminUsers.map(user => ({
          ...user,
          id: user._id.toString(),
          role: user.role ? user.role.toUpperCase().replace(/-/g, '_') : user.role, // Convert to GraphQL enum format
        }));
      }
    },
    clients: async (parent: any) => {
      // Clients are stored in gym-specific databases
      try {
        const GymModels = await getGymModels(parent.id);
        const clients = await GymModels.Client.find({ gymId: parent.id }).lean();
        return clients.map(client => ({ ...client, id: client._id.toString() }));
      } catch (error) {
        // Gym database might not exist yet
        return [];
      }
    },
    subscription: async (parent: any) => {
      const AdminModels = await getAdminModels();
      const mongoose = await import('mongoose');
      // Try to find by string ID first, then by ObjectId
      let subscription = await AdminModels.Subscription.findOne({ gymId: parent.id }).lean();
      if (!subscription && mongoose.default.Types.ObjectId.isValid(parent.id)) {
        subscription = await AdminModels.Subscription.findOne({
          gymId: new mongoose.default.Types.ObjectId(parent.id)
        }).lean();
      }
      if (!subscription) return null;
      return { ...subscription, id: subscription._id.toString() };
    },
  },
};


