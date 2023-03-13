const { default: axios } = require('axios');
const test = async () => {
  try {
    for (let i = 0; i < 10; i++) {
      const { data } = await axios.get('https://vgslivescore.com/live-scores/competition?id=4');
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  }
};

test();
