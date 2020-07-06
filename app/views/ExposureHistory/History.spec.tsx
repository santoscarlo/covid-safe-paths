import React from 'react';
import {
  fireEvent,
  wait,
  cleanup,
  render,
} from '@testing-library/react-native';

import { toExposureHistory } from '../../bt/exposureNotifications';
import { DateTimeUtils } from '../../helpers';
import { factories } from '../../factories';

import History from './History';

const CALENDAR_LENGTH = 21;

afterEach(cleanup);

describe('History', () => {
  it('renders', () => {
    const exposureHistory = buildBlankExposureHistory();

    const { getByTestId } = render(
      <History exposureHistory={exposureHistory} />,
    );

    expect(getByTestId('exposure-history-calendar')).not.toBeNull();
  });

  describe('when given an exposure history that has a possible exposure', () => {
    describe('and the user taps the date of that exposure', () => {
      it("shows a 'Next Steps' button", async () => {
        const twoDaysAgo = DateTimeUtils.beginningOfDay(
          DateTimeUtils.daysAgo(2),
        );
        const rawExposure = factories.rawExposure.build({
          id: 'Possible',
          date: twoDaysAgo,
        });
        const exposureHistory = toExposureHistory([rawExposure], {
          startDate: Date.now(),
          totalDays: CALENDAR_LENGTH,
        });

        const { queryByTestId, getByTestId } = render(
          <History exposureHistory={exposureHistory} />,
        );

        const twoDaysAgoIndicator = getByTestId(`calendar-day-${twoDaysAgo}`);

        expect(queryByTestId('exposure-history-next-steps-button')).toBeNull();

        fireEvent.press(twoDaysAgoIndicator);

        await wait(() => {
          expect(
            getByTestId('exposure-history-next-steps-button'),
          ).not.toBeNull();
        });
      });
    });
  });
});

const buildBlankExposureHistory = () => {
  const rawExposure = factories.rawExposure.build();
  return toExposureHistory([rawExposure], {
    startDate: Date.now(),
    totalDays: CALENDAR_LENGTH,
  });
};
