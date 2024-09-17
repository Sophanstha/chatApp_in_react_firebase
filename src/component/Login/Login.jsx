import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/Firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

function Login() {
  const [loading, setloading] = useState(false);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  let handleChange = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  let handlesubmit = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      const fromdata = new FormData(e.target);
      const { email, password } = Object.fromEntries(fromdata);
      await signInWithEmailAndPassword(auth, email, password);

      toast.success("login succesfully");
    } catch (e) {
      console.log(e);
      toast.error(e.massage);
    } finally {
      setloading(false);
    }
  };
  let handleRegister = async (e) => {
    e.preventDefault();
    setloading(true);
    const fromdata = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(fromdata);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgurl = await upload(avatar.file);
      await setDoc(doc(db, "username", res.user.uid), {
        username,
        email,
        avatar: imgurl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchat", res.user.uid), {
        chats: [],
      });
      toast.success("user account created");
    } catch (e) {
      console.log(e);
      toast.error(e.massage);
    } finally {
      setloading(false);
    }
  };
  return (
    <div className="w-full h-full flex items-center gap-24">
      <div className="flex-1 flex flex-col items-center gap-5">
        <h2 className="text-xl font-semibold">Welcome back,</h2>
        <form
          className="flex flex-col items-center justify-center gap-5 w-full max-w-sm "
          onSubmit={handlesubmit}
        >
          <input
            type="text"
            placeholder="Email"
            name="email"
            className="w-full px-5 py-4 bg-gray-800 text-white rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="w-full px-5 py-4 bg-gray-800 text-white rounded-md"
          />
          <button
            disabled={loading}
            className="w-full px-5 py-4 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition duration-300"
          >
            {loading ? "loading...." : "login "}
          </button>
        </form>
      </div>
      <div className="h-4/5 w-px bg-gray-300"></div>
      <div className="flex-1 flex flex-col items-center gap-5">
        <h2 className="text-xl font-semibold">Create an Account</h2>
        <form
          onSubmit={handleRegister}
          className="flex flex-col items-center justify-center gap-5 w-full max-w-sm"
        >
          <label
            htmlFor="file"
            className="w-full flex items-center justify-between cursor-pointer underline"
          >
            <img
              src={avatar.url || "./avatar.png"}
              alt="Avatar Preview"
              className="w-12 h-12 rounded-md object-cover opacity-60"
            />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Username"
            name="username"
            className="w-full px-5 py-4 bg-gray-800 text-white rounded-md"
          />
          <input
            type="text"
            placeholder="Email"
            name="email"
            className="w-full px-5 py-4 bg-gray-800 text-white rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="w-full px-5 py-4 bg-gray-800 text-white rounded-md"
          />
          <button
            disabled={loading}
            className="w-full px-5 py-4 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition duration-300"
          >
            {loading ? "loading...." : "sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
