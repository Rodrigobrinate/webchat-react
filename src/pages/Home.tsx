import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import Api from "../services/Api";
import { useCookies } from "react-cookie";
import io from "socket.io-client";
//import isVisible from "../components/isVisible";
import Messages from "../components/Messages";
import Headers from "../services/Headers";
import MessegeContext from "../context/MessegeContext";
import Contact from "../components/Contact";
import ContactContext from "../context/ContactContext";
import Alert from "../components/Alert";
import AlertContext from "../context/AlertContext";
import Header from "../components/Header";

//const socket = io("http://localhost:3001"); 
const socket = io(import.meta.env.API_HOST as string);


socket.on("connection", () => {
  console.log("connected");
});

type User1Id = {
  id?: number;
  name: string;
  conversationId: number;
}

type User2Id = {
  id?: number;
  name: string;
  conversationId: number;
}


type Conversation = {
  id?: number;
  user1: User1Id;
  user2: User2Id;
}

type Message = {
  id?: number;
  text: string;
  createdAt: string;
}

function Home() {
  const [name, setName] = useState("");
  const [cookies, setCookie] = useCookies(["token","name","user_id",]);


  const [contacts, setContacts]: any = useState([] );
  const [contact, setContact]: any = useState();
   const [conversation, setConversation] = useState([]) as any;
  const [conversationId, setConversationId] = useState([]) as any;

  const [message, setMessage] = useState([]) as any;
  const [text, setText] = useState("");
  const lastRef = useRef(null) as any;
  const [alert , setAlert] = useState([]) as any;
  const headers = Headers() as any;


/// verifica se o usuário está logado
  useEffect(() => {
    if (!cookies.token) {
      window.location.href = "/Login";
    }
  }, []);  

  /// busca os usuarios do chat
  function getAllContacts() {
    Api.get("/user")
      .then((res) => {
        let a = [] as any;
        res.data.users.map((user: any, index: any) => {
    
          //adiciona somente os usuarios que não são o usuario logado
          if (user.id !== parseInt(cookies.user_id)) {
             a.push(<Contact key={index} conversation={undefined}  type={'contact'} lastMessage={"nenhuma mensagem"} contact={user} socket={socket}/>);
          }

          //quando terminar de percorrer a lista de usuário, seta a lista de usuário
          if ( res.data.users.length == index + 1) {
              setContacts(a);
          }
      });
      })
      .catch((err) => {
        console.log(err);
      });
  }



    /// busca as converisas do ususario
  function getAllConversations() { 
    let a = [] as any[];
    Api.get("/conversation", headers).then((allconverstions) => {
     
      if (allconverstions.data.conversations.length <= 0) {
        setContacts('você ainda não possui conversas')
      }else{

      // percorre todas as conversas
      allconverstions.data.conversations?.map((conversation: Conversation, index: number) => {  

        socket.emit(
          "select_room",
          { room: conversation.id },
          (messages: any) => {
            console.log(messages);
          }
        );
        
        // busca a ultima mensagem de cada conversa conversa
        Api.get(`/message/lastmessage/${conversation.id}`, headers).then((lastMessage) => {
        
          // verifica se a mensagem foi niciada por mim
        if (conversation.user2.id != cookies.user_id * 1) {
          let user2 = {
            user2Id: conversation.user2,
            name: conversation.user2.name,
            conversationId: conversation.id,
          } as User2Id
           conversation = {
            id: conversation.id,
            user1: conversation.user1,
            user2: conversation.user2,
          } as Conversation
         
          let lastMessageObj = {
            id: lastMessage.data.message?.id  || null,
            text: lastMessage?.data?.message?.text || "nenhuma mensagem",
            createdAt: lastMessage?.data?.message?.createdAt || "",
          } as Message
        
          console.log(lastMessage.data.numberofnewmessages);
          console.log(conversation)
          a.push(<Contact 
            key={index} 
            conversation={conversation}  
            type={'message'}
              numberofnewmessages={lastMessage.data.numberofnewmessages} 
            lastMessage={lastMessageObj } 
            contact={user2} socket={socket}/>);
         
        //quando terminar de percorrer a lista de usuário, seta a lista de usuário
        if (allconverstions.data.conversations.length == index +1) {
          teste();
        }
         
        } else {
          let user1 = {
            user2Id: conversation.user1,
            name: conversation.user1.name,
            conversationId: conversation.id,
          } as User2Id
           conversation = {
            id: conversation.id,
            user1: conversation.user1,
            user2: conversation.user2,
          } as Conversation
          let lastMessageObj = {
            id: lastMessage.data.message.id,
            text: lastMessage.data.message.text,
            createdAt: lastMessage.data.message.createdAt,
          } as Message
          console.log(lastMessage.data.numberofnewmessages);

          a.push(<Contact 
            key={index} 
            conversation={conversation}  
            type={'message'} 
            lastMessage={lastMessageObj} 
            numberofnewmessages={lastMessage.data.numberofnewmessages} 
            contact={user1} socket={socket}/>);

          //quando terminar de percorrer a lista de usuário, seta a lista de usuário
          if (allconverstions.data.conversations.length == index + 1) {
            teste();
          }          
        }}) 
               
      });
      
     
    }




    function teste() {
      setContacts(
        <>
        {a.map((contact: any, index: number) => {return contact})}
      </>
      )
    }
  });
}


 socket.on("newMessage", (data: any) => {
  console.log(data);
  getAllConversations();

 })


  /// envia as mensagens
  function sendMessageh() {
    const messageInput = document.getElementById(`message`) as HTMLInputElement;
    
    if (conversation == 0 || conversation == undefined || conversation == null) {
        ///cria uma nova conversa
        Api.post(`/conversation/create`, { toId: contact.id}, headers).then((res) => {
          setConversation(res.data.conversation.id);

        let body = {
          text: text, //messageInput.value,
          userId: contact.id,
          conversationId: res.data.conversation.id,
        };

        Api.post("/message/create", body, headers).then((response) => {
          setTimeout(() => {
          setMessage(<Messages conversation={conversation} contact={contact} page={1}  conversationId={res.data.conversation.id} socket={socket}   />)
            lastRef.current?.scrollTo(0, lastRef.current?.scrollHeight)
          }, 100);  
  });

        let data = {
          conversationId: res.data.conversation.id,
          toId: cookies.user_id,
          fromId: contact.id,
          text: messageInput.value,
          page: 1,
        };
    socket.emit("new", data);

  })
    }else{
      let data = {
          conversationId: conversation.id || conversation,
          toId: cookies.user_id,
          fromId: contact.id,
          text: messageInput.value,
          id: message[message.length - 1]?.id + 1,
          page: 1,
        };

    /// emite uma nova mensagem
    socket.emit("new", data);


    /// salva a mesagens no banco de dados
    let body = {
      text: text, //messageInput.value,
      userId: contact?.user2Id?.id || contact.id,
      conversationId: conversation.id || conversation,
    };
    console.log(body)
    Api.post("/message/create", body, headers).then((res) => {
    setAlert(<Alert text={'Mensagem enviada com sucesso'} title={'legal'} type={'success'} />);
        setTimeout(() => {
          lastRef.current?.scrollTo(0, lastRef.current?.scrollHeight)
        }, 100);  
      });
    messageInput.value = "";
    }
  }


  function lauchMenu(e: any) {
    console.log('menu')
    const menu = document.getElementById(`menu`) as HTMLElement;
    if (menu.style.display == "none") {
      menu.style.display = "block";
      e.target.style.rotate = "0deg"
      e.target.style.left = "21rem"
      e.target.style.transform = "translateX(0rem)"
    }else{
      menu.style.display = "none";
    e.target.style.rotate = "180deg"
    console.log(e.target.style)
    e.target.style.transform = "translateX(21rem)"
    }
    
  }

  return (
    <MessegeContext.Provider value={{setContact, setConversation, conversation}}>
      <ContactContext.Provider value={{setMessage, setConversation, setContact, lastRef, setName }}>
        <AlertContext.Provider value={{setAlert}}>

         <Header />
    <div className={styles.container}>
      <div className={styles.left_menu } id="menu">
     
        <div>
          <div></div>
        <input type="text" placeholder="Search" className={styles.search} />
        </div>
        <div className={styles.contacts}> 
        <div>
              <button onClick={getAllContacts}>contacts</button>
              <button onClick={getAllConversations}>messages</button>
            </div>
          <ul>
           
            {contacts}
          </ul>
        </div>
      </div>
      <div className={styles.lauchMenu} onClick={(e)=> {lauchMenu(e)}}>
        <img src="https://img.icons8.com/000000/20/000000/circled-chevron-left.png" />
        </div>
   {/* /////////////////////////////////////////////////////////////////*/}


          {/* mesagens da conversa       */}
      <div className={`${styles.talk} none`} id="talk">
        <div className={styles.talk_header}>
          <img src="/user.png" width={"100px"} alt="" />
          <h4>{name}</h4>
          <div><a href="/profile">{cookies.name}</a></div>
        </div>

       <div className={styles.converse}>
       { message }
       </div>
        <div className={styles.form}>
          <input
            type="text"
            placeholder="Type a message"
            id="message"
            className={styles.input}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                sendMessageh();
              }
            }}
          />
          <button id="send" onClick={sendMessageh}>
            Send
          </button>

          {alert}
        </div>
      </div>
    </div>
    </AlertContext.Provider>
    </ContactContext.Provider>
    </MessegeContext.Provider>
  );
}

export default Home;
