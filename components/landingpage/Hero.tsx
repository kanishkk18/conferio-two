'use client'

import ContainerScroll from "../ui/container-scroll-animation";
import { Button } from "../ui/button"
import { Input } from "../ui/input"
// import { BackgroundGradientAnimation } from "../ui/background-gradient-animation"
import { 
  Sun, 
  Briefcase, 
  Calendar, 
  Check, 
  MoreHorizontal,
  MessageSquare,
  Star,
  Share2,
  User,
  Heart,
  Image as ImageIcon,
  Award, Search, Plus, ArrowLeft, MoreVertical, Trash2} from "lucide-react"
// import { motion } from "framer-motion"
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "../ui/accordion"
// import Image from "next/image"
import { useState } from 'react'
import { Card } from '../ui/card'
// import { Checkbox } from '../ui/checkbox'
// import { Badge } from '../ui/badge'
import { MdLightMode, MdWorkOutline } from "react-icons/md";


interface Task {
  id: number
  title: string
  completed: boolean
  tag?: string
}


export function Hero() {

  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Promote Bento Cards v.2', completed: false },
    { id: 2, title: 'Release Bento Cards for Framer', completed: false, tag: 'Moyo Shira' },
    { id: 3, title: 'Bento Cards: UI Components', completed: false },
    { id: 4, title: 'Removr Illustrations', completed: true },
    { id: 5, title: 'Bento Cards v. 4', completed: false },
  ]);

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length

  const faqs = [
    {
      question: "Is SimpleList free to use?",
      answer: "Yes, SimpleList offers a free tier with essential features. Premium features are available with a subscription."
    },
    {
      question: "Can I sync my lists across multiple devices?",
      answer: "Yes, your lists automatically sync across all your devices when you're signed in to your SimpleList account."
    },
    {
      question: "How secure is my data on SimpleList?",
      answer: "We use industry-standard encryption and security measures to protect your data. Your information is stored securely and never shared with third parties."
    },
    {
      question: "Can I share my lists with others?",
      answer: "Yes, you can easily share your lists with family, friends, or colleagues while maintaining control over editing permissions."
    },
    {
      question: "Is there a limit to how many lists or items I can create?",
      answer: "Free accounts can create up to 10 lists with 100 items each. Premium accounts have unlimited lists and items."
    }
  ]
  return (
    <section className="relative flex items-center justify-center dark">
      <div className="relative items-center w-full">


        <div className="b relative mb-12 overflow-hidden bg-gray-50 py-10 dark:bg-black md:py-40"><svg width="166" height="298" viewBox="0 0 166 298" fill="none" xmlns="http://www.w3.org/2000/svg" className="aspect-square pointer-events-none absolute inset-x-0 top-0 h-[100px] w-full md:h-[200px]"><line y1="-0.5" x2="406" y2="-0.5" transform="matrix(0 1 1 0 1 -108)" stroke="url(#paint0_linear_254_143)"></line><line y1="-0.5" x2="406" y2="-0.5" transform="matrix(0 1 1 0 34 -108)" stroke="url(#paint1_linear_254_143)"></line><line y1="-0.5" x2="406" y2="-0.5" transform="matrix(0 1 1 0 67 -108)" stroke="url(#paint2_linear_254_143)"></line><line y1="-0.5" x2="406" y2="-0.5" transform="matrix(0 1 1 0 100 -108)" stroke="url(#paint3_linear_254_143)"></line><line y1="-0.5" x2="406" y2="-0.5" transform="matrix(0 1 1 0 133 -108)" stroke="url(#paint4_linear_254_143)"></line><line y1="-0.5" x2="406" y2="-0.5" transform="matrix(0 1 1 0 166 -108)" stroke="url(#paint5_linear_254_143)"></line><defs><linearGradient id="paint0_linear_254_143" x1="-7.42412e-06" y1="0.500009" x2="405" y2="0.500009" gradientUnits="userSpaceOnUse"><stop stop-color="white"></stop><stop offset="1" stop-opacity="0"></stop></linearGradient><linearGradient id="paint1_linear_254_143" x1="-7.42412e-06" y1="0.500009" x2="405" y2="0.500009" gradientUnits="userSpaceOnUse"><stop stop-color="white"></stop><stop offset="1" stop-opacity="0"></stop></linearGradient><linearGradient id="paint2_linear_254_143" x1="-7.42412e-06" y1="0.500009" x2="405" y2="0.500009" gradientUnits="userSpaceOnUse"><stop stop-color="white"></stop><stop offset="1" stop-opacity="0"></stop></linearGradient><linearGradient id="paint3_linear_254_143" x1="-7.42412e-06" y1="0.500009" x2="405" y2="0.500009" gradientUnits="userSpaceOnUse"><stop stop-color="white"></stop><stop offset="1" stop-opacity="0"></stop></linearGradient><linearGradient id="paint4_linear_254_143" x1="-7.42412e-06" y1="0.500009" x2="405" y2="0.500009" gradientUnits="userSpaceOnUse"><stop stop-color="white"></stop><stop offset="1" stop-opacity="0"></stop></linearGradient><linearGradient id="paint5_linear_254_143" x1="-7.42412e-06" y1="0.500009" x2="405" y2="0.500009" gradientUnits="userSpaceOnUse"><stop stop-color="white"></stop><stop offset="1" stop-opacity="0"></stop></linearGradient></defs></svg><svg width="445" height="418" viewBox="0 0 445 418" fill="none" xmlns="http://www.w3.org/2000/svg" className="aspect-square pointer-events-none absolute inset-x-0 -bottom-20 z-20 h-[150px] w-full md:h-[300px]"><line x1="139.5" y1="418" x2="139.5" y2="12" stroke="url(#paint0_linear_0_1)"></line><line x1="172.5" y1="418" x2="172.5" y2="12" stroke="url(#paint1_linear_0_1)"></line><line x1="205.5" y1="418" x2="205.5" y2="12" stroke="url(#paint2_linear_0_1)"></line><line x1="238.5" y1="418" x2="238.5" y2="12" stroke="url(#paint3_linear_0_1)"></line><line x1="271.5" y1="418" x2="271.5" y2="12" stroke="url(#paint4_linear_0_1)"></line><line x1="304.5" y1="418" x2="304.5" y2="12" stroke="url(#paint5_linear_0_1)"></line><path d="M1 149L109.028 235.894C112.804 238.931 115 243.515 115 248.361V417" stroke="url(#paint6_linear_0_1)" stroke-opacity="0.1" stroke-width="1.5"></path><path d="M444 149L335.972 235.894C332.196 238.931 330 243.515 330 248.361V417" stroke="url(#paint7_linear_0_1)" stroke-opacity="0.1" stroke-width="1.5"></path><defs><linearGradient id="paint0_linear_0_1" x1="140.5" y1="418" x2="140.5" y2="13" gradientUnits="userSpaceOnUse"><stop stop-color="white"></stop><stop offset="1" stop-opacity="0"></stop></linearGradient><linearGradient id="paint1_linear_0_1" x1="173.5" y1="418" x2="173.5" y2="13" gradientUnits="userSpaceOnUse"><stop stop-color="white"></stop><stop offset="1" stop-opacity="0"></stop></linearGradient><linearGradient id="paint2_linear_0_1" x1="206.5" y1="418" x2="206.5" y2="13" gradientUnits="userSpaceOnUse"><stop stop-color="white"></stop><stop offset="1" stop-opacity="0"></stop></linearGradient><linearGradient id="paint3_linear_0_1" x1="239.5" y1="418" x2="239.5" y2="13" gradientUnits="userSpaceOnUse"><stop stop-color="white"></stop><stop offset="1" stop-opacity="0"></stop></linearGradient><linearGradient id="paint4_linear_0_1" x1="272.5" y1="418" x2="272.5" y2="13" gradientUnits="userSpaceOnUse"><stop stop-color="white"></stop><stop offset="1" stop-opacity="0"></stop></linearGradient><linearGradient id="paint5_linear_0_1" x1="305.5" y1="418" x2="305.5" y2="13" gradientUnits="userSpaceOnUse"><stop stop-color="white"></stop><stop offset="1" stop-opacity="0"></stop></linearGradient><linearGradient id="paint6_linear_0_1" x1="115" y1="390.591" x2="-59.1703" y2="205.673" gradientUnits="userSpaceOnUse"><stop offset="0.481613" stop-color="#F8F8F8"></stop><stop offset="1" stop-color="#F8F8F8" stop-opacity="0"></stop></linearGradient><linearGradient id="paint7_linear_0_1" x1="330" y1="390.591" x2="504.17" y2="205.673" gradientUnits="userSpaceOnUse"><stop offset="0.481613" stop-color="#F8F8F8"></stop><stop offset="1" stop-color="#F8F8F8" stop-opacity="0"></stop></linearGradient></defs></svg><svg width="1382" height="370" viewBox="0 0 1382 370" fill="none" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute inset-0 z-30 h-full w-full"><path d="M268 115L181.106 6.97176C178.069 3.19599 173.485 1 168.639 1H0" stroke="url(#paint0_linear_337_46)" stroke-opacity="0.1" stroke-width="1.5"></path><path d="M1114 115L1200.89 6.97176C1203.93 3.19599 1208.52 1 1213.36 1H1382" stroke="url(#paint1_linear_337_46)" stroke-opacity="0.1" stroke-width="1.5"></path><path d="M268 255L181.106 363.028C178.069 366.804 173.485 369 168.639 369H0" stroke="url(#paint2_linear_337_46)" stroke-opacity="0.1" stroke-width="1.5"></path><path d="M1114 255L1200.89 363.028C1203.93 366.804 1208.52 369 1213.36 369H1382" stroke="url(#paint3_linear_337_46)" stroke-opacity="0.1" stroke-width="1.5"></path><defs><linearGradient id="paint0_linear_337_46" x1="26.4087" y1="1.00001" x2="211.327" y2="175.17" gradientUnits="userSpaceOnUse"><stop offset="0.481613" stop-color="#F8F8F8"></stop><stop offset="1" stop-color="#F8F8F8" stop-opacity="0"></stop></linearGradient><linearGradient id="paint1_linear_337_46" x1="1355.59" y1="1.00001" x2="1170.67" y2="175.17" gradientUnits="userSpaceOnUse"><stop offset="0.481613" stop-color="#F8F8F8"></stop><stop offset="1" stop-color="#F8F8F8" stop-opacity="0"></stop></linearGradient><linearGradient id="paint2_linear_337_46" x1="26.4087" y1="369" x2="211.327" y2="194.83" gradientUnits="userSpaceOnUse"><stop offset="0.481613" stop-color="#F8F8F8"></stop><stop offset="1" stop-color="#F8F8F8" stop-opacity="0"></stop></linearGradient><linearGradient id="paint3_linear_337_46" x1="1355.59" y1="369" x2="1170.67" y2="194.83" gradientUnits="userSpaceOnUse"><stop offset="0.481613" stop-color="#F8F8F8"></stop><stop offset="1" stop-color="#F8F8F8" stop-opacity="0"></stop></linearGradient></defs></svg><svg xmlns="http://www.w3.org/2000/svg" width="807" height="797" viewBox="0 0 807 797" fill="none" className="pointer-events-none absolute -left-96 top-0 hidden h-full w-full dark:block"><path d="M807 110.119L699.5 -117.546L8.5 -154L-141 246.994L-7 952L127 782.111L279 652.114L513 453.337L807 110.119Z" fill="url(#paint0_radial_254_135)"></path><path d="M807 110.119L699.5 -117.546L8.5 -154L-141 246.994L-7 952L127 782.111L279 652.114L513 453.337L807 110.119Z" fill="url(#paint1_radial_254_135)"></path><defs><radialGradient id="paint0_radial_254_135" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(77.0001 15.8894) rotate(90.3625) scale(869.41 413.353)"><stop stop-color="#23268F"></stop><stop offset="0.25" stop-color="#1A266B"></stop><stop offset="0.573634" stop-color="#0C0C36"></stop><stop offset="1" stop-opacity="0"></stop></radialGradient><radialGradient id="paint1_radial_254_135" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(127.5 -31) rotate(1.98106) scale(679.906 715.987)"><stop stop-color="#2E459F"></stop><stop offset="0.283363" stop-color="#1C379B"></stop><stop offset="0.573634" stop-color="#0D0D33"></stop><stop offset="1" stop-opacity="0"></stop></radialGradient></defs></svg><svg xmlns="http://www.w3.org/2000/svg" width="551" height="295" viewBox="0 0 551 295" fill="none" className="pointer-events-none absolute -right-80 bottom-0 hidden h-full w-full dark:block"><path d="M118.499 0H532.468L635.375 38.6161L665 194.625L562.093 346H0L24.9473 121.254L118.499 0Z" fill="url(#paint0_radial_254_132)"></path><defs><radialGradient id="paint0_radial_254_132" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(412.5 346) rotate(-91.153) scale(397.581 423.744)"><stop stop-color="#253E9D"></stop><stop offset="0.25" stop-color="#1B3390"></stop><stop offset="0.573634" stop-color="#0C0D2F"></stop><stop offset="1" stop-opacity="0"></stop></radialGradient></defs></svg><div className="relative z-20 flex flex-col items-center justify-center overflow-hidden rounded-3xl p-4 md:p-12"><a className="flex items-center gap-1 rounded-full border border-[#404040] bg-gradient-to-b from-[#5B5B5D] to-[#262627] px-4 py-1 text-center text-sm text-white" href="#"><span className="text-sm  font-medium tracking-tight px-4 py-2 rounded-full">
          Introducing ConferioCal 1.0
        </span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-4 w-4 text-white"><path d="M5 12l14 0"></path><path d="M13 18l6 -6"></path><path d="M13 6l6 6"></path></svg></a><h1 className="bg-gradient-to-b from-black to-neutral-600 bg-clip-text py-4 text-center text-2xl text-transparent dark:from-white dark:to-[#999] md:text-4xl lg:text-7xl">Effortless Scheduling,<br /> Your Way!</h1><p className="mx-auto max-w-2xl py-4 text-center text-base text-neutral-600 dark:text-neutral-300 md:text-lg">With our state of the art, cutting edge, we are so back kinda hosting services, you can deploy your website in seconds.</p><div className="flex flex-col items-center gap-4 py-4 sm:flex-row"><a className="w-40 gap-1 rounded-full border border-[#404040] bg-gradient-to-b from-[#5B5B5D] to-[#262627] px-4 py-2 text-center text-sm text-white" href="#">Start a project</a><a className="w-40 gap-1 rounded-full border border-transparent bg-neutral-100 px-4 py-2 text-center text-sm text-black dark:bg-white" href="#">Book a call</a></div></div></div>


        <div className="relative items-center w-full py-8 mx-auto mt-10">
          <svg
            className="absolute inset-0 -mt-24 blur-3xl"
            style={{ zIndex: -1 }}
            fill="none"
            viewBox="0 0 400 400"
            height="100%"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_10_20)">
              <g filter="url(#filter0_f_10_20)">
                <path
                  d="M128.6 0H0V322.2L106.2 134.75L128.6 0Z"
                  fill="#03FFE0"
                ></path>
                <path
                  d="M0 322.2V400H240H320L106.2 134.75L0 322.2Z"
                  fill="#7C87F8"
                ></path>
                <path
                  d="M320 400H400V78.75L106.2 134.75L320 400Z"
                  fill="#4C65E4"
                ></path>
                <path
                  d="M400 0H128.6L106.2 134.75L400 78.75V0Z"
                  fill="#043AFF"
                ></path>
              </g>
            </g>
            <defs>
              <filter
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="720.666"
                id="filter0_f_10_20"
                width="720.666"
                x="-160.333"
                y="-160.333"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feBlend
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  mode="normal"
                  result="shape"
                ></feBlend>
                <feGaussianBlur
                  result="effect1_foregroundBlur_10_20"
                  stdDeviation="80.1666"
                ></feGaussianBlur>
              </filter>
            </defs>
          </svg>
<div className="pt-20 w-full flex justify-center items-center px-20 ">
          <ContainerScroll 
            titleComponent={<h2 className="text-2xl font-bold">Welcome to Conferio</h2>}
          >
            <div className="text-lg text-gray-400">
              Effortless scheduling and productivity tools for your workflow.
            </div>
          </ContainerScroll>
          </div>
        </div>


        {/* <div className="max-h-screen mt-16 mb-20 bg-black/60 mx-32 rounded-[80px] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)] text-white overflow-hidden relative">
     
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent " />
    
      <main className="container mx-auto px-4 pt-20 pb-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-28">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text">
            Where simplicity meets productivity
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Create, manage, and conquer your to-do lists with ease
          </p>
          <Button className="bg-white text-black hover:bg-gray-100 rounded-full px-8 py-6 text-lg">
             Explore plans
          </Button>
        
        </div>

        <div className="relative">
          <div className="absolute left-48 top-0 transform -translate-x-1/2">
            <div className="bg-orange-500/90 text-white px-4 py-1.5 rounded-full text-sm">
              John doe
            </div>
          </div>
          <div className="absolute -top-20 right-52 transform translate-x-1/2">
            <div className="bg-purple-500/90 text-white px-4 py-1.5 rounded-full text-sm">
              Goku
            </div>
          </div>

         
          <div className="flex justify-center items-start gap-4 perspective-1000">
            
            <Card className="bg-zinc-900 backdrop-blur-lg rounded-[30px] -mt-14 h-[400px] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] [border:1px_solid_rgba(255,255,255,.1)] p-4 w-[320px] transform rotate-[-12deg] translate-x-20 translate-y-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex w-full bg-black/60 justify-center opacity-70 gap-2 rounded-[20px] items-center p-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search list..."
                  className="bg-transparent text-sm text-gray-400 outline-none"
                /></div>
                <Plus className="w-8 h-8 dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] [border:1px_solid_rgba(255,255,255,.1)] bg-neutral-950 z-50 rounded-full p-1 text-gray-400 " />
              </div>
              <div className="space-y-3">
                <div className="flex items-center p-4 gap-3 dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] bg-neutral-800/70 rounded-[20px] text-white">
                  <span className="flex gap-2 text-center items-center"><MdLightMode className="bg-neutral-600 p-1.5 rounded-full w-8 h-8 text-green-400"/> <p>Today</p></span>
                </div>
                <div className="flex items-center p-4 gap-3 dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]  bg-neutral-800/70 rounded-[20px] text-white">
                <span className="flex gap-2 text-center items-center"><MdWorkOutline className="bg-neutral-600 p-1.5 rounded-full w-8 h-8 text-yellow-400"/> <p>Work</p></span>

                </div>
                <div className="flex items-center p-4 gap-3 dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] bg-neutral-800/70 rounded-[20px] text-white">
                <span className="flex gap-2 text-center items-center"><Calendar className="bg-neutral-600 p-1.5 rounded-full w-8 h-8 text-purple-400"/> <p>Today</p></span>

                </div>
                <div className="flex items-center p-4 gap-3 dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] bg-neutral-800/70 rounded-[20px] text-white">
                <span className="flex gap-2 text-center items-center"><Check className="bg-neutral-600 p-1.5 rounded-full w-8 h-8 text-blue-600"/> <p>Completed</p></span>

                </div>
              </div>
            </Card>

            
            <Card className="bg-black/30 border-none backdrop-blur-lg rounded-[40px] p-4 w-[340px] h-[500px] transform rotate-[12deg] -translate-x-8">

              <div className="rounded-[30px]  h-full p-3 dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)] bg-neutral-900/60">
              <div className="flex items-center gap-2 z-[9999] mb-6">
                <ArrowLeft className="w-8 h-8 dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] [border:1px_solid_rgba(255,255,255,.1)] bg-neutral-950 z-50 border rounded-full p-1 text-zinc-400" />
                <span className="text-lg">Upcoming</span>
                <Plus className="w-8 h-8 dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] [border:1px_solid_rgba(255,255,255,.1)] bg-neutral-950 z-50 border rounded-full p-1 text-zinc-400 ml-auto" />
              </div>
              <div className="space-y-2 z-[9999]">
                <div className="flex bg-neutral-800 rounded-[12px] p-4 items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                  <span className="text-[16px] font-semibold text-gray-300">Promote Bento Card...</span>
                  <div className="flex gap-1 ml-auto">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                    <Trash2 className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <div className="flex bg-neutral-950 rounded-[12px] p-4 items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                  <span className="text-[16px] font-semibold text-gray-300">Release Bento Cards</span>
                  <MoreVertical className="w-4 h-4 text-gray-500 ml-auto" />
                </div>
                <div className="flex  bg-neutral-950 rounded-[12px] p-4 items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                  <span className="text-[16px] font-semibold text-gray-300">Bento Cards: UI Compo</span>
                  <MoreVertical className="w-4 h-4 text-gray-500 ml-auto" />
                </div>
                <div className="flex  bg-neutral-950 rounded-[12px] p-4 items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                  <span className="text-[16px] font-semibold text-gray-300">Bento Cards: UI Compo</span>
                  <MoreVertical className="w-4 h-4 text-gray-500 ml-auto" />
                </div>
              </div>
              </div>
            </Card>
          </div>
        </div>
      </main> 
    </div>*/}
    {/* <div className="min-h-screen bg-background p-6 lg:p-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Frequently asked questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Contact us via support if you have any more questions.
            </p>
            <Button variant="outline" className="mt-4">
              Contact us
            </Button>
          </div>
          <div className="space-y-4">
            <Accordion collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className=" dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)] rounded-[30px] py-4 px-6">
                  <AccordionTrigger className="text-left text-xl ">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>  */}

   </div>
    </section>
  );
}
