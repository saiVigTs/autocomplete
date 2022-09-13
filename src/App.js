
import { useEffect, useRef, useState} from 'react'
import {BiSearchAlt2} from 'react-icons/bi'
import Dropdown from 'react-bootstrap/Dropdown';
import TsLogo from './ThoughtSpot_logo_2019.png'

// ================================= Mock Server Start =============================
var FAILURE_COEFF = 10;
var MAX_SERVER_LATENCY = 200;

function getRandomBool(n) {
  var maxRandomCoeff = 1000;
  if (n > maxRandomCoeff) n = maxRandomCoeff;
  return Math.floor(Math.random() * maxRandomCoeff) % n === 0;
}

function getSuggestions(text) {
  var pre = 'pre';
  var post = 'post';
  var results = [];
  if (getRandomBool(2)) {
    results.push(pre + text);
  }
  if (getRandomBool(2)) {
    results.push(text);
  }
  if (getRandomBool(2)) {
    results.push(text + post);
  }
  if (getRandomBool(2)) {
    results.push(pre + text + post);
  }
  return new Promise((resolve, reject) => {
    var randomTimeout = Math.random() * MAX_SERVER_LATENCY;
    setTimeout(() => {
      if (getRandomBool(FAILURE_COEFF)) {
        reject();
      } else {
        resolve(results);
      }
    }, randomTimeout);
  });
}
// ================================= Mock Server End =============================

function App() {

  const ref = useRef(null)

  const [inputText, setInputText] = useState('')
  const [data, setData] = useState([])
  const [subString, setSubString] = useState('')
  const [idx, setIdx] = useState(-1)
  const [vis, setVis] = useState(document.activeElement === ref.current)
  const KEY_CODE_UP = 38
  const KEY_CODE_DOWN = 40
  const opts = {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({text:'smaple' })
  }


  useEffect(() => {
    setSubString(inputText.slice(inputText.lastIndexOf(' ') +1))
    // console.log("SUbstring", subString)

  }, [inputText])

  // useEffect(() => {
  //   getSuggestions(subString)
  //   .then((response) => setData(response))
  //   .catch((e) => {
  //     console.log(e)
  //     setData([])
  //   })
  // }, [subString])


  // //I thoght that mock server was an API
  useEffect(() => {
    fetch('https://api.datamuse.com/sug?s=' + subString + '&max=5')
    .then(response => response.json())
    .then(response => {
      const apiData = response.map((ele) => {
        return ele.word
      })
      setData(apiData)
      // console.log(apiData)
    })
    .catch(err => {console.error(err)
    setData([])});
  }, [subString]);

  const handleSelect = (e) => {
    // console.log("Selected item: ", e)
    const firstPart = inputText.slice(0, inputText.lastIndexOf(' ')+1)
    const newString = firstPart + e + " "
    setInputText(newString)
    ref.current.focus()
    // console.log(document.activeElement, "Active element")
    // console.log(ref.current, "Ref.current")



  }

  const onKeyDown = (e) => {
    // console.log("Key presse is ", e)
    if (e.keyCode === KEY_CODE_DOWN || e.keyCode === KEY_CODE_UP) {
      // console.log("Navigation jey preswed is", e.keyCode)
      const suggestions  = data
      const selectedIdxMax = data.length - 1;

      setIdx(idx + (e.keyCode === KEY_CODE_DOWN ? 1 : -1))
      console.log(idx)
      const firstPart = inputText.slice(0, inputText.lastIndexOf(' ')+1)
      const lastPart = inputText.slice(inputText.lastIndexOf(' ') +1)
      
      if (idx > selectedIdxMax) {
        setIdx(-1)
        setInputText(firstPart)
      } else if (idx < -1) {
        setIdx(selectedIdxMax)
      }

      if (idx > -1) {
        setInputText(firstPart + suggestions[idx] + ' ')
        setSubString(lastPart)
      }
    }
  }


  return (
    <div className="flex h-screen" onClick={() => {
      setVis(document.activeElement === ref.current)
      // console.log(vis, "Vis")
    }}>
      <div className='m-auto w-1/2'
      onKeyDown={evt => onKeyDown(evt)}
      >
        <img src={TsLogo} className="w-7/8 pl-5 pb-3"/>
      <div className = "p-1 w-full flex m-auto relative">
      <BiSearchAlt2 className="absolute mr-2 mt-1.5 ml-1"/>
        <input 
        ref = {ref}
        onChange={(e) => {
          setInputText(e.target.value)
          // console.log("Input text vaariable", inputText)
        }} 
        className = "w-full pl-5 border-2 border-solid border-black rounded" 
        type={"text"} 
        placeholder = {"Start typing to see suggestions..."}
        value = {inputText}/>
      </div>
        {
          vis && (
            <div className='w-full'>
              <Dropdown onSelect = {handleSelect}>
      
            {
            data.map((ele) => {
              // console.log(currInd, "CurrInd")
              return (
                <div 
                className = {'flex flex-row w-full rounded bg-white-0 hover:bg-sky-100'}>
                <Dropdown.Item 
                eventKey={ele} 
                className={"flex-1 pl-7 pb-1 " + (subString == ele ? "font-bold text-pink-400 ": "") + (data[idx] == ele ? "bg-sky-100 rounded border border-l-red-700" : " ")}
                >{ele + "\n" }</Dropdown.Item>
              </div>
              )

            })}
          </Dropdown>
          </div>

          )  
      }
      </div>
    </div>
  );
}

export default App
