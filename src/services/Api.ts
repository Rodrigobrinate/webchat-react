import axios from "axios";


let Api
export default  Api = axios.create({ 
      //  baseURL: "http://localhost:3001",
        //baseURL: "https://chat-in-realitime.herokuapp.com"
        baseURL: import.meta.env.VITE_API_HOST
      });