import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { IoMdMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa";
import { IoIosPin } from "react-icons/io";
import { db } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useFormik } from "formik";
import * as Yup from "yup";
import emailjs from "@emailjs/browser";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const initialValues = {
  Name: "",
  Email: "",
  Message: "",
};

function Contact(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const form = useRef();
  const { t, i18n } = useTranslation("common");

  const sendEmail = (e) => {
    // e.preventDefault();

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE,
        form.current,
        {
          publicKey: process.env.NEXT_PUBLIC_EMAILJS_API_KEY,
        }
      )
      .then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  const handleSubmitMessage = async (e) => {
    try {
      const docRef = await addDoc(collection(db, "contactus"), {
        Name: values.Name,
        Email: values.Email,
        Message: values.Message,
      });

      console.log("Document written with ID: ", docRef.id);
      setIsSubmitted(true);
      sendEmail();
      setIsError(false);
    } catch (error) {
      console.log("Error adding document: ", error);
      setIsSubmitted(false);
      setIsError(true);
    }
  };

  const { values, errors, handleBlur, handleChange, handleSubmit, touched } =
    useFormik({
      initialValues: initialValues,
      validationSchema: Yup.object({
        Name: Yup.string()
          .min(2, "Must be 2 characters or more")
          .max(15, "Must be 15 characters or less")
          .required("Required"),
        Email: Yup.string().email("Invalid email address").required("Required"),
        Message: Yup.string()
          .min(20, "Must be 20 characters or more")
          .max(50, "Must be 50 characters or less")
          .required("Required"),
      }),
      onSubmit: async (values) => {
        alert(JSON.stringify(values, null, 2));
        await handleSubmitMessage();
      },
    });

  const getLanguageStyles = (language) => {
    switch (language) {
      case "en":
        return {
          fontSize: "14px",
          letterSpacing: "2px",
        };
      case "zh":
        return {
          fontSize: "17px",
          letterSpacing: "1px",
        };
      case "ur":
        return {
          fontSize: "18px",
          letterSpacing: "0px",
        };
      default:
        return {};
    }
  };

  const languageStyles = getLanguageStyles(i18n.language);

  return (
    <div>
      <div className="flex items-center justify-center m-2 mb-10 mt-10">
        <h1 className="text-4xl font-bold">
          <span className="bg-neutral text-neutral-content flex items-center p-2">
            {t("contactUs")}
          </span>
        </h1>
      </div>
      <div className="px-4 sm:px-10 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-1 mx-4 sm:mx-10">
        <div className="px-2 sm:px-5">
          <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="font-extrabold text-center text-2xl sm:text-3xl">
                {t("myStore")}
              </h2>
              <div className="py-2 border-b-2">
                <p className="flex" style={languageStyles}>
                  <IoMdMail size={30} className="m-2" />
                  <span className="m-2.5  font-bold">{t("emailAddress")}</span>
                </p>
                <p className="mx-4 sm:mx-6" style={languageStyles}>
                  info@mystore.com
                </p>
              </div>
              <div className="py-2 border-b-2">
                <p className="flex" style={languageStyles}>
                  <FaPhone size={30} className="m-2" />
                  <span className="m-2.5  font-bold">{t("phone")}</span>
                </p>
                <p className="mx-4 sm:mx-6" style={languageStyles}>
                  +92 343 4543211
                </p>
                <p className="mx-4 sm:mx-6" style={languageStyles}>
                  +92 343 4543211
                </p>
              </div>
              <div className="py-2 border-b-2">
                <p className="flex" style={languageStyles}>
                  <IoIosPin size={30} className="m-2" />
                  <span className="m-2.5  font-bold">{t("address")}</span>
                </p>
                <p className="mx-4 sm:mx-6" style={languageStyles}>
                  My City, My Country
                </p>
              </div>
              <div className="py-2">
                <p className="flex" style={languageStyles}>
                  <span className="m-2.5 font-bold">
                    {t("customerServiceTimings")}
                  </span>
                </p>
                <p className="mx-4 sm:mx-6" style={languageStyles}>
                  {t("timings")}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className=" px-5">
          <Map />
        </div>
      </div>
      <div className="pt-20">
        <p className=" text-center mb-6" style={languageStyles}>
          {t("gotQuestions")}
        </p>
        <h1 className="text-center text-4xl font-extrabold my-3">
          {t("contactForm")}
        </h1>
      </div>
      <div className="flex items-center justify-center min-h-96">
        <div className="w-full max-w-lg p-10 bg-white shadow-xl rounded-lg">
          <h2 className="text-3xl font-extrabold text-center mb-4">
            {t("writeToUs")}
          </h2>
          <p className=" text-center mb-6" style={languageStyles}>
            {t("fillForm")}
          </p>
          {isSubmitted && (
            <div className="text-center text-green-500" style={languageStyles}>
              {t("receivedMessage")}
            </div>
          )}
          {isError && (
            <div className="text-center text-red-500" style={languageStyles}>
              {t("submitError")}
            </div>
          )}
          {!isSubmitted && (
            <form ref={form} onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block  font-medium text-gray-700"
                  style={languageStyles}
                >
                  {t("name")}
                </label>
                {errors.Name && touched.Name ? (
                  <div className="text-center text-red-500">
                    {t(errors.Name)}
                  </div>
                ) : null}
                <input
                  type="text"
                  id="Name"
                  name="Name"
                  value={values.Name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block font-medium text-gray-700"
                  style={languageStyles}
                >
                  {t("email")}
                </label>
                {errors.Email && touched.Email ? (
                  <div className="text-center text-red-500">
                    {t(errors.Email)}
                  </div>
                ) : null}
                <input
                  type="email"
                  id="Email"
                  name="Email"
                  value={values.Email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block  font-medium text-gray-700"
                  style={languageStyles}
                >
                  {t("message")}
                </label>
                {errors.Message && touched.Message ? (
                  <div className="text-center text-red-500">
                    {t(errors.Message)}
                  </div>
                ) : null}
                <textarea
                  id="Message"
                  name="Message"
                  value={values.Message}
                  rows={7}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm "
                  required
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-neutral"
                  style={languageStyles}
                >
                  {t("sendMessage")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ locale }) {
  const res = await fetch("https://dummyjson.com/products?limit=0");
  const data = await res.json();
  console.log(res);
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      data,
    },
  };
}

export default Contact;
