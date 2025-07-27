# Frontend Authentication Implementation

## Overview
The frontend now has full authentication functionality integrated with the Spring Boot backend JWT authentication system.

## Features Implemented

### 1. Authentication Context (`src/contexts/AuthContext.tsx`)
- Manages authentication state throughout the application
- Handles login, register, logout, and token refresh
- Automatically stores/retrieves tokens from localStorage
- Provides loading states and error handling

### 2. API Service (`src/lib/api.ts`)
- Centralized API communication with the backend
- Handles all authentication endpoints:
  - `POST /api/v1/auth/register` - User registration
  - `POST /api/v1/auth/authenticate` - User login
  - `POST /api/v1/auth/logout` - User logout
  - `POST /api/v1/auth/refresh-token` - Token refresh
  - `GET /api/v1/auth/me` - Get current user
- Automatically includes JWT tokens in requests
- Error handling and response parsing

### 3. Updated LoginPage (`src/components/LoginPage.tsx`)
- Real form validation with error messages
- Email and password validation
- Registration form with firstname, lastname, email, password, confirm password
- Loading states during authentication
- Success/error toast notifications
- Password strength indicator (pixel hearts)

### 4. Updated Dashboard (`src/components/Dashboard.tsx`)
- Displays actual user information (firstname)
- Functional logout button
- Logout confirmation via toast

### 5. Updated Index Page (`src/pages/Index.tsx`)
- Automatic navigation based on authentication state
- Loading screen while checking authentication
- Seamless flow between landing → login → dashboard

## How It Works

### Authentication Flow
1. **App Start**: AuthContext checks for existing tokens in localStorage
2. **Landing Page**: User clicks to go to login
3. **Login/Register**: User submits credentials
4. **Success**: Tokens stored, user redirected to dashboard
5. **Dashboard**: User can logout, which clears tokens and redirects to landing

### Token Management
- **JWT Token**: Stored in localStorage as `authToken`
- **Refresh Token**: Stored in localStorage as `refreshToken`
- **Auto-refresh**: Tokens are automatically refreshed when needed
- **Logout**: Both tokens are cleared from localStorage

### Error Handling
- Form validation with real-time error messages
- API error handling with user-friendly messages
- Toast notifications for success/error states
- Automatic token cleanup on authentication failures

## Usage

### For Users
1. **Register**: Fill in firstname, lastname, email, password, confirm password
2. **Login**: Enter email and password
3. **Dashboard**: View personalized content and logout when done

### For Developers
```typescript
// Use authentication context in any component
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Access user data
  console.log(user?.firstname);
  
  // Check authentication status
  if (isAuthenticated) {
    // User is logged in
  }
  
  // Handle logout
  const handleLogout = () => {
    logout();
  };
};
```

## Backend Integration
- **Base URL**: `http://localhost:8080/api/v1`
- **CORS**: Configured to allow frontend requests
- **JWT**: Tokens are automatically included in Authorization header
- **Error Handling**: Backend errors are properly caught and displayed

## Security Features
- Form validation on both client and server
- Secure token storage in localStorage
- Automatic token refresh
- Proper error handling without exposing sensitive information
- Logout functionality that clears all tokens

## Testing
1. Start the backend server (`./mvnw spring-boot:run`)
2. Start the frontend (`npm run dev`)
3. Test registration with new user
4. Test login with existing user
5. Test logout functionality
6. Test automatic redirect based on authentication state 