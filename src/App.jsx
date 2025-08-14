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

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(calculateYearProgress());
    }, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []); // Empty dependency array ensures this runs only once on mount


  // --- Visuals ---

  // Create the block representation of the year (e.g., 100 blocks)
  const totalBlocks = 100;
  const filledBlocks = Math.floor(progress.percentage);
  const emptyBlocks = totalBlocks - filledBlocks;
  const progressBlocks = '▓'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);


  // --- Styles ---

  const styles = {
    container: {
      backgroundColor: '#111',
      backgroundSize: 'cover',
      backgroundRepeat: 'repeat',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      fontFamily: `'Helvetica Neue', Arial, sans-serif`,
      fontWeight: '300',
      textAlign: 'center',
    },
    year: {
      fontSize: '3rem',
      fontWeight: '300',
      color: '#fff',
      letterSpacing: '0',
      margin: '0',
    },
    loadingTextContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '80%',
      maxWidth: '600px',
      fontSize: '2.5rem',
      fontFamily: `monospace`,
      margin: '0.5rem 0 1.5rem 0',
      letterSpacing: '0',
      color: '#fff',
      textTransform: 'uppercase',
    },
    progressBarContainer: {
      width: '90%',
      maxWidth: '600px',
      height: '30px',
      backgroundColor: 'transparent',
      border: '1px solid #fff',
      borderRadius: '15px',
      margin: '1rem 0',
    },
    progressBarFill: {
      height: '100%',
      backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0.8) 5px, transparent 5px, transparent 10px)',
      backgroundColor: 'transparent',
      width: `${progress.percentage}%`,
      transition: 'width 0.5s linear',
      borderRadius: '15px',
      boxShadow: '0 0 8px rgba(255,255,255,0.5)',
    },
    blocks: {
      fontSize: '0.75rem',
      letterSpacing: '0',
      wordBreak: 'break-all',
      width: '80%',
      maxWidth: '600px',
      lineHeight: '1.2',
      color: '#eeeeee1e',
    }
  };


  return (
    <div style={styles.container}>
      <h1 style={styles.year}>{progress.year}</h1>
      
      <div style={styles.loadingTextContainer}>
        <span>LOADING</span>
        <span>{progress.percentage.toFixed(2)}%</span>
      </div>
      
      <div style={styles.progressBarContainer}>
        <div style={styles.progressBarFill}></div>
      </div>
    </div>
  );
}

export default YearProgress;