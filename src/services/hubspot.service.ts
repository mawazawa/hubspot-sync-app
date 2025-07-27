/*
██╗  ██╗██╗   ██╗██████╗ ███████╗██████╗  ██████╗ ████████╗    ███████╗███████╗██████╗ ██╗   ██╗██╗ ██████╗███████╗
██║  ██║██║   ██║██╔══██╗██╔════╝██╔══██╗██╔═══██╗╚══██╔══╝    ██╔════╝██╔════╝██╔══██╗██║   ██║██║██╔════╝██╔════╝
███████║██║   ██║██████╔╝███████╗██████╔╝██║   ██║   ██║       ███████╗█████╗  ██████╔╝██║   ██║██║██║     █████╗  
██╔══██║██║   ██║██╔══██╗╚════██║██╔═══╝ ██║   ██║   ██║       ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██║██║     ██╔══╝  
██║  ██║╚██████╔╝██████╔╝███████║██║     ╚██████╔╝   ██║       ███████║███████╗██║  ██║ ╚████╔╝ ██║╚██████╗███████╗
╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝      ╚═════╝    ╚═╝       ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚═╝ ╚═════╝╚══════╝
*/

import { Client } from '@hubspot/api-client';
import type { 
  SimplePublicObjectInput,
  SimplePublicObject,
  CollectionResponseWithTotalSimplePublicObjectForwardPaging 
} from '@hubspot/api-client/lib/codegen/crm/contacts';
import winston from 'winston';

export class HubSpotService {
  private client: Client;
  private logger: winston.Logger;

  constructor(logger: winston.Logger) {
    this.logger = logger;
    
    // Initialize with private app access token (recommended)
    if (process.env.HUBSPOT_ACCESS_TOKEN) {
      this.client = new Client({ 
        accessToken: process.env.HUBSPOT_ACCESS_TOKEN 
      });
      this.logger.info('HubSpot client initialized with access token');
    } 
    // Or initialize with OAuth (for user-facing apps)
    else if (process.env.HUBSPOT_CLIENT_ID && process.env.HUBSPOT_CLIENT_SECRET) {
      this.client = new Client();
      this.logger.info('HubSpot client initialized for OAuth flow');
    } else {
      throw new Error('HubSpot credentials not configured. Please set HUBSPOT_ACCESS_TOKEN or OAuth credentials.');
    }
  }

  /**
   * Get OAuth authorization URL for user authentication
   */
  getAuthorizationUrl(): string {
    if (!process.env.HUBSPOT_CLIENT_ID || !process.env.HUBSPOT_REDIRECT_URI || !process.env.HUBSPOT_SCOPES) {
      throw new Error('OAuth configuration incomplete');
    }
    
    return this.client.oauth.getAuthorizationUrl(
      process.env.HUBSPOT_CLIENT_ID,
      process.env.HUBSPOT_REDIRECT_URI,
      process.env.HUBSPOT_SCOPES
    );
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<string> {
    if (!process.env.HUBSPOT_CLIENT_ID || !process.env.HUBSPOT_CLIENT_SECRET || !process.env.HUBSPOT_REDIRECT_URI) {
      throw new Error('OAuth configuration incomplete');
    }

    const tokenResponse = await this.client.oauth.tokensApi.create(
      'authorization_code',
      code,
      process.env.HUBSPOT_REDIRECT_URI,
      process.env.HUBSPOT_CLIENT_ID,
      process.env.HUBSPOT_CLIENT_SECRET
    );

    // Set the access token on the client
    this.client.setAccessToken(tokenResponse.accessToken);
    
    return tokenResponse.accessToken;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    if (!process.env.HUBSPOT_CLIENT_ID || !process.env.HUBSPOT_CLIENT_SECRET) {
      throw new Error('OAuth configuration incomplete');
    }

    const tokenResponse = await this.client.oauth.tokensApi.create(
      'refresh_token',
      undefined,
      undefined,
      process.env.HUBSPOT_CLIENT_ID,
      process.env.HUBSPOT_CLIENT_SECRET,
      refreshToken
    );

    this.client.setAccessToken(tokenResponse.accessToken);
    return tokenResponse.accessToken;
  }

  /**
   * Get contacts with pagination
   */
  async getContacts(
    limit = 100,
    after?: string,
    properties?: string[]
  ): Promise<CollectionResponseWithTotalSimplePublicObjectForwardPaging> {
    try {
      return await this.client.crm.contacts.basicApi.getPage(
        limit,
        after,
        properties
      );
    } catch (error) {
      this.logger.error('Error fetching contacts:', error);
      throw error;
    }
  }

  /**
   * Create a new contact
   */
  async createContact(properties: Record<string, string>): Promise<SimplePublicObject> {
    const contactInput: SimplePublicObjectInput = { properties };
    
    try {
      return await this.client.crm.contacts.basicApi.create(contactInput);
    } catch (error) {
      this.logger.error('Error creating contact:', error);
      throw error;
    }
  }

  /**
   * Update a contact
   */
  async updateContact(contactId: string, properties: Record<string, string>): Promise<SimplePublicObject> {
    const contactInput: SimplePublicObjectInput = { properties };
    
    try {
      return await this.client.crm.contacts.basicApi.update(contactId, contactInput);
    } catch (error) {
      this.logger.error('Error updating contact:', error);
      throw error;
    }
  }

  /**
   * Get all contacts (handles pagination automatically)
   */
  async getAllContacts(): Promise<SimplePublicObject[]> {
    try {
      return await this.client.crm.contacts.getAll();
    } catch (error) {
      this.logger.error('Error fetching all contacts:', error);
      throw error;
    }
  }

  /**
   * Search contacts
   */
  async searchContacts(
    filterGroups: Array<{
      filters: Array<{
        propertyName: string;
        operator: string;
        value: string;
      }>;
    }>,
    properties?: string[],
    limit = 100
  ): Promise<any> {
    const searchRequest = {
      filterGroups,
      properties: properties || ['email', 'firstname', 'lastname', 'createdate'],
      limit,
      after: '0'
    };

    try {
      return await this.client.crm.contacts.searchApi.doSearch(searchRequest);
    } catch (error) {
      this.logger.error('Error searching contacts:', error);
      throw error;
    }
  }

  /**
   * Batch update multiple objects
   */
  async batchUpdateContacts(
    updates: Array<{ id: string; properties: Record<string, string> }>
  ): Promise<any> {
    const inputs = updates.map(update => ({
      id: update.id,
      properties: update.properties
    }));

    try {
      return await this.client.crm.contacts.batchApi.update({ inputs });
    } catch (error) {
      this.logger.error('Error batch updating contacts:', error);
      throw error;
    }
  }
}