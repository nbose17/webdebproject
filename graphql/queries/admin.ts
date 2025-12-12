import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      token
      message
      user {
        id
        email
        name
        role
        permissions {
          resource
          actions
        }
        isActive
        gymId
        branchId
      }
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      name
      role
      permissions {
        resource
        actions
      }
      isActive
      gymId
      branchId
    }
  }
`;

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalGyms
      activeGyms
      totalUsers
      activeUsers
      totalBranches
      activeBranches
      totalClients
      activeClients
      overduePayments
      expiredSubscriptions
    }
  }
`;

export const GET_GYMS = gql`
  query GetGyms($featured: Boolean, $subscriptionStatus: SubscriptionStatus, $paymentStatus: PaymentStatus) {
    gyms(featured: $featured, subscriptionStatus: $subscriptionStatus, paymentStatus: $paymentStatus) {
      id
      name
      location
      image
      featured
      description
      ownerId
      subscriptionStatus
      paymentStatus
      lastActive
      createdAt
      owner {
        id
        name
        email
      }
      branches {
        id
        name
        address
        phone
        email
        status
      }
      users {
        id
        name
        email
        role
      }
    }
  }
`;

export const GET_GYM = gql`
  query GetGym($id: ID!) {
    gym(id: $id) {
      id
      name
      location
      image
      featured
      description
      ownerId
      subscriptionStatus
      paymentStatus
      lastActive
      createdAt
      owner {
        id
        name
        email
      }
      branches {
        id
        name
        address
        phone
        email
        status
      }
      users {
        id
        name
        email
        role
        isActive
      }
      clients {
        id
        name
        email
        phone
        membershipType
        status
        joinDate
        subscriptionEndDate
      }
      subscription {
        id
        planType
        startDate
        endDate
        status
        amount
        billingCycle
        lastPaymentDate
        nextPaymentDate
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers($role: UserRole, $gymId: ID, $branchId: ID, $isActive: Boolean) {
    users(role: $role, gymId: $gymId, branchId: $branchId, isActive: $isActive) {
      id
      email
      name
      role
      permissions {
        resource
        actions
      }
      gymId
      branchId
      isActive
      createdAt
      gym {
        id
        name
      }
      branch {
        id
        name
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      name
      role
      permissions {
        resource
        actions
      }
      gymId
      branchId
      isActive
      createdAt
      updatedAt
      gym {
        id
        name
      }
      branch {
        id
        name
      }
    }
  }
`;

export const GET_BRANCHES = gql`
  query GetBranches($gymId: ID!) {
    branches(gymId: $gymId) {
      id
      name
      address
      phone
      email
      gymId
      managerId
      status
      createdAt
      manager {
        id
        name
        email
      }
      staff {
        id
        name
        email
      }
      clients {
        id
        name
        email
      }
    }
  }
`;

export const GET_BRANCH = gql`
  query GetBranch($id: ID!, $gymId: ID!) {
    branch(id: $id, gymId: $gymId) {
      id
      name
      address
      phone
      email
      gymId
      managerId
      status
      createdAt
      updatedAt
      gym {
        id
        name
        location
      }
      manager {
        id
        name
        email
        role
      }
      staff {
        id
        name
        email
        role
        isActive
      }
      clients {
        id
        name
        email
        phone
        membershipType
        status
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser(
    $email: String!
    $name: String!
    $password: String!
    $role: UserRole!
    $gymId: ID
    $branchId: ID
    $permissions: [PermissionInput!]
  ) {
    createUser(
      email: $email
      name: $name
      password: $password
      role: $role
      gymId: $gymId
      branchId: $branchId
      permissions: $permissions
    ) {
      id
      email
      name
      role
      isActive
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $email: String
    $name: String
    $password: String
    $role: UserRole
    $gymId: ID
    $branchId: ID
    $isActive: Boolean
    $permissions: [PermissionInput!]
  ) {
    updateUser(
      id: $id
      email: $email
      name: $name
      password: $password
      role: $role
      gymId: $gymId
      branchId: $branchId
      isActive: $isActive
      permissions: $permissions
    ) {
      id
      email
      name
      role
      isActive
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const CREATE_GYM = gql`
  mutation CreateGym(
    $name: String!
    $location: String!
    $image: String
    $description: String
    $ownerId: ID!
    $featured: Boolean
    $subscriptionStatus: SubscriptionStatus
    $paymentStatus: PaymentStatus
  ) {
    createGym(
      name: $name
      location: $location
      image: $image
      description: $description
      ownerId: $ownerId
      featured: $featured
      subscriptionStatus: $subscriptionStatus
      paymentStatus: $paymentStatus
    ) {
      id
      name
      location
      image
      featured
      subscriptionStatus
      paymentStatus
    }
  }
`;

export const UPDATE_GYM = gql`
  mutation UpdateGym(
    $id: ID!
    $name: String
    $location: String
    $image: String
    $featured: Boolean
    $description: String
    $ownerId: ID
    $subscriptionStatus: SubscriptionStatus
    $paymentStatus: PaymentStatus
  ) {
    updateGym(
      id: $id
      name: $name
      location: $location
      image: $image
      featured: $featured
      description: $description
      ownerId: $ownerId
      subscriptionStatus: $subscriptionStatus
      paymentStatus: $paymentStatus
    ) {
      id
      name
      location
      image
      featured
      subscriptionStatus
      paymentStatus
      ownerId
    }
  }
`;

export const DELETE_GYM = gql`
  mutation DeleteGym($id: ID!) {
    deleteGym(id: $id)
  }
`;

export const CREATE_BRANCH = gql`
  mutation CreateBranch(
    $name: String!
    $address: String!
    $phone: String!
    $email: String!
    $gymId: ID!
    $managerId: ID
    $status: BranchStatus
  ) {
    createBranch(
      name: $name
      address: $address
      phone: $phone
      email: $email
      gymId: $gymId
      managerId: $managerId
      status: $status
    ) {
      id
      name
      address
      phone
      email
      gymId
      managerId
      status
    }
  }
`;

export const UPDATE_BRANCH = gql`
  mutation UpdateBranch(
    $id: ID!
    $gymId: ID!
    $name: String
    $address: String
    $phone: String
    $email: String
    $managerId: ID
    $status: BranchStatus
  ) {
    updateBranch(
      id: $id
      gymId: $gymId
      name: $name
      address: $address
      phone: $phone
      email: $email
      managerId: $managerId
      status: $status
    ) {
      id
      name
      address
      phone
      email
      gymId
      managerId
      status
    }
  }
`;

export const DELETE_BRANCH = gql`
  mutation DeleteBranch($id: ID!, $gymId: ID!) {
    deleteBranch(id: $id, gymId: $gymId)
  }
`;

export const GET_CMS = gql`
  query GetCMS($gymId: ID!) {
    cms(gymId: $gymId) {
      id
      gymId
      heroSubHeading
      heroMainHeading
      heroDescription
      heroBackgroundImage
      heroButton1Text
      heroButton2Text
      featureHeading
      featureSubHeading
      featureBannerContent
      classesHeading
      classesSubHeading
      plansHeading
      plansSubHeading
      trainersHeading
      trainersSubHeading
      newsletterHeading
      newsletterSubHeading
      newsletterButtonText
      gymLogo
      address
      email
      phone
      businessHours
      facebookUrl
      twitterUrl
      instagramUrl
    }
  }
`;

export const GET_PLANS = gql`
  query GetPlans($gymId: ID!) {
    plans(gymId: $gymId) {
      id
      name
      duration
      price
      description
      gymId
      createdAt
      updatedAt
    }
  }
`;

export const GET_PLAN = gql`
  query GetPlan($id: ID!, $gymId: ID!) {
    plan(id: $id, gymId: $gymId) {
      id
      name
      duration
      price
      description
      gymId
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PLAN = gql`
  mutation CreatePlan(
    $name: String!
    $duration: String!
    $price: Float!
    $gymId: ID!
    $description: String
  ) {
    createPlan(
      name: $name
      duration: $duration
      price: $price
      gymId: $gymId
      description: $description
    ) {
      id
      name
      duration
      price
      description
      gymId
    }
  }
`;

export const UPDATE_PLAN = gql`
  mutation UpdatePlan(
    $id: ID!
    $gymId: ID!
    $name: String
    $duration: String
    $price: Float
    $description: String
  ) {
    updatePlan(
      id: $id
      gymId: $gymId
      name: $name
      duration: $duration
      price: $price
      description: $description
    ) {
      id
      name
      duration
      price
      description
      gymId
    }
  }
`;

export const DELETE_PLAN = gql`
  mutation DeletePlan($id: ID!, $gymId: ID!) {
    deletePlan(id: $id, gymId: $gymId)
  }
`;

export const GET_CLASSES = gql`
  query GetClasses($gymId: ID!) {
    classes(gymId: $gymId) {
      id
      name
      duration
      numberOfClasses
      price
      description
      gymId
      createdAt
      updatedAt
    }
  }
`;

export const GET_CLASS = gql`
  query GetClass($id: ID!, $gymId: ID!) {
    class(id: $id, gymId: $gymId) {
      id
      name
      duration
      numberOfClasses
      price
      description
      gymId
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CLASS = gql`
  mutation CreateClass(
    $name: String!
    $duration: String!
    $numberOfClasses: Int!
    $price: Float!
    $gymId: ID!
    $description: String
  ) {
    createClass(
      name: $name
      duration: $duration
      numberOfClasses: $numberOfClasses
      price: $price
      gymId: $gymId
      description: $description
    ) {
      id
      name
      duration
      numberOfClasses
      price
      description
      gymId
    }
  }
`;

export const UPDATE_CLASS = gql`
  mutation UpdateClass(
    $id: ID!
    $gymId: ID!
    $name: String
    $duration: String
    $numberOfClasses: Int
    $price: Float
    $description: String
  ) {
    updateClass(
      id: $id
      gymId: $gymId
      name: $name
      duration: $duration
      numberOfClasses: $numberOfClasses
      price: $price
      description: $description
    ) {
      id
      name
      duration
      numberOfClasses
      price
      description
      gymId
    }
  }
`;

export const DELETE_CLASS = gql`
  mutation DeleteClass($id: ID!, $gymId: ID!) {
    deleteClass(id: $id, gymId: $gymId)
  }
`;

export const GET_TRAINERS = gql`
  query GetTrainers($gymId: ID!) {
    trainers(gymId: $gymId) {
      id
      name
      experience
      image
      bio
      gymId
      createdAt
      updatedAt
    }
  }
`;

export const GET_TRAINER = gql`
  query GetTrainer($id: ID!, $gymId: ID!) {
    trainer(id: $id, gymId: $gymId) {
      id
      name
      experience
      image
      bio
      gymId
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_TRAINER = gql`
  mutation CreateTrainer(
    $name: String!
    $experience: String!
    $image: String
    $bio: String
    $gymId: ID!
  ) {
    createTrainer(
      name: $name
      experience: $experience
      image: $image
      bio: $bio
      gymId: $gymId
    ) {
      id
      name
      experience
      image
      bio
      gymId
    }
  }
`;

export const UPDATE_TRAINER = gql`
  mutation UpdateTrainer(
    $id: ID!
    $gymId: ID!
    $name: String
    $experience: String
    $image: String
    $bio: String
  ) {
    updateTrainer(
      id: $id
      gymId: $gymId
      name: $name
      experience: $experience
      image: $image
      bio: $bio
    ) {
      id
      name
      experience
      image
      bio
      gymId
    }
  }
`;

export const DELETE_TRAINER = gql`
  mutation DeleteTrainer($id: ID!, $gymId: ID!) {
    deleteTrainer(id: $id, gymId: $gymId)
  }
`;

export const GET_CLIENTS = gql`
  query GetClients($gymId: ID!, $branchId: ID, $status: ClientStatus) {
    clients(gymId: $gymId, branchId: $branchId, status: $status) {
      id
      name
      email
      phone
      membershipType
      gymId
      branchId
      status
      image
      subscriptionEndDate
      contractStartDate
      contractEndDate
      joinDate
      createdAt
      updatedAt
    }
  }
`;

export const GET_CLIENT = gql`
  query GetClient($id: ID!, $gymId: ID!) {
    client(id: $id, gymId: $gymId) {
      id
      name
      email
      phone
      membershipType
      gymId
      branchId
      status
      image
      subscriptionEndDate
      contractStartDate
      contractEndDate
      joinDate
      createdAt
      updatedAt
      gym {
        id
        name
        location
      }
      branch {
        id
        name
        address
      }
    }
  }
`;

export const CREATE_CLIENT = gql`
  mutation CreateClient(
    $name: String!
    $email: String!
    $phone: String!
    $membershipType: String!
    $gymId: ID!
    $branchId: ID
    $image: String
    $status: ClientStatus
    $joinDate: Date
    $subscriptionEndDate: Date
    $contractStartDate: Date
    $contractEndDate: Date
  ) {
    createClient(
      name: $name
      email: $email
      phone: $phone
      membershipType: $membershipType
      gymId: $gymId
      branchId: $branchId
      image: $image
      status: $status
      joinDate: $joinDate
      subscriptionEndDate: $subscriptionEndDate
      contractStartDate: $contractStartDate
      contractEndDate: $contractEndDate
    ) {
      id
      name
      email
      phone
      membershipType
      gymId
      branchId
      status
      image
      subscriptionEndDate
      contractStartDate
      contractEndDate
      joinDate
    }
  }
`;

export const UPDATE_CLIENT = gql`
  mutation UpdateClient(
    $id: ID!
    $gymId: ID!
    $name: String
    $email: String
    $phone: String
    $membershipType: String
    $branchId: ID
    $status: ClientStatus
    $image: String
    $joinDate: Date
    $subscriptionEndDate: Date
    $contractStartDate: Date
    $contractEndDate: Date
  ) {
    updateClient(
      id: $id
      gymId: $gymId
      name: $name
      email: $email
      phone: $phone
      membershipType: $membershipType
      branchId: $branchId
      status: $status
      image: $image
      joinDate: $joinDate
      subscriptionEndDate: $subscriptionEndDate
      contractStartDate: $contractStartDate
      contractEndDate: $contractEndDate
    ) {
      id
      name
      email
      phone
      membershipType
      gymId
      branchId
      status
      image
      subscriptionEndDate
      contractStartDate
      contractEndDate
      joinDate
    }
  }
`;

export const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!, $gymId: ID!) {
    deleteClient(id: $id, gymId: $gymId)
  }
`;

export const UPDATE_CMS = gql`
  mutation UpdateCMS(
    $gymId: ID!
    $heroSubHeading: String
    $heroMainHeading: String
    $heroDescription: String
    $heroBackgroundImage: String
    $heroButton1Text: String
    $heroButton2Text: String
    $featureHeading: String
    $featureSubHeading: String
    $featureBannerContent: String
    $classesHeading: String
    $classesSubHeading: String
    $plansHeading: String
    $plansSubHeading: String
    $trainersHeading: String
    $trainersSubHeading: String
    $newsletterHeading: String
    $newsletterSubHeading: String
    $newsletterButtonText: String
    $gymLogo: String
    $address: String
    $email: String
    $phone: String
    $businessHours: String
    $facebookUrl: String
    $twitterUrl: String
    $instagramUrl: String
  ) {
    updateCMS(
      gymId: $gymId
      heroSubHeading: $heroSubHeading
      heroMainHeading: $heroMainHeading
      heroDescription: $heroDescription
      heroBackgroundImage: $heroBackgroundImage
      heroButton1Text: $heroButton1Text
      heroButton2Text: $heroButton2Text
      featureHeading: $featureHeading
      featureSubHeading: $featureSubHeading
      featureBannerContent: $featureBannerContent
      classesHeading: $classesHeading
      classesSubHeading: $classesSubHeading
      plansHeading: $plansHeading
      plansSubHeading: $plansSubHeading
      trainersHeading: $trainersHeading
      trainersSubHeading: $trainersSubHeading
      newsletterHeading: $newsletterHeading
      newsletterSubHeading: $newsletterSubHeading
      newsletterButtonText: $newsletterButtonText
      gymLogo: $gymLogo
      address: $address
      email: $email
      phone: $phone
      businessHours: $businessHours
      facebookUrl: $facebookUrl
      twitterUrl: $twitterUrl
      instagramUrl: $instagramUrl
    ) {
      id
      gymId
      heroSubHeading
      heroMainHeading
      heroDescription
      heroBackgroundImage
      heroButton1Text
      heroButton2Text
      featureHeading
      featureSubHeading
      featureBannerContent
      classesHeading
      classesSubHeading
      plansHeading
      plansSubHeading
      trainersHeading
      trainersSubHeading
      newsletterHeading
      newsletterSubHeading
      newsletterButtonText
      gymLogo
      address
      email
      phone
      businessHours
      facebookUrl
      twitterUrl
      instagramUrl
    }
  }
`;


