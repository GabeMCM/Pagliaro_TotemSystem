import Link from "next/link";
import { SplashOverlay } from '../components/environment/SplashOverlay'



export default function Home() {
  return (
    <Link href="/inicio" className="absolute inset-0 block cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary inset-ring">
      <SplashOverlay />
    </Link>
  )
}
