import { useEffect, useRef } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import type { Notification } from '../../communications/types';
import { playSoundIfEnabled } from '../../utils/sounds';

interface ToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onClick?: () => void;
  index: number;
}

const Toast: React.FC<ToastProps> = ({ notification, onDismiss, onClick, index }) => {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  const idRef = useRef(notification.id);
  idRef.current = notification.id;

  useEffect(() => {
    if (notification.title.includes('📧') || notification.title.includes('Email')) {
      playSoundIfEnabled('email');
    } else if (notification.type === 'error') {
      playSoundIfEnabled('error');
    } else if (notification.type === 'warning') {
      playSoundIfEnabled('warning');
    } else if (notification.type === 'success') {
      playSoundIfEnabled('success');
    } else {
      playSoundIfEnabled('notification');
    }

    const timerId = window.setTimeout(() => {
      onDismissRef.current(idRef.current);
    }, 2000);

    return () => window.clearTimeout(timerId);
  }, []);

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success': return 'border-l-emerald-500';
      case 'warning': return 'border-l-amber-500';
      case 'error': return 'border-l-red-500';
      default: return 'border-l-blue-500';
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e?.stopPropagation();
    onDismissRef.current(idRef.current);
  };

  const handleToastClick = () => {
    if (onClick) onClick();
    onDismissRef.current(idRef.current);
  };

  return (
    <div
      onClick={handleToastClick}
      className={`max-w-sm w-full transform transition-all duration-300 ease-out animate-slide-in-right cursor-pointer ${getBorderColor()} border-l-4`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
          </div>
          <button onClick={handleDismiss} className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors group">
            <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface ToastContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onNotificationClick?: () => void;
  hidden?: boolean;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ notifications, onDismiss, onNotificationClick, hidden }) => {
  const visibleNotifications = notifications.slice(0, 3);

  if (hidden || visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {visibleNotifications.map((notification, index) => (
        <Toast
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
          onClick={onNotificationClick}
          index={index}
        />
      ))}
      
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ToastContainer;