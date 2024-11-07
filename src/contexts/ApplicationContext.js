import React, {createContext, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {selectTracker} from '../store/selectors/session.selector';

const ApplicationContext = createContext({
  tracker: null,
});

const ApplicationProvider = ({children}) => {
  const tracker = useSelector(selectTracker);

  const value = useMemo(() => {
    return {
      tracker,
    };
  }, [tracker]);

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

export {ApplicationContext, ApplicationProvider};
