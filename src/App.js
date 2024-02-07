import { Col, Container, Row } from 'react-bootstrap';
import './App.css';
import { useEffect, useState } from 'react';
import TodoLi from './Components/TodoLi';
import Timerdemo from './Timerdemo';

function App() {
  let [localData,setLocaldata] = useState([])
  let [filteredData, setFilteredData] = useState(localData); //for filtr

  let [input, setInput] = useState("")//for input  
  let [state, setstate] = useState(1)
  let [EditInputt, setEditInputt] = useState("")
  let [editid, seteditid] = useState("")

  useEffect(()=>{
    let localData = JSON.parse(localStorage.getItem("localData"))
    setLocaldata(localData)
    setFilteredData(localData)
  },[])

  const handelInput = (e) => {
    setInput(e.target.value)
  }

  // Set data to Localstorage
  const handleButtonClick = () => {
    let localData = JSON.parse(localStorage.getItem("localData"))
    if (localData ) {
      if(input){
      let maxid = localData.reduce((max, obj) => Math.max(max, obj.id), 0)
      const obj = {
        id: maxid + 1,
        state: "1",
        color: "tgl-on",
        starttime: "0:00:00",
        currentTime: "0:00:00",
        endtime: "0:00:00",
        title: input
      }
      localData.push(obj)
      localStorage.setItem("localData", JSON.stringify(localData))
      setInput("")
      setFilteredData(localData)
      }
    } else {
      if(input){
      let array = []
      let obj = {
        id: 1,
        state: "1",
        color: "tgl-on",
        starttime: "0:00:00",
        currentTime: "0:00:00",
        endtime: "0:00:00",
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
    localStorage.removeItem("localData");
    setFilteredData([]);
    window.location.reload()
  }

  //Data filter
  const handleFilter = (filterType) => {
    if(filterType === 'all') {
      loadDataFromLocal();
    } else if (filterType === 'active') {
      filterActive();
    } else if (filterType === 'completed') {
      filterCompleted();
    }
  };

  const loadDataFromLocal = () => {
    let localData = JSON.parse(localStorage.getItem("localData"))
    setFilteredData(localData);
  };
  const filterActive = () => {
    let localData = JSON.parse(localStorage.getItem("localData"))
    const filterArray = localData.filter((data) => data.state === '2');
    setFilteredData(filterArray);
  };

  const filterCompleted = () => {
    let localData = JSON.parse(localStorage.getItem("localData"))
    const filterArray = localData.filter((data) => data.state === '3');
    setFilteredData(filterArray);
  };

  //Edit Input
  const EditInput = (childdata, id, statee) => {
    setEditInputt(childdata)
    setstate(statee)
    seteditid(id)
  }

  const handleEditButton = () => {
    let localData = JSON.parse(localStorage.getItem("localData"));
    localData.forEach((items) => {
      if (items.id === editid) {
        items.title = EditInputt;
      }
    });
    localStorage.setItem("localData", JSON.stringify(localData));
    setstate(1);
    seteditid("");
    setEditInputt("");
    setFilteredData(localData)
  };

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
                  <input type="text" id="input1" placeholder="Enter Title" value={EditInputt} onChange={(e) => { EditInput(e.target.value, editid, 2) }} />
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
                    <TodoLi data2={filteredData} filterfunc={setFilteredData} childdata={EditInput} EditedInput={EditInputt} />
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
    <Timerdemo/>
    </>
  );
}

export default App;
