import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { IoLogoFacebook } from "react-icons/io";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider,
  db,
} from "../../firebaseConfig";
import { setUser } from "../../redux/slices/authSlice";
import { Toast } from "@/components";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

async function addToFirestore(email, firstName, lastName) {
  try {
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(userRef, {
        email: email,
        displayName: `${firstName} ${lastName}`,
        createdAt: new Date().toISOString(),
      });
      console.log("Document added for Email: ", email);
      return true;
    } else {
      console.log("Document already exists for Email: ", email);
      return false;
    }
  } catch (error) {
    console.error("Error adding document: ", error);
    return false;
  }
}

const Login = (props) => {
  const [showToast, setShowToast] = useState(false);
  const [emaillogin, setEmaillogin] = useState(false);
  const [emaillogin1, setEmaillogin1] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Add loading state
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const validateName = (name) => {
    return name.trim() !== "";
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    let valid = true;
    let errors = {};
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      valid = false;
      errors.email = "No user registered with this email";
    }

    if (!validatePassword(password)) {
      valid = false;
      errors.password =
        "Password must be at least 8 characters long and include at least one letter and one number";
    }

    setErrors(errors);

    if (valid) {
      setLoading(true);

      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;

        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          })
        );

        router.push("/");
      } catch (error) {
        if (
          error.code === "user not found" ||
          error.code === "password incorrect"
        ) {
          errors.email = "Invalid email or password";
          setErrors(errors);
        } else {
          console.error("Error signing in with Email", error);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    let valid = true;
    let errors = {};

    if (!validateEmail(email)) {
      valid = false;
      errors.email = "Invalid email format";
    }

    if (!validatePassword(password)) {
      valid = false;
      errors.password =
        "Password must be at least 8 characters long and include at least one letter and one number";
    }

    if (!validateName(firstName)) {
      valid = false;
      errors.firstName = "First name cannot be empty";
    }

    if (!validateName(lastName)) {
      valid = false;
      errors.lastName = "Last name cannot be empty";
    }

    setErrors(errors);
    if (valid) {
      console.log("Form is valid...");
      setLoading(true);
      try {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = result.user;
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        });
        await addToFirestore(user.email, firstName, lastName);

        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
        setEmaillogin1(true);
        return true;
      } catch (error) {
        console.error("Error signing up with Email", error);
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  const handleSignIn = async () => {
    setLoading(true); // Start loading indicator
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user data already exists in Firestore
      const isNewUser = await addToFirestore(
        user.email,
        user.displayName.split(" ")[0],
        user.displayName.split(" ")[1]
      );

      if (isNewUser) {
        // User data was added to Firestore (isNewUser is true)
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          })
        );
      } else {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          })
        );
      }

      router.push("/");
    } catch (error) {
      console.error("Error signing in with Google", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      const displayName = user.displayName;
      const spaceIndex = displayName.indexOf(" ");
      const firstName =
        spaceIndex !== -1 ? displayName.slice(0, spaceIndex) : displayName;
      const lastName =
        spaceIndex !== -1 ? displayName.slice(spaceIndex + 1) : "";

      await addToFirestore(user.email, firstName, lastName);

      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      );

      router.push("/");
    } catch (error) {
      console.error("Error signing in with Facebook", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl mt-5 text-center">Sign up | Login Form</h1>
      <div className="flex items-center justify-center min-h-80 pt-20">
        <div className="card w-[32rem] bg-neutral text-neutral-content">
          <div className="card-body items-center text-center">
            <h1 className="card-title text-4xl my-5">My Store</h1>
            {loading && (
              <span className="loading loading-bars loading-lg"></span>
            )}
            {emaillogin ? (
              <>
                <form onSubmit={handleEmailSignUp}>
                  <label className="input input-bordered flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4 opacity-70"
                    >
                      <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                      <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <input
                      type="text"
                      className="grow"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  {errors.email && (
                    <p className="text-red-500">{errors.email}</p>
                  )}

                  <label className="input input-bordered flex items-center gap-2 my-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4 opacity-70"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 9a5 5 0 0 0-5 5v1h10v-1a5 5 0 0 0-5-5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      type="text"
                      className="grow"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </label>
                  {errors.firstName && (
                    <p className="text-red-500">{errors.firstName}</p>
                  )}

                  <label className="input input-bordered flex items-center gap-2 my-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4 opacity-70"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 9a5 5 0 0 0-5 5v1h10v-1a5 5 0 0 0-5-5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      type="text"
                      className="grow"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </label>
                  {errors.lastName && (
                    <p className="text-red-500">{errors.lastName}</p>
                  )}

                  <label className="input input-bordered flex items-center gap-2 my-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4 opacity-70"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      type="password"
                      className="grow"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                  {errors.password && (
                    <p className="text-red-500">{errors.password}</p>
                  )}

                  <button className="btn btn-active btn-wide" type="submit">
                    Sign up
                  </button>
                </form>
                <p className="text-xs ">If you already have an account</p>
                <button
                  className="btn btn-active btn-wide"
                  onClick={() => {
                    setEmaillogin1(true);
                    setEmaillogin(false);
                  }}
                >
                  <MdEmail size={30} color="#463AA2" />
                  Login with Email
                </button>
                <p className="text-xs ">Or</p>
                <button
                  className="btn btn-active btn-wide"
                  onClick={() => setEmaillogin(false)}
                >
                  Sign in with Facebook Or Google
                </button>
                <p className="text-xs my-5">
                  By Creating an account you agree to our Terms & Conditions.
                </p>
              </>
            ) : emaillogin1 ? (
              <>
                <form onSubmit={handleEmailSignIn}>
                  <label className="input input-bordered flex items-center gap-2  my-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4 opacity-70"
                    >
                      <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                      <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <input
                      type="text"
                      className="grow"
                      placeholder="Email or Username"
                      value={emailOrUsername}
                      onChange={(e) => setEmailOrUsername(e.target.value)}
                    />
                  </label>
                  {errors.email && (
                    <p className="text-red-500">{errors.email}</p>
                  )}
                  <label className="input input-bordered flex items-center gap-2  my-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4 opacity-70"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      type="password"
                      className="grow"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                  {errors.code && <p className="text-red-500">{errors.code}</p>}
                  <button
                    className="btn btn-active btn-wide"
                    type="submit"
                    // onClick={handleEmailSignIn}
                  >
                    Login
                  </button>
                </form>
                <p className="text-xs my-5">
                  By logging in, you agree to our Terms & Conditions.
                </p>
                <button
                  className="btn btn-active btn-wide"
                  onClick={() => setEmaillogin1(false)}
                >
                  Back
                </button>
              </>
            ) : (
              <>
                <p className="text-sm ">Sign in using</p>
                <button
                  className="btn btn-active btn-wide"
                  onClick={handleSignIn}
                >
                  <FcGoogle size={30} /> Sign in with Google
                </button>
                <p className="text-xs ">Or</p>
                <button
                  className="btn btn-active btn-wide"
                  onClick={handleFacebookSignIn}
                >
                  <IoLogoFacebook size={30} className="icon" color="#1877F2" />{" "}
                  Sign in with Facebook
                </button>
                <p className="text-xs ">Or</p>
                <button
                  className="btn btn-active btn-wide"
                  onClick={() => setEmaillogin(true)}
                >
                  <MdEmail size={30} />
                  Sign up with Email
                </button>
                <p className="text-xs ">If you already have an account</p>
                <button
                  className="btn btn-active btn-wide"
                  onClick={() => setEmaillogin1(true)}
                >
                  <MdEmail size={30} color="#463AA2" />
                  Login with Email
                </button>
                <p className="text-xs my-5">
                  Make sure you&apos;re signed in to the browser with the same
                  Google, email or Facebook account you want to login.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      {/* </>
      )} */}
      {showToast && <Toast message="Sign Up Successfull" />}
    </>
  );
};

export default Login;
