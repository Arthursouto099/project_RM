

export type ping = {
    ping: string
}


export const pingServer = async (): Promise<ping>  => {
    const request = await fetch(`${import.meta.env.VITE_API_URL}/ping`)
    const response = await request.json()


    return response 
    
}