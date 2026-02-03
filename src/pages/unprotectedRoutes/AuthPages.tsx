import React, { useState } from "react";
import "../../tailwind.css";
import image from "../../assets/logo.png";
import UserApi from "../../api/UserApi";
import {toast} from "sonner"
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState<"login" | "register">("register");

  return (
    <main className="w-screen h-screen overflow-y-hidden">
      <div className="w-full h-full flex">
        <div className="h-full  w-[50%] flex justify-center items-center ">
          <div className=" mt-16 w-[60%] h-[90%] ">
            <div className="flex items-end  gap-5">
              <img src={image} className="w-[10%]" alt="" />
              <h1 className="font-bold text-2xl">
                RELAX<span className="text-accent-normal">MIND</span>
              </h1>
            </div>

            <div className="font-normal mt-5 opacity-80">
              <p>
                Um app prático de desenvolvimento pessoal e autoajuda, com
                ferramentas e conteúdos pensados para ajudar você a criar
                hábitos positivos, aumentar sua produtividade e evoluir todos os
                dias.
              </p>
            </div>

            <div className="h-[1px] mt-5 mb-10 w-full bg-gray-300"></div>

            <div className="flex gap-5 mt-8 mb-8">
              <h1
                className={` p-1 text-black text-[15px]  font-semibold  ${
                  form === "login"
                    ? " scale-102 border-b-1 border-b-accent-normal "
                    : "  cursor-pointer"
                }`}
                onClick={() => setForm("login")}
              >
                Login
              </h1>

              <h1
                className={`p-1  text-[15px] font-semibold   ${
                  form === "register"
                    ? " text-black scale-102 border-b-1 border-b-accent-normal"
                    : " text-black cursor-pointer "
                }`}
                onClick={() => setForm("register")}
              >
                Register
              </h1>
            </div>

            {form === "register" && (
              <RegisterForm
                action={() => {
                  setForm("login");
                }}
              />
            )}
            {form === "login" && <LoginForm />}

            {/* <div className="flex mt-6 gap-5">
                <button className="bg-blue-300 text-sm rounded-md font-semibold text-white w-full p-2">Conheça nosso Facebook</button>
                <button className=" bg-red-300 text-sm rounded-md font-semibold text-white w-full p-2">Conheça nosso Instagram</button>

              </div> */}
          </div>
        </div>

        <div
          className="h-full w-[50%] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/woman-having-video-call-home-laptop-device.jpg')",
          }}
        ></div>
      </div>
    </main>
  );
}

const RegisterForm = ({ action }: { action: () => void }) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [contact, setContact] = useState<string>("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await UserApi.post({
      username: name,
      email: email,
      cpf,
      password,
      contact,
    });
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    action()
    toast.success(res.message);
  };

  return (
    <form onSubmit={onSubmit}>
     

      <div className="grid grid-cols-2 gap-5 ">
        <div className="">
          <label htmlFor="" className="">
            {" "}
            <h1 className="font-semibold">Name</h1>
          </label>
          <input
            type="text"
            placeholder="Arthur Morgan"
            required
            onChange={(e) => setName(e.target.value)}
            className="border-b-1 w-full focus:outline-none focus:border-accent-normal focus:ring-0 p-1 border-gray-300"
          />
        </div>
        <div className="">
          <label htmlFor="" className="">
            {" "}
            <h1 className="font-semibold">Email</h1>
          </label>
          <input
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            className="border-b-1  w-full focus:outline-none focus:border-accent-normal focus:ring-0 p-1 border-gray-300"
          />
        </div>
        <div className="">
          <label htmlFor="" className="">
            {" "}
            <h1 className="font-semibold">Senha</h1>
          </label>
          <input
            type="password"
            required
            placeholder="Talk2Us@"
            onChange={(e) => setPassword(e.target.value)}
            className="border-b-1  w-full focus:outline-none focus:border-accent-normal focus:ring-0 p-1 border-gray-300"
          />
        </div>
        <div className="">
          <label htmlFor="" className="">
            {" "}
            <h1 className="font-semibold">Cpf</h1>
          </label>
          <input
            type="text"
            required
            placeholder="123.456.789-0"
            onChange={(e) => setCpf(e.target.value)}
            className="border-b-1  w-full focus:outline-none focus:border-accent-normal focus:ring-0 p-1 border-gray-300"
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="" className="">
            {" "}
            <h1 className="font-semibold">Contato</h1>
          </label>
          <input
            type="text"
            placeholder="11987654321"
            onChange={(e) => setContact(e.target.value)}
            className="border-b-1  w-full focus:outline-none focus:border-accent-normal focus:ring-0 p-1 border-gray-300"
          />
        </div>

        <div>
          <h1 className="mt-4">Esqueceu sua senha?</h1>
        </div>

        <div className="flex  col-span-2 gap-2">
          <button
            className="p-2 bg-accent-normal cursor-pointer hover:bg-accent/90 w-full rounded-md text-white"
            type="submit"
          >
            Registrar
          </button>
        </div>
      </div>
    </form>
  );
};

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await UserApi.login({ email: email, password: password });
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    navigate("/home");
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-5 ">
        <div className="col-span-2">
          <label htmlFor="" className="">
            {" "}
            <h1 className="font-semibold">Email</h1>
          </label>
          <input
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            className="border-b-1  w-full focus:outline-none focus:border-accent-normal focus:ring-0 p-1 border-gray-300"
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="" className="">
            {" "}
            <h1 className="font-semibold">Senha</h1>
          </label>
          <input
            type="password"
            required
            placeholder="Talk2Us@"
            onChange={(e) => setPassword(e.target.value)}
            className="border-b-1  w-full focus:outline-none focus:border-accent-normal focus:ring-0 p-1 border-gray-300"
          />
        </div>

        <div>
          <h1 className="mt-4">Esqueceu sua senha?</h1>
        </div>

        <div className="flex  col-span-2 gap-2">
          <button
            className=" cursor-pointer  p-2 bg-accent-normal hover:bg-accent/90 w-full rounded-md text-white"
            type="submit"
          >
            Login
          </button>
        </div>
      </div>
    </form>
  );
};
