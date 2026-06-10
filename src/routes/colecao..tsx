import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/colecao/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/colecao/"!</div>
}
