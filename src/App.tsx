import "./App.css"
import { useEffect, useState } from "react";

function App() {
  const [timePassed, setTimePassed] = useState({
    years: 0,
    months: 0,
    days: 0,
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const lastPerlutan = new Date("2025-08-15T22:00:00");
  const perlutanInterval = 21;
  const oestrogelDelay = 11;
  const [perlutanDates, setPerlutanDates] = useState<Date[]>([]);
  const [oestrogelDates, setOestrogelDates] = useState<Date[]>([]);

  useEffect(() => {
    const fromDate = new Date("2025-02-23");
    const updateCounter = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let years = today.getFullYear() - fromDate.getFullYear();
      let months = today.getMonth() - fromDate.getMonth();
      let days = today.getDate() - fromDate.getDate();

      if (days < 0) {
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
        months -= 1;
      }
      if (months < 0) {
        months += 12;
        years -= 1;
      }
      setTimePassed({ years, months, days });
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000 * 60 * 60 * 24);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const calculateMedicationDates = () => {
      const perlutanList: Date[] = [];
      const oestrogelList: Date[] = [];

      // const startDate = new Date(lastPerlutan);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 6);

      let currentPerlutan = new Date(lastPerlutan);

      while (currentPerlutan <= endDate) {
        perlutanList.push(new Date(currentPerlutan));

        const oestrogelDate = new Date(currentPerlutan);
        oestrogelDate.setDate(oestrogelDate.getDate() + oestrogelDelay);

        const nextPerlutan = new Date(currentPerlutan);
        nextPerlutan.setDate(nextPerlutan.getDate() + perlutanInterval);

        if (oestrogelDate.toDateString() === nextPerlutan.toDateString()) {
          oestrogelDate.setDate(oestrogelDate.getDate() + 1);
        }

        oestrogelList.push(new Date(oestrogelDate));

        currentPerlutan.setDate(currentPerlutan.getDate() + perlutanInterval);
      }

      setPerlutanDates(perlutanList);
      setOestrogelDates(oestrogelList);
    };

    calculateMedicationDates();
  }, []);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const scheduleNotifications = () => {
      const now = new Date();
      const upcomingPerlutan = perlutanDates.find(date => date > now);
      const upcomingOestrogel = oestrogelDates.find(date => date > now);

      if (upcomingPerlutan) {
        const diff = upcomingPerlutan.getTime() - now.getTime();
        if (diff > 0 && diff < 24 * 60 * 60 * 1000) {
          setTimeout(() => {
            new Notification("💉 Time for your dose of Perlutan!");
          }, diff);
        }
      }

      if (upcomingOestrogel) {
        const diff = upcomingOestrogel.getTime() - now.getTime();
        if (diff > 0 && diff < 24 * 60 * 60 * 1000) {
          setTimeout(() => {
            new Notification("🌸 Time to apply Oestrogel!");
          }, diff);
        }
      }
    };

    if (perlutanDates.length > 0 && oestrogelDates.length > 0) {
      scheduleNotifications();
    }
  }, [perlutanDates, oestrogelDates]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateMatch = (day: number, targetDates: Date[]) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return targetDates.some(date =>
      date.toDateString() === checkDate.toDateString()
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isPerlutan = isDateMatch(day, perlutanDates);
      const isOestrogel = isDateMatch(day, oestrogelDates);
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      let className = "calendar-day";
      if (isToday) className += " today";
      if (isPerlutan) className += " perlutan";
      if (isOestrogel) className += " oestrogel";

      days.push(
        <div key={day} className={className}>
          <span className="day-number">{day}</span>
          {isPerlutan && <div className="medication">💉</div>}
          {isOestrogel && <div className="medication">🌸</div>}
        </div>
      );
    }

    return (
      <div className="calendar">
        <div className="calendar-header">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="nav-btn"
          >
            ←
          </button>
          <h3>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="nav-btn"
          >
            →
          </button>
        </div>
        <div className="calendar-weekdays">
          {dayNames.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {days}
        </div>
      </div>
    );
  };

  const { years, months, days } = timePassed;
  let message = "";
  if (years > 0) {
    message = `${years} year${years !== 1 ? "s" : ""}, ${months} month${months !== 1 ? "s" : ""} and ${days} day${days !== 1 ? "s" : ""} had passed.`;
  } else if (months > 0) {
    message = `${months} month${months !== 1 ? "s" : ""} and ${days} day${days !== 1 ? "s" : ""} had passed.`;
  } else {
    message = `${days} day${days !== 1 ? "s" : ""} had passed.`;
  }

  return (
    <main className="main-container">
      <h1>📆 Since I start my gender transition</h1>
      <p className="time-message">{message}</p>

      <h2>💊 Medication Schedule</h2>
      {renderCalendar()}

      <div className="legend">
        <div className="legend-item">
          <span className="legend-color perlutan-legend">💉</span>
          <span>Perlutan - Next: {perlutanDates.find(date => date > new Date())?.toLocaleDateString() ?? "N/A"}</span>
        </div>
        <div className="legend-item">
          <span className="legend-color oestrogel-legend">🌸</span>
          <span>Oestrogel - Next: {oestrogelDates.find(date => date > new Date())?.toLocaleDateString() ?? "N/A"}</span>
        </div>
      </div>
    </main>
  );
}

export default App;