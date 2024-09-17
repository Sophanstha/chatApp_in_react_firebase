import Chat from "./component/Chat"
import List from "./component/List"
import Detail from "./component/Detail"
import Login from "./component/login/login"
import Notify from "./component/Notify"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/Firebase"
import {useUserStore } from "./lib/UseUserStore"
import { UseChat } from "./lib/UseChat"
const App = () => {

  const {
  currentUser,
    isLoading,
    fetchUserInfo
} = useUserStore()
const {chatId} = UseChat()
useEffect(() => {

  const unSub = onAuthStateChanged(auth, (user) => {
    fetchUserInfo(user?.uid);
  });

  return () => {
    unSub();
  };
}, [fetchUserInfo]);

 console.log(currentUser);
 

  if(isLoading){
    return <div className="p-11 bg-blue-900 rounded-md text-xl ">Loading...</div>
  }
 
  return (
    <>
       <div className="conatiner w-[85vw] h-[95vh] rounded-md flex">

    {
    currentUser ? (
      <>
    <List />
 {chatId && <Chat /> }
    {chatId && <Detail />}
      </>
    ) : 
    (
      <Login />
    )
    }
    </div>
    <Notify />
    </>
  )
}

export default App