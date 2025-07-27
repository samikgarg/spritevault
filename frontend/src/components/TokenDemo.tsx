import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import api from '@/lib/axios';

export const TokenDemo = () => {
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
    const [tokenStatus, setTokenStatus] = useState<'valid' | 'refreshing' | 'error'>('valid');

    // Function to make an authenticated request
    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Current token:', token?.slice(0, 10) + '...');
            
            await api.get('/api/v1/sprites'); // or any authenticated endpoint
            setTokenStatus('valid');
        } catch (error) {
            setTokenStatus('error');
        }
    };

    // Check auth status every minute
    useEffect(() => {
        const interval = setInterval(checkAuth, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed bottom-4 right-4 p-4 bg-card rounded-lg shadow-lg border border-accent">
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                        tokenStatus === 'valid' ? 'bg-green-500' :
                        tokenStatus === 'refreshing' ? 'bg-yellow-500' :
                        'bg-red-500'
                    }`} />
                    <span className="text-xs font-pixel">
                        {tokenStatus === 'valid' ? 'Session Active' :
                         tokenStatus === 'refreshing' ? 'Refreshing...' :
                         'Session Error'}
                    </span>
                </div>
                
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={checkAuth}
                    className="w-full text-xs font-pixel"
                >
                    Check Session
                </Button>
                
                {lastRefresh && (
                    <p className="text-xs text-muted-foreground font-pixel">
                        Last refresh: {lastRefresh.toLocaleTimeString()}
                    </p>
                )}
            </div>
        </div>
    );
};
