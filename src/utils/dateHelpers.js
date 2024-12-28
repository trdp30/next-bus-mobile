const {DateTime} = require('luxon');

export const parseDateTime = date => {
  return typeof date === 'string'
    ? DateTime.fromISO(date)
    : DateTime.fromJSDate(date);
};

export const getStartOfDay = date => {
  const parsedDay = parseDateTime(date);
  const startOfDay = parsedDay.isValid
    ? parsedDay.startOf('day')
    : DateTime.now().startOf('day');
  return startOfDay;
};

export const getIsoGetStartOfDay = date => {
  return getStartOfDay(date).toUTC().toISO();
};

export const getCurrentDateTime = () => {
  return DateTime.now();
};
