import { getAdminModels, getGymModels } from '@/lib/db-models';

export const dashboardResolvers = {
  Query: {
    dashboardStats: async () => {
      const AdminModels = await getAdminModels();
      
      // Count from admin database
      const [
        totalGyms,
        activeGyms,
        totalBranches,
        activeBranches,
        overdueGyms,
        expiredSubscriptions,
        adminUsers,
        activeAdminUsers,
      ] = await Promise.all([
        AdminModels.Gym.countDocuments(),
        AdminModels.Gym.countDocuments({ subscriptionStatus: 'active' }),
        AdminModels.Branch.countDocuments(),
        AdminModels.Branch.countDocuments({ status: 'active' }),
        AdminModels.Gym.countDocuments({ paymentStatus: 'overdue' }),
        AdminModels.Subscription.countDocuments({ status: 'expired' }),
        AdminModels.User.countDocuments(),
        AdminModels.User.countDocuments({ isActive: true }),
      ]);

      // Count users and clients from all gym databases
      let totalUsers = adminUsers;
      let activeUsers = activeAdminUsers;
      let totalClients = 0;
      let activeClients = 0;

      // Get all gyms to iterate through their databases
      const allGyms = await AdminModels.Gym.find({}).lean();
      
      for (const gym of allGyms) {
        try {
          const GymModels = await getGymModels(gym._id.toString());
          const [gymUsers, gymActiveUsers, gymClients, gymActiveClients] = await Promise.all([
            GymModels.User.countDocuments(),
            GymModels.User.countDocuments({ isActive: true }),
            GymModels.Client.countDocuments(),
            GymModels.Client.countDocuments({ status: 'active' }),
          ]);
          totalUsers += gymUsers;
          activeUsers += gymActiveUsers;
          totalClients += gymClients;
          activeClients += gymActiveClients;
        } catch (error) {
          // Gym database might not exist yet, skip it
          console.warn(`Gym database for ${gym._id} not found, skipping`);
        }
      }

      return {
        totalGyms,
        activeGyms,
        totalUsers,
        activeUsers,
        totalBranches,
        activeBranches,
        totalClients,
        activeClients,
        overduePayments: overdueGyms,
        expiredSubscriptions,
      };
    },
  },
};

