import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1'
});

// Request interceptor to add token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken'); // Use consistent key
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => {
        // Log successful requests for demonstration
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} successful`);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                console.log('🔄 Token expired, attempting refresh...');
                
                // Call refresh token endpoint
                const response = await axios.post('/api/v1/auth/refresh-token', {
                    refreshToken
                });

                console.log('🎉 Token refreshed successfully!');
                
                // Store new tokens
                const { token, refreshToken: newRefreshToken } = response.data;
                localStorage.setItem('authToken', token); // Use consistent key
                localStorage.setItem('refreshToken', newRefreshToken);

                // Update auth header
                originalRequest.headers.Authorization = `Bearer ${token}`;
                
                // Retry original request
                return axios(originalRequest);
            } catch (err) {
                // If refresh fails, log out user
                localStorage.removeItem('authToken'); // Use consistent key
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
