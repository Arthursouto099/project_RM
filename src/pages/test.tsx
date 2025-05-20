import '../tailwind.css'


// Pagina teste <Somente para testar se está funcionando>
const Test = () => {
    return (
        <div className='flex  justify-center items-center h-screen  bg-gray-100'>
            <div className='flex flex-col  w-[300px]   bg-white shadow-lg rounded-md mx-auto my-10 '>
                <div className='text-center p-5 '>
                    <h1 className='font-bold   text-gray-600'>Pagina de Teste</h1>
                </div>
                <div className='text-center  p-1'>
                    <h2 className='font-bold text-green-300'>EM DESENVOLVIMENTO</h2>
                    <p className='p-5'>Tenha paciencia, estamos nos esforçando muito. Assim que o projeto estiver finalizado vamos iniciar com o deploy.
                    Você pode contrubuir para o projeto clicando <span className='text-green-300'> <a href="https://github.com/Arthursouto099/Arthursouto099-project_RM">aqui.</a> </span> </p>
                </div>

            </div>
        </div>

    )
}


export default Test