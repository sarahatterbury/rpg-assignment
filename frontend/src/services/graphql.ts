const GRAPHQL_ENDPOINT = 'http://localhost:3200/graphql';

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

import { storage } from '@/composables/useAuth';

export class GraphQLService {
  private async request<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const token = storage.getToken();
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result: GraphQLResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (result.errors?.length) {
      throw new Error(result.errors.map(e => e.message).join(', '));
    }

    if (!result.data) {
      throw new Error('No data returned from GraphQL server');
    }

    return result.data;
  }

  async query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    return this.request<T>(query, variables);
  }

  async mutate<T>(mutation: string, variables?: Record<string, unknown>): Promise<T> {
    return this.request<T>(mutation, variables);
  }
}

export const graphqlService = new GraphQLService();
