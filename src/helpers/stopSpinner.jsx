


export default function stopSpinner(exchangeName, parentData) {
  if (parentData && parentData.find(e => e.exchange === exchangeName)) {
    const idElement = '#wallet-spinner-' + exchangeName;
    const spinnerElement = document.querySelector(idElement);
    // spinnerElement.classList.remove('show');
    // console.log(spinnerElement);
    if (spinnerElement) {
      spinnerElement.classList.add('hide');
    }
  }
}
