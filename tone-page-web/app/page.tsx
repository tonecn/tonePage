'use client';
import favicon from './favicon.ico';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center">
      <Image
        src={favicon.src}
        alt="TONE's avatar"
        width={180}
        height={180}
        className="rounded-full duration-400 size-35 md:size-45 select-none"
        priority
        quality={100}
      />
      <h1 className='text-4xl md:text-5xl font-bold mt-5 md:mt-8 gradient-title duration-400 select-none'>特恩(TONE)</h1>
      <h2 className='text-lg sm:text-xl md:text-2xl mt-3 font-medium text-zinc-400 duration-400 select-none'>一名啥都会一点点的程序员</h2>
      <div className='flex sm:flex-row flex-col gap-2 sm:gap-10 mt-5 md:mt-8 duration-400'>
        <a href='https://space.bilibili.com/474156211' target='_black' className='bg-[#488fe9] hover:bg-[#3972ba] text-center text-white w-45 sm:w-32 px-6 py-2 text-lg rounded-full cursor-pointer'>哔哩哔哩</a>
        <a href='https://github.com/tonecn' className='bg-[#da843f] hover:bg-[#c87d3e] text-center text-white w-45 sm:w-32 px-6 py-2 text-lg rounded-full cursor-pointer'>GitHub</a>
      </div>
    </div>
  );
}
