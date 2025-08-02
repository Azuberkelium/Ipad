document.addEventListener('DOMContentLoaded', () => {
    // --- State variables to keep track of counts and timers ---
    let greenCircleCount = 0;
    let warningCount = 0;
    let timerInterval = null;
    let countdownTime = 0; // Total time in milliseconds
    let isPaused = false;
    let noIpadActive = false;

    // --- Select all the HTML elements we need to interact with ---
    const greenCircleBtn = document.getElementById('greenCircleBtn');
    const greenCircleCountEl = document.getElementById('greenCircleCount');
    const greenCardBtn = document.getElementById('greenCardBtn');
    const ipadTimerDisplay = document.getElementById('ipadTimerDisplay');
    const resetBtn = document.getElementById('resetBtn');
    const newDayBtn = document.getElementById('newDayBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const playBtn = document.getElementById('playBtn');
    const warningBtn = document.getElementById('warningBtn');
    const warningCountEl = document.getElementById('warningCount');
    const yellowCardBtn = document.getElementById('yellowCardBtn');
    const redCardBtn = document.getElementById('redCardBtn');
    const noIpadPopup = document.getElementById('noIpadPopup');

    // --- Functions to update the displays and manage the pop-up ---
    function updateTimerDisplay() {
        if (isPaused) {
            return;
        }

        if (countdownTime <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            countdownTime = 0;
            noIpadActive = false;
        }

        noIpadPopup.style.display = noIpadActive ? 'block' : 'none';

        const hours = Math.floor(countdownTime / (1000 * 60 * 60));
        const minutes = Math.floor((countdownTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((countdownTime % (1000 * 60)) / 1000);

        ipadTimerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        countdownTime -= 1000;
    }

    function addTimeToTimer(hoursToAdd) {
        countdownTime += hoursToAdd * 60 * 60 * 1000;
        if (!timerInterval && !isPaused) {
            timerInterval = setInterval(updateTimerDisplay, 1000);
        }
    }

    function setCountdownTimer(hours, isNoIpadActive = false) {
        clearInterval(timerInterval);
        isPaused = false;
        countdownTime = hours * 60 * 60 * 1000;
        timerInterval = setInterval(updateTimerDisplay, 1000);
        noIpadActive = isNoIpadActive;
    }

    function pauseTimer() {
        isPaused = true;
    }

    function playTimer() {
        if (isPaused) {
            isPaused = false;
            timerInterval = setInterval(updateTimerDisplay, 1000);
        }
    }
    
    // --- Event Listeners for all the buttons ---
    
    // Left Side Buttons
    greenCircleBtn.addEventListener('click', () => {
        greenCircleCount++;
        greenCircleCountEl.textContent = greenCircleCount;

        if (greenCircleCount >= 5) {
            greenCircleCount = 0;
            greenCircleCountEl.textContent = greenCircleCount;
            addTimeToTimer(1);
        }
    });

    greenCardBtn.addEventListener('click', () => {
        setCountdownTimer(1);
        noIpadActive = false;
    });
    
    // Middle Buttons
    resetBtn.addEventListener('click', () => {
        // Reset all counts and timers
        greenCircleCount = 0;
        warningCount = 0;
        clearInterval(timerInterval);
        timerInterval = null;
        countdownTime = 0;
        isPaused = false;
        noIpadActive = false;
        
        greenCircleCountEl.textContent = greenCircleCount;
        warningCountEl.textContent = warningCount;
        ipadTimerDisplay.textContent = '00:00:00';
        noIpadPopup.style.display = 'none';
    });

    newDayBtn.addEventListener('click', () => {
        addTimeToTimer(3);
    });

    pauseBtn.addEventListener('click', () => {
        pauseTimer();
    });

    playBtn.addEventListener('click', () => {
        playTimer();
    });
    
    // Right Side Buttons
    warningBtn.addEventListener('click', () => {
        warningCount++;
        warningCountEl.textContent = warningCount;

        if (warningCount >= 5) {
            warningCount = 0;
            warningCountEl.textContent = warningCount;
            
            // Reset the iPad timer
            countdownTime = 0;
            ipadTimerDisplay.textContent = '00:00:00';
        }
    });

    yellowCardBtn.addEventListener('click', () => {
        setCountdownTimer(12, true);
    });

    redCardBtn.addEventListener('click', () => {
        if (countdownTime > 0) {
            addTimeToTimer(24);
        } else {
            setCountdownTimer(24, true);
        }
    });

    // Start the timer when the page loads
    playTimer();
});
