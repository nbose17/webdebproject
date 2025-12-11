import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectAdminDB } from '@/lib/db';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { ResolverContext } from '@/graphql/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const server = new ApolloServer<ResolverContext>({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
});

// Initialize server
server.startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests();

const handler = startServerAndCreateNextHandler<NextRequest, ResolverContext>(
  server,
  {
    context: async (req: NextRequest) => {
      // Connect to admin database
      await connectAdminDB();

      // Extract token from Authorization header
      const authHeader = req.headers.get('authorization');
      let user = null;

      console.log('🔐 GraphQL Context:', {
        hasAuthHeader: !!authHeader,
        authHeaderPreview: authHeader ? authHeader.substring(0, 30) + '...' : 'none'
      });

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as any;
          user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            gymId: decoded.gymId || null,
            branchId: decoded.branchId || null,
          };
          
          console.log('🔐 Token decoded successfully:', {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            hasGymId: !!decoded.gymId
          });
        } catch (error) {
          console.log('🔐 Token verification failed:', error);
          // Invalid token, continue without user
        }
      } else {
        console.log('🔐 No valid authorization header found');
      }

      return {
        user,
      };
    },
  }
);

export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}


