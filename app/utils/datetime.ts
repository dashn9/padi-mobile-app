export function formatAmPm(date: Date) {
    let hours = date.getHours();
    let minutes: string | number = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours %= 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

export function fetchNoOfMonths(dateString: string) {
    // Assuming your datetime is in the format 'YYYY-MM-DD'
    const date = new Date(dateString);

    // Get the current date
    const currentDate = new Date();

    // Calculate the number of months between the two dates
    return ((currentDate.getFullYear() - date.getFullYear()) * 12) + (currentDate.getMonth() - date.getMonth());
}

export function formatDateTimeStringWithTimezone() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    const timezoneOffsetMinutes = date.getTimezoneOffset();
    const timezoneOffsetHours = Math.abs(Math.floor(timezoneOffsetMinutes / 60));
    const timezoneOffsetSign = timezoneOffsetMinutes > 0 ? '-' : '+';

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}${timezoneOffsetSign}${String(timezoneOffsetHours).padStart(2, '0')}`;

    return formattedDate;
}

export function formatDateToString(date: Date) {
    return (date.getFullYear()) + '-' + String((date.getMonth() + 1)).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}

export function removeNoOfYearsFromDate(date: Date, noOfYears: number) {
    date.setUTCFullYear(date.getUTCFullYear() - noOfYears);
    return date;
}
