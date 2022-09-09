export const timeAgo = (time: string|number) => {
    let seconds = 0;

    if(typeof time === 'string') {
        seconds += Math.floor((Date.now() - Date.parse(time)) / 1000);
    }
    if(typeof time === 'number') {
        seconds += Math.floor((Date.now() - time) / 1000);
    }
    var interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes";
    return Math.floor(seconds) + " seconds";
}