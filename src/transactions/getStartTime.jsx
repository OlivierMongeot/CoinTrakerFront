import getTimeTable from "./getTimeTable";


const getStartTime = async (userData, exchange, type, reset = false) => {

  if (reset) {
    return 1640908800000
  }

  let currentTimesTable = await getTimeTable(userData)
  console.log('currentTimesTable', currentTimesTable)
  let start = null;

  if (currentTimesTable === undefined) {

    start = 1640908800000
    throw new Error('no table table');
  } else {
    start = currentTimesTable[exchange][type]
  }
  console.log('start time ', start)
  return start
}

export default getStartTime