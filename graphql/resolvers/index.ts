import { GraphQLScalarType } from 'graphql';
import { Resolvers } from '../types';
import { userResolvers } from './user';
import { gymResolvers } from './gym';
import { branchResolvers } from './branch';
import { clientResolvers } from './client';
import { subscriptionResolvers } from './subscription';
import { templateResolvers } from './template';
import { authResolvers } from './auth';
import { dashboardResolvers } from './dashboard';
import { cmsResolvers } from './cms';
import { planResolvers } from './plan';
import { classResolvers } from './class';
import { trainerResolvers } from './trainer';

// Date scalar resolver
const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value: any) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  },
  parseValue(value: any) {
    return new Date(value);
  },
  parseLiteral(ast: any) {
    return new Date(ast.value);
  },
});

export const resolvers: Resolvers = {
  // Date: DateScalar, // Commented out - not in Resolvers type definition
  Query: {
    ...userResolvers.Query,
    ...gymResolvers.Query,
    ...branchResolvers.Query,
    ...clientResolvers.Query,
    ...subscriptionResolvers.Query,
    ...templateResolvers.Query,
    ...dashboardResolvers.Query,
    ...cmsResolvers.Query,
    ...planResolvers.Query,
    ...classResolvers.Query,
    ...trainerResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...userResolvers.Mutation,
    ...gymResolvers.Mutation,
    ...branchResolvers.Mutation,
    ...clientResolvers.Mutation,
    ...subscriptionResolvers.Mutation,
    ...templateResolvers.Mutation,
    ...cmsResolvers.Mutation,
    ...planResolvers.Mutation,
    ...classResolvers.Mutation,
    ...trainerResolvers.Mutation,
  },
  User: {
    ...userResolvers.User,
  },
  Gym: {
    ...gymResolvers.Gym,
  },
  Branch: {
    ...branchResolvers.Branch,
  },
  Client: {
    ...clientResolvers.Client,
  },
  Subscription: {
    ...subscriptionResolvers.Subscription,
  },
  // CMS: {
  //   ...cmsResolvers.CMS,
  // },
  // Plan: {
  //   ...planResolvers.Plan,
  // },
  // Class: {
  //   ...classResolvers.Class,
  // },
  // Trainer: {
  //   ...trainerResolvers.Trainer,
  // },
  ContractTemplate: {},
  IDCardTemplate: {},
};


