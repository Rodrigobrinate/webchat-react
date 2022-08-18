import { useState } from 'react'
import styles from '../styles/Login.module.css'
import api from '../services/Api'
import { useCookies } from "react-cookie";
import Error from '../services/Error';
import Alert from "../components/Alert";
import AlertContext from '../context/AlertContext';


export default function register(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [cookies, setCookie] = useCookies(["user_id","email","password", "token"]);
    const [error, setError] = useState('')
    const [alert , setAlert] = useState([]) as any;

   

    const handleSubmit = (e: any) => {
        e.preventDefault()

        api.post('/user/Register', {
            name,
            email,
            password
        }).then(res => {
            window.location.href = '/Login'
        }
        ).catch(err => {
            console.log(err)
            setError(err.response.data.message)
            setAlert(<Alert text={err.response.data.message} title={'não foi possivel compeltar'} type={'danger'} />);
            const error = document.getElementById('alert')
            Error(error, styles)
        }
        )
        
    }

    return (
        <AlertContext.Provider value={{setAlert}}>
        <>
        <div className={styles.content}>
            <div className={styles.img}>
        <img src="/317717-P94VDW-609.jpg" alt="" />
        </div>
        <form className={styles.login} onSubmit={(e: any) => handleSubmit(e)} autoComplete={'off'}>
            <h1>Chat </h1>
            <span className={`${styles.alert} ${styles.none}`} id="alert">{error}</span>

            <fieldset className={styles.input}>
            <legend >Nome</legend>
            <input type="text" onChange={(e) => setName(e.target.value)} name="" id=""  />
            </fieldset>

            <fieldset className={styles.input}>
            <legend >Email</legend>
            <input type="email" onChange={(e) => setEmail(e.target.value)} name="" id=""  />
            </fieldset>

            <fieldset className={styles.input}>
            <legend>  Senha</legend>
            <input autoComplete={'off'} onChange={(e) => setPassword(e.target.value)} type="password" name="" id="" />
            </fieldset>
            <button>Entrar</button>
            <hr />
            <p>Ainda não possui cadastro? <a href="/login">Entrar</a></p>
        </form >

        {alert}
        </div>
        </>
        </AlertContext.Provider>
    )
}