
import React, { useState } from "react"
import "../../tailwind.css"
import image from "../../assets/logo.png"
import UserApi from "../../api/UserApi"
import {toast, ToastContainer} from "react-toastify"

export default function Login() {
  const [form, setForm] = useState<"login" | "register">("register")


  return (
    <main className="w-screen h-screen">
      <div className="w-full h-full flex">

        <div className="h-full w-[50%] flex justify-center items-center ">
          <div className=" mt-16 w-[60%] h-[90%] ">
            <div className="flex items-end  gap-5">
              <img src={image} className="w-[10%]" alt="" />
              <h1 className="font-bold text-2xl">RELAX<span className="text-accent">MIND</span></h1>
            </div>

            <div className="mt-9 font-semibold opacity-80">
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem saepe beatae veniam quis iusto, consectetur, error vitae modi a</p>

           
            </div>

            <div className="h-[1px] mt-10 mb-10 w-full bg-gray-300"></div>

            <div className="flex gap-5 mt-8 mb-8">
              <h1 className={`${form === "login" ? "bg-accent p-2 rounded-md text-white font-semibold" : "p-2 rounded-md bg-gray-300 text-white font-semibold cursor-pointer" } `} onClick={() => setForm("login")}>Login</h1>
              <h1 className={`${form === "register" ? "bg-accent p-2 rounded-md text-white font-semibold" : "p-2 rounded-md bg-gray-300 text-white font-semibold cursor-pointer"}`} onClick={() => setForm("register")}>Register</h1>
            </div>


            {form === "register" && <RegisterForm/>}
            {form === "login" && <LoginForm/>}
           
          
               <div className="flex mt-6 gap-5">
                <button className="bg-blue-300 text-sm rounded-md font-semibold text-white w-full p-2">Conheça nosso Facebook</button>
                <button className=" bg-red-300 text-sm rounded-md font-semibold text-white w-full p-2">Conheça nosso Instagram</button>

              </div>

          </div>
        </div>

        <div className="h-full w-[50%] bg-accent">

        </div>

      </div>


    </main>


  )

}



const RegisterForm = () => {
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [cpf, setCpf] = useState<string>("")
    const [contact, setContact] = useState<string>("")
  
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      
      const res = await UserApi.post({username: name, email: email, cpf, password, contact})
      if(!res.success) {
        toast.error(res.message)
        return
      }

      toast.success(res.message)
      


    }
  
  return (

      


       <form onSubmit={onSubmit}>

        <ToastContainer position="top-center"></ToastContainer>

              <div className="grid grid-cols-2 gap-5 ">
                <div className="">
                  <label htmlFor="" className=""> <h1 className="font-semibold">Name</h1></label>
                  <input type="text" placeholder="Arthur Morgan"  onChange={(e) => setName(e.target.value)} className="border-b-1 w-full focus:outline-none focus:border-accent focus:ring-0 p-1 border-gray-300" />
                </div>
                <div className="">
                  <label htmlFor="" className=""> <h1 className="font-semibold">Email</h1></label>
                  <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" className="border-b-1  w-full focus:outline-none focus:border-accent focus:ring-0 p-1 border-gray-300" />
                </div>
                <div className="">
                  <label htmlFor="" className=""> <h1 className="font-semibold">Senha</h1></label>
                  <input type="password" placeholder="Talk2Us@"  onChange={(e) => setPassword(e.target.value)} className="border-b-1  w-full focus:outline-none focus:border-accent focus:ring-0 p-1 border-gray-300" />
                </div>
                <div className="">
                  <label htmlFor="" className=""> <h1 className="font-semibold">Cpf</h1></label>
                  <input type="text" placeholder="123.456.789-0"  onChange={(e) => setCpf(e.target.value)} className="border-b-1  w-full focus:outline-none focus:border-accent focus:ring-0 p-1 border-gray-300" />
                </div>
                <div className="col-span-2">
                  <label htmlFor="" className=""> <h1 className="font-semibold">Contato</h1></label>
                  <input type="text" placeholder="11987654321"  onChange={(e) => setContact(e.target.value)} className="border-b-1  w-full focus:outline-none focus:border-accent focus:ring-0 p-1 border-gray-300" />
                </div>

                <div>
                  <h1 className="mt-4">Esqueceu sua senha?</h1>
                </div>

                  <div className="flex mt-10 col-span-2 gap-2">
              <button className="p-2 bg-accent w-full rounded-md text-white"  type="submit">Registrar</button>
              <button className="p-2 bg-accent-dark w-full rounded-md text-white" disabled>Login</button>
              
            </div>





              </div>

            </form>
  )
}



const LoginForm = () => {
  return (
       <form>

              <div className="grid grid-cols-2 gap-5 ">
                <div className="col-span-2">
                  <label htmlFor="" className=""> <h1 className="font-semibold">Email</h1></label>
                  <input type="email" placeholder="example@gmail.com" className="border-b-1  w-full focus:outline-none focus:border-accent focus:ring-0 p-1 border-gray-300" />
                </div>
                <div className="col-span-2">
                  <label htmlFor="" className=""> <h1 className="font-semibold">Senha</h1></label>
                  <input type="password" placeholder="Talk2Us@" className="border-b-1  w-full focus:outline-none focus:ring-0 focus:border-accent p-1 border-gray-300" />
                </div>

                <div>
                  <h1 className="mt-4">Esqueceu sua senha?</h1>
                </div>

                  <div className="flex mt-10 col-span-2 gap-2">
              <button className="p-2 bg-accent-dark w-full rounded-md text-white" disabled>Registrar</button>
              <button className="p-2 bg-accent w-full rounded-md text-white" >Login</button>
              
            </div>





              </div>

            </form>
  )
}