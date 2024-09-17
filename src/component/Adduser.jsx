import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where,  } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../lib/Firebase';
import {useUserStore} from "../lib/UseUserStore"
function Adduser() {
  const [user, setUser] = useState(null);
  const {currentUser} = useUserStore()
  let handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("search");
    try {
      const ref = collection(db, "username");
      const q = query(ref, where("username", "==", username));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        console.log("User not found");
        setUser(null); // Clear user state if no user found
      } else {
        setUser(querySnapshot.docs[0].data()); // Set the user data if found
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  let handleAdd = async () => {
    const chatref = collection(db, "chats");
    const userachatref = collection(db, "userchat");
  
    try {
      const newChatRef = doc(chatref);
      
      // Create a new chat document
      await setDoc(newChatRef, {
        createAt: serverTimestamp(),
        message: [],
      });
  
      // Update the current user's chat
      await updateDoc(doc(userachatref, user.id), {
        chat: arrayUnion({
          chatId: newChatRef.id,
          lastmessage: "",
          receiverId: currentUser.id,
          updateAt: Date.now(), // Use serverTimestamp instead of Date.now() to keep it consistent
        }),
      });
  
      // Update the receiver's chat
      await updateDoc(doc(userachatref, currentUser.id), {
        chat: arrayUnion({
          chatId: newChatRef.id,
          lastmessage: "",
          receiverId: user.id,
          updateAt: Date.now(),
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className='absolute left-0 right-0 top-0 bottom-0 m-auto p-7 w-[400px] h-[max-content] rounded-md bg-slate-400 shadow-lg'>
      <form className='flex items-center mb-6'
      onSubmit={handleSearch}
      >
        <input 
          type="text" 
          placeholder='Search' 
          name='search' 
          className='w-full px-4 py-2 text-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button 
          type="submit" 
          className='px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          Search
        </button>
      </form>
    { user &&
      <div className='flex items-center justify-between'>
     <div className='flex items-center space-x-4'>
        <img 
          src={user.avatar ||"avatar.png"} 
          alt="Avatar" 
          className='w-16 h-16 rounded-full border-2 border-white shadow-sm'
        />
        <h2 className='text-xl font-semibold text-white'>{user.username}</h2>
      </div>
        <button 
className='px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500'
        onClick={handleAdd}
        >

          Add User
        </button>
      </div>
}
    </div>
  )
}

export default Adduser;
