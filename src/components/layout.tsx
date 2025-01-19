import { Transition } from "./transition";
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Transition />
      {children}
    </>
  );
}