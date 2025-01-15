import { useEffect, useState } from 'react';

function useScreenY(ref: any) {
  const [screenY, setScreenY] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const handleScroll = () => {
      const rect = ref.current.getBoundingClientRect();
      const newScreenY = rect.top + window.scrollY; // Calculate the screenY position
      setScreenY(newScreenY);
      console.log('screenY:', newScreenY);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initial calculation
    handleScroll();

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ref]);

  return screenY;
}

export default useScreenY;
