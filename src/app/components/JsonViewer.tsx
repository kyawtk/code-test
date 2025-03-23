"use client";

import dynamic from "next/dynamic";

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });
import { useEffect, useState } from "react";

const JsonViewer = ({ data }: { data: any }) => {

  return <ReactJson src={data} />;
};

export default JsonViewer;
