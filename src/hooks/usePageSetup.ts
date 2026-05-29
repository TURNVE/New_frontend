import { useEffect, useState } from 'react';

// Scroll to top on mount
export const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);
};

// Detect device type
export const useDeviceDetect = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isIOS: false,
    isAndroid: false
  });

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isMobile = /android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent);
    const isTablet = /iPad/.test(userAgent) || (/android/i.test(userAgent) && !/mobile/i.test(userAgent));
    const isDesktop = !isMobile && !isTablet;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /android/i.test(userAgent);

    setDeviceInfo({
      isMobile,
      isTablet,
      isDesktop,
      isIOS,
      isAndroid
    });
  }, []);

  return deviceInfo;
};

// Keyboard avoidance for mobile
export const useKeyboardAvoidance = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const isMobileDevice = /android/i.test(navigator.userAgent) || /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (!isMobileDevice) {
      return;
    }

    const handleFocusIn = () => {
      setKeyboardVisible(true);
      document.body.classList.add('keyboard-visible');
    };

    const handleFocusOut = () => {
      setKeyboardVisible(false);
      document.body.classList.remove('keyboard-visible');
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  return { isKeyboardVisible };
};

// Viewport height fix for mobile browsers
export const useViewportHeight = () => {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);
};

// Combine all hooks for easy use
export const usePageSetup = () => {
  useScrollToTop();
  useViewportHeight();
  useKeyboardAvoidance();
  const deviceInfo = useDeviceDetect();
  
  return {
    ...deviceInfo,
    setupComplete: true
  };
};