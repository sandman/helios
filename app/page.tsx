"use client";

import { ModeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { beep } from '@/utils/audio';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Camera, FlipHorizontal, MoonIcon, PersonStanding, SunIcon, Video, Volume, Volume2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Rings } from 'react-loader-spinner';
import Webcam from 'react-webcam';
import { toast } from "sonner";
import SocialMediaLinks from '@/components/social-links';
import * as cocossd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';

type Props = {}

const HomePage = (props: Props) => {

  const webcamRef = useRef<Webcam>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  // state
  const [isRecording, setRecording] = useState<boolean>(false);
  const [autoRecordEnabled, setautoRecordEnabled] = useState<boolean>(false);
  const [mirrored, setMirrored] = useState<boolean>(false);
  const [volume, setVolume] = useState(0.8);
  const [model, setModel] = useState<cocossd.ObjectDetection>();
  const [loading, setloading] = useState(false)

  useEffect(() => {
    setloading(true);
    initModel();

  }, []);

  async function initModel() {
    const model: cocossd.ObjectDetection = await cocossd.load({
      base: 'mobilenet_v2'
    });
    setModel(model);
  };

  useEffect(() => {
    if (model) {
      setloading(false);
    }

  }, [model]);


  return (
    <div className='flex h-screen'>
      { /* Left section: webcam and canvas */}
      <div className='relative'>
        <div className='relative h-screen w-full'>
          <Webcam
            audio={false}
            ref={webcamRef}
            mirrored={mirrored}
            className='h-full w-full object-contain p-2'
          />
          <canvas ref={canvasRef}
            className='absolute top-0 h-full w-full object-contain' >
          </canvas>
        </div>
      </div>

      { /* Right section: controls */}
      <div className='flex flex-row flex-1'>
        <div className='border-primary/5 border-2 max-w-xs flex flex-col gap-2 justify-between shadow-md rounded-md p-4'>
          { /* Top section */}
          <div className='flex flex-col gap-2'>
            <ModeToggle />
            <Button variant={'outline'}
              size={'icon'}
              onClick={()=>{
                setMirrored((prev) => !prev)

              }}>
              <FlipHorizontal />
            </Button>
            <Separator className='my-2' />
          </div>

          { /* Middle section */}
          <div className='flex flex-col gap-2'>
            <Separator className='my-2' />
            <Button variant={'outline'} size={'icon'}
              onClick={userPromptScreenshot}>
              <Camera />
            </Button>

            <Button variant={isRecording ? 'destructive' : 'outline'} size={'icon'}
              onClick={userPromptRecord}>
              <Video />
            </Button>
            <Separator className='my-2' />

            <Button variant={autoRecordEnabled ? 'destructive' : 'outline'} size={'icon'}
              onClick={toggleAutoRecord}>
                {autoRecordEnabled ? <Rings color='white' height={45} /> : <PersonStanding />}

            </Button>
          </div>

          { /* Bottom section */}
          <div className='flex flex-col gap-2'></div>
          <Separator className='my-2' />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={'outline'} size={'icon'}>
                <Volume2 />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Slider max={1}
                      min={0}
                      step={0.2}
                      defaultValue={[volume]}
                      onValueCommit={(val)=>{
                        setVolume(val[0]);
                        beep(val[0]);
                      }}
                      />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className='h-full flex-1 py-4 px-2 overflow-y-school'>
        <RenderFeatureHighlightsSection />
      </div>

    </div>
  )

  function userPromptScreenshot() {

    // take picture

    // Save it to downloads
  }

  function userPromptRecord() {
    if (isRecording) {
      // stop recording
      setRecording(false)
      // Save to Downloads
    } else {
      // start recording
      setRecording(true)
    }
  }

  function toggleAutoRecord() {
    if (autoRecordEnabled) {
      // stop recording
      setautoRecordEnabled(false);
      toast("Auto record disabled");
    }
    else {
      // start recording
      setautoRecordEnabled(true);
      toast("Auto record enabled");
    }
  }


  // Inner components
  function RenderFeatureHighlightsSection() {
    return
    // return <div className="text-xs text-muted-foreground">
    //   <ul className="space-y-4">
    //     <li>
    //       <strong>Dark Mode/Sys Theme 🌗</strong>
    //       <p>Toggle between dark mode and system theme.</p>
    //       <Button className="my-2 h-6 w-6" variant={"outline"} size={"icon"}>
    //         <SunIcon size={14} />
    //       </Button>{" "}
    //       /{" "}
    //       <Button className="my-2 h-6 w-6" variant={"outline"} size={"icon"}>
    //         <MoonIcon size={14} />
    //       </Button>
    //     </li>
    //     <li>
    //       <strong>Horizontal Flip ↔️</strong>
    //       <p>Adjust horizontal orientation.</p>
    //       <Button className='h-6 w-6 my-2'
    //         variant={'outline'} size={'icon'}
    //         onClick={() => {
    //           setMirrored((prev) => !prev)
    //         }}
    //       ><FlipHorizontal size={14} /></Button>
    //     </li>
    //     <Separator />
    //     <li>
    //       <strong>Take Pictures 📸</strong>
    //       <p>Capture snapshots at any moment from the video feed.</p>
    //       <Button
    //         className='h-6 w-6 my-2'
    //         variant={'outline'} size={'icon'}
    //         onClick={userPromptScreenshot}
    //       >
    //         <Camera size={14} />
    //       </Button>
    //     </li>
    //     <li>
    //       <strong>Manual Video Recording 📽️</strong>
    //       <p>Manually record video clips as needed.</p>
    //       <Button className='h-6 w-6 my-2'
    //         variant={isRecording ? 'destructive' : 'outline'} size={'icon'}
    //         onClick={userPromptRecord}
    //       >
    //         <Video size={14} />
    //       </Button>
    //     </li>
    //     <Separator />
    //     <li>
    //       <strong>Enable/Disable Auto Record 🚫</strong>
    //       <p>
    //         Option to enable/disable automatic video recording whenever
    //         required.
    //       </p>
    //       <Button className='h-6 w-6 my-2'
    //         variant={autoRecordEnabled ? 'destructive' : 'outline'}
    //         size={'icon'}
    //         onClick={toggleAutoRecord}
    //       >
    //         {autoRecordEnabled ? <Rings color='white' height={30} /> : <PersonStanding size={14} />}

    //       </Button>
    //     </li>

    //     <li>
    //       <strong>Volume Slider 🔊</strong>
    //       <p>Adjust the volume level of the notifications.</p>
    //     </li>
    //     <li>
    //       <strong>Camera Feed Highlighting 🎨</strong>
    //       <p>
    //         Highlights persons in{" "}
    //         <span style={{ color: "#FF0F0F" }}>red</span> and other objects in{" "}
    //         <span style={{ color: "#00B612" }}>green</span>.
    //       </p>
    //     </li>
    //     <Separator />
    //     <li className="space-y-4">
    //       <strong>Share your thoughts 💬 </strong>
    //       <SocialMediaLinks/>
    //       <br />
    //       <br />
    //       <br />
    //     </li>
    //   </ul>
    // </div>
  }
    //

}

export default HomePage