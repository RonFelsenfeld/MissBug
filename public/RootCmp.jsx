const Router = ReactRouterDOM.BrowserRouter
const { Route, Routes } = ReactRouterDOM

import { Home } from './pages/Home.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { UserDetails } from './pages/UserDetails.jsx'
import { UserIndex } from './pages/UserIndex.jsx'

import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'

export function App() {
  return (
    <Router>
      <div>
        <AppHeader />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bug" element={<BugIndex />} />
            <Route path="/bug/:bugId" element={<BugDetails />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/user" element={<UserDetails />} />
            <Route path="/users" element={<UserIndex />} />
          </Routes>
        </main>
        <AppFooter />
      </div>
    </Router>
  )
}
