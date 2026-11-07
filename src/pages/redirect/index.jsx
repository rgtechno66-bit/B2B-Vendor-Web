import { useEffect } from 'react';

export default function Page({url}) {

    useEffect(() => {
        // Redirect to the external URL
        window.location.href = url;
      }, [url]);
    
      return null; // This component does not render anything
    }
