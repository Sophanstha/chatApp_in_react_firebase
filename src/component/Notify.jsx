import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
  
function Notify() {
  return (
    <div>
        <ToastContainer position="bottom-right"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body" />
    </div>
  )
}

export default Notify