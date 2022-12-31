const DateFormater = (props) => {


  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function getHumanDateTime(timeStamp) {

    const dateFormat = new Date(timeStamp)

    return [dateFormat.getDate() +
      " " + (months[dateFormat.getMonth()]) +
      " " + dateFormat.getFullYear(),
    " " + dateFormat.getHours().toString().padStart(2, "0") +
    ":" + dateFormat.getMinutes().toString().padStart(2, "0")];
  }
  // console.log('props', props);
  if (props.value) {
    const value = getHumanDateTime(props.value);
    return (
      <div>
        <div>
          {value[0]}
        </div>
        <span style={{ color: 'grey' }}>
          {value[1]}
        </span>
      </div>
    )
  }
};

export default DateFormater;