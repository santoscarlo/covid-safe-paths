import React, { createContext, useState, useEffect } from 'react';

import * as BTNativeModule from './bt/nativeModule';
import {
  ExposureInfo,
  ExposureHistory,
  calendarDays,
  toExposureHistory,
} from './exposureHistory';

interface ExposureHistoryState {
  lastExposureDetectionDate: string;
  exposureHistory: ExposureHistory;
  hasBeenExposed: boolean;
  userHasNewExposure: boolean;
  observeExposures: () => void;
  resetExposures: () => void;
}

const initialState = {
  lastExposureDetectionDate: '',
  exposureHistory: [],
  hasBeenExposed: false,
  userHasNewExposure: true,
  observeExposures: () => {},
  resetExposures: () => {},
};

const ExposureHistoryContext = createContext<ExposureHistoryState>(
  initialState,
);

export type ExposureInfoSubscription = (
  cb: (exposureInfo: ExposureInfo) => void,
) => { remove: () => void };

interface ExposureHistoryProps {
  children: JSX.Element;
  exposureInfoSubscription: ExposureInfoSubscription;
}

const CALENDAR_DAY_COUNT = 21;

const blankHistory = toExposureHistory(
  {},
  calendarDays(Date.now(), CALENDAR_DAY_COUNT),
);

const ExposureHistoryProvider = ({
  children,
  exposureInfoSubscription,
}: ExposureHistoryProps): JSX.Element => {
  const [exposureHistory, setExposureHistory] = useState<ExposureHistory>(
    blankHistory,
  );
  const [userHasNewExposure, setUserHasNewExposure] = useState<boolean>(false);
  const [lastExposureDetectionDate, setLastExposureDetectionDate] = useState(
    '',
  );

  useEffect(() => {
    const subscription = exposureInfoSubscription(
      (exposureInfo: ExposureInfo) => {
        const days = calendarDays(Date.now(), CALENDAR_DAY_COUNT);
        const exposureHistory = toExposureHistory(exposureInfo, days);

        const handleNativeResponse = (detectionDate: string) => {
          console.log('Detection date: ', detectionDate);
          setLastExposureDetectionDate(detectionDate);
        };
        console.log('in context');
        BTNativeModule.getLastExposureDetectionDate(handleNativeResponse);
        setExposureHistory(exposureHistory);
      },
    );

    return subscription.remove;
  }, [exposureInfoSubscription]);

  const observeExposures = () => {
    setUserHasNewExposure(false);
  };

  const resetExposures = () => {
    setUserHasNewExposure(true);
  };

  const hasBeenExposed = false;
  return (
    <ExposureHistoryContext.Provider
      value={{
        lastExposureDetectionDate,
        exposureHistory,
        hasBeenExposed,
        userHasNewExposure,
        observeExposures,
        resetExposures,
      }}>
      {children}
    </ExposureHistoryContext.Provider>
  );
};

export { ExposureHistoryProvider };
export default ExposureHistoryContext;
