import { useState, useEffect } from "react";

const useFetch = (url) => {
    const [data, setData] = useState([]);

  async function fetchData() {
    try {
      const response = await fetch(url);
      if(!response.ok){
        throw new Error(`Response error: ${response.status}`)
      }
      const result = await response.json();
      setData(result);
    }
    catch(error) {
      console.log(error)
    }

  }

  useEffect(()=> {
    fetchData();
  },[url])


  return data;
};

export default useFetch;