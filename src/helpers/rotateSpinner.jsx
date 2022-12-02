


export default function rotateSpinner(exchangeName, parentData) {
  if (parentData && parentData.find(e => e.exchange === exchangeName)) {
    // if (parentData) {
    const idElement = '#wallet-spinner-' + exchangeName;
    const spinnerElement = document.querySelector(idElement);
    // spinnerElement.classList.add('show');
    if (spinnerElement) {
      spinnerElement.classList.remove('hide');
    }
  }
}



