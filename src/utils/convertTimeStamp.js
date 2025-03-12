export function convertTimestamp(timestampStr) {
  const timestamp = new Date(timestampStr);

  const year = timestamp.getFullYear();
  const month = timestamp.getMonth() + 1;
  const day = timestamp.getDate();
  const hours = timestamp.getHours();
  const minutes = timestamp.getMinutes();
  // const seconds = timestamp.getSeconds();
  // const timezoneOffset = timestamp.getTimezoneOffset() / 60;
  const formattedTimestamp = `${day.toString().padStart(2, '0')}/${month
    .toString()
    .padStart(2, '0')}/${year.toString().slice(2)} ${hours.toString()
    .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`; //${seconds.toString().padStart(2, '0')}  //GMT${timezoneOffset >= 0 ? '+' : '-'} ${Math.abs(timezoneOffset)}

  return formattedTimestamp;
}

export function convertTimestampNotGMT(timestampStr) {
  const timestamp = new Date(timestampStr);
  const timestampHour = new Date(timestampStr).setHours(new Date(timestampStr).getHours() - 7);
  const year = timestamp.getFullYear();
  const month = timestamp.getMonth() + 1;
  const day = timestamp.getDate();
  const hours = new Date(timestampHour).getHours();
  const minutes = timestamp.getMinutes();
  // const seconds = timestamp.getSeconds();
  // const timezoneOffset = timestamp.getTimezoneOffset() / 60;
  const formattedTimestamp = `${day.toString().padStart(2, '0')}/${month
    .toString()
    .padStart(2, '0')}/${year.toString().slice(2)} ${(hours).toString()
    .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`; //${seconds.toString().padStart(2, '0')}  //GMT${timezoneOffset >= 0 ? '+' : '-'} ${Math.abs(timezoneOffset)}

  return formattedTimestamp;
}
export function convertDate(timestampStr) {
  const timestamp = new Date(timestampStr);

  const year = timestamp.getFullYear();
  const month = timestamp.getMonth() + 1;
  const day = timestamp.getDate();
  const formattedDate = `${day.toString().padStart(2, '0')}/${month
    .toString()
    .padStart(2, '0')}/${year.toString()}`; //${seconds.toString().padStart(2, '0')}  //GMT${timezoneOffset >= 0 ? '+' : '-'} ${Math.abs(timezoneOffset)}

  return formattedDate;
}
