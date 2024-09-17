import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc, } from "firebase/firestore";
import { db } from "../lib/Firebase";
import { UseChat } from "../lib/UseChat";
import { useUserStore } from "../lib/UseUserStore";
import upload from "../lib/upload";
function Chat() {
  const [chats,setchats] = useState()
  const [open, setopen] = useState(false);
  const [message, setMessage] = useState("");
  const endref = useRef("");
  const {chatId,user,  isCurrentUserBlocked,
    isReceiverBlocked,} = UseChat()
  const {currentUser} = useUserStore()
  const [img,setimg] = useState({
    file: null,
    url:""
  })  

  
  let handleimg = (e) => {
    if (e.target.files[0]) {
      setimg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  let hanldeEmoji = (e) => {
    setMessage((prev) => prev + e.emoji);
    open(false);
  };

  useEffect(() => {
    endref.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  useEffect(()=>{
    const onsub = onSnapshot(doc(db,"chats",chatId),(res)=>{
      setchats(res.data())
    })
    return ()=>{
      onsub();
    }
  },[chatId])
  console.log(chats);

  let handleSend = async () =>{
      if(message === "") return ;
     let imgurl = null;     
      try {
        if(img.file){
          imgurl = await upload(img.file);
         }
         
        updateDoc(
          doc(db, "chats", chatId),{
            message:arrayUnion({
              senderId : currentUser.id ,
              message,
              createAt : Date.now(),
              ...(imgurl && {img:imgurl})
            })
          }
        )

        const chatIds = [currentUser.id,user.id];

        chatIds.forEach(  async (id)=>{
        const chatref = doc(db,"userchat",id);
        const snapsot = await getDoc(chatref)
        if(snapsot.exists()){
          const userdata = snapsot.data()

          const chatIndex = userdata.chats.findIndex(
            (chat) => chat.chatId === chatId
          )
         userdata.chat[chatIndex].lastmessage = message ;
         userdata.chat[chatIndex].isSeen = id === currentUser.id ? true : false
         userdata.chat[chatIndex].updateAt = Date.now();
         await updateDoc(chatref,{
          chats:userdata.chat
         })
        }
      })
      } catch (error) {
        console.log(error);
      }
      setimg({
        file : null,
        url : ""
      })
      setMessage("");
  }


  return (
    <div className="flex-[2] border-r border-l border-white p-4 flex flex-col">
      <div className="top flex items-center justify-between border-b border-b-white">
        <div className="info p-2 flex gap-2">
          <div>
            <img
              src={
                isCurrentUserBlocked || isReceiverBlocked ? "avatar.png" :
                user?.avatar ||"./avatar.png"}
              alt=""
              className="w-14 h-14 object-cover rounded-full"
            />
          </div>
          <div className="name flex flex-col gap-1">
            <h2 className="text-xl font-extrabold text-white">
              {
              isCurrentUserBlocked || isReceiverBlocked ? "user" :
              user.username}
            </h2>
            <p className="font-light text-sm">Active 5 minutes ago</p>
          </div>
        </div>
        <div className="icons flex items-center justify-between gap-3">
          <img src="./phone.png" alt="" className="w-5 h-5" />
          <img src="./video.png" alt="" className="w-5 h-5" />
          <img src="./info.png" alt="" className="w-5 h-5" />
        </div>
      </div>

 <div className="middle flex-1 p-4 overflow-y-auto">
  {chats?.message?.map((message) => {
    return (
      <div 
      className={ message.senderId === currentUser.id ?
        "ownmessage mb-4 flex items-end justify-end "
      : "mb-4 flex items-start justify-start bg-transparent"
      } key={message?.createAt}>
        <div className="bg-blue-500 p-4 rounded-lg shadow-md max-w-xs">
          {message.img && (
            <img
              src={message.img}
              alt="Product"
              className="h-32 w-32 object-cover rounded-lg"
            />
          )}
          <p className="text-gray-700">{message.message}</p>
          <div className="text-right mt-2">
            <span className="text-xs text-blue-200">1 min ago</span>
          </div>
        </div>
      </div>
    );
  })}
  {img.url &&
 <div className="ownmessage mb-4 flex items-end justify-end" >
        <div className="p-4 rounded-lg shadow-md max-w-xs">
          {/* {message.img && ( */}
            <img
              src={img.url}
              alt="Product"
              className="h-32 w-32 object-cover rounded-lg"
            />
          
       
        </div>
      </div>
}
  <div ref={endref}></div>
</div>

      <div class="bottom w-full flex items-center p-4 border-t border-gray-200 m-auto">
        <div class="flex space-x-4">
         <label htmlFor="img">
          <img src="./img.png" alt="Icon" class="h-6 w-6" />
         </label>
         <input type="file" id="img" className="hidden" onChange={handleimg}/>
          <img src="./camera.png" alt="Camera" class="h-6 w-6" />
          <img src="./mic.png" alt="Microphone" class="h-6 w-6" />
        </div>
        <input
          type="text"
          placeholder={isCurrentUserBlocked || isReceiverBlocked ?"user is block" : "Type message"}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          disabled = {isCurrentUserBlocked || isReceiverBlocked}
          className="flex-1 mx-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <div class="flex items-center  relative">
          <img
            src="./emoji.png"
            alt="Emoji"
            class="h-6 w-6 mr-4"
            onClick={() => setopen((prev) => !prev)}
          />
          <div className=" absolute left-0 bottom-12">
            <EmojiPicker open={open} onEmojiClick={hanldeEmoji} />
          </div>
          <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          disabled = {isCurrentUserBlocked || isReceiverBlocked}
          onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
// why its not displaying any message 