import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import Api from "../services/Api";
import styles from "../styles/Home.module.css";
import Headers from "../services/Headers";
import isVisible from "./isVisible";
import MessageContext from '../context/MessegeContext';
import { useContext } from 'react';

export default function Messages({
  contact,
  page,
  conversationId,
  socket,
}: any) {
  const [todos, setTodos] = useState(1);
  const [message, setMessage] = useState([]) as any;
  const [cookies, setCookie] = useCookies(["token", "user_id"]);
  const headers = Headers() as any;
  const lastRef = useRef(null) as any;
  const lastRef2 = useRef(null) as any;
  const isLastVisible = isVisible(lastRef2.current);
  const [name, setName] = useState("");


  const {setContact, setConversation, conversation} = useContext(MessageContext) as any;

  useEffect(() => {
    if (isLastVisible) {
      previusMessage(contact, todos + 1, conversation);
    }
  }, [isLastVisible]);

  function previusMessage(contact: any, page: number, conversationId?: any) {
    setTodos(page);
    if (conversationId == 0 || conversationId == undefined || conversationId == null) {
    } else {
      setTimeout(() => {
        console.log(message);
      }, 1000);
      Api.get(`/message/${conversationId || conversation.id}/${page || 1}`, headers).then((res) => {
        if (message) {
          setMessage([
            ...res.data.messages.sort((a: any, b: any) => a.id - b.id),
            ...message,
          ]);
        } else {
          setMessage(res.data.messages.sort((a: any, b: any) => a.id - b.id));
        }

        /// pega o tamanho do scroll antes de adicioar as mensagens
        const sch = lastRef.current?.scrollHeight;

        ///seta o scroll para a posição que estava antes de concatenar as mensagens
        window.setTimeout(() => {
          //lastRef.current?.scrollTo(0, lastRef.current?.scrollHeight - sch);
          lastRef.current?.scrollTo({
            top: lastRef.current?.scrollHeight - sch,
            behavior: "smooth",
          })
        }, 100);
      });
    }
 
    setContact(contact);
    
    setName(contact.name);
  }

  useEffect(() => {
    setMessage([])
    setContact(contact);
    setTodos(page);
    const talk = document.getElementById(`talk`) as HTMLDivElement;
    talk.classList.remove("none");
    setConversation(conversationId);

    ///  busca as mensagens
    if (conversationId == 0 || conversationId == undefined || conversationId == null) {
      Api.post(`conversation/getOneVerify`, {toId: contact.id}, headers).then(res => {
          if (res.data.conversation){
            setConversation(res.data.conversation);
            Api.get(`/message/${res.data.conversation?.id}/${1}`, headers).then((res) => {
              lastRef.current?.scrollTo({
                top: lastRef.current?.scrollHeight,
                behavior: "smooth",
              })

              /// selciona a sala que quer escutar
              socket.emit(
                "select_room",
                { room: conversationId },
                (messages: any) => {
                  console.log(messages);
                }
              );
              setMessage(res.data.messages.sort((a: any, b: any) => a.id - b.id));
            });
        }
       })
    } else {
      Api.get(`/message/${conversationId}/${page}`, headers).then((res) => {
        lastRef.current?.scrollTo({
          top: lastRef.current?.scrollHeight,
          behavior: "smooth",
        })
        /// selciona a sala que quer escutar
        socket.emit(
          "select_room",
          { room: conversationId },
          (messages: any) => {
            console.log(messages);
          }
        );

        console.log(res.data.messages.sort((a: any, b: any) => a.id - b.id));
        setMessage(res.data.messages.sort((a: any, b: any) => a.id - b.id));
      });
    }

    /// escuta as mensagens que o usuario recebeu
    socket.on("message", (data: any) => {
      console.log(data);
      setMessage(data.data.sort((a: any, b: any) => a.id - b.id));
      window.setTimeout(() => {
        lastRef.current?.scrollTo(0, lastRef.current?.scrollHeight);
      }, 100);
    });

     setContact(contact);
    setName(contact.name);
  }, []);

  function viewMore(){
    lastRef2.current.classList.remove("none")
  }

  return (
    <>

<ul id="ul" ref={lastRef}>
        <div ref={lastRef2} className="none" >não hà mensagens anteriores</div>
        <button onClick={viewMore}>ver mensagens anteriores</button>
        
      {message?.map((item: any, index:any) =>
        item.toId == cookies.user_id ? (
          <li key={index} className={`${styles.li} right`}>
            <img src={
                     `${import.meta.env.VITE_API_HOST}/static/profile/` +
                    item.conversation.user2.profile_image
                  } alt={JSON.stringify(item.conversation.user2.profile_image)} />
            {item.text}
          </li>
        ) : (
          <li key={item.id} className={`${styles.li} left`}>
            <img src={
                    `${import.meta.env.VITE_API_HOST}/static/profile/` +
                    item.conversation.user1.profile_image
                  } alt="" />
            {item.text}
          </li>
        )
      )}
     
        </ul>
    </>
  );
}
