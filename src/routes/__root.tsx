import { createRootRoute, Outlet, ScrollRestoration } from '@tanstack/react-router'
import * as React from 'react'
import '../styles.css'
import { HomenagemProvider } from '../lib/homenagem-store'
import { STRINGS } from '../data/strings'
import { EnvironmentLayer } from '../components/environment/EnvironmentLayer'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <div>{STRINGS.errors.notFound}</div>,
  errorComponent: () => <div>{STRINGS.errors.pageError}</div>,
})

function RootComponent() {
  return (
    <HomenagemProvider>
      <EnvironmentLayer />
      <div className="absolute inset-0 z-50 flex flex-col">
        <Outlet />
      </div>
      <ScrollRestoration />
    </HomenagemProvider>
  )
}

