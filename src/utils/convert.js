const yardMeter = 0.9144;
const yardToMeter = (yards) => {
  return Math.floor(yardMeter * yards);
};
module.exports = {
  yardToMeter,
};
