import React, { useState } from "react";

import "./App.css";
import Axios from "axios";

function App() {
  const [name, setName] = useState();
  const [file, setFile] = useState();
  const [img, setimg] = useState([]);
  let temp= [];



  const send = event => {
    const data = new FormData();
    data.append("name", name);
    data.append("file", file);
    Axios.post("http://localhost:9000/upload", data)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };
  function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer.data );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }
  const get=()=>{
    Axios.get("http://localhost:9000/get")
      .then(res=>{
        const base64Flag = 'data:image/jpeg;base64,';
        console.log(res.data.length);
        for(let i=0;i<res.data.length;i++){
          const imageStr = _arrayBufferToBase64(res.data[i].img.data);
          temp.push(imageStr);
        }
        setimg(temp);
      })
  }
  return (
    < div className="App">
      <header className="App-header">
        <form action="#">
          <div className="flex">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              onChange={event => {
                const { value } = event.target;
                setName(value);
              }}
            />
          </div>
          <div className="flex">
            <label htmlFor="file">File</label>
            <input
              type="file"
              id="file"
              accept=".jpg"
              onChange={event => {
                const file = event.target.files[0];
                setFile(file);
              }}
            />
          </div>
        </form>
        <button onClick={send}>Send</button>
      </header>
      <button onClick={get}>get</button>
      {img.map((im,i)=><img src={`data:image/jpg;base64,${img[i]}` } alt='hmm'  style={{'width':'100px'}}/>)}
      
    </div>
  );
}

export default App;