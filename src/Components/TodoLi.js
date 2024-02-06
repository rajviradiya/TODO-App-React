import moment from 'moment/moment';
import React, { useEffect, useState } from 'react'

const TodoLi = ({ data2, filterfunc, childdata, EditedInput }) => {
    const [statee, setStatee] = useState(2)
    const [state, setState] = useState(1)
    const [timers, setTimers] = useState([]);

    console.log(timers, "timers")

    useEffect(() => {
        startRunningTimersOnLoad();
        console.log("data locald onload")
        }, []);

    //Timer IN lis
    function createTimer(timerId) {
        return {
            id: timerId,
            startTime: null,
            timerInterval: null,
            elapsedTime: 0,
        };
    }

    function startRunningTimersOnLoad() {
        let localData = JSON.parse(localStorage.getItem("localData"))
        const newTimers = localData.filter(element => element.state === "2")
        newTimers.map(element => {
            const timer = createTimer(element.id);
            timer.elapsedTime = element.elapsedTime || 0;
            timer.startTime = element.starttime ? moment(element.starttime, "H:mm:ss") : null;
            timer.timerInterval = setInterval(() => updateTimer(timer), 1000);
            return timer;
        });
        setTimers(newTimers);
    }

    function startTimer(timerid) {
        const localData = JSON.parse(localStorage.getItem("localData"))
        const time = moment().format("H:mm:ss");
        localData.forEach((element) => {
            if (element.id == timerid) {
                element.starttime = time;
            }
        });
        localStorage.setItem("localData", JSON.stringify(localData));
        const timer = timers.find(timer => timer.id == timerid);
        if (timer && !timer.startTime) {
            timer.startTime = moment();
            timer.timerInterval = setInterval(() => updateTimer(timer), 1000);
        } else {
            console.error("Timer not found with id:", timerid);
        }
        filterfunc(localData);
    }

    function updateTimer(timer) {
        let localData = JSON.parse(localStorage.getItem("localData"));
        const currentTime = moment();
        const duration = moment.duration(currentTime.diff(timer.startTime) + timer.elapsedTime, "milliseconds");
        const formattedTime = moment.utc(duration.asMilliseconds()).format("H:mm:ss");
        
        localData.forEach((element) => {
            if (element.id == timer.id) {
               element.currentTime = formattedTime
            }
         });
         localStorage.setItem("localData", JSON.stringify(localData));
        filterfunc(localData)
    }

    // function stopTimer(timerid) {
    //     const localData = JSON.parse(localStorage.getItem("localData"));
    //     const time = moment().format("h:mm:ss");
    //     localData.forEach((element) => {
    //         if (element.id == timerid) {
    //            element.endtime = time;
    //         }
    //      });
    //      localStorage.setItem("localData", JSON.stringify(localData));
    //     const timer = timers.find(timer => timer.id == timerid);
    //     if (timer.startTime) {
    //         clearInterval(timer.timerInterval);
    //         timer.elapsedTime += moment().diff(timer.startTime);
    //         timer.startTime = null;
    //      }
    //     filterfunc(localData)
    // }

    // function resetTimer(timerid) {
    //     const timer = timers.find(timer => timer.id == timerid);
    //     clearInterval(timer.timerInterval);
    //     timer.startTime = null;
    //     timer.elapsedTime = 0;
    //     const localData = JSON.parse(localStorage.getItem("localData"))
    //     localData.forEach((element) => {
    //         if (element.id == timerid) {
    //            element.starttime = "0:00:00";
    //            element.endtime = "0:00:00";
    //            element.currentTime = "0:00:00";
    //         }
    //      });
    //      localStorage.setItem("localData", JSON.stringify(localData));
    // }




    // switch function 
    const switchElement = (element, ids) => {
        let localData = JSON.parse(localStorage.getItem("localData"));
        let value = parseInt(element.value, 10);
        if (state === 1) {
            setState(2);
            startTimer(ids)
        } else if (state === 2) {
            setState(3);
            // stopTimer(ids)
        } else if (state === 3) {
            setState(1);
            // resetTimer(ids)
        } else {
            setState(1);
            // resetTimer(ids)
        }
        element.value = state;
        const classList = ["tgl-on", "tgl-def", "tgl-off"];
        element.classList.remove(...classList);
        element.classList.add(classList[state - 1]);

        localData.forEach((data) => {
            if (data.id == element.dataset.id) {
                data.state = element.value;
                data.color = element.className;
            }
            localStorage.setItem("localData", JSON.stringify(localData));
        });
        filterfunc(localData)
    }
    //Edit Title
    const handleEdit = (element, id) => {
        childdata(element, id, statee)
    }

    //Delete Li
    const handeleDeleteLi = (id) => {
        const localData = JSON.parse(localStorage.getItem("localData")) || [];
        const updatedData = localData.filter(item => item.id !== id);
        localStorage.setItem("localData", JSON.stringify(updatedData));
        filterfunc(updatedData);
    }

    return (
        <ul className="todo-li" >
            {Array.isArray(data2) ? (
                (data2).map((element, index) => (
                    <li key={index} id={element.id}>
                        <div className="wrapper">
                            <input type="range" name="points" data-id={element.id} min="1" step="1" id="custom-toggle" className={element.color} max="3" value={element.state} onClick={(e) => { switchElement(e.target, element.id) }} />
                        </div>
                        <div className="lable1">
                            <label className="titleLable overflow-hidden" >{element.title}</label>
                        </div>
                        <div className="timer">
                            <div className="time" id={`timer${element.id}`} data-timer={element.id}>{element.currentTime}</div>
                        </div>
                        <div className="f-button">
                            <button className="editBtn"><i className="fa-solid fa-pen-to-square" onClick={() => { handleEdit(element.title, element.id) }}></i></button>
                            <button className="deleteBtn"><i className="fa-solid fa-trash" onClick={() => { handeleDeleteLi(element.id) }}></i></button>
                        </div>
                    </li>
                )
                )) : (<h5 className=' text-center'>Array is Empty</h5>)
            }
        </ul>

    )
}

export default TodoLi
