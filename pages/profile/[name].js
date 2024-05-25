import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ProtectedRoute } from "@/components";
import { updateUserProfile } from "@/redux/slices/authSlice";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

async function updateUserProfileInFirestore(
  email,
  firstName,
  lastName,
  phone,
  address,
  profilePicURL
) {
  try {
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("email not found");
    } else {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        displayName: `${firstName} ${lastName}`,
        phone: phone || "",
        address: address || "",
        photoURL: profilePicURL || "",
        updatedAt: new Date().toISOString(),
      });
      console.log("Document updated for Data of: ", email);
      return true;
    }
  } catch (error) {
    console.error("Error updating document: ", error);
    return false;
  }
}

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicURL, setProfilePicURL] = useState(null);
  const [warningMessage, setWarningMessage] = useState("");

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

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(file);
      setProfilePicURL(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProfile = {
      displayName: `${firstName} ${lastName}`,
      photoURL: profilePicURL,
      phone: phone,
      address: address,
    };
    // Update Firestore
    const success = await updateUserProfileInFirestore(
      user.email,
      firstName,
      lastName,
      phone,
      address,
      profilePicURL
    );
    if (success) {
      dispatch(updateUserProfile(updatedProfile));
    }
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
              My Profile
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
                            <img src={profilePicURL} alt="Profile" />
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
                        onChange={handleProfilePicChange}
                        className="mb-4 file-input file-input-bordered file-input-neutral w-32 max-w-xs"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-4 mb-4">
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">First Name</span>
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          readOnly
                          className="input input-bordered w-full"
                          onClick={() =>
                            setWarningMessage("First name can't be changed")
                          }
                        />
                      </div>
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">Last Name</span>
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          readOnly
                          className="input input-bordered w-full"
                          onClick={() =>
                            setWarningMessage("Last name can't be changed")
                          }
                        />
                      </div>
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">Email Address</span>
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          readOnly
                          className="input input-bordered w-full"
                          onClick={() =>
                            setWarningMessage("Email can't be changed")
                          }
                        />
                      </div>
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">Phone Number</span>
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
                          <span className="label-text">Home Address</span>
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
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-xl mt-5 text-neutral font-extrabold">
            My Orders
          </h1>
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="text-lg">
                <tr>
                  <th></th>
                  <th>Order #</th>
                  <th>Placed On</th>
                  <th>Items</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
