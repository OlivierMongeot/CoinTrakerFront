

const getHumanDateTime = (timeStamp) => {

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dateFormat = new Date(timeStamp)

  return [dateFormat.getDate() +
    " " + (months[dateFormat.getMonth()]) +
    " " + dateFormat.getFullYear(),
  " " + dateFormat.getHours().toString().padStart(2, "0") +
  ":" + dateFormat.getMinutes().toString().padStart(2, "0") +
  ":" + dateFormat.getSeconds().toString().padStart(2, "0")
  ];
}


export default getHumanDateTime;