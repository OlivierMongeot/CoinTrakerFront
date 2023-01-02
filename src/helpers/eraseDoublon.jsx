
const eraseDoublon = (transactions) => {
  console.log('Before erase ', transactions.length)
  let r = [...new Map(transactions.map((m) => {

    return [m.id, m]
  })).values()];
  console.log('After erase ', r.length)
  if (transactions.length > r.length) {
    alert("erase transac");
  }
  return r;
}


export default eraseDoublon;
