import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local BEFORE any other imports
config({ path: resolve(process.cwd(), '.env.local') });

// Verify MONGODB_URI is loaded
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  console.log('💡 Make sure .env.local exists with MONGODB_URI set');
  process.exit(1);
}

console.log(`📝 Using MONGODB_URI: ${process.env.MONGODB_URI.replace(/\/\/[^@]+@/, '//***:***@')}`); // Hide credentials

import { connectAdminDB, connectGymDB } from '../lib/db';
import { getAdminModels, getGymModels } from '../lib/db-models';
import { UserRole } from '../lib/types';
import { getRolePermissions } from '../lib/roles';
import { initializeGymDatabase } from '../lib/gym-db-utils';

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to admin database
    await connectAdminDB();
    console.log('✅ Connected to Admin Database (fitconnect_admin)');
    
    // Get admin models
    const AdminModels = await getAdminModels();

    // Clear existing data from admin database (optional - comment out if you want to preserve data)
    console.log('🧹 Clearing existing data from admin database...');
    await AdminModels.User.deleteMany({});
    await AdminModels.Gym.deleteMany({});
    await AdminModels.Branch.deleteMany({});
    await AdminModels.Subscription.deleteMany({});
    await AdminModels.ContractTemplate.deleteMany({});
    await AdminModels.IDCardTemplate.deleteMany({});
    console.log('✅ Cleared existing data from admin database');

    // Create Admin Users
    console.log('👤 Creating admin users...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const superAdminPassword = await bcrypt.hash('superadmin123', 10);

    const adminUser = new AdminModels.User({
      email: 'admin@fitconnect.com',
      name: 'FitConnect Admin',
      password: adminPassword,
      role: UserRole.FITCONNECT_ADMIN,
      permissions: getRolePermissions(UserRole.FITCONNECT_ADMIN),
      isActive: true,
    });

    const superAdmin = new AdminModels.User({
      email: 'superadmin@fitconnect.com',
      name: 'Super Admin',
      password: superAdminPassword,
      role: UserRole.FITCONNECT_ADMIN,
      permissions: getRolePermissions(UserRole.FITCONNECT_ADMIN),
      isActive: true,
    });

    await adminUser.save();
    await superAdmin.save();
    console.log('✅ Created admin users');
    console.log('   - admin@fitconnect.com / admin123');
    console.log('   - superadmin@fitconnect.com / superadmin123');

    // Create Gym Owner
    console.log('👤 Creating gym owner...');
    const ownerPassword = await bcrypt.hash('owner123', 10);
    const gymOwner = new AdminModels.User({
      email: 'owner@fitnessgym.com',
      name: 'John Fitness Owner',
      password: ownerPassword,
      role: UserRole.GYM_OWNER,
      permissions: getRolePermissions(UserRole.GYM_OWNER),
      isActive: true,
    });
    await gymOwner.save();
    const ownerId = gymOwner._id;
    console.log('✅ Created gym owner');
    console.log('   - owner@fitnessgym.com / owner123');

    // Create Gyms
    console.log('🏋️ Creating gyms...');
    const gym1 = new AdminModels.Gym({
      name: 'FITNESS GYM - Downtown',
      location: '123 Main Street, Downtown',
      image: '/images/gym-placeholder.jpg',
      featured: true,
      description: 'A premier fitness center in the heart of downtown with state-of-the-art equipment.',
      ownerId: ownerId,
      subscriptionStatus: 'active',
      paymentStatus: 'current',
      lastActive: new Date(),
    });

    const gym2 = new AdminModels.Gym({
      name: 'FITNESS GYM - Uptown',
      location: '456 Oak Avenue, Uptown',
      image: '/images/gym-placeholder.jpg',
      featured: false,
      description: 'Modern fitness facility in the uptown district.',
      ownerId: ownerId,
      subscriptionStatus: 'active',
      paymentStatus: 'overdue',
      lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    });

    const gym3 = new AdminModels.Gym({
      name: 'FITNESS GYM - Eastside',
      location: '789 Pine Road, Eastside',
      image: '/images/gym-placeholder.jpg',
      featured: false,
      description: 'Community-focused gym serving the eastside neighborhood.',
      ownerId: ownerId,
      subscriptionStatus: 'expired',
      paymentStatus: 'current',
      lastActive: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    });

    await gym1.save();
    await gym2.save();
    await gym3.save();
    const gym1Id = gym1._id;
    const gym2Id = gym2._id;
    const gym3Id = gym3._id;
    console.log('✅ Created 3 gyms');

    // Create Branches in admin database (metadata only)
    console.log('🏢 Creating branches...');
    const branch1 = new AdminModels.Branch({
      name: 'Downtown Main Branch',
      address: '123 Main Street, Downtown, Floor 2',
      phone: '+1-555-0101',
      email: 'downtown@fitnessgym.com',
      gymId: gym1Id,
      status: 'active',
    });

    const branch2 = new AdminModels.Branch({
      name: 'Uptown Branch',
      address: '456 Oak Avenue, Uptown, Suite 200',
      phone: '+1-555-0102',
      email: 'uptown@fitnessgym.com',
      gymId: gym2Id,
      status: 'active',
    });

    await branch1.save();
    await branch2.save();
    const branch1Id = branch1._id;
    const branch2Id = branch2._id;
    console.log('✅ Created branches in admin database');

    // Now create gym-specific databases and seed gym data
    console.log('\n🏋️ Creating gym-specific databases and seeding gym data...');
    
    // Initialize all gym databases (ensure they exist)
    console.log('\n🔄 Initializing gym databases...');
    await initializeGymDatabase(gym1Id.toString());
    await initializeGymDatabase(gym2Id.toString());
    await initializeGymDatabase(gym3Id.toString());
    console.log('✅ All gym databases initialized');
    
    // Gym 1 - Downtown
    await seedGymDatabase(gym1Id.toString(), branch1Id.toString(), 'Downtown');
    
    // Gym 2 - Uptown
    await seedGymDatabase(gym2Id.toString(), branch2Id.toString(), 'Uptown');
    
    // Gym 3 - Eastside (create database but no branches/staff/clients yet)
    console.log(`\n📦 Initializing database for Gym 3 (Eastside)...`);
    await seedGymDatabase(gym3Id.toString(), '', 'Eastside');

    // Helper function to seed gym-specific database
    async function seedGymDatabase(gymId: string, branchId: string, gymName: string) {
      console.log(`\n  📦 Seeding database for ${gymName} (Gym ID: ${gymId})...`);
      
      // Connect to gym database (ensures it exists)
      await connectGymDB(gymId);
      const GymModels = await getGymModels(gymId);
      
      // Clear existing data
      await GymModels.Client.deleteMany({});
      await GymModels.User.deleteMany({});
      await GymModels.Branch.deleteMany({});
      
      // Skip seeding if no branchId provided (empty gym)
      if (!branchId) {
        console.log(`    ℹ️ No branch data to seed for ${gymName}`);
        return;
      }
      
      // Create gym staff
      const managerPassword = await bcrypt.hash('manager123', 10);
      const trainerPassword = await bcrypt.hash('trainer123', 10);
      const receptionistPassword = await bcrypt.hash('receptionist123', 10);
      
      const manager = new GymModels.User({
        email: `manager@${gymName.toLowerCase()}.com`,
        name: `${gymName} Manager`,
        password: managerPassword,
        role: UserRole.GYM_MANAGER,
        permissions: getRolePermissions(UserRole.GYM_MANAGER),
        gymId: gymId,
        branchId: branchId,
        isActive: true,
      });
      
      const trainer = new GymModels.User({
        email: `trainer@${gymName.toLowerCase()}.com`,
        name: `${gymName} Trainer`,
        password: trainerPassword,
        role: UserRole.GYM_TRAINER,
        permissions: getRolePermissions(UserRole.GYM_TRAINER),
        gymId: gymId,
        branchId: branchId,
        isActive: true,
      });
      
      const receptionist = new GymModels.User({
        email: `reception@${gymName.toLowerCase()}.com`,
        name: `${gymName} Receptionist`,
        password: receptionistPassword,
        role: UserRole.GYM_RECEPTIONIST,
        permissions: getRolePermissions(UserRole.GYM_RECEPTIONIST),
        gymId: gymId,
        branchId: branchId,
        isActive: true,
      });
      
      await manager.save();
      await trainer.save();
      await receptionist.save();
      console.log(`    ✅ Created gym staff for ${gymName}`);
      
      // Create branch copy in gym database (with staff/clients data)
      const branchCopy = new GymModels.Branch({
        _id: branchId,
        name: gymName === 'Downtown' ? 'Downtown Main Branch' : 'Uptown Branch',
        address: gymName === 'Downtown' ? '123 Main Street, Downtown, Floor 2' : '456 Oak Avenue, Uptown, Suite 200',
        phone: gymName === 'Downtown' ? '+1-555-0101' : '+1-555-0102',
        email: gymName === 'Downtown' ? 'downtown@fitnessgym.com' : 'uptown@fitnessgym.com',
        gymId: gymId,
        managerId: manager._id,
        status: 'active',
      });
      await branchCopy.save();
      
      // Create clients
      const clients = gymName === 'Downtown' ? [
        new GymModels.Client({
          name: 'Alice Johnson',
          email: 'alice.johnson@email.com',
          phone: '+1-555-1001',
          membershipType: 'Premium Annual',
          gymId: gymId,
          branchId: branchId,
          status: 'active',
          joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          subscriptionEndDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000),
          contractStartDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          contractEndDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000),
        }),
        new GymModels.Client({
          name: 'Bob Smith',
          email: 'bob.smith@email.com',
          phone: '+1-555-1002',
          membershipType: 'Basic Monthly',
          gymId: gymId,
          branchId: branchId,
          status: 'active',
          joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          subscriptionEndDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          contractStartDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          contractEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }),
      ] : [
        new GymModels.Client({
          name: 'Carol White',
          email: 'carol.white@email.com',
          phone: '+1-555-1003',
          membershipType: 'Premium Monthly',
          gymId: gymId,
          branchId: branchId,
          status: 'active',
          joinDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          subscriptionEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          contractStartDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          contractEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        }),
      ];
      
      await GymModels.Client.insertMany(clients);
      console.log(`    ✅ Created ${clients.length} clients for ${gymName}`);
      
      // Update branch manager in admin DB
      if (gymName === 'Downtown') {
        await AdminModels.Branch.findByIdAndUpdate(branchId, { managerId: manager._id });
      }
    }

    // Create Subscriptions (in admin database)
    console.log('\n💳 Creating subscriptions...');
    const subscriptions = [
      new AdminModels.Subscription({
        gymId: gym1Id,
        planType: 'Premium Plan',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000), // 335 days from now
        status: 'active',
        amount: 299.99,
        billingCycle: 'monthly',
        lastPaymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        nextPaymentDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
      }),
      new AdminModels.Subscription({
        gymId: gym2Id,
        planType: 'Standard Plan',
        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        endDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000), // 305 days from now
        status: 'active',
        amount: 199.99,
        billingCycle: 'monthly',
        lastPaymentDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago (overdue)
        nextPaymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (overdue)
      }),
      new AdminModels.Subscription({
        gymId: gym3Id,
        planType: 'Basic Plan',
        startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
        endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Expired 30 days ago
        status: 'expired',
        amount: 149.99,
        billingCycle: 'monthly',
        lastPaymentDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        nextPaymentDate: null,
      }),
    ];

    await AdminModels.Subscription.insertMany(subscriptions);
    console.log('✅ Created 3 subscriptions');

    // Create Contract Templates (in admin database)
    console.log('\n📄 Creating contract templates...');
    const contractTemplates = [
      new AdminModels.ContractTemplate({
        name: 'Standard Membership Contract',
        content: `# Membership Contract

This contract is between **{{gym.name}}** and **{{member.name}}**.

## Membership Details
- **Membership Type:** {{membership.type}}
- **Monthly Fee:** \${membership.price}
- **Contract Duration:** {{contract.duration}} months
- **Start Date:** {{contract.startDate}}
- **End Date:** {{contract.endDate}}

## Terms and Conditions
1. Membership fees are due monthly in advance.
2. Membership is non-transferable.
3. Cancellation requires 30 days written notice.
4. Late fees may apply for overdue payments.

## Member Information
- **Name:** {{member.name}}
- **Email:** {{member.email}}
- **Phone:** {{member.phone}}

Signed on {{signature.date}}.`,
        variables: ['gym.name', 'member.name', 'membership.type', 'membership.price', 'contract.duration', 'contract.startDate', 'contract.endDate', 'member.email', 'member.phone', 'signature.date'],
        isActive: true,
      }),
      new AdminModels.ContractTemplate({
        name: 'Annual Membership Contract',
        content: `# Annual Membership Contract

## Agreement
This annual membership agreement is entered into between **{{gym.name}}** and **{{member.name}}**.

## Membership Terms
- **Type:** {{membership.type}}
- **Annual Fee:** \${membership.price}
- **Duration:** 12 months
- **Effective:** {{contract.startDate}} to {{contract.endDate}}

## Payment Terms
Payment is due annually. No refunds for early termination.

Member: {{member.name}}
Date: {{signature.date}}`,
        variables: ['gym.name', 'member.name', 'membership.type', 'membership.price', 'contract.startDate', 'contract.endDate', 'signature.date'],
        isActive: true,
      }),
    ];

    await AdminModels.ContractTemplate.insertMany(contractTemplates);
    console.log('✅ Created 2 contract templates');

    // Create ID Card Templates (in admin database)
    console.log('\n🆔 Creating ID card templates...');
    const idCardTemplate = new AdminModels.IDCardTemplate({
      name: 'Standard Member ID Card',
      width: 336,
      height: 212,
      backgroundColor: '#FFFFFF',
      elements: [
        {
          id: 'member-name',
          type: 'text',
          content: '{{member.name}}',
          x: 20,
          y: 30,
          width: 296,
          height: 40,
          fontSize: 24,
          fontFamily: 'Arial',
          color: '#000000',
        },
        {
          id: 'member-id',
          type: 'text',
          content: 'ID: {{member.id}}',
          x: 20,
          y: 80,
          width: 200,
          height: 25,
          fontSize: 14,
          fontFamily: 'Arial',
          color: '#666666',
        },
        {
          id: 'membership-type',
          type: 'text',
          content: '{{membership.type}}',
          x: 20,
          y: 115,
          width: 200,
          height: 25,
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#4CAF50',
        },
        {
          id: 'expiry-date',
          type: 'text',
          content: 'Expires: {{member.expiryDate}}',
          x: 20,
          y: 150,
          width: 200,
          height: 25,
          fontSize: 12,
          fontFamily: 'Arial',
          color: '#888888',
        },
        {
          id: 'qr-code',
          type: 'qr',
          content: '{{member.qrCode}}',
          x: 230,
          y: 80,
          width: 86,
          height: 86,
        },
        {
          id: 'gym-logo',
          type: 'image',
          content: '/images/gym-placeholder.jpg',
          x: 20,
          y: 175,
          width: 60,
          height: 30,
        },
      ],
      isActive: true,
    });

    await idCardTemplate.save();
    
    // Update gym subscription status based on subscriptions
    await AdminModels.Gym.findByIdAndUpdate(gym1Id, {
      subscriptionStatus: 'active',
      paymentStatus: 'current',
    });
    await AdminModels.Gym.findByIdAndUpdate(gym2Id, {
      subscriptionStatus: 'active',
      paymentStatus: 'overdue',
    });
    await AdminModels.Gym.findByIdAndUpdate(gym3Id, {
      subscriptionStatus: 'expired',
      paymentStatus: 'current',
    });
    console.log('✅ Created 1 ID card template');

    console.log('\n✨ Seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('\n📦 Admin Database (fitconnect_admin):');
    console.log('   - 2 Admin users');
    console.log('   - 1 Gym owner');
    console.log('   - 3 Gyms');
    console.log('   - 2 Branches (metadata)');
    console.log('   - 3 Subscriptions');
    console.log('   - 2 Contract templates');
    console.log('   - 1 ID card template');
    console.log('\n🏋️ Gym-Specific Databases:');
    console.log('   - fc_gym_<gym1Id>: 3 staff, 1 branch, 2 clients');
    console.log('   - fc_gym_<gym2Id>: 3 staff, 1 branch, 1 client');
    console.log('\n🔐 Admin Login Credentials:');
    console.log('   Email: admin@fitconnect.com');
    console.log('   Password: admin123');
    console.log('\n   Email: superadmin@fitconnect.com');
    console.log('   Password: superadmin123');

    // Close all database connections
    await AdminModels.User.db.close();
    console.log('\n✅ All database connections closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed function
seed();


