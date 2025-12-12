import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar Date

  enum UserRole {
    FITCONNECT_ADMIN
    GYM_OWNER
    GYM_MANAGER
    GYM_TRAINER
    GYM_RECEPTIONIST
  }

  enum SubscriptionStatus {
    active
    suspended
    expired
    cancelled
  }

  enum PaymentStatus {
    current
    overdue
  }

  enum BranchStatus {
    active
    inactive
  }

  enum ClientStatus {
    active
    inactive
  }

  type Permission {
    resource: String!
    actions: [String!]!
  }

  type User {
    id: ID!
    email: String!
    name: String!
    role: UserRole!
    permissions: [Permission!]
    gymId: ID
    branchId: ID
    isActive: Boolean!
    createdAt: Date!
    updatedAt: Date!
    gym: Gym
    branch: Branch
  }

  type Gym {
    id: ID!
    name: String!
    location: String!
    image: String!
    featured: Boolean!
    description: String
    ownerId: ID!
    owner: User
    subscriptionStatus: SubscriptionStatus!
    paymentStatus: PaymentStatus!
    lastActive: Date
    createdAt: Date!
    updatedAt: Date!
    branches: [Branch!]!
    users: [User!]!
    clients: [Client!]!
    subscription: Subscription
  }

  type Branch {
    id: ID!
    name: String!
    address: String!
    phone: String!
    email: String!
    gymId: ID!
    gym: Gym
    managerId: ID
    manager: User
    status: BranchStatus!
    createdAt: Date!
    updatedAt: Date!
    staff: [User!]!
    clients: [Client!]!
  }

  type Client {
    id: ID!
    name: String!
    email: String!
    phone: String!
    membershipType: String!
    gymId: ID!
    gym: Gym
    branchId: ID
    branch: Branch
    status: ClientStatus!
    image: String
    subscriptionEndDate: Date
    contractStartDate: Date
    contractEndDate: Date
    joinDate: Date!
    createdAt: Date!
    updatedAt: Date!
  }

  type Subscription {
    id: ID!
    gymId: ID!
    gym: Gym
    planType: String!
    startDate: Date!
    endDate: Date!
    status: SubscriptionStatus!
    amount: Float!
    billingCycle: String!
    lastPaymentDate: Date
    nextPaymentDate: Date
    createdAt: Date!
    updatedAt: Date!
  }

  type ContractTemplate {
    id: ID!
    name: String!
    content: String!
    variables: [String!]!
    isActive: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type IDCardElement {
    id: String!
    type: String!
    content: String!
    x: Float!
    y: Float!
    width: Float!
    height: Float!
    fontSize: Float
    fontFamily: String
    color: String
    backgroundColor: String
    borderWidth: Float
    borderColor: String
    borderRadius: Float
  }

  type IDCardTemplate {
    id: ID!
    name: String!
    width: Float!
    height: Float!
    backgroundColor: String!
    elements: [IDCardElement!]!
    isActive: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type CMS {
    id: ID!
    gymId: ID!
    gym: Gym
    # Hero Section
    heroSubHeading: String!
    heroMainHeading: String!
    heroDescription: String!
    heroBackgroundImage: String!
    heroButton1Text: String!
    heroButton2Text: String!
    # Feature Section
    featureHeading: String!
    featureSubHeading: String!
    featureBannerContent: String!
    # Section Headings
    classesHeading: String!
    classesSubHeading: String!
    plansHeading: String!
    plansSubHeading: String!
    trainersHeading: String!
    trainersSubHeading: String!
    # Newsletter Section
    newsletterHeading: String!
    newsletterSubHeading: String!
    newsletterButtonText: String!
    # Branding & Contact
    gymLogo: String!
    address: String
    email: String
    phone: String
    businessHours: String
    facebookUrl: String
    twitterUrl: String
    instagramUrl: String
    createdAt: Date!
    updatedAt: Date!
  }

  type Plan {
    id: ID!
    name: String!
    durationMonths: Int!
    price: Float!
    gymId: ID!
    gym: Gym
    description: String
    includedClasses: [Class!]
    createdAt: Date!
    updatedAt: Date!
  }

  type Class {
    id: ID!
    name: String!
    durationMinutes: Int!
    numberOfClasses: Int!
    price: Float!
    description: String
    gymId: ID!
    gym: Gym
    createdAt: Date!
    updatedAt: Date!
  }

  type Trainer {
    id: ID!
    name: String!
    experience: String!
    image: String!
    bio: String
    gymId: ID!
    gym: Gym
    createdAt: Date!
    updatedAt: Date!
  }

  type AuthResponse {
    success: Boolean!
    token: String
    user: User
    message: String
  }

  # Query types
  type Query {
    # Auth
    me: User
    
    # Users
    users(role: UserRole, gymId: ID, branchId: ID, isActive: Boolean): [User!]!
    user(id: ID!): User
    
    # Gyms
    gyms(featured: Boolean, subscriptionStatus: SubscriptionStatus, paymentStatus: PaymentStatus): [Gym!]!
    gym(id: ID!): Gym
    
    # Branches
    branches(gymId: ID!): [Branch!]!
    branch(id: ID!, gymId: ID!): Branch
    
    # Clients
    clients(gymId: ID!, branchId: ID, status: ClientStatus): [Client!]!
    client(id: ID!, gymId: ID!): Client
    
    # Subscriptions
    subscriptions(gymId: ID, status: SubscriptionStatus): [Subscription!]!
    subscription(id: ID!): Subscription
    
    # Templates
    contractTemplates(isActive: Boolean): [ContractTemplate!]!
    contractTemplate(id: ID!): ContractTemplate
    
    # ID Card Templates
    idCardTemplates(isActive: Boolean): [IDCardTemplate!]!
    idCardTemplate(id: ID!): IDCardTemplate
    
    # CMS
    cms(gymId: ID!): CMS
    
    # Plans
    plans(gymId: ID!): [Plan!]!
    plan(id: ID!, gymId: ID!): Plan
    
    # Classes
    classes(gymId: ID!): [Class!]!
    class(id: ID!, gymId: ID!): Class
    
    # Trainers
    trainers(gymId: ID!): [Trainer!]!
    trainer(id: ID!, gymId: ID!): Trainer
    
    # Dashboard stats
    dashboardStats: DashboardStats!
  }

  type DashboardStats {
    totalGyms: Int!
    activeGyms: Int!
    totalUsers: Int!
    activeUsers: Int!
    totalBranches: Int!
    activeBranches: Int!
    totalClients: Int!
    activeClients: Int!
    overduePayments: Int!
    expiredSubscriptions: Int!
  }

  # Mutation types
  type Mutation {
    # Auth
    login(email: String!, password: String!): AuthResponse!
    logout: Boolean!
    
    # Users
    createUser(
      email: String!
      name: String!
      password: String!
      role: UserRole!
      gymId: ID
      branchId: ID
      permissions: [PermissionInput!]
    ): User!
    
    updateUser(
      id: ID!
      email: String
      name: String
      password: String
      role: UserRole
      gymId: ID
      branchId: ID
      permissions: [PermissionInput!]
      isActive: Boolean
    ): User!
    
    deleteUser(id: ID!): Boolean!
    
    # Gyms
    createGym(
      name: String!
      location: String!
      image: String
      description: String
      ownerId: ID!
      featured: Boolean
      subscriptionStatus: SubscriptionStatus
      paymentStatus: PaymentStatus
    ): Gym!
    
    updateGym(
      id: ID!
      name: String
      location: String
      image: String
      featured: Boolean
      description: String
      ownerId: ID
      subscriptionStatus: SubscriptionStatus
      paymentStatus: PaymentStatus
    ): Gym!
    
    deleteGym(id: ID!): Boolean!
    
    # Branches
    createBranch(
      name: String!
      address: String!
      phone: String!
      email: String!
      gymId: ID!
      managerId: ID
      status: BranchStatus
    ): Branch!
    
    updateBranch(
      id: ID!
      gymId: ID!
      name: String
      address: String
      phone: String
      email: String
      managerId: ID
      status: BranchStatus
    ): Branch!
    
    deleteBranch(id: ID!, gymId: ID!): Boolean!
    
    # Clients
    createClient(
      name: String!
      email: String!
      phone: String!
      membershipType: String!
      gymId: ID!
      branchId: ID
      image: String
      status: ClientStatus
      joinDate: Date
      subscriptionEndDate: Date
      contractStartDate: Date
      contractEndDate: Date
    ): Client!
    
    updateClient(
      id: ID!
      gymId: ID!
      name: String
      email: String
      phone: String
      membershipType: String
      branchId: ID
      status: ClientStatus
      image: String
      joinDate: Date
      subscriptionEndDate: Date
      contractStartDate: Date
      contractEndDate: Date
    ): Client!
    
    deleteClient(id: ID!, gymId: ID!): Boolean!
    
    # Subscriptions
    createSubscription(
      gymId: ID!
      planType: String!
      startDate: Date!
      endDate: Date!
      amount: Float!
      billingCycle: String!
    ): Subscription!
    
    updateSubscription(
      id: ID!
      planType: String
      startDate: Date
      endDate: Date
      status: SubscriptionStatus
      amount: Float
      billingCycle: String
    ): Subscription!
    
    deleteSubscription(id: ID!): Boolean!
    
    # Templates
    createContractTemplate(
      name: String!
      content: String!
      variables: [String!]!
    ): ContractTemplate!
    
    updateContractTemplate(
      id: ID!
      name: String
      content: String
      variables: [String!]
      isActive: Boolean
    ): ContractTemplate!
    
    deleteContractTemplate(id: ID!): Boolean!
    
    createIDCardTemplate(
      name: String!
      width: Float!
      height: Float!
      backgroundColor: String!
      elements: [IDCardElementInput!]!
    ): IDCardTemplate!
    
    updateIDCardTemplate(
      id: ID!
      name: String
      width: Float
      height: Float
      backgroundColor: String
      elements: [IDCardElementInput!]
      isActive: Boolean
    ): IDCardTemplate!
    
    deleteIDCardTemplate(id: ID!): Boolean!
    
    # CMS
    updateCMS(
      gymId: ID!
      heroSubHeading: String
      heroMainHeading: String
      heroDescription: String
      heroBackgroundImage: String
      heroButton1Text: String
      heroButton2Text: String
      featureHeading: String
      featureSubHeading: String
      featureBannerContent: String
      classesHeading: String
      classesSubHeading: String
      plansHeading: String
      plansSubHeading: String
      trainersHeading: String
      trainersSubHeading: String
      newsletterHeading: String
      newsletterSubHeading: String
      newsletterButtonText: String
      gymLogo: String
      address: String
      email: String
      phone: String
      businessHours: String
      facebookUrl: String
      twitterUrl: String
      instagramUrl: String
    ): CMS!
    
    # Plans
    createPlan(
      name: String!
      durationMonths: Int!
      price: Float!
      gymId: ID!
      description: String
      includedClassIds: [ID!]
    ): Plan!
    
    updatePlan(
      id: ID!
      gymId: ID!
      name: String
      durationMonths: Int
      price: Float
      description: String
      includedClassIds: [ID!]
    ): Plan!
    
    deletePlan(id: ID!, gymId: ID!): Boolean!
    
    # Classes
    createClass(
      name: String!
      durationMinutes: Int!
      numberOfClasses: Int!
      price: Float!
      gymId: ID!
      description: String
    ): Class!
    
    updateClass(
      id: ID!
      gymId: ID!
      name: String
      durationMinutes: Int
      numberOfClasses: Int
      price: Float
      description: String
    ): Class!
    
    deleteClass(id: ID!, gymId: ID!): Boolean!
    
    # Trainers
    createTrainer(
      name: String!
      experience: String!
      image: String
      bio: String
      gymId: ID!
    ): Trainer!
    
    updateTrainer(
      id: ID!
      gymId: ID!
      name: String
      experience: String
      image: String
      bio: String
    ): Trainer!
    
    deleteTrainer(id: ID!, gymId: ID!): Boolean!
  }

  input PermissionInput {
    resource: String!
    actions: [String!]!
  }

  input IDCardElementInput {
    id: String!
    type: String!
    content: String!
    x: Float!
    y: Float!
    width: Float!
    height: Float!
    fontSize: Float
    fontFamily: String
    color: String
    backgroundColor: String
    borderWidth: Float
    borderColor: String
    borderRadius: Float
  }
`;


