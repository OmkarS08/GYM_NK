const { addMonths, parseISO, format, addDays } = require('date-fns');

function calculateEndDate(startDate, numberOfMonths) {
    // Parse the start date if it's in string format
    const parsedStartDate = parseISO(startDate);
    let months = typeof numberOfMonths === 'string' ? parseFloat(numberOfMonths) : numberOfMonths;
    let endDate;
    // Handle fractional months (0.5 = 15 days)
    if (months === 0.5) {
        endDate = addDays(parsedStartDate, 15);
    } else {
        endDate = addMonths(parsedStartDate, months);
    }
    return format(endDate, 'yyyy-MM-dd');
}

module.exports = calculateEndDate;