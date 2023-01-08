import os from 'node:os';
import { ONE_DAY_IN_MILLISECONDS } from '../constants';

const addZeroPrefix = (num: number) => {
    if (num < 10) {
      return '0' + num;
    }
    return num;
  };

// returns the OS uptime in xd HH:MM:SS where x = number of days passed
export const getOsUpTime = () => {
    let ut_sec = os.uptime();
    let ut_min = ut_sec/60;
    let ut_hour = ut_min/60;
    const numDays = Math.floor(ut_sec / ONE_DAY_IN_MILLISECONDS);

    ut_sec = Math.floor(ut_sec);
    ut_min = Math.floor(ut_min);
    ut_hour = Math.floor(ut_hour);

    ut_hour = ut_hour%60;
    ut_min = ut_min%60;
    ut_sec = ut_sec%60;

    return `${numDays}d ${addZeroPrefix(ut_hour)}:${addZeroPrefix(ut_min)}:${addZeroPrefix(ut_sec)}`;
};

const formatDate = (date: Date) => {
    const d = new Date(date);
     let month = '' + (d.getMonth() + 1), 
        day = '' + d.getDate();
    const year = d.getFullYear();
  
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
  
    return [day, month, year].join('/');
  };

export const getOsTimeAndDate = (date: Date) => {
    let hours: string | number = date.getHours();
    let minutes: string | number = date.getMinutes();
    let seconds: string | number = date.getSeconds();
  
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return formatDate(date) + ' ' + hours + ':' + minutes + ':' + seconds;
};