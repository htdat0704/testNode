const convertTimeToUTC = (date) => {
  return new Date(new Date(date).getTime() - 25200000);
};

module.exports = convertTimeToUTC;
