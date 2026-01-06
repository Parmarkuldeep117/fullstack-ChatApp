import { CircleUser, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Signup = () => {
  const [show, setShow] = useState(false)
  const { signup, isSigningUp } = useAuthStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()


  const onsubmit = async (data) => {
    const success = await signup(data)
    if (success) {
      reset()
      navigate("/home", { replace: true })
    }
  }

  return (
    <div
      className="min-h-screen  bg-[#111] flex items-center justify-center ">

      <form
        onSubmit={handleSubmit(onsubmit)}
        className="w-full  max-w-md p-8 rounded-2xl"
      >
        <div className="flex justify-center items-center">
            <img className="h-20 w-30" src="/yap.png" alt="yappy" />
        </div>
        <h2
          className="text-2xl font-bold text-white mb-2 text-center "
        > Create Account</h2>
        <h4 className="text-center text-[#666] mb-10">Get started with your free Account</h4>



        <div className="mb-4 relative">
          <h3 className="mb-2 text-[0.8rem] text-white">Full Name</h3>
          <input
            type="text"
            className="w-full px-2 py-2 rounded-lg
                       bg-white/30 pl-12 text-white
                       outline-none border border-white/40
                       focus:border-white"
            {...register("fullName",
              {
                required: true,
                minLength: {
                  value: 5,
                  message: "Name must be atleast 5 characters"
                }
              }
            )}
          />
          {errors.fullName?.type === "required" && (
            <span className="absolute  top-8 right-2 text-[1rem] font-bold text-red-500">
              *
            </span>
          )
          }
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
          )}
          <CircleUser className="absolute text-zinc-400 left-2 top-[36px]" />
        </div>

        <div className="mb-4 relative">
          <h3 className="mb-2 text-[0.8rem] text-white">Email</h3>
          <input
            type="email"
            className="w-full px-2 py-2 rounded-lg
                       bg-white/30 pl-12 text-white
                       outline-none border border-white/40
                       focus:border-white"
            {...register("email", {
              required: true,
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              }
            })}
          />
          {errors.email?.type === "required" && (
            <span className="absolute top-8 right-2 text-[1rem] font-bold text-red-500">
              *
            </span>
          )
          }
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
          <Mail className="absolute text-zinc-400 top-[36px] left-2" />
        </div>


        <div className="mb-8 relative ">
          <h3 className="mb-2 text-[0.8rem] text-white">Password</h3>
          <input
            type={show ? "text" : "password"}
            className="w-full px-2 py-2 rounded-lg
                       bg-white/30 pl-12 text-white
                       outline-none border flex items-center border-white/40
                       focus:border-white"
            {...register("password", {
              required: true,
              minLength: {
                value: 6,
                message: "password must be atleast 6 characters"
              }
            })}
          />
          {errors.password?.type === "required" && (
            <span className="absolute  top-8 right-2 text-[1rem] font-bold text-red-500">
              *
            </span>
          )}
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}

          <button
            type="button"
            onClick={() => setShow(p => !p)}
            className="absolute right-2 top-[36px]"
          >
            {show ? <Eye className="text-zinc-400" /> : <EyeOff className="text-zinc-400" />}
          </button>
          <Lock className="absolute text-zinc-400 left-2 top-[36px]" />
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-lg
                     bg-red-500 text-white font-semibold
                     hover:bg-red-700 transition
                     disabled:opacity-60"
          disabled={isSigningUp}>
          {isSigningUp ? "Creating" : "Create Account"}
        </button>
        <div className="flex w-full justify-center items-center mt-4 gap-2 font-semibold text-red-500">
          <p className="text-white">Already have an account ?</p>
          <NavLink
            to={"/login"}>Login</NavLink>
        </div>
      </form>
    </div>
  )
}

export default Signup
