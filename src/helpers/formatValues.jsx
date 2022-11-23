
const formatValues = (type, value) => {

  switch (type) {
    case 'price':
      value = parseFloat(value);

      if (value >= 1000) {
        return value.toFixed(0);
      } else if (value >= 100 && value < 1000) {
        return value.toFixed(2);
      } else if (value >= 10 && value < 100) {
        return value.toFixed(2);
      } else if (value >= 1 && value < 10) {
        return value.toFixed(3);
      } else if (value >= 0.01 && value < 1) {
        return value.toFixed(3);
      } else if (value >= 0.001 && value < 0.01) {
        return value.toFixed(4);
      } else {
        return value.toFixed(4);
      }

    case 'pourcent':

      if (isNaN(value)) {
        return 'no';
      }
      value = parseFloat(value);
      if (value >= 10) {
        return value.toFixed(1);
      } else {
        return value.toFixed(2);
      }

    case 'camelise':
      return value.charAt(0).toUpperCase() + value.slice(1);

    case 'timestamp':
      let dateFormat = new Date(value);
      let minute = (parseInt(dateFormat.getMinutes()) < 9) ? ('0' + dateFormat.getMinutes().toString()) : dateFormat.getMinutes();
      let seconde = (parseInt(dateFormat.getSeconds()) < 9) ?
        ('0' + dateFormat.getSeconds()) : dateFormat.getSeconds();
      return ("Last updated " + dateFormat.getDate() +
        "/" + (dateFormat.getMonth() + 1) +
        "/" + dateFormat.getFullYear() +
        " " + dateFormat.getHours() +
        ":" + minute +
        ":" + seconde);

    case 'switch-color':
      value = parseFloat(value)
      if (value >= 0) {
        return 'green';
      }
      else {
        return 'red';
      }

    default:
      return '';
  }


}

export default formatValues;