import { Camera, Loader, Mail, User } from 'lucide-react';
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
const Profile = () => {

  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore()


  const def = "/default.jpg"
  const [preview, setPreview] = useState(null);
  const created = authUser.createdAt?.split("T")[0]

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setPreview(URL.createObjectURL(file))
    await updateProfile(file)

  };


  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])


  return (
    <div className='h-screen flex justify-center p-5 items-center w-full'>
      <section className="max-w-[400px] profile border border-base-300 shadow-2xl bg-gradient-to-br from-base-100 via-base-200 to-base-100
 rounded-2xl p-5 w-[50%] relative">

        <h3 className="text-center text-xl font-bold mb-3 tracking-wider text-base-content">Profile</h3>
        <h4 className="text-center text-[0.77rem] text-content-base  tracking-widest mb-10">
          your profile information
        </h4>

        {/* Avatar */}
        <div className="avatar-container leading-tight size-25 relative rounded-full overflow-hidden bg-red-100 mx-auto">
          <img
            className="w-full h-full object-center object-cover"
            src={preview || authUser.profilepic || def}
            alt="avatar"
            onError={(e) => e.target.src = def}
          />
        </div>

        <label className="camera-button cursor-pointer ">
          <Camera className="p-1 rounded-2xl size-6 bg-gray-600 text-white" />

          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </label>

        {isUpdatingProfile ? <h3 className='flex justify-center mt-2 text-[0.7rem] text-gray-600'><Loader className='animate-spin'/></h3> : <h3 className='text-center mt-2 text-[0.77rem] text-gray-600'>Click on the camera to update your profile</h3>}

        <div className="fullname mt-10">
          <h3 className='flex gap-1 mb-2 justify-start items-center'><User className='h-5 text-base-content' /> <span className="name text-base-content">Full Name</span></h3>
          <div className='p-2 bg-base-100 rounded w-full min-w-fit border name border-base-300'>
            {authUser.fullName}
          </div>
        </div>

        <div className="fullname mt-4">
          <h3 className='flex gap-1 mb-2 justify-start items-center'><Mail className='text-base-content h-5' /> <span className="email text-base-content">Email</span></h3>
          <div className='p-2 bg-base-100 email rounded w-full min-w-fit border border-base-300'>
            {authUser.email}
          </div>
        </div>

        <div className='mb-6 text-gray-600 text-center mt-10 account'>
          <h1 >Account Information</h1>
        </div>


        <div className='flex px-3 text-base-content  mb-2 justify-between name'>
          <h5>Member since</h5>
          <h5>{created}</h5>
        </div>

        <hr className='w-[94%] border-b-1 mx-auto mt-3 mb-2 border-base-300' />

        <div className='flex px-3 text-base-content justify-between name'>
          <h5>Account Status</h5>
          <h5 className='text-green-500'>Active</h5>
        </div>

      </section>
    </div>
  );
};

export default Profile;
