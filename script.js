document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('month-form');
    const monthInput = document.getElementById('month-input');
    const calendarDiv = document.getElementById('calendar');
    const currentDatetimeDiv = document.getElementById('current-datetime');
    const monthYearDiv = document.getElementById('month-year');

    // Updating the current date and time
    function updateCurrentDatetime() {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        currentDatetimeDiv.innerHTML = now.toLocaleDateString('en-US', options);
    }

    setInterval(updateCurrentDatetime, 1000);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const monthName = monthInput.value.trim();
        if (monthName) {
            const date = new Date();
            const year = date.getFullYear();
            const monthIndex = new Date(Date.parse(monthName + " 1, " + year)).getMonth();
            if (!isNaN(monthIndex)) {
                showCalendar(monthIndex, year);
                monthYearDiv.innerHTML = `${capitalizeFirstLetter(monthName)} ${year}`;
            } else {
                monthYearDiv.innerHTML = "Invalid month name.";
                calendarDiv.innerHTML = "";
            }
        }
    });

    function showCalendar(month, year) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month).getDay();
        let table = `<table>
            <tr>
                <th>Sun</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
            </tr>
            <tr>`;

        // Blank spaces for days of the previous month
        for (let i = 0; i < firstDay; i++) {
            table += "<td></td>";
        }

        // Fill the calendar with the days of the current month
        for (let day = 1; day <= daysInMonth; day++) {
            if ((day + firstDay - 1) % 7 == 0 && day != 1) {
                table += "</tr><tr>";
            }
            // Check if the day is a holiday
            const holidayName = checkHoliday(month, day);
            table += `<td class="day-cell">
                        <span class="${holidayName ? 'holiday' : ''}" data-holiday="${holidayName ? holidayName : ''}">${day}</span>
                      </td>`;
        }

        table += "</tr></table>";
        calendarDiv.innerHTML = table;
    }

    // Check if a specific day is a holiday
    function checkHoliday(month, day) {
        const holidays = {
            '0-1': "New Year's Day",
            '1-14': "Valentine's Day",
            '4-1': "International Workers' Day",
            '11-25': "Christmas Day",
        };

        const key = `${month}-${day}`;
        return holidays[key] || null;
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    updateCurrentDatetime();
});
