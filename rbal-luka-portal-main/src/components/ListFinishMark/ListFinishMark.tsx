import React from "react";

export const ListFinishMark: React.FC<React.SVGProps<SVGSVGElement>> = (
  props
) => {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 9L1.41421 9C0.523309 9 0.0771408 7.92286 0.707106 7.29289L7.29289 0.707106C7.92286 0.0771414 9 0.523307 9 1.41421L9 8C9 8.55228 8.55229 9 8 9Z"
        fill="#49505A"
      />
    </svg>
  );
};
