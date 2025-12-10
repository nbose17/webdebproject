import mongoose from 'mongoose';
import { getGymModels } from '@/lib/db-models';

export const cmsResolvers = {
  Query: {
    cms: async (_: any, { gymId }: { gymId: string }, context: any) => {
      // Allow public access for CMS data
      const GymModels = await getGymModels(gymId);
      
      // Convert gymId string to ObjectId
      const gymObjectId = new mongoose.Types.ObjectId(gymId);
      
      let cmsData = await GymModels.CMS.findOne({ gymId: gymObjectId });
      
      // If no CMS data exists, create default
      if (!cmsData) {
        cmsData = await GymModels.CMS.create({
          gymId: gymObjectId,
        });
      }
      
      return {
        id: cmsData._id.toString(),
        gymId: cmsData.gymId.toString(),
        heroSubHeading: cmsData.heroSubHeading,
        heroMainHeading: cmsData.heroMainHeading,
        heroDescription: cmsData.heroDescription,
        heroBackgroundImage: cmsData.heroBackgroundImage,
        heroButton1Text: cmsData.heroButton1Text,
        heroButton2Text: cmsData.heroButton2Text,
        featureHeading: cmsData.featureHeading,
        featureSubHeading: cmsData.featureSubHeading,
        featureBannerContent: cmsData.featureBannerContent,
        classesHeading: cmsData.classesHeading,
        classesSubHeading: cmsData.classesSubHeading,
        plansHeading: cmsData.plansHeading,
        plansSubHeading: cmsData.plansSubHeading,
        trainersHeading: cmsData.trainersHeading,
        trainersSubHeading: cmsData.trainersSubHeading,
        newsletterHeading: cmsData.newsletterHeading,
        newsletterSubHeading: cmsData.newsletterSubHeading,
        newsletterButtonText: cmsData.newsletterButtonText,
        gymLogo: cmsData.gymLogo,
        address: cmsData.address,
        email: cmsData.email,
        phone: cmsData.phone,
        businessHours: cmsData.businessHours,
        facebookUrl: cmsData.facebookUrl,
        twitterUrl: cmsData.twitterUrl,
        instagramUrl: cmsData.instagramUrl,
        createdAt: cmsData.createdAt,
        updatedAt: cmsData.updatedAt,
      };
    },
  },
  
  Mutation: {
    updateCMS: async (_: any, args: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      
      const { gymId, ...updateData } = args;
      
      // Verify user has access to this gym
      const userGymId = context.user.gymId?.toString();
      const userRole = context.user.role?.toUpperCase();
      const isAdmin = userRole === 'FITCONNECT_ADMIN';
      
      if (!isAdmin && userGymId !== gymId) {
        throw new Error('You do not have permission to update this gym\'s CMS');
      }
      
      const GymModels = await getGymModels(gymId);
      
      // Convert gymId string to ObjectId
      const gymObjectId = new mongoose.Types.ObjectId(gymId);
      
      // Remove undefined values
      const cleanUpdateData: any = {};
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          cleanUpdateData[key] = updateData[key];
        }
      });
      
      const cmsData = await GymModels.CMS.findOneAndUpdate(
        { gymId: gymObjectId },
        { $set: cleanUpdateData },
        { new: true, upsert: true }
      );
      
      return {
        id: cmsData._id.toString(),
        gymId: cmsData.gymId.toString(),
        heroSubHeading: cmsData.heroSubHeading,
        heroMainHeading: cmsData.heroMainHeading,
        heroDescription: cmsData.heroDescription,
        heroBackgroundImage: cmsData.heroBackgroundImage,
        heroButton1Text: cmsData.heroButton1Text,
        heroButton2Text: cmsData.heroButton2Text,
        featureHeading: cmsData.featureHeading,
        featureSubHeading: cmsData.featureSubHeading,
        featureBannerContent: cmsData.featureBannerContent,
        classesHeading: cmsData.classesHeading,
        classesSubHeading: cmsData.classesSubHeading,
        plansHeading: cmsData.plansHeading,
        plansSubHeading: cmsData.plansSubHeading,
        trainersHeading: cmsData.trainersHeading,
        trainersSubHeading: cmsData.trainersSubHeading,
        newsletterHeading: cmsData.newsletterHeading,
        newsletterSubHeading: cmsData.newsletterSubHeading,
        newsletterButtonText: cmsData.newsletterButtonText,
        gymLogo: cmsData.gymLogo,
        address: cmsData.address,
        email: cmsData.email,
        phone: cmsData.phone,
        businessHours: cmsData.businessHours,
        facebookUrl: cmsData.facebookUrl,
        twitterUrl: cmsData.twitterUrl,
        instagramUrl: cmsData.instagramUrl,
        createdAt: cmsData.createdAt,
        updatedAt: cmsData.updatedAt,
      };
    },
  },
  
  CMS: {
    gym: async (parent: any, _: any, context: any) => {
      const { getAdminModels } = await import('@/lib/db-models');
      const AdminModels = await getAdminModels();
      const gym = await AdminModels.Gym.findById(parent.gymId);
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
