"use client"
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useToast } from './ui/use-toast';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import ReactDatePicker from 'react-datepicker';


const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
};


const MeetingTypeList = () => {
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>(undefined);
    //we have only this types of value for our meetings and also undefined here undefined meanning means meeting is close
    const router = useRouter()
    
    const {user} = useUser();

    const client = useStreamVideoClient()

    const [values, setValues] = useState(initialValues);

    const [callDetails,setCallDetails] = useState<Call>()

    const {toast} = useToast()
    //to understand this create meeting function first go to providers and take it streamClientProvider and Provider(action)
    const createMeeting = async()=>{
        if(!client || !user) return;
        
        try {
// here we chekced our meeting date 
          if(!values.dateTime){
            toast({title:"Please select a date and time"})
            return;
          }
          const id = crypto.randomUUID();//genrate a random id 
          const call = client.call('default',id);
// 
          if(!call) throw new Error("Faill to create call")

          const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();

          const description  = values.description || 'Instant meeting'
// getOrcreate is the function to start meeting
          await call.getOrCreate({
            data:{
              starts_at:startsAt,
              custom:{
                description
              }
            }
          })


          setCallDetails(call)
          if(!values.description){
            router.push(`/meeting/${call.id}`)
          }
          toast({title:"Meeting Created"})
        } catch (error) {
          toast({title:"Failled to create meeting"})
          console.log("Creat meating error",error)
        }
    }

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState('isInstantMeeting')}
      />
      {/* yh home card hamre list hai (grid) hai  */}
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        className="bg-blue-1"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
     <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        className="bg-purple-1"
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />

      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        className="bg-yellow-1"
        handleClick={() => router.push('/recordings')}
      />
      {!callDetails ?(
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          // className="text-center"
          // buttonText="Start Meeting"
          handleClick={createMeeting}
        >
        <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
        </div>
        <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ):(
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={()=>{
            navigator.clipboard.writeText(meetingLink);
            toast({title:'Link copied'})
          }}
          image={'/icons/checked.svg'}
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Copy Meeting Link"
      />
      ) }
      <MeetingModal
          isOpen={meetingState === 'isInstantMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Start an Instant Meeting"
          className="text-center"
          buttonText="Start Meeting"
          handleClick={createMeeting}
      />
{/* meeting model ek pop window ka work karti hai jo shadcn dialog ka use kari hai  yh ham ek hi componse ko mutiple time re use kar rhe hai  */}
{/* yha isopen mai hum meeting ka state (status ) pass kar rha hai for indentify ki kis type ki meeting hai  */}
{/* pop up ko close karne hai ke liye meeting status ko undefined kar dete hai */}
{/* main important handlClick hum button par click karne par kis function ko call karna chahte hai ->createMeeting function */}
      <MeetingModal
          isOpen={meetingState === 'isJoiningMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Start an Instant Meeting"
          className="text-center"
          buttonText="Start Meeting"
          handleClick={()=>router.push(values.link)}
      >
        <Input
          placeholder="Meeting link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </MeetingModal>
    </section>
  )
}

export default MeetingTypeList