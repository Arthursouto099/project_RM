import dotenv from "dotenv";

dotenv.config()

export type ping = {
    ping: string
}


export const pingServer = async (): Promise<ping>  => {
    const request = await fetch(`${process.env.API_URL}/ping`)
    const response = await request.json()

    return response 
    
}