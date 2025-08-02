document.addEventListener('DOMContentLoaded', () => {
    // --- State variables to keep track of counts and timers ---
    let greenCircleCount = 0;
    let warningCount = 0;
    let ipadHours = 0;
    let timerInterval = null;
    let timerEndTime = null;
    let isPaused = false;
    let remainingTime = 0;

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
    function updateIpadTimerDisplay() {
        if (timerInterval) {
            // Do not update the hours if a countdown timer is active
            return;
        }
        const hours = String(Math.floor(ipadHours)).padStart(2, '0');
        ipadTimerDisplay.textContent = `${hours}:00:00`;
    }

    function updateCardTimerDisplay() {
        if (timerEndTime) {
            const now = new Date().getTime();
            let distance = timerEndTime - now;

            if (isPaused) {
                distance = remainingTime;
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            ipadTimerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            if (distance < 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                noIpadPopup.style.display = 'none'; // Hide pop-up
                ipadTimerDisplay.textContent = "Timer Expired!";
            }
        }
    }

    function startCountdownTimer(hours) {
        clearInterval(timerInterval);
        isPaused = false;
        timerEndTime = new Date().getTime() + (hours * 60 * 60 * 1000);
        timerInterval = setInterval(updateCardTimerDisplay, 1000);
        noIpadPopup.style.display = 'block'; // Show pop-up
    }

    function pauseCountdownTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            remainingTime = timerEndTime - new Date().getTime();
            isPaused = true;
        }
    }

    function playCountdownTimer() {
        if (isPaused) {
            timerEndTime = new Date().getTime() + remainingTime;
            timerInterval = setInterval(updateCardTimerDisplay, 1000);
            isPaused = false;
        }
    }

    // --- Event Listeners for all the buttons ---

    // Left Side Buttons
    greenCircleBtn.addEventListener('click', () => {
        if (timerInterval) return; // Do nothing if a countdown is running
        greenCircleCount++;
        greenCircleCountEl.textContent = greenCircleCount;

        if (greenCircleCount >= 5) {
            greenCircleCount = 0;
            greenCircleCountEl.textContent = greenCircleCount;
            ipadHours++;
            updateIpadTimerDisplay();
        }
    });

    greenCardBtn.addEventListener('click', () => {
        if (timerInterval) return; // Do nothing if a countdown is running
        // The prompt did not specify what this button does. Add logic here if you want.
        console.log("Green card button clicked!");
    });

    // Middle Buttons
    resetBtn.addEventListener('click', () => {
        // Reset all counts and timers
        ipadHours = 0;
        greenCircleCount = 0;
        warningCount = 0;
        clearInterval(timerInterval);
        timerInterval = null;
        timerEndTime = null;
        isPaused = false;
        remainingTime = 0;

        greenCircleCountEl.textContent = greenCircleCount;
        warningCountEl.textContent = warningCount;
        updateIpadTimerDisplay();
        noIpadPopup.style.display = 'none'; // Hide pop-up
    });

    newDayBtn.addEventListener('click', () => {
        if (timerInterval) return; // Do nothing if a countdown is running
        ipadHours += 3;
        updateIpadTimerDisplay();
    });

    pauseBtn.addEventListener('click', () => {
        pauseCountdownTimer();
    });

    playBtn.addEventListener('click', () => {
        playCountdownTimer();
    });

    // Right Side Buttons
    warningBtn.addEventListener('click', () => {
        if (timerInterval) return; // Do nothing if a countdown is running
        warningCount++;
        warningCountEl.textContent = warningCount;

        if (warningCount >= 5) {
            warningCount = 0;
            warningCountEl.textContent = warningCount;

            // Reset the iPad timer
            ipadHours = 0;
            updateIpadTimerDisplay();
        }
    });

    yellowCardBtn.addEventListener('click', () => {
        // Reset iPad timer to 0 and start 12-hour countdown
        ipadHours = 0;
        updateIpadTimerDisplay(); // Clears the hours display
        startCountdownTimer(12);
    });

    redCardBtn.addEventListener('click', () => {
        const hoursToAdd = 24;
        if (timerInterval) {
            // If a countdown is already running, add 24 hours
            timerEndTime += (hoursToAdd * 60 * 60 * 1000);
            isPaused = false;
        } else {
            // If no countdown is running, start a new 24-hour countdown
            ipadHours = 0;
            updateIpadTimerDisplay(); // Clears the hours display
            startCountdownTimer(hoursToAdd);
        }
    });
});
