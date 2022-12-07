

const bigNumberFormater = (props) => {
  if (props.value) {
    let number = props.value;

    if (number > 1000000 && number <= 1000000000) {
      number = number / 1000000
      return number.toFixed(1) + ' M'


    } else if (number > 1000000000) {
      number = number / 1000000000
      return number.toFixed(1) + ' G';
    } else {
      return number.toFixed(1) + ' '
    }
  }


};

export default bigNumberFormater;

