export const getStartOfDay = date => {
  const parsedDay = new Date(date);
  const startOfDay = new Date(
    parsedDay.getFullYear(),
    parsedDay.getMonth(),
    parsedDay.getDate(),
  );
  return startOfDay.toISOString();
};
