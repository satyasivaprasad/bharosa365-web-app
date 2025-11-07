# Bharosa365 Web App

A serverless signup system with phone number authentication using Firebase.

## Features

- 📱 **Two-Step Verification**: Phone number verification with SMS OTP
- 🔐 **Firebase Authentication**: Secure phone authentication with reCAPTCHA
- 📝 **Registration Form**: Complete affiliate registration with validation
- 🗄️ **Firestore Database**: Secure data storage with robust security rules
- 🎨 **Beautiful UI**: Modern responsive design with teal theme
- ⚡ **Serverless**: 100% serverless architecture using Firebase services

## Architecture

This application follows the serverless architecture documented in your project specification:

### Technology Stack
- **Frontend**: React.js (SPA)
- **Authentication**: Firebase Authentication (Phone Auth)
- **Database**: Cloud Firestore
- **Hosting**: Firebase Hosting
- **Security**: Firestore Security Rules

### Two-Step Flow
1. **Phone Verification**: User enters phone number → receives SMS OTP → verifies OTP
2. **Registration**: User completes personal info, address, and company details

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Firebase CLI installed globally: `npm install -g firebase-tools`
- A Firebase project created at [console.firebase.google.com](https://console.firebase.google.com)

### Firebase Configuration

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication and Firestore

2. **Configure Authentication**
   - In Firebase Console → Authentication → Sign-in method
   - Enable "Phone" sign-in provider
   - Add your domain to authorized domains

3. **Configure Firestore**
   - Create a Firestore database in production mode
   - Deploy the security rules (see deployment section)

4. **Get Firebase Configuration**
   - Go to Project Settings → General → Your apps
   - Click "Add app" → Web app
   - Copy the configuration object

5. **Update Configuration**
   - Edit `src/firebase.js`
   - Replace the placeholder config with your Firebase configuration:

   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   
   The app will open at `http://localhost:3000`

### Firebase Deployment

1. **Login to Firebase**
   ```bash
   firebase login
   ```

2. **Initialize Firebase Project**
   ```bash
   firebase init
   ```
   - Select Hosting and Firestore
   - Choose your Firebase project
   - Set public directory to `build`
   - Configure as single-page app: Yes

3. **Deploy Security Rules and Indexes**
   ```bash
   firebase deploy --only firestore
   ```

4. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## File Structure

```
bharosa365-web-app/
├── src/
│   ├── components/
│   │   ├── PhoneVerification.js    # Phone number verification component
│   │   ├── RegistrationForm.js     # User registration form
│   │   └── SuccessModal.js         # Success confirmation modal
│   ├── hooks/
│   │   └── useNotification.js      # Notification hook for error/success messages
│   ├── utils/
│   │   └── validation.js           # Form validation utilities
│   ├── firebase.js                 # Firebase configuration
│   ├── App.js                      # Main application component
│   └── index.css                   # Global styles with teal theme
├── firebase.json                   # Firebase configuration
├── firestore.rules                # Firestore security rules
├── firestore.indexes.json         # Firestore indexes
└── package.json                   # Dependencies and scripts
```

## Data Schema

### Affiliate Collection (`/affiliate/{userId}`)
```javascript
{
  firstName: string,
  lastName: string,
  phoneNumber: string,           // +91XXXXXXXXXX format
  email: string,
  address: {
    village: string,
    mandal: string,
    city: string,
    state: string
  },
  companyName: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  isActive: boolean
}
```

## Security Features

- **Phone Verification**: Two-factor authentication via SMS
- **reCAPTCHA**: Bot protection for OTP requests
- **Firestore Rules**: Row-level security ensuring users can only access their own data
- **Data Validation**: Client-side and server-side validation
- **HTTPS Only**: All communication encrypted in transit

## Testing Phone Authentication

For testing during development:
1. Use test phone numbers provided by Firebase (check Firebase Console → Authentication → Settings → Test phone numbers)
2. Or use your real phone number for testing

## Production Considerations

1. **Domain Configuration**: Add your production domain to Firebase Auth authorized domains
2. **reCAPTCHA**: Configure reCAPTCHA keys for production
3. **Monitoring**: Set up Firebase Analytics and performance monitoring
4. **Backup**: Configure Firestore backup/export schedules

## Troubleshooting

### Common Issues

1. **reCAPTCHA Issues**
   - Ensure your domain is added to Firebase Auth authorized domains
   - Check browser console for reCAPTCHA errors

2. **OTP Not Received**
   - Verify phone number format (+91XXXXXXXXXX)
   - Check if phone number is blacklisted
   - Ensure SMS quota is not exceeded

3. **Firestore Permission Denied**
   - Verify security rules are deployed correctly
   - Ensure user is authenticated before writing data

## Cost Optimization

- **Free Tier Usage**: The app is designed to work within Firebase free tier limits
- **Monitoring**: Use Firebase Console to monitor usage
- **Optimization**: Consider implementing pagination for large datasets

## Support

For issues and questions:
1. Check the browser console for error messages
2. Verify Firebase configuration
3. Review Firestore security rules
4. Check Firebase Console for authentication and database status

---

**Built with ❤️ using Firebase and React.js**