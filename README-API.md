# FitConnect GraphQL API

This project uses GraphQL with Apollo Server and Mongoose for database operations.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Copy `.env.example` to `.env.local` and configure:
   ```bash
   cp .env.example .env.local
   ```

   Update the following variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure secret key for JWT tokens
   - `NEXT_PUBLIC_GRAPHQL_URL`: GraphQL endpoint (default: `/api/graphql`)

3. **Start MongoDB**
   Make sure MongoDB is running on your system or use a cloud MongoDB instance.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## GraphQL API

### Endpoint
- **Development**: `http://localhost:3000/api/graphql`
- **GraphQL Playground**: Visit the endpoint in your browser (when introspection is enabled)

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Available Queries

### Auth
- `login(email: String!, password: String!)`: Login and get JWT token
- `me`: Get current authenticated user

### Users
- `users(role: UserRole, gymId: ID, branchId: ID, isActive: Boolean)`: List users
- `user(id: ID!)`: Get user by ID

### Gyms
- `gyms(featured: Boolean, subscriptionStatus: SubscriptionStatus, paymentStatus: PaymentStatus)`: List gyms
- `gym(id: ID!)`: Get gym by ID

### Branches
- `branches(gymId: ID!)`: List branches for a gym
- `branch(id: ID!)`: Get branch by ID

### Clients
- `clients(gymId: ID, branchId: ID, status: ClientStatus)`: List clients
- `client(id: ID!)`: Get client by ID

### Subscriptions
- `subscriptions(gymId: ID, status: SubscriptionStatus)`: List subscriptions
- `subscription(id: ID!)`: Get subscription by ID

### Templates
- `contractTemplates(isActive: Boolean)`: List contract templates
- `contractTemplate(id: ID!)`: Get contract template by ID
- `idCardTemplates(isActive: Boolean)`: List ID card templates
- `idCardTemplate(id: ID!)`: Get ID card template by ID

### Dashboard
- `dashboardStats`: Get dashboard statistics

## Available Mutations

### Users
- `createUser(...)`: Create a new user
- `updateUser(id: ID!, ...)`: Update a user
- `deleteUser(id: ID!)`: Delete a user

### Gyms
- `createGym(...)`: Create a new gym
- `updateGym(id: ID!, ...)`: Update a gym
- `deleteGym(id: ID!)`: Delete a gym

### Branches
- `createBranch(...)`: Create a new branch
- `updateBranch(id: ID!, ...)`: Update a branch
- `deleteBranch(id: ID!)`: Delete a branch

### Clients
- `createClient(...)`: Create a new client
- `updateClient(id: ID!, ...)`: Update a client
- `deleteClient(id: ID!)`: Delete a client

### Subscriptions
- `createSubscription(...)`: Create a new subscription
- `updateSubscription(id: ID!, ...)`: Update a subscription
- `deleteSubscription(id: ID!)`: Delete a subscription

### Templates
- `createContractTemplate(...)`: Create a contract template
- `updateContractTemplate(id: ID!, ...)`: Update a contract template
- `deleteContractTemplate(id: ID!)`: Delete a contract template
- `createIDCardTemplate(...)`: Create an ID card template
- `updateIDCardTemplate(id: ID!, ...)`: Update an ID card template
- `deleteIDCardTemplate(id: ID!)`: Delete an ID card template

## Example Query

```graphql
query GetGyms {
  gyms(subscriptionStatus: active) {
    id
    name
    location
    subscriptionStatus
    paymentStatus
    owner {
      id
      name
      email
    }
  }
}
```

## Example Mutation

```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    success
    token
    user {
      id
      email
      name
      role
    }
  }
}
```

## Database Models

All models are defined in the `models/` directory:
- `User`: User accounts with roles and permissions
- `Gym`: Gym/studio entities
- `Branch`: Branch locations for gyms
- `Client`: Gym members/clients
- `Subscription`: Gym subscriptions and billing
- `ContractTemplate`: Reusable contract templates
- `IDCardTemplate`: ID card design templates

## Notes

- Passwords are hashed using bcrypt before storage
- JWT tokens expire after 7 days
- All mutations require authentication (except login)
- The API includes fallback to mock data for development when MongoDB is unavailable


