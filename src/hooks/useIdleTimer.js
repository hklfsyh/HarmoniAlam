import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import IdleTimer from '../utils/idleTimer';

const useIdleTimer = (isAuthenticated, userRole) => {
  const navigate = useNavigate();
  const idleTimerRef = useRef(null);

  useEffect(() => {
    // Only start idle timer for authenticated users with specific roles
    const allowedRoles = ['admin', 'volunteer', 'organizer'];
    
    if (isAuthenticated && allowedRoles.includes(userRole)) {
      const handleIdleTimeout = () => {
        // Clear user session
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();
        
        // Show notification
        alert('Sesi Anda telah berakhir karena tidak ada aktivitas selama 1 jam. Silakan login kembali.');
        
        // Redirect to login
        navigate('/login', { replace: true });
      };

      idleTimerRef.current = new IdleTimer(3600000, handleIdleTimeout); // 1 hour
      idleTimerRef.current.start();
    }

    return () => {
      if (idleTimerRef.current) {
        idleTimerRef.current.stop();
      }
    };
  }, [isAuthenticated, userRole, navigate]);

  return null;
};

export default useIdleTimer;