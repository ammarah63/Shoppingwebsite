import React, { useState } from "react";
import dynamic from "next/dynamic";
import { IoMdMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa";
import { IoIosPin } from "react-icons/io";
import { db } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

function Contact(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "contactus"), {
        Name: name,
        Email: email,
        Message: message,
      });
      console.log("Document written with ID: ", docRef.id);
      setIsSubmitted(true);
      setIsError(false);
    } catch (error) {
      console.log("Error adding document: ", error);
      setIsSubmitted(false);
      setIsError(true);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center m-2 mb-10 mt-10">
        <h1 className="text-4xl font-bold">
          <span className="bg-neutral text-neutral-content flex items-center p-2">
            Contact Us
          </span>
        </h1>
      </div>
      <div className="px-20 grid grid-cols-1 lg:grid-cols-2 gap-1 mx-10">
        <div className="px-5">
          <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="font-extrabold text-center text-3xl">My Store</h2>
              <div className="py-2 border-b-2">
                <p className="flex">
                  <IoMdMail size={30} className="m-2" />
                  <span className="m-2.5 text-xl font-bold">Email Address</span>
                </p>
                <p className="mx-6">info@mystore.com</p>
              </div>
              <div className="py-2 border-b-2">
                <p className="flex">
                  <FaPhone size={30} className="m-2" />
                  <span className="m-2.5 text-xl font-bold">Phone</span>
                </p>
                <p className="mx-6">+92 343 4543211</p>
                <p className="mx-6">+92 343 4543211</p>
              </div>
              <div className="py-2 border-b-2">
                <p className="flex">
                  <IoIosPin size={30} className="m-2" />
                  <span className="m-2.5 text-xl font-bold">Address</span>
                </p>
                <p className="mx-6">My City, My Country</p>
              </div>
              <div className="py-2">
                <p className="flex">
                  <span className="m-2.5 text-xl font-bold">
                    CUSTOMER SERVICE TIMINGS
                  </span>
                </p>
                <p className="mx-6">Monday to Saturday: 9 am to 6 pm</p>
              </div>
            </div>
          </div>
        </div>
        <div className=" px-5">
          <Map />
        </div>
      </div>
      <div className="pt-20">
        <p className="text-xs text-center mb-6">Got Questions?</p>
        <h1 className="text-center text-4xl font-extrabold my-3">
          Contact Form
        </h1>
      </div>
      <div className="flex items-center justify-center min-h-96">
        <div className="w-full max-w-lg p-10 bg-white shadow-xl rounded-lg">
          <h2 className="text-3xl font-extrabold text-center mb-4">
            Write to Us
          </h2>
          <p className="text-xs text-center mb-6">
            Fill in the form to send us a message
          </p>
          {isSubmitted && (
            <div className="text-center text-green-500">
              We have received your message.
            </div>
          )}
          {isError && (
            <div className="text-center text-red-500">
              The message did not submit due to some error.
            </div>
          )}
          {!isSubmitted && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  rows={7}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  required
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-neutral"
                >
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;
