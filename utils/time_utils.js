const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const formatDate = function (date) {
  const dateTime = new Date(date);
  return `${dateTime.getFullYear()}-${(dateTime.getMonth() + 1).toString().padStart(2, '0')}-${(dateTime.getDate()).toString().padStart(2, '0')}`;
}

const formatDateWithMonth = function (date) {
  const dateTime = new Date(date);

  return `${dateTime.getDate()} ${months[dateTime.getMonth()]} ${dateTime.getFullYear()}`;
}

const formatPeriod = function (date_start, date_end) {
  const dtStart = new Date(date_start);
  const dtEnd = new Date(date_end);
  const dayStart = dtStart.getDate();
  const dayEnd = dtEnd.getDate();
  const monthStart = dtStart.getMonth();
  const monthEnd = dtEnd.getMonth();
  const yearStart = dtStart.getFullYear();
  const yearEnd = dtEnd.getFullYear();

  if (monthStart == monthEnd && yearStart == yearEnd) {
    if (dayStart == dayEnd) {
      return `${dayStart} ${months[monthStart]} ${yearStart}`;
    }
    return `${dayStart} - ${dayEnd} ${months[monthStart]} ${yearStart}`;
  } else if (yearStart == yearEnd) {
    return `${dayStart} ${months[monthStart]} - ${dayEnd} ${months[monthEnd]} ${yearStart}`;
  } else {
    return `${dayStart} ${months[monthStart]} ${yearStart} - ${dayEnd} ${months[monthEnd]} ${yearEnd}`;
  }
}

export {
  formatDate,
  formatDateWithMonth,
  formatPeriod
}