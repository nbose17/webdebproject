/**
 * Helper functions to get models with the correct database connection
 * Admin database models vs Gym-specific database models
 */

import mongoose, { Connection } from 'mongoose';
import { connectAdminDB, connectGymDB } from './db';
import * as schemas from '../models/schemas';

// Admin database models (fitconnect_admin)
// These models store: Users (admins, gym owners), Gyms, Branches metadata, Subscriptions, Templates

let adminConnection: Connection | null = null;

export async function getAdminConnection(): Promise<Connection> {
  if (!adminConnection) {
    adminConnection = (await connectAdminDB()) as Connection;
  }
  return adminConnection;
}

// Lazy load admin models
let adminModels: {
  User: any;
  Gym: any;
  Branch: any;
  Subscription: any;
  ContractTemplate: any;
  IDCardTemplate: any;
} | null = null;

export async function getAdminModels() {
  if (adminModels) return adminModels;

  const conn = await getAdminConnection();
  
  adminModels = {
    User: conn.models.User || conn.model('User', schemas.UserSchema),
    Gym: conn.models.Gym || conn.model('Gym', schemas.GymSchema),
    Branch: conn.models.Branch || conn.model('Branch', schemas.BranchSchema),
    Subscription: conn.models.Subscription || conn.model('Subscription', schemas.SubscriptionSchema),
    ContractTemplate: conn.models.ContractTemplate || conn.model('ContractTemplate', schemas.ContractTemplateSchema),
    IDCardTemplate: conn.models.IDCardTemplate || conn.model('IDCardTemplate', schemas.IDCardTemplateSchema),
  };

  return adminModels;
}

// Gym-specific database models (fc_gym_<gymId>)
// These models store: Clients, Gym-specific users (staff), Branch-specific data
// Note: Using shorter prefix due to MongoDB Atlas 38-byte database name limit

export async function getGymModels(gymId: string) {
  const conn = await connectGymDB(gymId);
  
  // Get or create models (this ensures collections exist, which creates the database)
  const models = {
    Client: conn.models.Client || conn.model('Client', schemas.ClientSchema),
    User: conn.models.User || conn.model('User', schemas.UserSchema),
    Branch: conn.models.Branch || conn.model('Branch', schemas.BranchSchema),
    CMS: conn.models.CMS || conn.model('CMS', schemas.CMSSchema),
    Plan: conn.models.Plan || conn.model('Plan', schemas.PlanSchema),
    Class: conn.models.Class || conn.model('Class', schemas.ClassSchema),
    Trainer: conn.models.Trainer || conn.model('Trainer', schemas.TrainerSchema),
  };
  
  // Ensure indexes exist (this also ensures collections exist)
  try {
    await Promise.all([
      models.User.createIndexes().catch(() => {}),
      models.Client.createIndexes().catch(() => {}),
      models.Branch.createIndexes().catch(() => {}),
      models.CMS.createIndexes().catch(() => {}),
      models.Plan.createIndexes().catch(() => {}),
      models.Class.createIndexes().catch(() => {}),
      models.Trainer.createIndexes().catch(() => {}),
    ]);
  } catch (error) {
    // Ignore errors - database/collections might already exist
  }
  
  return models;
}

