import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [daysPassed, setDaysPassed] = useState<number>(0);

  useEffect(() => {
    const fromDate = new Date("2025-02-23");
    const updateCounter = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diff = today.getTime() - fromDate.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      setDaysPassed(days);
    };

    updateCounter();

    const interval = setInterval(updateCounter, 1000 * 60 * 60 * 24);
    return () => clearInterval(interval);
  }, []);

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
      <p>{daysPassed} day{daysPassed !== 1 ? "s" : ""} had passed.</p>
    </main>
  );
}

export default App;
