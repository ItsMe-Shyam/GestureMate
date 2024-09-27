import axios from "axios"
import { useState } from "react"
import ReactMarkdown from 'react-markdown';

function QueryFetcher() {
  const API_KEY = process.env.REACT_APP_API_KEY;

  const [query, setQuery] = useState("");  // State to store the fetched query
  const [res,setRes]=useState("Response will display here");


    // Function to fetch the query from Flask API=================================================
    async function fetchQuery(){
      try {
        const response = await fetch('/get-query');
        console.log(response)
        const data = await response.json();
        console.log(data)
        setQuery(data.query);  // Store the query in the useState variable
      } catch (error) {
        console.error("Error fetching the query:", error);
      }
    };
    
    
    // Function to fetch the answer from Gemini API=================================================
    async function generateAnswer(){
      console.log(query)
      console.log(API_KEY)
      if(query!==""){
        try{
          console.log("calling API...")
          const responce = await axios({
            method: "post",
            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
            data: {
              "contents":[
                {"parts":[{"text":query}]}
              ]
            }
          })
    
          console.log(responce);
          setRes(responce.data.candidates[0].content.parts[0].text);
          setQuery("");
        }catch(err){
          console.log(`Error in axios POST request:\n ${err}`)
        }
        console.log("finish...")
      }
   }
  
   function onChangeHandler(event){
    setQuery(event.target.value);
   }

  return (
    <div className='min-h-screen flex flex-col gap-6 items-center justify-center'>
      <h1 className="text-3xl text-center p-10 font-bold">
      AI Chat Bot
      </h1>

     {/* Taking Query From Hand Gestures using flask API */}
      <h1>Query from Flask:</h1>
      <button className='text-center py-1 px-4 border-2 border-black m-2 rounded-full'
      onClick={fetchQuery}
      >Get Query</button>

      <input type="text" placeholder="Ask any Question!" value={query} onChange={onChangeHandler}
        className="p-2 border-2 border-black rounded-md w-11/12 bg-transparent"/>
      <button className="border rounded-full px-10 py-2 border-black text-xl hover:text-white hover:bg-slate-900"
        onClick={generateAnswer}
      >Generate</button>
      
      <div className="p-4 m-2 border border-black rounded-md w-11/12">
        <ReactMarkdown>{res}</ReactMarkdown>
      </div>

      
    </div>
  );
}

export default QueryFetcher;
