# Digital Banking System - Frontend

A modern, responsive digital banking system frontend built with HTML, CSS, JavaScript, Bootstrap, and Node.js.

## Features

### 1. User Authentication & Account Management
- **Secure Login/Registration**: Modern authentication system with form validation
- **Profile Management**: Complete user profile management with photo upload
- **Password Security**: Strong password validation and change functionality
- **Session Management**: Secure session handling with localStorage

### 2. Account Balance & Transaction History
- **Dashboard Overview**: Real-time account balance display
- **Transaction History**: Comprehensive transaction listing with filtering
- **Account Summary**: Detailed account statistics and summaries
- **Export Functionality**: CSV export for transaction data

### 3. Fund Transfer System
- **Internal Transfers**: Transfer between user accounts
- **External Transfers**: Transfer to other bank accounts
- **Transfer Validation**: Comprehensive form validation and limits
- **Confirmation System**: Multi-step transfer confirmation process

## Technology Stack

- **HTML5**: Semantic markup structure
- **CSS3**: Custom styling with CSS variables and animations
- **JavaScript (ES6+)**: Modern JavaScript with async/await
- **Bootstrap 5**: Responsive UI framework
- **Font Awesome**: Icon library
- **Node.js**: Development server and package management
- **Express.js**: Static file serving

## Project Structure

```
frontend/
├── css/
│   └── style.css          # Custom styles and animations
├── js/
│   ├── main.js           # Common utilities and functions
│   ├── auth.js           # Authentication functionality
│   ├── dashboard.js      # Dashboard and account management
│   ├── transactions.js   # Transaction history and filtering
│   ├── transfer.js       # Fund transfer functionality
│   └── profile.js        # Profile management
├── pages/
│   ├── login.html        # Login page
│   ├── register.html     # Registration page
│   ├── dashboard.html    # Main dashboard
│   ├── transactions.html # Transaction history
│   ├── transfer.html     # Fund transfer
│   └── profile.html      # User profile
├── images/               # Image assets
├── components/           # Reusable components
├── server.js            # Express development server
├── package.json         # Node.js dependencies
└── README.md           # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

### Development Mode
```bash
npm run dev
```
This will start the server with nodemon for automatic reloading during development.

## Usage

### Demo Credentials
For testing purposes, use these demo credentials:
- **Email**: `demo@example.com`
- **Password**: `Password123!`

### Key Features

#### Authentication
- Secure login with email and password
- User registration with comprehensive validation
- Password strength indicator
- Remember me functionality

#### Dashboard
- Real-time account balance display
- Quick action cards for common tasks
- Recent transaction overview
- Account summary statistics

#### Transactions
- Comprehensive transaction history
- Advanced filtering by account, type, and date
- Search functionality
- Export to CSV
- Transaction details modal

#### Fund Transfer
- Internal transfers between user accounts
- External transfers to other banks
- Transfer limits and validation
- Confirmation and success modals
- Recent transfers history

#### Profile Management
- Personal information editing
- Password change functionality
- Profile photo upload
- Security settings management
- Account information display

## API Integration

The frontend is designed to integrate with a backend API. Currently, it uses simulated API calls that can be easily replaced with actual API endpoints.

### API Endpoints (to be implemented)
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/accounts` - Get user accounts
- `GET /api/transactions` - Get transaction history
- `POST /api/transfers` - Process fund transfers
- `PUT /api/profile` - Update user profile

## Security Features

- **Form Validation**: Client-side validation for all forms
- **Password Security**: Strong password requirements
- **Session Management**: Secure token-based authentication
- **Input Sanitization**: Protection against XSS attacks
- **CSRF Protection**: Ready for CSRF token implementation

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Customization

### Styling
- Custom CSS variables in `css/style.css`
- Bootstrap 5 theme customization
- Responsive breakpoints
- Animation classes

### Configuration
- Server port configuration in `server.js`
- API endpoint configuration in JavaScript files
- Development/production environment settings

## Development

### Code Structure
- **Modular JavaScript**: Separate files for different functionalities
- **Utility Functions**: Common functions in `main.js`
- **Form Validation**: Comprehensive client-side validation
- **Error Handling**: Proper error handling and user feedback

### Best Practices
- **Semantic HTML**: Proper HTML structure and accessibility
- **CSS Organization**: Logical CSS structure with variables
- **JavaScript Modules**: Modular code organization
- **Performance**: Optimized loading and rendering

## Deployment

### Production Build
1. Install dependencies: `npm install`
2. Start production server: `npm start`
3. Configure environment variables
4. Set up reverse proxy (nginx/Apache)

### Environment Variables
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This is a frontend-only implementation. For a complete banking system, integrate with a secure backend API and database. 