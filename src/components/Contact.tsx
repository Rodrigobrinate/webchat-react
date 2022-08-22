    import React,{ useContext, useState} from 'react';
    import styles from '../styles/Home.module.css';
    import Messages from './Messages';
    import contactContext from '../context/ContactContext';
    import Headers from '../services/Headers';
    import Api from '../services/Api';

        export default function Contact({conversation, contact, lastMessage,type,numberofnewmessages, socket}: any) {
         
          const headers = Headers();
          const {setMessage, setConversation, setContact, lastRef, setName} = useContext(contactContext) as any;

          function tes(){
            
            
                  
          }

          function testes(type: string){
            console.log(type != 'contact')

            if(type != 'contact'){
         Api.post("/conversation/visualization", {conversation: conversation}, headers);
            setConversation(conversation);
            setName(contact.name);
            setContact(contact);
            setMessage([])
            setTimeout(() => {
              setMessage(<Messages contact={contact} conversation={conversation} page={1} conversationId={conversation?.id} socket={socket}   />)
             
            }, 100);

           


          }else{
console.log("contato")
            setTimeout(() => {
              setMessage(<Messages contact={contact} conversation={null} conversationId={null} socket={socket}   />)
             
            }, 100);
          }
            
            
         
          }
            
            return (
               
              
              
                    <li
                      onClick={() => {
                        type !== "message"
                        //?   setMessage(<Messages contact={contact} conversation={null} page={1} conversationId={null} socket={socket}   />)
                        ?   testes('contact')
                         // ? newMessage(contact, 1) 
                         :   testes('message'); window.location.href = "#endMessages"
                          //: setMessage(<Messages contact={contact} page={1} conversation={conversation} conversationId={conversation.id} socket={socket}   />)
                         //: console.log(contacts,);
                      }}
                    >
                      <img src="/user.png" alt="" />
                      <div>
                        <h4>{contact?.name}</h4>
                        <p>{lastMessage?.text?.slice(0, 20) || lastMessage}</p>
                      
                      </div>
                      <div>
                      <p>{lastMessage?.createdAt 
                      ? new Date(lastMessage?.createdAt).getHours()+":"+new Date(lastMessage?.createdAt).getMinutes()
                      : null
                    }</p>
                      <p className={styles.numberofnewmessages}>{numberofnewmessages || ''}</p>
                     </div>
                      </li>
                

            );
        }