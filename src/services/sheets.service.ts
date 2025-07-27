/*
 ██████╗  ██████╗  ██████╗  ██████╗ ██╗     ███████╗    ███████╗██╗  ██╗███████╗███████╗████████╗███████╗
██╔════╝ ██╔═══██╗██╔═══██╗██╔════╝ ██║     ██╔════╝    ██╔════╝██║  ██║██╔════╝██╔════╝╚══██╔══╝██╔════╝
██║  ███╗██║   ██║██║   ██║██║  ███╗██║     █████╗      ███████╗███████║█████╗  █████╗     ██║   ███████╗
██║   ██║██║   ██║██║   ██║██║   ██║██║     ██╔══╝      ╚════██║██╔══██║██╔══╝  ██╔══╝     ██║   ╚════██║
╚██████╔╝╚██████╔╝╚██████╔╝╚██████╔╝███████╗███████╗    ███████║██║  ██║███████╗███████╗   ██║   ███████║
 ╚═════╝  ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝╚══════╝    ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝   ╚═╝   ╚══════╝
*/

import { google, sheets_v4 } from 'googleapis';
import type { OAuth2Client } from 'google-auth-library';
import winston from 'winston';

export interface SheetRange {
  spreadsheetId: string;
  range: string;
}

export interface SheetsUpdateRequest {
  spreadsheetId: string;
  range: string;
  valueInputOption: 'RAW' | 'USER_ENTERED';
  values: Array<Array<string | number | boolean>>;
}

export interface SheetsReadResponse {
  range: string;
  majorDimension: string;
  values?: Array<Array<string>>;
}

export class GoogleSheetsService {
  private sheets: sheets_v4.Sheets;
  private auth: OAuth2Client;
  private logger: winston.Logger;

  constructor(logger: winston.Logger) {
    this.logger = logger;
    
    // Initialize OAuth2 client for Google Sheets
    this.auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Initialize Google Sheets API client
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    
    this.logger.info('Google Sheets service initialized');
  }

  /**
   * Get OAuth authorization URL for Google Sheets access
   */
  getAuthorizationUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file'
    ];

    return this.auth.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      include_granted_scopes: true
    });
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<void> {
    try {
      const { tokens } = await this.auth.getToken(code);
      this.auth.setCredentials(tokens);
      
      // Set up token refresh handler
      this.auth.on('tokens', (newTokens) => {
        if (newTokens.refresh_token) {
          this.logger.info('Refresh token updated');
        }
        this.logger.info('Access token refreshed');
      });
      
      this.logger.info('Google Sheets authentication successful');
    } catch (error) {
      this.logger.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  /**
   * Set credentials if you already have tokens
   */
  setCredentials(tokens: { access_token?: string; refresh_token?: string }): void {
    this.auth.setCredentials(tokens);
    this.logger.info('Google Sheets credentials set');
  }

  /**
   * Read data from a Google Sheets range
   */
  async readSheet(sheetRange: SheetRange): Promise<SheetsReadResponse> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: sheetRange.spreadsheetId,
        range: sheetRange.range
      });

      return {
        range: response.data.range || '',
        majorDimension: response.data.majorDimension || 'ROWS',
        values: response.data.values || []
      };
    } catch (error) {
      this.logger.error('Error reading sheet:', error);
      throw error;
    }
  }

  /**
   * Update data in a Google Sheets range
   */
  async updateSheet(updateRequest: SheetsUpdateRequest): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: updateRequest.spreadsheetId,
        range: updateRequest.range,
        valueInputOption: updateRequest.valueInputOption,
        requestBody: {
          values: updateRequest.values
        }
      });

      this.logger.info(`Sheet updated: ${updateRequest.range}`);
    } catch (error) {
      this.logger.error('Error updating sheet:', error);
      throw error;
    }
  }

  /**
   * Append data to a Google Sheets range
   */
  async appendToSheet(updateRequest: SheetsUpdateRequest): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: updateRequest.spreadsheetId,
        range: updateRequest.range,
        valueInputOption: updateRequest.valueInputOption,
        requestBody: {
          values: updateRequest.values
        }
      });

      this.logger.info(`Data appended to sheet: ${updateRequest.range}`);
    } catch (error) {
      this.logger.error('Error appending to sheet:', error);
      throw error;
    }
  }

  /**
   * Clear data from a Google Sheets range
   */
  async clearSheet(sheetRange: SheetRange): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: sheetRange.spreadsheetId,
        range: sheetRange.range
      });

      this.logger.info(`Sheet cleared: ${sheetRange.range}`);
    } catch (error) {
      this.logger.error('Error clearing sheet:', error);
      throw error;
    }
  }

  /**
   * Create a new spreadsheet
   */
  async createSpreadsheet(title: string): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
    try {
      const response = await this.sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title
          }
        }
      });

      const spreadsheetId = response.data.spreadsheetId;
      const spreadsheetUrl = response.data.spreadsheetUrl;

      if (!spreadsheetId || !spreadsheetUrl) {
        throw new Error('Failed to create spreadsheet');
      }

      this.logger.info(`Spreadsheet created: ${title} (${spreadsheetId})`);
      
      return { spreadsheetId, spreadsheetUrl };
    } catch (error) {
      this.logger.error('Error creating spreadsheet:', error);
      throw error;
    }
  }

  /**
   * Get spreadsheet metadata
   */
  async getSpreadsheetInfo(spreadsheetId: string): Promise<sheets_v4.Schema$Spreadsheet> {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId,
        includeGridData: false
      });

      return response.data;
    } catch (error) {
      this.logger.error('Error getting spreadsheet info:', error);
      throw error;
    }
  }

  /**
   * Batch update multiple ranges
   */
  async batchUpdate(
    spreadsheetId: string,
    updates: Array<{
      range: string;
      values: Array<Array<string | number | boolean>>;
    }>
  ): Promise<void> {
    try {
      const valueRanges = updates.map(update => ({
        range: update.range,
        values: update.values
      }));

      await this.sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          valueInputOption: 'USER_ENTERED',
          data: valueRanges
        }
      });

      this.logger.info(`Batch update completed for ${updates.length} ranges`);
    } catch (error) {
      this.logger.error('Error in batch update:', error);
      throw error;
    }
  }

  /**
   * Convert HubSpot contact data to sheet row format
   */
  formatContactForSheet(contact: any): Array<string> {
    return [
      contact.id || '',
      contact.properties?.email || '',
      contact.properties?.firstname || '',
      contact.properties?.lastname || '',
      contact.properties?.phone || '',
      contact.properties?.company || '',
      contact.properties?.createdate || '',
      contact.properties?.lastmodifieddate || ''
    ];
  }

  /**
   * Get standard header row for HubSpot contacts
   */
  getContactHeaders(): Array<string> {
    return [
      'HubSpot ID',
      'Email',
      'First Name', 
      'Last Name',
      'Phone',
      'Company',
      'Created Date',
      'Last Modified Date'
    ];
  }
}