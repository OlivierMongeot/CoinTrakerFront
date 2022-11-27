

const BigNumberFormater = (props) => {
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

export default BigNumberFormater;

// 10 000        Dix mille
// 100 000       Cent Mille
// 1 000 000     1 Million
// 1000 000 000  1 Milliard