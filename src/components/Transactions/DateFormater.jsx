import getHumanDateTime from "../../helpers/getHumanDate";

const DateFormater = (props) => {



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