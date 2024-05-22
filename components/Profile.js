import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Profile = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const user = useSelector((state) => state.auth.user);

  const splitName = () => {
    const nameParts = user.displayName.split(" ");
    setFirstName(nameParts[0]);
    setLastName(nameParts[1]);
  };

  useEffect(() => {
    splitName();
  }, []);

  return (
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
            <div className=" grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-2 mb-4">
              <div className="col-span-1">
                <div className="flex flex-col items-center">
                  <div className="avatar mb-4">
                    <div className="w-24 rounded-full">
                      {profilePic ? (
                        <img src={profilePic} alt="Profile" />
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
                    // onChange={handleProfilePicChange}
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
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Last Name</span>
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
                      <span className="label-text">Email Address</span>
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input input-bordered w-full"
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
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-xl mt-5 text-neutral font-extrabold">My Orders</h1>
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="text-lg ">
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
  );
};

export default Profile;
