import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ProtectedRoute, Toast } from "@/components";
import { updateUserProfile } from "@/redux/slices/authSlice";
import { db, storage } from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

async function updateUserProfileInFirestore(
  email,
  firstName,
  lastName,
  phone,
  address,
  file
) {
  try {
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("email not found");
      return false;
    } else {
      const docRef = querySnapshot.docs[0].ref;

      let profilePicURL = "";
      if (file) {
        const fileName = file.name;
        const storageRef = ref(storage, `${email}/${fileName}`);
        await uploadBytes(storageRef, file);
        profilePicURL = await getDownloadURL(storageRef);
        console.log("uploaded url", profilePicURL);
      }

      await updateDoc(docRef, {
        displayName: `${firstName} ${lastName}`,
        phone: phone || "",
        address: address || "",
        photoURL: profilePicURL || "",
        updatedAt: new Date().toISOString(),
      });
      console.log("Document updated for Data of: ", email);
      return profilePicURL;
    }
  } catch (error) {
    console.error("Error updating document: ", error);
    return false;
  }
}

const Profile = () => {
  const [showToast, setShowToast] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicURL, setProfilePicURL] = useState(null);
  const [warningMessage, setWarningMessage] = useState("");
  const { t } = useTranslation("common");
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const splitName = () => {
    if (user && user.displayName) {
      const nameParts = user.displayName.split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts[1] || "");
    }
  };

  useEffect(() => {
    splitName();
    if (user) {
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setProfilePicURL(user.photoURL || null);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const objectUrl = URL.createObjectURL(file);
      setProfilePicURL(objectUrl); // Display image preview immediately
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserProfileInFirestore(
      user.email,
      firstName,
      lastName,
      phone,
      address,
      profilePic
    );
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
    const updatedProfile = {
      displayName: `${firstName} ${lastName}`,
      photoURL: profilePicURL,
      phone: phone,
      address: address,
    };
    dispatch(updateUserProfile(updatedProfile));
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <ProtectedRoute>
      <div>
        <div className="flex items-center justify-center m-2 mb-10 mt-10">
          <h1 className="text-4xl font-bold">
            <span className="bg-neutral text-neutral-content flex items-center p-2">
              {t("profileTitle")}
            </span>
          </h1>
        </div>
        <div className="p-10">
          <div className="p-6 bg-base-100 text-base-content">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
              {warningMessage && (
                <div className="alert alert-warning mb-4">{warningMessage}</div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-2 mb-4">
                  <div className="col-span-1">
                    <div className="flex flex-col items-center">
                      <div className="avatar mb-4">
                        <div className="w-24 rounded-full">
                          {profilePicURL ? (
                            <img
                              src={profilePicURL || user.photoURL}
                              alt="Profile"
                            />
                          ) : (
                            <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M10 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H3z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mb-4 file-input file-input-bordered file-input-neutral w-32 max-w-xs"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-4 mb-4">
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">
                            {t("firstName")}
                          </span>
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="input input-bordered w-full"
                        />
                      </div>
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">
                            {t("lastName")}
                          </span>
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="input input-bordered w-full"
                        />
                      </div>
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">{t("emailLabel")}</span>
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          readOnly
                          className="input input-bordered w-full"
                        />
                      </div>
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">{t("phoneLabel")}</span>
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="input input-bordered w-full"
                        />
                      </div>
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">
                            {t("addressLabel")}
                          </span>
                        </label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="input input-bordered w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="btn btn-neutral">
                    {t("updateProfileBtn")}
                  </button>
                </div>
              </form>
              {showToast && <Toast message={t("profileUpdatedToast")} />}
            </div>
          </div>
          <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-xl mt-5 text-neutral font-extrabold">
              {t("myOrdersTitle")} 
            </h1>
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="text-lg">
                  <tr>
                    <th></th>
                    <th>{t("orderNumber")}</th>{" "}
             
                    <th>{t("placedOn")}</th> 
                    <th>{t("items")}</th> 
                    <th>{t("total")}</th> 
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

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
export default Profile;
