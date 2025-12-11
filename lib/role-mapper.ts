/**
 * Helper functions to convert between database role format and GraphQL enum format
 * Database: lowercase with underscores (e.g., 'fitconnect_admin')
 * GraphQL: uppercase with underscores (e.g., 'FITCONNECT_ADMIN')
 */

export function dbRoleToGraphQL(dbRole: string): string {
  // Database format is already lowercase with underscores
  // Just convert to uppercase
  return dbRole.toUpperCase();
}

export function graphQLRoleToDb(graphqlRole: string): string {
  // GraphQL format is uppercase with underscores
  // Convert to lowercase
  return graphqlRole.toLowerCase();
}


