

const priceFormater = (props) => {
  var parts = props.value.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  let res = parts.join(".");
  return res + " $"
};

export default priceFormater;

