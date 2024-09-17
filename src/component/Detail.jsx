import React from 'react';
import { auth, db } from '../lib/Firebase';
import { UseChat } from '../lib/UseChat';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { useUserStore } from '../lib/UseUserStore';
function Detail() {
  const {   chatId,
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    changeBlock} = UseChat()
    const {
    currentUser
    } = useUserStore()

    let handleblock = async ()=>{
      if(!user) return;
      const ref = doc(db, "username",currentUser.id) ;
      try {
          await updateDoc(ref,{
            blocked : isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
          })
          changeBlock();
      } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
      }
    }
  return (
    <div className="detail flex flex-col flex-1 p-6 overflow-y-scroll ">
      <div className="user flex flex-col items-center bg-white p-6 rounded-lg shadow-md mb-6">
        <img src={user?.avatar || "./avatar.png"} alt="User Avatar" className="h-24 w-24 rounded-full mb-4" />
        <h2 className="text-xl font-semibold mb-2 text-black">{user.username}</h2>
        <p className="text-gray-600">view my profile </p>
      </div>
      <div className="info flex flex-col space-y-4">
        <div className="option bg-white p-4 rounded-lg shadow-md">
          <div className="title flex justify-between items-center">
            <span className="text-gray-800 font-medium">Chat Settings</span>
            <img src="./arrowUp.png" alt="Arrow Up" className="h-4 w-4" />
          </div>
        </div>
      
        <div className="option bg-white p-4 rounded-lg shadow-md">
          <div className="title flex justify-between items-center">
            <span className="text-gray-800 font-medium">Privacy & Help</span>
            <img src="./arrowUp.png" alt="Arrow Up" className="h-4 w-4" />
          </div>
        </div>
        <div className="option bg-white p-4 rounded-lg shadow-md">
          <div className="title flex justify-between items-center">
            <span className="text-gray-800 font-medium">Shared Photos</span>
            <img src="./arrowDown.png" alt="Arrow Down" className="h-4 w-4" />
          </div>
          <div className="photos grid grid-rows-4 gap-4 mt-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="photoItem flex items-center bg-gray-50 p-1 rounded-lg">
                <div className="photoDetail flex items-center flex-wrap">
                  <img
                    src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                    alt="Shared Photo"
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <span className="text-sm text-gray-700">photo_2024_2.png</span>
                </div>
                <img src="./download.png" alt="Download Icon" className="h-4 w-4 bg-slate-950 mx-5"  />
              </div>
            ))}
          </div>
        </div>
        <div className="option bg-white p-4 rounded-lg shadow-md">
          <div className="title flex justify-between items-center">
            <span className="text-gray-800 font-medium">Shared Files</span>
            <img src="./arrowUp.png" alt="Arrow Up" className="h-4 w-4" />
          </div>
        </div>
        <button
        onClick={handleblock}
        className="logout bg-slate-950 text-white py-2 rounded-lg shadow-md hover:bg-red-600 transition">
          {
            isCurrentUserBlocked ? "Your are blocked" : isReceiverBlocked ? "user is blocked" : "blocked"
          }
        </button>
        <button className="logout bg-red-500 text-white py-2 rounded-lg shadow-md hover:bg-red-600 transition"
        onClick={()=> auth.signOut()}>
          logout
        </button>
      </div>
    </div>
  );
}

export default Detail;
