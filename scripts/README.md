# Database Seeding Script

This script populates the MongoDB database with initial data for development and testing.

## Usage

### Prerequisites

1. Make sure MongoDB is running locally or you have a MongoDB connection string
2. Set up your `.env.local` file with:
   ```env
   MONGODB_URI=mongodb://localhost:27017/fitconnect
   ```

### Run the Seed Script

```bash
npm run seed
```

This will:
- Connect to MongoDB
- Clear all existing data (optional - can be disabled)
- Create sample data including:
  - Admin users
  - Gym owners
  - Gyms and branches
  - Staff members
  - Clients
  - Subscriptions
  - Contract templates
  - ID card templates

## Created Users

### Admin Users
- **Email:** `admin@fitconnect.com`
- **Password:** `admin123`

- **Email:** `superadmin@fitconnect.com`
- **Password:** `superadmin123`

### Gym Owner
- **Email:** `owner@fitnessgym.com`
- **Password:** `owner123`

### Gym Staff
- **Manager:** `manager@fitnessgym.com` / `manager123`
- **Trainer:** `trainer1@fitnessgym.com` / `trainer123`
- **Receptionist:** `reception@fitnessgym.com` / `receptionist123`

## Sample Data Created

- **2 Admin users** (FitConnect Admin, Super Admin)
- **1 Gym owner**
- **3 Gym staff members** (Manager, Trainer, Receptionist)
- **3 Gyms** (Downtown, Uptown, Eastside)
- **2 Branches** (Downtown Main Branch, Uptown Branch)
- **4 Clients** (mix of active/inactive, different membership types)
- **3 Subscriptions** (various statuses: active, overdue, expired)
- **2 Contract templates** (Standard, Annual)
- **1 ID card template** (Standard Member ID Card)

## Customization

To customize the seed data:

1. Edit `scripts/seed.ts`
2. Modify the data objects as needed
3. To preserve existing data, comment out the cleanup section:
   ```typescript
   // await User.deleteMany({});
   // await Gym.deleteMany({});
   // etc...
   ```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or start MongoDB service
- Check your `MONGODB_URI` in `.env.local`
- Verify the database name and credentials

### Permission Errors
- Ensure the MongoDB user has read/write permissions
- For local MongoDB, typically no special permissions needed

### Script Fails Midway
- The script uses transactions where possible
- Check MongoDB logs for specific errors
- Ensure all required models are properly defined

