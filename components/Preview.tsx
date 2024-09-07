"use client";
import React from "react";
import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

interface PreviewProps {
  value: string;
}

const Preview = ({ value }: PreviewProps) => {
  const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

  const modules = {
    toolbar: false,
  };
  return <ReactQuill theme="snow" value={value} modules={modules} readOnly />;
};

export default Preview;
