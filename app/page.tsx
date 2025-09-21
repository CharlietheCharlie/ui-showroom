"use client";
import TargetCursor from "@/components/TargetCursor";
import RadialMenu from "./(components)/RadialMenu";
import { useEffect, useState } from "react";


export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      {!isMobile && <TargetCursor spinDuration={5} hideDefaultCursor={true} />}
      <RadialMenu />
    </>
  );
}
