const parseDate = date => {
  const parts = date.split('-')
  const d = new Date(parts[2], parts[0] - 1, parts[1])
  const weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return `${weekday[d.getDay()]}, ${
    month[d.getMonth()]
  } ${d.getDate()}, ${d.getFullYear()}`
}

export default parseDate
