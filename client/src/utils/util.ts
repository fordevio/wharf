export const hostUrl = () => {
  let url = window.location.origin;
  if (url === 'http://localhost:3000') {
    return 'http://localhost:9001';
  }
  return url;
};

export const convertToIndianDateTime = (unixTimestamp: number): string => {
  // Convert timestamp to milliseconds
  const date = new Date(unixTimestamp * 1000);

  // Define options for formatting the date and time
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata', // Indian Standard Time (IST)
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // 24-hour format
  };

  // Format the date and time
  return date.toLocaleString('en-IN', options);
};

export const formatBytes = (bytes: number) => {
  if (bytes < 0) return 'Not calculated';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};
