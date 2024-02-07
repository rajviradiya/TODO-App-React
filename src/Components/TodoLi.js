import moment from 'moment';
import React, { useEffect, useState } from 'react'

const TodoLi = ({ data2, filterfunc, childdata, EditedInput }) => {
    const [statee, setStatee] = useState(2)
    const [timers, setTimers] = useState([])


    useEffect(() => {
        startRunningTimersOnLoad();
        return () => {
            timers.forEach(timer => clearInterval(timer.timerInterval));
        };
    }, []);

    // //Timer IN lis
    function createTimer(timerId) {
        return {
            id: timerId,
            startTime: null,
            timerInterval: null,
            elapsedTime: 0,
        };
    }
    function startRunningTimersOnLoad() {
        let localData = JSON.parse(localStorage.getItem("localData"));
        if (localData) {
            localData.forEach((element) => {
                if (element.state == "2") {
                   const timer = createTimer(element.id);
                   timer.elapsedTime = element.elapsedTime || 0;
                   timer.startTime = element.starttime ? moment(element.starttime, "H:mm:ss") : null;
                   timer.timerInterval = setInterval(() => updateTimer(timer), 1000);
                   if (timer.startTime) {
                       setTimers(prevTimers => [...prevTimers, timer]);
                   }
                }
             });
        }
        filterfunc(localData)
    }

    function startTimer(timerid,localData) {
        let time = moment().format("H:mm:ss");
        localData.forEach((element) => {
            if (element.id == timerid) {
                element.starttime = time;
            }
        });
        localStorage.setItem("localData", JSON.stringify(localData));
        console.log(localData,"dataaaaa")
        let timer = timers.find(timer => timer.id === timerid);
        if (!timer) {
            timer = createTimer(timerid);
            setTimers(prevTimers => [...prevTimers, timer]);
        }
        if (!timer.startTime) {
            timer.startTime = moment();
            timer.timerInterval = setInterval(() => updateTimer(timer), 1000);
            setTimers(prevTimers => [...prevTimers, timer]);
        }
    }

    function updateTimer(timer) {
        let localData = JSON.parse(localStorage.getItem("localData"));
        if (localData) {
            const currentTime = moment();
            const duration = moment.duration(currentTime.diff(timer.startTime) + timer.elapsedTime, "milliseconds");
            const formattedTime = moment.utc(duration.asMilliseconds()).format("H:mm:ss");

            localData.forEach((element) => {
                if (element.id == timer.id) {
                    element.currentTime = formattedTime
                }
            });
            localStorage.setItem("localData", JSON.stringify(localData));
        }
        setTimers(prevTimers => prevTimers.map(t => t.id === timer.id ? timer : t));
        filterfunc(localData);
    }

    function stopTimer(timerid,localData) {
        let time = moment().format("H:mm:ss");
        localData.forEach((element) => {
           if (element.id == timerid) {
              element.endtime = time;
           }
        });
        localStorage.setItem("localData", JSON.stringify(localData));

        setTimers(prevTimers => {
            return prevTimers.map(timer => {
                if (timer.id === timerid) {
                    clearInterval(timer.timerInterval);
                    timer.elapsedTime += moment().diff(timer.startTime);
                    timer.startTime = null;
                }
                return timer;
            });
        });
        filterfunc(localData);
    }

    function resetTimer(timerid,localData) {
        const timerDataIndex = localData.findIndex(item => item.id === timerid);
        if (timerDataIndex !== -1) {
            localData[timerDataIndex].starttime = "0:00:00";
            localData[timerDataIndex].endtime = "0:00:00";
            localData[timerDataIndex].currentTime = "0:00:00";
            localStorage.setItem("localData", JSON.stringify(localData));
            filterfunc(localData);
        }
        setTimers(prevTimers => prevTimers.map(timer => {
            if (timer.id === timerid) {
                clearInterval(timer.timerInterval);
                return {
                    ...timer,
                    startTime: null,
                    elapsedTime: 0
                };
            }
            return timer;
        }));
    }

  

    // switch function 
    const switchElement = (element, ids) => {
        let localData = JSON.parse(localStorage.getItem("localData"));
        let value = parseInt(element.value, 10);
        if (value === 1) {
            value = 2
            startTimer(ids,localData);
        } else if (value === 2) {
            value = 3
            stopTimer(ids,localData);
        } else if (value === 3) {
            value = 1
            resetTimer(ids,localData);
        }
        element.value = value;
        const classList = ["tgl-on", "tgl-def", "tgl-off"];
        element.classList.remove(...classList);
        element.classList.add(classList[value - 1]);

        localData.forEach((data) => {
            if (data.id == element.dataset.id) {
                data.state = value.toString();
                data.color = element.className;
            }
        });
        localStorage.setItem("localData", JSON.stringify(localData));
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
