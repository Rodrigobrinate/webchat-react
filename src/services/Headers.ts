import { useCookies } from "react-cookie";

 

 export default function Headers(){
const [cookies, setCookie] = useCookies(["token","user_id",]);



return  {
  headers: {
      "Content-Type": "application/json",
      "x-access-token": cookies.token,
  }
  };


}