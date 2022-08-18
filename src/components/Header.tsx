    import styles  from '../styles/Header.module.css';
    import { useCookies } from "react-cookie";


    export default function Header(){
        const [cookies, setCookie] = useCookies(["user_id","email","profile_image","name","background_image", "token"]);

        function logout(){
            setCookie("user_id", "", { maxAge: 3600 * 24 });
            setCookie("email", "", { maxAge: 3600 * 24 });
            setCookie("name", "", { maxAge: 3600 * 24 });
            setCookie("token", "", { maxAge: 3600 * 24 });
            setCookie("profile_image", "", { maxAge: 3600 * 24 });
            setCookie("background_image", "", { maxAge: 3600 * 24 });
            window.location.reload()
        }
                return(
            <div>
                 <header className={styles.header}>
            <h1>logo</h1>
            <div>
              <ul>
              <li> <a href="/"> Home</a></li>
              <li><a href="/chat"> Chat</a></li>
              <li><a href="/contatos">Contatos</a></li>
              <li><a href="social">Rede social</a></li>
              </ul>
              </div>
            <div>{cookies.name.split(" ",1 ) || 'faze login'}&nbsp;<img onClick={()=>{logout()}} src="https://img.icons8.com/fluency-systems-regular/20/000000/exit.png"/></div>
          </header>
            </div>
        )
    }