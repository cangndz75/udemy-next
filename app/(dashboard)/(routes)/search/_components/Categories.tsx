"use client"
import { Category } from '@prisma/client'
import React from 'react'
import { IconType } from 'react-icons/lib'
import CategoriesItem from './CategoriesItem';
import { FaLaptopCode } from "react-icons/fa";
import { FaCode } from "react-icons/fa";
import { TbBrandReactNative } from "react-icons/tb";
import { FaJs } from "react-icons/fa";


interface CategoriesProps {
    items:Category[]
}

const iconMap: Record<Category["name"], IconType> = {
    "Artifical Intelligence": TbBrandReactNative,
    "Frontend Development": TbBrandReactNative,
    "Backend": FaLaptopCode,
    "FullStack": FaCode,
    "React Native": TbBrandReactNative,
    "JavaScript": FaJs,
}

const Categories = ({items}:CategoriesProps) => {
  return (
    <div className='space-y-2'>
        {items.map((item) => (
            <CategoriesItem key={item.id} label={item.name} icon={iconMap[item.name]} value={item.id} />
        ))}
    </div>
  )
}

export default Categories