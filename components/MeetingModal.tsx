import React,{ReactNode} from 'react'
import { Dialog, DialogContent } from "./ui/dialog";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {Button} from "./ui/button"
interface MeetingModalProps{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: ReactNode;
  handleClick?: () => void;
  buttonText?: string;
  instantMeeting?: boolean;
  image?: string;
  buttonClassName?: string;
  buttonIcon?: string;
}
//yh meeting model hai me hum deffrent type ke prorp define kar rhe hai hai 
//isopen yh shadcn dialog componet ki ek propertiy hai 
const MeetingModal = ({isOpen,onClose,title,handleClick,buttonText,
    instantMeeting,
    image,
    buttonClassName,
    buttonIcon,className,children}:MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white">
        <div className="flex flex-col gap-6">
          {image && (
            <div className="flex justify-center">
              <Image src={image} alt="checked" width={72} height={72} />
            </div>
          )}
          <h1 className={cn("text-3xl font-bold leading-[42px]", className)}>
            {title}
          </h1>
          {children}
          <Button
            className={
              "bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0"
            }
            onClick={handleClick}
          >
            {buttonIcon && (
              <Image
                src={buttonIcon}
                alt="button icon"
                width={13}
                height={13}
              />
            )}{" "}
            &nbsp;
            {buttonText || "Schedule Meeting"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MeetingModal