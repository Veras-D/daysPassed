import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [timePassed, setTimePassed] = useState({
    years: 0,
    months: 0,
    days: 0,
  });

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
    <main
      style={{
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: "2rem",
        fontSize: "1rem",
      }}
    >
      <h1>📆 Since I start my gender transition</h1>
      <p>{message}</p>
    </main>
  );
}

export default App;
