// TypeScript types for GraphQL resolvers
import { Document } from 'mongoose';

export interface ResolverContext {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export type Resolvers = {
  Query: any;
  Mutation: any;
  User: any;
  Gym: any;
  Branch: any;
  Client: any;
  Subscription: any;
  ContractTemplate: any;
  IDCardTemplate: any;
};

