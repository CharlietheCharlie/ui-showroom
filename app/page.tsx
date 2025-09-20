import TargetCursor from "@/components/TargetCursor";
import RadialMenu from "./(components)/RadialMenu";


export default function Home() {
  return (
    <>
      <TargetCursor spinDuration={5} hideDefaultCursor={true} />
      <RadialMenu />
    </>
  );
}
