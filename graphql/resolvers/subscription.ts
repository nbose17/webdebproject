import Subscription from '@/models/Subscription';
import Gym from '@/models/Gym';

export const subscriptionResolvers = {
  Query: {
    subscriptions: async (_: any, args: any) => {
      const filter: any = {};
      if (args.gymId) filter.gymId = args.gymId;
      if (args.status) filter.status = args.status;

      const subscriptions = await Subscription.find(filter).lean();
      return subscriptions.map(sub => ({ ...sub, id: sub._id.toString() }));
    },
    subscription: async (_: any, { id }: { id: string }) => {
      const subscription = await Subscription.findById(id).lean();
      if (!subscription) {
        throw new Error('Subscription not found');
      }
      return { ...subscription, id: subscription._id.toString() };
    },
  },
  Mutation: {
    createSubscription: async (_: any, args: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const subscription = new Subscription(args);
      await subscription.save();
      
      // Update gym subscription status
      await Gym.findByIdAndUpdate(args.gymId, {
        subscriptionStatus: 'active',
      });

      const populated = await Subscription.findById(subscription._id).lean();
      return { ...populated!, id: populated!._id.toString() };
    },
    updateSubscription: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const subscription = await Subscription.findByIdAndUpdate(
        id,
        { ...args },
        { new: true, runValidators: true }
      ).lean();

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      // Update gym subscription status if changed
      if (args.status) {
        await Gym.findByIdAndUpdate(subscription.gymId, {
          subscriptionStatus: args.status === 'active' ? 'active' : args.status,
        });
      }

      return { ...subscription, id: subscription._id.toString() };
    },
    deleteSubscription: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const subscription = await Subscription.findByIdAndDelete(id);
      return !!subscription;
    },
  },
  Subscription: {
    gym: async (parent: any) => {
      const gym = await Gym.findById(parent.gymId).lean();
      if (!gym) return null;
      return { ...gym, id: gym._id.toString() };
    },
  },
};


