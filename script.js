document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('month-form');
    const monthInput = document.getElementById('month-input');
    const calendarDiv = document.getElementById('calendar');
    const currentDatetimeDiv = document.getElementById('current-datetime');
    const monthYearDiv = document.getElementById('month-year');

    // Pad single digits with zero for date formatting
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }

    // Fetch holiday data from the API
    async function fetchHolidays(year, countryCode) {
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
        const data = await response.json();
        return data;
    }

    // Update calendar with fetched holidays data
    async function updateCalendarWithHolidays(holidays) {
        const monthYearText = monthYearDiv.textContent;
        const [monthName, year] = monthYearText.split(' ');

        // Convert month name to month index
        const monthIndex = new Date(Date.parse(`${monthName} 1, ${year}`)).getMonth();

        // Fill the calendar with holidays based on fetched data
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const firstDay = new Date(year, monthIndex).getDay();
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
            const holiday = holidays.find(h => h.date === `${year}-${padZero(monthIndex + 1)}-${padZero(day)}`);
            // Add the day number with red color and holidays in a tooltip
            table += `<td class="day-cell">
                        <span class="${holiday ? 'holiday' : ''}" data-holiday="${holiday ? holiday.localName : ''}">${day}</span>
                      </td>`;
        }

        table += "</tr></table>";
        calendarDiv.innerHTML = table;
    }

    // Updating the current date and time
    async function updateCurrentDatetime() {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        currentDatetimeDiv.innerHTML = now.toLocaleDateString('en-US', options);

        // Fetch holidays for the current year and country (e.g., Austria - AT)
        const holidays = await fetchHolidays(now.getFullYear(), 'AT');
        // Update the calendar with fetched holidays
        updateCalendarWithHolidays(holidays);
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
                updateCalendarWithHolidays([]);
                monthYearDiv.innerHTML = `${capitalizeFirstLetter(monthName)} ${year}`;
            } else {
                monthYearDiv.innerHTML = "Invalid month name.";
                calendarDiv.innerHTML = "";
            }
        }
    });

    // Function to capitalize the first letter of a month name
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    // Initialize the current date and time display
    updateCurrentDatetime();
});
