
const formatValues = (type, value) => {

  switch (type) {
    case 'price':
      value = parseFloat(value);

      if (value >= 1000) {
        value = value.toFixed(0);
      } else if (value >= 100 && value < 1000) {
        value = value.toFixed(2);
      } else if (value >= 10 && value < 100) {
        value = value.toFixed(3);
      } else if (value >= 1 && value < 10) {
        value = value.toFixed(3);
      } else if (value > 0.1 && value < 1) {
        value = value.toFixed(4);
      } else {
        value = value.toFixed(5);
      }
      return value;

    case 'pourcent':

      if (isNaN(value)) {
        return 'no';
      }
      value = parseFloat(value);
      if (value >= 10) {
        value = value.toFixed(1);
      } else {
        value = value.toFixed(2);
      }
      return value;

    default:
      return '';
  }





}

export default formatValues;