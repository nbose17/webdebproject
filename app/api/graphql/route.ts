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

      const token = req.headers.get('authorization')?.replace('Bearer ', '');

      if (!token) {
        return { user: undefined };
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
          userId: string;
          email: string;
          role: string;
          gymId?: string;
          branchId?: string;
        };

        return {
          user: {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            gymId: decoded.gymId,
            branchId: decoded.branchId,
          },
        };
      } catch (error) {
        console.error('JWT verification failed:', error);
        return { user: undefined };
      }
    },
  }
);

export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}
