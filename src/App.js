import { Col, Container, Row } from 'react-bootstrap';
import './App.css';
import { useEffect, useState } from 'react';
import moment from 'moment';

function App() {
  const [localData, setLocaldata] = useState([])
  const [filteredData, setFilteredData] = useState(localData); //for filtr
  const [input, setInput] = useState("")//for input  
  const [state, setstate] = useState(1)//For edit Functionality
  const [EditInputt, setEditInputt] = useState("")
  const [editid, seteditid] = useState("")
  const [refreshKey, setRefreshKey] = useState(0);

  const [timers, setTimers] = useState([])
  const [active, setActive] = useState([])
  const [complited, setComplited] = useState([])
  const [statee,setStatee] = useState(1)

  useEffect(() => {
    startRunningTimersOnLoad();
    return () => {
      timers.forEach(timer => clearInterval(timer.timerInterval));
    };
  }, []);

  useEffect(() => {
    let localData = JSON.parse(localStorage.getItem("localData"))
    setLocaldata(localData)
    setFilteredData(localData)
  }, [refreshKey])

  //Input Handle
  const handelInput = (e) => {
    setInput(e.target.value)
  }
  // Set data to Localstorage
  const handleButtonClick = () => {
    let localData = JSON.parse(localStorage.getItem("localData"))
    if (localData) {
      if (input) {
        let maxid = localData.reduce((max, obj) => Math.max(max, obj.id), 0)
        const obj = {
          id: maxid + 1,
          state: "1",
          color: "tgl-on",
          starttime: "0:00:00",
          currentTime: "0:00:00",
          endtime: "0:00:00",
          strike: "",
          title: input
        }
        localData.push(obj)
        localStorage.setItem("localData", JSON.stringify(localData))
        setInput("")
        setFilteredData(localData)
      }
    } else {
      if (input) {
        let array = []
        let obj = {
          id: 1,
          state: "1",
          color: "tgl-on",
          starttime: "0:00:00",
          currentTime: "0:00:00",
          endtime: "0:00:00",
          strike: "",
          title: input
        }
        array.push(obj)
        localStorage.setItem("localData", JSON.stringify(array))
        setInput("")
        setFilteredData(array)
      }
    }
  }
  // Clear All
  const handleClearAll = () => {
    localStorage.clear()
    setFilteredData([]);
    setRefreshKey(prevKey => prevKey + 1);
    timers.forEach(timer => clearInterval(timer.timerInterval));
    setTimers([]);
  }
  //Data filter
  const handleFilter = (filterType) => {
    if (filterType === 'all') {
      let localData = JSON.parse(localStorage.getItem("localData"))
      setStatee(1)
      setFilteredData(localData);
    } else if (filterType === 'active') {
      let localData = JSON.parse(localStorage.getItem("localData"))
      const filterArray = localData.filter((data) => data.state === '2');
      setActive(filterArray);
      setStatee(2)
    } else if (filterType === 'completed') {
      let localData = JSON.parse(localStorage.getItem("localData"))
      const filterArray = localData.filter((data) => data.state === '3');
      setComplited(filterArray);
      setStatee(3)
    }
  };
  //Edit Input
  const EditInput = (element) => {
    setEditInputt(element)
  }
  //Edit Input Button
  const handleEditButton = () => {
    let localData = JSON.parse(localStorage.getItem("localData"));
    const updatedData = localData.map((items) => {
      if (items.id === editid) {
        items.title = EditInputt;
      }
      return items;
    });
    localStorage.setItem("localData", JSON.stringify(updatedData));
    setstate(1);
    seteditid("");
    setEditInputt("");
    setFilteredData(localData)
  };
  //Edit Li Button
  const handleEdit = (element, id) => {
    setEditInputt(element)
    setstate(2)
    seteditid(id)
  }

  //Delete Li
  const handeleDeleteLi = (id) => {
    const localData = JSON.parse(localStorage.getItem("localData")) || [];
    const updatedData = localData.filter(item => item.id !== id);
    localStorage.setItem("localData", JSON.stringify(updatedData));
    setFilteredData(updatedData);
  }

  //Timer IN lis
  function createTimer(timerId) {
    return {
      id: timerId,
      startTime: null,
      timerInterval: null,
      elapsedTime: 0,
    };
  }
  //ON relode timer
  function startRunningTimersOnLoad() {
    let localData = JSON.parse(localStorage.getItem("localData")) || [];
    const updatedTimers = [];

    localData.forEach((element) => {
      if (element.state === "2") {
        const timer = createTimer(element.id);
        timer.elapsedTime = element.elapsedTime || 0;
        timer.startTime = element.starttime ? moment(element.starttime, "H:mm:ss") : null;
        timer.timerInterval = setInterval(() => updateTimer(timer), 1000);
        if (timer.startTime) {
          updatedTimers.push(timer);
        }
      }
    });
    setTimers(updatedTimers);
  }
  //Start Timer
  function startTimer(timerid, localData) {
    let time = moment().format("H:mm:ss");
    const updatedData = localData.map(element => {
      if (element.id === timerid) {
        element.starttime = time;
      }
      return element;
    });
    localStorage.setItem("localData", JSON.stringify(updatedData));
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
  //Update Timer
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
    setFilteredData(prevData => {return localData;});  
  }
  // Stop TImer
  function stopTimer(timerid, localData) {
    let time = moment().format("H:mm:ss");
    const updatedData = localData.map(element => {
      if (element.id === timerid) {
        element.endtime = time;
      }
      return element;
    });
    localStorage.setItem("localData", JSON.stringify(updatedData));
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
    setFilteredData(updatedData);
  }
  //Reset Timer
  function resetTimer(timerid, localData) {
    const updatedData = localData.map(item => {
      if (item.id === timerid) {
        item.starttime = "0:00:00";
        item.endtime = "0:00:00";
        item.currentTime = "0:00:00";
      }
      return item;
    });
    localStorage.setItem("localData", JSON.stringify(updatedData));
    setFilteredData(updatedData);
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
    setFilteredData(localData);
  }
  // switch function 
  const switchElement = (element, ids) => {
    let localData = JSON.parse(localStorage.getItem("localData"));
    let value = parseInt(element.value, 10);
    if (value === 1) {
      value = 2
      startTimer(ids, localData);
    } else if (value === 2) {
      value = 3
      stopTimer(ids, localData);
    } else if (value === 3) {
      value = 1
      resetTimer(ids, localData);
    }
    element.value = value;
    const classList = ["tgl-on", "tgl-def", "tgl-off"];
    element.classList.remove(...classList);
    element.classList.add(classList[value - 1]);
    //set data to localstorage
    localData.forEach((data) => {
      if (data.id == element.dataset.id) {
        data.state = value.toString();
        data.color = element.className;
        if (data.state == 2) {
          data.strike = "strike"
        } else {
          data.strike = "non-strike"
        }
      }
    });
    localStorage.setItem("localData", JSON.stringify(localData));
    setFilteredData(localData);
  }

  return (
    <>
      <Container fluid className="p-0">
        <Col className="App">
          {/* TODO Background Image */}
          <Row className="head"></Row>
          {/* TODO Space */}
          <Row className="body2">
            <Col className="todo">
              {/* TODO Head */}
              <Row className="todo-title">
                <p>T O D O</p>
                <i className="fa-solid fa-moon"></i>
              </Row>
              {/*TODO Input*/}
              {
                state == 1 ? (<Row className="todo-inpput">
                  <input type="text" id="input1" placeholder="Enter Title" value={input} onChange={(e) => { handelInput(e) }} />
                  <input id="txtId" type="hidden" className="form-control txt" />
                  <button type="button" className="btn btn-danger" onClick={() => { handleButtonClick() }}>
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </Row>) :
                  (<Row className="todo-inpput">
                    <input type="text" id="input1" placeholder="Enter Title" value={EditInputt} onChange={(e) => { EditInput(e.target.value) }} />
                    <input id="txtId" type="hidden" className="form-control txt" />
                    <button type="button" className="btn btn-danger" onClick={() => { handleEditButton() }}>
                      <i class="fa-solid fa-user-pen"></i>
                    </button>
                  </Row>)
              }
              {/*TODO Body*/}
              <Row className="todo-body">
                <Container fluid className="">
                  <Col className="p-0">
                    {/* TODO UL */}
                    <Row className="m-1 ">
                      <ul className="todo-li" >
                        {Array.isArray(filteredData) ? (
                          (statee == 1?filteredData:(statee == 2?active:complited)).map((element, index) => (
                            <li key={index} id={element.id}>
                              <div className="wrapper">
                                <input type="range" name="points" data-id={element.id} min="1" step="1" id="custom-toggle" className={element.color} max="3" value={element.state} onClick={(e) => { switchElement(e.target, element.id) }} />
                              </div>
                              <div className="lable1">
                                <label className={`${element.strike} titleLable overflow-hidden`} >{element.title}</label>
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
                      {/* <TodoLi data2={filteredData} filterfunc={setFilteredData} childdata={EditInput} EditedInput={EditInputt} /> */}

                    </Row>
                    {/* TODO Footer*/}
                    <hr className="m-1" />
                    <Row className="m-1 todo-footer">
                      <div className="items">
                        <h6>Items</h6>
                      </div>
                      <div className="btn-group">
                        <button className="bt btn1" aria-current="page" onClick={() => { handleFilter("all") }}>All</button>
                        <button className="bt btn2" onClick={() => { handleFilter("active") }}>Active</button>
                        <button className="bt btn3" onClick={() => { handleFilter("completed") }}>Completed</button>
                      </div>
                      <button className="clear" onClick={() => { handleClearAll() }}>Clear All</button>
                    </Row>
                  </Col>
                </Container>
              </Row>
            </Col>
          </Row>
        </Col>
      </Container>
    </>
  );
}

export default App;
