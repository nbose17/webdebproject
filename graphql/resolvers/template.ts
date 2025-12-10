import ContractTemplate from '@/models/ContractTemplate';
import IDCardTemplate from '@/models/IDCardTemplate';

export const templateResolvers = {
  Query: {
    contractTemplates: async (_: any, args: any) => {
      const filter: any = {};
      if (args.isActive !== undefined) filter.isActive = args.isActive;

      const templates = await ContractTemplate.find(filter).lean();
      return templates.map(template => ({ ...template, id: template._id.toString() }));
    },
    contractTemplate: async (_: any, { id }: { id: string }) => {
      const template = await ContractTemplate.findById(id).lean();
      if (!template) {
        throw new Error('Contract template not found');
      }
      return { ...template, id: template._id.toString() };
    },
    idCardTemplates: async (_: any, args: any) => {
      const filter: any = {};
      if (args.isActive !== undefined) filter.isActive = args.isActive;

      const templates = await IDCardTemplate.find(filter).lean();
      return templates.map(template => ({ ...template, id: template._id.toString() }));
    },
    idCardTemplate: async (_: any, { id }: { id: string }) => {
      const template = await IDCardTemplate.findById(id).lean();
      if (!template) {
        throw new Error('ID card template not found');
      }
      return { ...template, id: template._id.toString() };
    },
  },
  Mutation: {
    createContractTemplate: async (_: any, args: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const template = new ContractTemplate(args);
      await template.save();
      
      const populated = await ContractTemplate.findById(template._id).lean();
      return { ...populated!, id: populated!._id.toString() };
    },
    updateContractTemplate: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const template = await ContractTemplate.findByIdAndUpdate(
        id,
        { ...args },
        { new: true, runValidators: true }
      ).lean();

      if (!template) {
        throw new Error('Contract template not found');
      }

      return { ...template, id: template._id.toString() };
    },
    deleteContractTemplate: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const template = await ContractTemplate.findByIdAndDelete(id);
      return !!template;
    },
    createIDCardTemplate: async (_: any, args: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const template = new IDCardTemplate(args);
      await template.save();
      
      const populated = await IDCardTemplate.findById(template._id).lean();
      return { ...populated!, id: populated!._id.toString() };
    },
    updateIDCardTemplate: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const template = await IDCardTemplate.findByIdAndUpdate(
        id,
        { ...args },
        { new: true, runValidators: true }
      ).lean();

      if (!template) {
        throw new Error('ID card template not found');
      }

      return { ...template, id: template._id.toString() };
    },
    deleteIDCardTemplate: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const template = await IDCardTemplate.findByIdAndDelete(id);
      return !!template;
    },
  },
};

