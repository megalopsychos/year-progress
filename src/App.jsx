import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

// Memoized year progress calculation
const calculateYearProgress = () => {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);

  const elapsed = now.getTime() - startOfYear.getTime();
  const total = endOfYear.getTime() - startOfYear.getTime();
  const percentage = (elapsed / total) * 100;

  const dayOfYear = Math.floor(elapsed / (1000 * 60 * 60 * 24)) + 1;
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDaysInYear = isLeap ? 366 : 365;

  return { percentage, year, dayOfYear, totalDaysInYear };
};

// ✅ Fixed custom hook for persistent localStorage
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
    } catch (error) {
      console.log("LocalStorage not available, fallback to default");
    }
    return initialValue;
  });

  const setStoredValue = useCallback(
    (newValue) => {
      try {
        setValue(newValue);
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(key, JSON.stringify(newValue));
        }
      } catch (error) {
        console.log("LocalStorage not available");
      }
    },
    [key]
  );

  return [value, setStoredValue];
};

// Custom draggable hook
const useDraggable = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e) => {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [position]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;

      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    position,
    isDragging,
    handleMouseDown,
  };
};

function YearProgress() {
  const cardRef = useRef(null);
  const updateIntervalRef = useRef(null);

  // State management
  const [progress, setProgress] = useState(calculateYearProgress());
  const [todos, setTodos] = useLocalStorage("todos", []);
  const [newTodo, setNewTodo] = useState("");
  const [isDarkMode, setIsDarkMode] = useLocalStorage("darkMode", false);

  // Draggable functionality
  const { position, isDragging, handleMouseDown } = useDraggable();

  // Update progress every minute
  useEffect(() => {
    const updateProgress = () => {
      setProgress(calculateYearProgress());
    };

    updateProgress();
    updateIntervalRef.current = setInterval(updateProgress, 60000);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, []);

  // Memoized calculations
  const { daysPassed, daysLeft, matrixDays } = useMemo(() => {
    const daysPassed = progress.dayOfYear;
    const daysLeft = progress.totalDaysInYear - daysPassed;
    const matrixDays = Array.from(
      { length: progress.totalDaysInYear },
      (_, i) => (i < daysPassed ? "filled" : "empty")
    );

    return { daysPassed, daysLeft, matrixDays };
  }, [progress.dayOfYear, progress.totalDaysInYear]);

  // Handlers
  const addTodo = useCallback(() => {
    const trimmed = newTodo.trim();
    if (trimmed) {
      setTodos((prev) => [...prev, trimmed]);
      setNewTodo("");
    }
  }, [newTodo, setTodos]);

  const deleteTodo = useCallback(
    (index) => {
      setTodos((prev) => prev.filter((_, i) => i !== index));
    },
    [setTodos]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTodo();
      }
    },
    [addTodo]
  );

  // Current time
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Theme colors
  const theme = useMemo(
    () => ({
      bg: isDarkMode ? "#111" : "#fff",
      cardBg: isDarkMode ? "#1a1a1a" : "#fff",
      noteBg: isDarkMode ? "#222" : "#fafafa",
      noteItemBg: isDarkMode ? "#333" : "#f8f8f8",
      text: isDarkMode ? "#fff" : "#333",
      textSecondary: isDarkMode ? "#aaa" : "#666",
      textTertiary: isDarkMode ? "#888" : "#888",
      textMuted: isDarkMode ? "#666" : "#ccc",
      border: isDarkMode ? "#333" : "#ddd",
      borderLight: isDarkMode ? "#444" : "#eee",
      progressBg: isDarkMode ? "#333" : "#f0f0f0",
      progressFill: isDarkMode ? "#fff" : "#333",
      dotFilled: isDarkMode ? "#fff" : "#333",
      dotEmpty: isDarkMode ? "#444" : "#ddd",
      inputBg: isDarkMode ? "#222" : "#fff",
      inputBorder: isDarkMode ? "#444" : "#ddd",
    }),
    [isDarkMode]
  );

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        fontFamily: "monospace",
        fontSize: "12px",
        backgroundColor: theme.bg,
        color: theme.text,
        transition: "all 0.3s ease",
      }}
    >
      {/* Dark mode toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        style={{
          position: "absolute",
          top: "40px",
          right: "40px",
          background: "transparent",
          border: `1px solid ${theme.border}`,
          padding: "8px 12px",
          fontSize: "10px",
          color: theme.text,
          cursor: "pointer",
          fontFamily: "monospace",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = theme.noteItemBg;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent";
        }}
      >
        {isDarkMode ? "☀" : "🌙"}
      </button>

      {/* Notes section */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          width: "200px",
          padding: "12px",
          backgroundColor: theme.noteBg,
          border: `1px solid ${theme.borderLight}`,
          borderRadius: "0px",
          transition: "all 0.3s ease",
        }}
      >
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="note..."
          style={{
            padding: "6px",
            borderRadius: "0px",
            border: `1px solid ${theme.inputBorder}`,
            width: "100%",
            boxSizing: "border-box",
            fontFamily: "monospace",
            fontSize: "11px",
            backgroundColor: theme.inputBg,
            color: theme.text,
            outline: "none",
            transition: "all 0.3s ease",
          }}
          maxLength={60}
        />
        <ul
          style={{
            marginTop: "8px",
            padding: 0,
            listStyle: "none",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {todos.map((todo, idx) => (
            <li
              key={`${todo}-${idx}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: theme.text,
                fontFamily: "monospace",
                fontSize: "12px",
                margin: "4px 0",
                padding: "4px 8px",
                backgroundColor: theme.noteItemBg,
                borderRadius: "0px",
                border: `1px solid ${theme.borderLight}`,
                transition: "all 0.3s ease",
              }}
            >
              <span>{todo}</span>
              <button
                onClick={() => deleteTodo(idx)}
                style={{
                  marginLeft: "8px",
                  background: "transparent",
                  border: "none",
                  color: theme.textTertiary,
                  cursor: "pointer",
                  fontSize: "12px",
                  padding: "2px",
                }}
                aria-label="Delete todo"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main card */}
      <div
        ref={cardRef}
        onMouseDown={handleMouseDown}
        style={{
          position: "absolute",
          left: `calc(50% - 160px + ${position.x}px)`,
          top: `calc(50% - 120px + ${position.y}px)`,
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: "0px",
          padding: "24px",
          width: "320px",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          transition: isDragging ? "none" : "all 0.3s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            fontSize: "14px",
            color: theme.textSecondary,
          }}
        >
          <span>{progress.year}</span>
          <span>{progress.percentage.toFixed(2)}%</span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: "100%",
            height: "4px",
            backgroundColor: theme.progressBg,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress.percentage}%`,
              height: "100%",
              backgroundColor: theme.progressFill,
              transition: "width 0.3s ease",
            }}
          />
        </div>

        {/* Day matrix */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(37, 4.8px)",
            gap: "4px",
            justifyContent: "center",
            padding: "16px 0",
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          {matrixDays.map((status, idx) => (
            <div
              key={idx}
              style={{
                width: "4px",
                height: "4px",
                backgroundColor:
                  status === "filled" ? theme.dotFilled : theme.dotEmpty,
                borderRadius: "0px",
              }}
            />
          ))}
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: theme.textTertiary,
            paddingTop: "16px",
          }}
        >
          <span>{daysPassed} passed</span>
          <span>{daysLeft} left</span>
        </div>
      </div>

      {/* Time */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "40px",
          fontSize: "11px",
          color: theme.textMuted,
        }}
      >
        {currentTime}
      </div>

      {/* Credits */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "40px",
          fontSize: "10px",
          color: theme.textMuted,
        }}
      >
        <a
          href="https://github.com/megalopsychos"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: theme.textMuted,
            textDecoration: "none",
          }}
        >
          anant
        </a>
      </div>
    </div>
  );
}

export default YearProgress;
