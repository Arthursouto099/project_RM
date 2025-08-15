import img1 from "../../assets/1.png"



export default function Login() {



  return (
    <div className="w-screen h-screen  md:flex ">
      <div className="w-1/2 h-full flex justify-center items-center   bg-blue-400 lg:bg-blue-400">
        <div className="p-7 flex justify-center items-center">
          <div className="font-bold p-7 text-gray-100 flex flex-col items-center justify-center  text-center" >
            <h1 className="text-8xl">Lorem ipsum dolor sit a</h1>
            <div className="p-3 max-w-2xl bg-blue-500 m-8 rounded-3xl">
              <h2 className="text-2xl">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab ea at natus  </ h2>
            </div>
          </div>
        </div>
      </div>

      <div className="w-1/2 h-full bg-blue-400 lg:bg-white flex  justify-center items-center">
        <div className="w-[85%]  h-[70%] flex justify-center items-center">
          <div className="w-full h-full">
            <div className="w-full h-full flex justify-center items-center ">
              <form className="w-120 rounded-lg shadow-2xs h-[90%] bg-blue-400">
                <div className="w-[100%] p-5 justify-center text-center items-center">
                  
                  <h1 className="font-semibold p-3 text-white text-3xl">Faça seu cadastro</h1>


                  <div className="h-0.5  bg-white" ></div>
                    
                </div>


                <div className="grid grid-cols-2">


                </div>


              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}