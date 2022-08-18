    import styles from "../styles/Alert.module.css";
    import AlertContext from '../context/AlertContext';
import { useContext, useEffect } from "react";


      export default  function Alert({text, title,type}: any) {

        const {setAlert} = useContext(AlertContext) as any;

        useEffect(() => {
           setTimeout(() => {
                setAlert([]);
            }, 3000);
        }, []);


            return (
                <div className={`${styles.alert} ${type}`} role="alert">
                    <strong>{title}</strong> 
                    <p>{text}</p>
                </div>
            );
        }