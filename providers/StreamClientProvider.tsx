"use client"
import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';
import { useUser } from '@clerk/nextjs';
import {StreamVideo,StreamVideoClient} from '@stream-io/video-react-sdk';
import { ReactNode, useEffect, useState } from 'react';
  
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

// refrence -> https://getstream.io/video/docs/react/basics/quickstart/
// and this video service we used both video/react/sdk (from stream.io) and nodejs streams
// StreamVideoProvider yh function user ki datials leta hai calling ke liye
//is liye yh strema video client hai 
//tokenProvider hamere backend par hoga 


//finally we warap our root layout from this StreamVideo Provider
// so our app have access this all values

//now after this we can work on creating on meeting and calls and other oprations
const StreamVideoProvider = ({children}:{children:ReactNode}) => {
    const [videoClient,setVideoClient] = useState<StreamVideoClient>()

    const {user,isLoaded} = useUser();

    useEffect(()=>{

        if(!isLoaded || !user) return;

        if(!apiKey) throw new Error("Stream API key missisng")
          const client = new StreamVideoClient({
          // this StreamVideoClient is create a webstockt connection by user (who came from clerk/next)
          //its take our arrguents 1 our api key, 2. our user, 3 is  toekn (we create our token) in spreated file that call token provider
            apiKey,
            user:{
                id: user?.id,
                name: user?.username || user?.id,
                image: user?.imageUrl,
            },
            tokenProvider:tokenProvider
        })
//and after pass all parametters we pass our client in  setvideoClent(client) 
        setVideoClient(client)
    },[user,isLoaded]);

    if(!videoClient) return <Loader/>
    return (
      // and here we pass our videoclinet in streamvideo and inside it we pass our componets when we call it
      <StreamVideo client={videoClient}>
        {children}
      </StreamVideo>
    );
};
export default StreamVideoProvider