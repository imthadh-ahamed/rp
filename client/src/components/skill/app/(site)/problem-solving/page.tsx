import React from "react";
import { Metadata } from "next";
import HeroSub from "@/components/skill/app/components/shared/hero-sub";
import ProbSection from "@/components/skill/app/components/probSection/index";
export const metadata: Metadata = {
  title: "Critical Thinking | Property-pro",
};

const page = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/critical-thinking", text: "Critical Thinking" },
  ];
  return (
    <>
      <ProbSection/>
    </>
  );
};

export default page;
