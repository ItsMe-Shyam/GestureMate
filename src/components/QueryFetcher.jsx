import axios from "axios"
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import { FaHandSparkles } from "react-icons/fa";

function QueryFetcher() {
  const API_KEY = process.env.REACT_APP_API_KEY;

  const [query, setQuery] = useState("");  // State to store the fetched query
  const [responses, setResponses] = useState([]); // Array to store responses
  const [loading,setLoading] = useState(false); // Loading variable to detact the action state of appication
  const responseEndRef = useRef(null); // Reference to the bottom of the responses


  // Function to fetch the query from Flask API=================================================
  async function fetchQuery(){
    try {
      const res = await fetch('/get-query');
      console.log("Call to Flask-API")
      console.log(res)
      const data = await res.json();
      console.log(data)
      setQuery(data.query);  // Store the query in the useState variable
    } catch (error) {
      console.error("Error fetching the query:", error);
    }
  };

  
    
    
  // Function to fetch the answer from Gemini API=================================================
  async function generateAnswer(){
    console.log("Query: ")
    console.log(query)
    if(query!==""){
      setLoading(true);
      try{
        console.log("Call to Gemini-API...")
        const res = await axios({
          method: "post",
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
          // url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDmwtQrvqEEWJmSrs0eRbtJQuQiiGFGeFo",
          data: {
            "contents":[
              {"parts":[{"text":query}]}
            ]
          }
        })
  
        console.log(res);
        const newResponse =res.data.candidates[0].content.parts[0].text;
        setResponses((prevResponses) => [...prevResponses, newResponse]);
        
      }catch(err){
        console.log(`Error in axios POST request:\n ${err}`)
      }
      setQuery("");
      setLoading(false);
      console.log("finish...")
    }
  }

   // Use `useEffect` to Scroll to the bottom whenever a new response is added
   useEffect(() => {
    if (responseEndRef.current) {
      responseEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [responses]);
  
  function onChangeHandler(event){
  setQuery(event.target.value);
  }

  return (
    <div className='min-h-screen flex flex-col gap-6 items-center justify-end pb-16'>
      <h1 className="text-3xl text-center p-10 font-bold">
      AI Chat Bot
      </h1>

      {/* Responses Container */}
        <div className="flex flex-col gap-2 px-2 sm:px-16 w-full ">
          {responses.map((response, index) => (
            <div key={index} className="w-full  p-2 border-gray-700 border-2 rounded-md">
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          ))}
        </div>

      {/* Input Bottom Bar */}
      <div className="w-full flex gap-4 px-2 py-2 sm:px justify-center items-center bg-slate-300 border-t-2 border-black fixed bottom-0">
        
        {/* Taking Query From Hand Gestures using flask API */}
        <button onClick={fetchQuery} 
          className="font-semibold text-yellow-500 flex gap-2 bg-black hover:bg-slate-900 rounded-full items-center p-2   "
          >
          <FaHandSparkles className="text-2xl" />
          <span className="hidden md:block">Use Hand-Gesture</span>
        </button>

        {/* Taking Query Input From User in text fromat */}
        <input type="text" placeholder="Ask any Question!" value={query} onChange={onChangeHandler}
          className="p-2 border-2 border-black rounded-md  bg-transparent flex-grow"/>

        {/* Button to call function-> make Gemini-API request for response */}
        <button
          onClick={() => {
            if (!loading) {
              generateAnswer(query);
            }
          }}
          className={`font-semibold text-yellow-500 flex gap-2 ${ loading ? "bg-slate-600" : "bg-black hover:bg-slate-900" }  rounded-full items-center py-2 px-4`}        >
          Generate
        </button>
      </div>

      {/* Ref to scroll to the end */}
      <div ref={responseEndRef}></div>
           
    </div>
  );
}

export default QueryFetcher;
