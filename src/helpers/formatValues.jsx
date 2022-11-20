
const formatValues = (type, value) => {

  function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  switch (type) {
    case 'price':
      value = parseFloat(value);

      if (value >= 1000) {
        return value.toFixed(0);
      } else if (value >= 100 && value < 1000) {
        return value.toFixed(2);
      } else if (value >= 10 && value < 100) {
        return value.toFixed(3);
      } else if (value >= 1 && value < 10) {
        return value.toFixed(3);
      } else if (value > 0.1 && value < 1) {
        return value.toFixed(4);
      } else {
        return value.toFixed(5);
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

    default:
      return '';
  }


}

export default formatValues;