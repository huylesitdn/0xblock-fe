import moment from 'moment-timezone';

export const formatTimestamp = (timestamp: string, formatter: string): string => {
  if (timestamp !== '') {
    return moment(new Date(timestamp)).format(formatter);
  }
  return moment(new Date()).format(formatter);
};

export const formatTimestampV2 = (timestamp: string): string => {
  return moment.unix(Number(timestamp)).format('MMM DD YYYY');
};

export const formatTimestampV3 = (timestamp: number, formatter: string): string => {
  const date = new Date(timestamp * 1000);
  return moment(date).format(formatter);
};
