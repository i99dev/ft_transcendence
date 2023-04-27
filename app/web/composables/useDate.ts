export function getDisplayDate(year: number, month: number, day: number) {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  const compDate = new Date(year,month-1,day); // month - 1 because January == 0
  const diff = today.getTime() - compDate.getTime(); // get the difference between today(at 00:00:00) and the date
  if (compDate.getTime() == today.getTime()) {
      return "Today";
  } else if (diff <= (24 * 60 * 60 *1000)) {
      return "Yesterday";
  } else { 
      return compDate.toDateString(); // or format it what ever way you want
  }
}