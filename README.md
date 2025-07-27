# HubSpot Sync App

A powerful two-way synchronization tool between HubSpot and spreadsheets (Google Sheets/Excel), designed to make data management seamless and efficient.

## 🚀 Features

- **True Two-Way Sync**: Changes in HubSpot reflect in your spreadsheets and vice versa
- **Real-Time Updates**: Near-instant synchronization with configurable intervals
- **Smart Conflict Resolution**: Intelligent handling of simultaneous edits
- **Custom Object Support**: Works with standard and custom HubSpot objects
- **Bulk Operations**: Update thousands of records efficiently
- **Audit Trail**: Complete history of all synchronization activities
- **Error Recovery**: Automatic retry mechanisms and detailed error reporting

## 📋 Prerequisites

- Node.js 18.0 or higher
- HubSpot account with API access
- Google Cloud Project (for Google Sheets integration) or Microsoft Azure (for Excel)
- TypeScript knowledge (for development)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hubspot-sync-app.git
cd hubspot-sync-app
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables template:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```
HUBSPOT_API_KEY=your_hubspot_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
# ... other configuration
```

## 🚦 Quick Start

1. Build the project:
```bash
npm run build
```

2. Start the development server:
```bash
npm run dev
```

3. Access the application at `http://localhost:3000`

## 📖 Usage

### Setting Up a Sync

1. **Connect HubSpot**: Authenticate with your HubSpot account
2. **Connect Spreadsheet**: Link your Google Sheets or Excel workbook
3. **Map Fields**: Choose which HubSpot properties sync with which columns
4. **Configure Sync**: Set sync frequency and conflict resolution rules
5. **Activate**: Start the synchronization

### API Endpoints

- `POST /api/sync/create` - Create a new sync configuration
- `GET /api/sync/:id` - Get sync status and details
- `PUT /api/sync/:id` - Update sync configuration
- `DELETE /api/sync/:id` - Delete a sync
- `POST /api/sync/:id/trigger` - Manually trigger a sync

## 🧪 Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run typecheck
```

## 🏗️ Architecture

The application follows a modular architecture:

- **API Layer**: RESTful endpoints for sync management
- **Service Layer**: Core business logic for synchronization
- **Utils**: Helper functions and utilities
- **Types**: TypeScript type definitions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- HubSpot API team for excellent documentation
- Google Sheets API team
- All contributors who help improve this tool

## 📞 Support

- Create an issue for bug reports or feature requests
- Join our [Discord community](https://discord.gg/yourinvite)
- Email: support@yourdomain.com

---

Made with ❤️ for the HubSpot community