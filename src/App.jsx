import React, { useState, useEffect } from 'react';

// --- Helper Functions for Calculation ---

const calculateYearProgress = () => {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1); // Jan 1st
  const endOfYear = new Date(year + 1, 0, 1); // Jan 1st of next year

  const elapsed = now.getTime() - startOfYear.getTime();
  const total = endOfYear.getTime() - startOfYear.getTime();

  const percentage = (elapsed / total) * 100;

  // Day calculations
  const dayOfYear = Math.floor(elapsed / (1000 * 60 * 60 * 24)) + 1;
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDaysInYear = isLeap ? 366 : 365;

  return {
    percentage,
    year,
    dayOfYear,
    totalDaysInYear,
  };
};


// --- The Main Component ---

function YearProgress() {
  const [progress, setProgress] = useState(calculateYearProgress());
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(calculateYearProgress());
    }, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []); // Empty dependency array ensures this runs only once on mount


  // --- Visuals ---

  // Calculate daysPassed and daysLeft
  const daysPassed = progress.dayOfYear;
  const daysLeft = progress.totalDaysInYear - daysPassed;

  // Create the block representation of the year (e.g., 100 blocks)
  const totalBlocks = 100;
  const filledBlocks = Math.floor(progress.percentage);
  const emptyBlocks = totalBlocks - filledBlocks;
  const progressBlocks = '▓'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

  // Create matrixWeeks: one element per week in the year, 'filled' if week index < weeksPassed, else 'empty'
  const totalWeeks = Math.ceil(progress.totalDaysInYear / 7);
  const weeksPassed = Math.ceil(daysPassed / 7);
  const matrixWeeks = Array.from({ length: totalWeeks }, (_, i) =>
    i < weeksPassed ? 'filled' : 'empty'
  );

  // --- Styles ---

  const styles = {
    container: {
      backgroundColor: '#fff',
      backgroundSize: 'cover',
      backgroundRepeat: 'repeat',
      color: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      fontFamily: 'monospace',
      fontWeight: '100',
      textAlign: 'center',
    },
    year: {
      fontSize: '2rem',
      fontWeight: '100',
      color: '#000',
      letterSpacing: '0',
      margin: 0,
      marginBottom: '1rem',
    },
    loadingTextContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '80%',
      maxWidth: '600px',
      fontSize: '1rem',
      fontFamily: `monospace`,
      margin: '0.5rem 0 1.5rem 0',
      letterSpacing: '0',
      color: '#000',
      textTransform: 'uppercase',
    },
    progressBarContainer: {
      width: '90%',
      maxWidth: '600px',
      height: '20px',
      backgroundColor: '#eee',
      border: '2px solid #000',
      padding: '2px',
      margin: '1rem 0',
      boxShadow: '0 0 10px #000',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: '#000',
      width: `${progress.percentage}%`,
      transition: 'width 0.5s linear',
    },
    blocks: {
      fontSize: '0.75rem',
      letterSpacing: '0',
      wordBreak: 'break-all',
      width: '80%',
      maxWidth: '600px',
      lineHeight: '1.2',
      color: '#eeeeee1e',
    },
    dayMatrix: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 26px)',
      gap: '11px',
      marginTop: '20px',
    },
    dayDot: {
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      transition: 'box-shadow 0.3s ease',
    },
  };


  return (
    <div style={styles.container}>
      <h1 style={styles.year}>{progress.year}</h1>
      <div style={styles.loadingTextContainer}>
        <span>YEARLY PROGRESS</span>
        <span>{progress.percentage.toFixed(2)}%</span>
      </div>
      <div style={styles.progressBarContainer}>
        <div style={styles.progressBarFill}></div>
      </div>
      <div style={styles.dayMatrix}>
        {matrixWeeks.map((status, idx) => (
          <div
            key={idx}
            style={{
              ...styles.dayDot,
              backgroundColor: status === 'filled' ? '#000' : '#ccc',
              boxShadow: hoveredIndex === idx ? '0 0 5px #000' : 'none',
            }}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default YearProgress;