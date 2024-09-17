import React, { useEffect, useState } from 'react';
import { useUserStore } from "../lib/UseUserStore";
import Adduser from './Adduser';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../lib/Firebase';
import { UseChat } from '../lib/UseChat';

function Chatlist() {
  const [mode, setMode] = useState(false);
  const [chats, setChats] = useState([]);
  const { changechat } = UseChat();
  const { currentUser } = useUserStore();
  const [input,setinput]= useState("")


  useEffect(() => {
    const unsub = onSnapshot(doc(db, "userchat", currentUser.id), async (docSnap) => {
      if (docSnap.exists()) {
        const items = docSnap.data().chat;

        // Fetch additional user data for each chat asynchronously
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "username", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...item, user }; // Combine chat item with user data
        });

        // Await all promises and then sort the chats
        const chatData = await Promise.all(promises);

        // Sort chats by updatedAt timestamp
        const sortedChats = chatData.sort((a, b) => b.updateAt - a.updateAt);

        // Set chats in state
        setChats(sortedChats);
      }
    });

    // Cleanup subscription
    return () => {
      unsub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    try {
      // Mark the chat as seen
      const updatedChats = chats.map((item) => {
        if (item.chatId === chat.chatId) {
          return { ...item, isSeen: true }; // Update isSeen for selected chat
        }
        return item;
      });

      // Update Firestore with the modified chats
      const chatRef = doc(db, "userchat", currentUser.id);
      await updateDoc(chatRef, {
        chat: updatedChats.map(({ user, ...rest }) => rest), // Strip user info before updating
      });

      // Change the current chat in the UI
      changechat(chat.chatId, chat.user);
    } catch (error) {
      console.error("Error updating chat:", error);
    }
  };
  // const chatfilter = chats.filter((c)=>c.users.username.toLowerCase().include(input.toLowerCase()))
  const chatfilter = chats.filter((c) => c.user.username.toLowerCase().includes(input.toLowerCase()));

  return (
    <div className="p-4 overflow-y-scroll">
      <div className="flex justify-between items-center">
        <div className="flex items-center bg-[rgba(17, 25, 40, 0.75)] p-2 rounded-md">
          <img src="./search.png" alt="Search" className="cursor-pointer mr-2 w-6 h-6" />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-transparent outline-none text-white placeholder-gray-400"
          onChange={(e)=>setinput(e.target.value)}
          />
        </div>
        <img
          src={mode ? `./minus.png` : `./plus.png`} 
          alt="Add" 
          className="cursor-pointer w-6 h-5"
          onClick={() => setMode((prev) => !prev)}
        />
      </div>

      {chatfilter.map((chat) => (
        <div
          className="flex items-center gap-5 cursor-pointer p-4 border-b border-b-white"
          key={chat.chatId}  // Ensure that chat.chatId exists
          onClick={() => handleSelect(chat)}
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "blue",  // Conditionally change background
          }}
        >
          <img
            src={chat.user.avatar || "./avatar.png"}
            alt=""
            className="w-10 h-10 object-cover rounded-full"
          />
          <div className="flex flex-col gap-3">
            <span className="font-bold">{
            chat.user.username}</span>
            <p className="text-sm font-semibold">{chat.user.LastMessage}</p>
          </div>
        </div>
      ))}

      {mode && <Adduser />}
    </div>
  );
}

export default Chatlist;
