import { REQUEST_EVENT } from './constants';

export const dateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Mexico_City',
});

export const formatDateToYYYYMMDD = (date: string) => {
  const parts = date.split('/'); // Split the string by '/'
  parts[0] = parseInt(parts[0], 10) < 10 ? '0' + parts[0] : parts[0];
  parts[1] = parseInt(parts[1], 10) < 10 ? '0' + parts[1] : parts[1];
  return `${parts[2]}-${parts[0]}-${parts[1]}`; // Rearrange parts in the format 'yyyy/mm/dd'
};

export const getLocalDate = () => formatDateToYYYYMMDD(dateFormat.format(new Date()));

export const getLocalDateTime = () => {
  // Get current date in the America/Mexico_City time zone
  const currentDate = new Date();

  // Extract individual date and time components
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');

  // Concatenate components in the desired format
  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:00`;

  return formattedDateTime;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setRequestState = (state: any, type: string, status: string) => {
  state.requestStatus.type = type;
  switch (status) {
    case REQUEST_EVENT.PENDING:
      state.requestStatus.loading = true;
      state.requestStatus.success = false;
      state.requestStatus.error = false;
      break;
    case REQUEST_EVENT.SUCCESS:
      state.requestStatus.loading = false;
      state.requestStatus.success = true;
      state.requestStatus.error = false;
      break;
    case REQUEST_EVENT.ERROR:
      state.requestStatus.loading = false;
      state.requestStatus.success = false;
      state.requestStatus.error = true;
      break;
  }
};

function generateRandomNumber() {
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

export const generateBarcode = () => {
  function generateRandomNumber() {
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }

  // Function to calculate the checksum digit
  function calculateChecksum(number: string) {
    let sum = 0;
    for (let i = 0; i < number.length; i++) {
      const digit = parseInt(number[i]);
      if (i % 2 === 0) {
        sum += digit;
      } else {
        sum += digit * 3;
      }
    }
    const checksum = (10 - (sum % 10)) % 10;
    return checksum;
  }

  // Generate a random 12-digit number
  const randomNumber = generateRandomNumber();
  // Calculate the checksum digit
  const checksum = calculateChecksum(randomNumber);
  // Combine the random number and checksum to form a valid EAN-13 barcode
  const ean13Barcode = randomNumber + checksum;

  return ean13Barcode;
};
