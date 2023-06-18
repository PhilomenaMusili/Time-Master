function App() {
    const [displayTime, setDisplayTime] = React.useState(25 * 60);
    const [breakTime, setBreakTime] = React.useState(5 * 60);
    const [sessionTime, setSessionTime] = React.useState(25 * 60);
    const [timerOn, setTimerOn] = React.useState(false);
    const [onBreak, setOnBreak] = React.useState(false);
    const [breakAudio, setBreakAudio] = React.useState(new Audio("./breaktime.mp3"));

    const playBreakSound = () => {
        breakAudio.currentTime = 0;
        breakAudio.play();
    };

    const formatTime = (time) => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        return (
            (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
        );
    };

    const changeTime = (amount, type) => {
        if (type === "break") {
            if (breakTime <= 60 && amount < 0) {
                return;
            }
            setBreakTime((prev) => prev + amount);
        } else {
            if (sessionTime <= 60 && amount < 0) {
                return;
            }
            setSessionTime((prev) => prev + amount);
            if (!timerOn) {
                setDisplayTime(sessionTime + amount);
            }
        }
    };

    const controlTime = () => {
        let second = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + second;
        let onBreakVariable = onBreak;

        if (!timerOn) {
            let interval = setInterval(() => {
                date = new Date().getTime();
                if (date > nextDate) {
                    setDisplayTime((prev) => {
                        if (prev <= 0 && !onBreakVariable) {
                            playBreakSound();
                            onBreakVariable = true;
                            setOnBreak(true);
                            return breakTime;
                        } else if (prev <= 0 && onBreakVariable) {
                            playBreakSound();
                            onBreakVariable = false;
                            setOnBreak(false);
                            return breakTime;
                        }
                        return prev - 1;
                    });
                    nextDate += second;
                }
            }, 30);
            localStorage.clear();
            localStorage.setItem("interval-id", interval);
        }
        if (timerOn) {
            clearInterval(localStorage.getItem("interval-id"));
        }
        setTimerOn(!timerOn);
    };

    const resetTime = () => {
        setDisplayTime(25 * 60);
        setBreakTime(5 * 60);
        setSessionTime(25 * 60);
    };

    return (
        <div>
            <div className="center-align container">
            <h3>25+5 Clock</h3>
            <div className="dual-container">
                <Length title={"break length"} changeTime={changeTime} type={"break"} time={breakTime} formatTime={formatTime} />
                <Length title={"session length"} changeTime={changeTime} type={"session"} time={sessionTime} formatTime={formatTime} />
            </div>
            <h5>{onBreak ? "Break" : "Session"}</h5>
            <h4>{formatTime(displayTime)}</h4>
            <button className="btn-large deep-blue lighten-2" onClick={controlTime}>
                {timerOn ? (
                    <i className="material-icons">paused_circle_filled</i>
                ) : (
                    <i className="material-icons">play_circle_filled</i>
                )}
            </button>
            <button className="btn-large deep-blue lighten-2" onClick={resetTime}>
                <i className="material-icons">autorenew</i>
            </button>
            </div>
            <h4 className="author">By Philomena Kyalo</h4>
        </div>
        
    );
}

function Length({ title, changeTime, type, time, formatTime }) {
    return (
        <div>
            <h5>{title}</h5>
            <div className="time-sets">
                <button className="btn-small deep-blue lighten-2 downarrow-button" onClick={() => changeTime(-60, type)}>
                    <i className="material-icons">arrow_downward</i>
                </button>
                <h5>{formatTime(time)}</h5>
                <button className="btn-small deep-blue lighten-2 uparrow-button" onClick={() => changeTime(60, type)}>
                    <i className="material-icons">arrow_upward</i>
                </button>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
