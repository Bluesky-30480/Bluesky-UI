import { Outlet } from 'react-router-dom'
import { Box } from '@bluesky-ui/ui'
import { Header } from './layout/Header'
import { Sidebar } from './layout/Sidebar'

export function Layout() {
  return (
    <Box className="showcaser-layout">
      <Header />
      <Sidebar />
      <Box as="main" className="showcaser-content bg-background">
        <Outlet />
      </Box>
    </Box>
  )
}
