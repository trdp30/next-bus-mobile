import {useEffect, useState} from 'react';
import {Linking} from 'react-native';

export const useInitialURL = () => {
  const [url, setUrl] = useState(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const getUrlAsync = async path => {
      // Get the deep link used to open the app
      let initialUrl = null;
      if (path) {
        initialUrl = path;
      } else {
        initialUrl = await Linking.getInitialURL();
      }

      // The setTimeout is just for testing purpose
      setTimeout(() => {
        setUrl(initialUrl);
        setProcessing(false);
      }, 1000);
    };

    if (Linking.addEventListener) {
      Linking.addEventListener('url', getUrlAsync);
    }

    getUrlAsync();
    return () => {
      if (Linking.removeEventListener) {
        Linking.removeEventListener('url', getUrlAsync);
      }
    };
  }, []);

  return {url, processing};
};
