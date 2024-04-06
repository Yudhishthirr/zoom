"use server"
// this token provider component(file) running on server if we used other backend like django or 
//expree so we need to create it in this framwork but next js support server side and clinet side both
import { currentUser } from "@clerk/nextjs";
import { StreamClient } from "@stream-io/node-sdk";
import { use } from "react";

// refrence ->https://getstream.io/video/docs/api/
//here we ussed node-sdk(from stream io)
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async ()=>{
    const user = await currentUser();
    if(!user) throw new Error("User is Not Authenticated")
    if(!apiKey) throw new Error("No API key")
    if(!apiSecret) throw new Error("No API secret")
    // here we cresate our client by passing two parametters 1.api key ,2 is api secret
    const client = new StreamClient(apiKey,apiSecret)

    // exp is optional (by default the token is valid for an hour)
    const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;

    const issued = Math.floor(Date.now()/1000) - 60;

    const token = client.createToken(user.id,exp,issued)
    //to create token we need 1.user.id, 2. expiring date , 3. issued date
    return token;
}