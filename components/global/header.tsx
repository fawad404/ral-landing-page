import React from 'react'

interface Props{
    title: string;
    description: string;
}

const Header:React.FC<Props> = ({
    title="Dashboard",
    description="Facility snapshot and quick actions."
}) => {
  return (
    <div className='w-fit h-auto flex flex-col gap-1'>
        <p className='text-4xl font-black text-[#0F172A] uppercase font-space'>{title}</p>
        <p className='text-lg font-normal text-[#64748B]'>{description}</p>
    </div>
  )
}

export default Header