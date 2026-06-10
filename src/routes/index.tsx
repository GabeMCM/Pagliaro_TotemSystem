import { createFileRoute, Link } from '@tanstack/react-router'
import { SplashOverlay } from '../components/environment/SplashOverlay'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <Link to="/inicio" className="absolute inset-0 block cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary inset-ring">
      <SplashOverlay />
    </Link>
  )
}
