"use client";

import dynamic from "next/dynamic";

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

const JsonViewer = ({ data }: { data: any }) => {
  return <ReactJson src={data} displayDataTypes={false} />;
};

export default JsonViewer;
