import { AppLayout } from '@hilla/react-components/AppLayout.js';
import { DrawerToggle } from '@hilla/react-components/DrawerToggle.js';
import Placeholder from 'Frontend/components/placeholder/Placeholder';
import { useRouteMetadata } from 'Frontend/util/routing';
import { Suspense } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import css from './MainLayout.module.css';

export default function MainLayout() {
  const currentTitle = useRouteMetadata()?.title ?? 'My App';
  return (
    <AppLayout primarySection="drawer">
      <div slot="drawer" className={css.drawer}>
        <header>
          <h1 className="text-l m-0">My App</h1>
          <nav>
            <NavLink to="/">Hello World</NavLink>
            <NavLink to="/users">Users</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
        </header>
      </div>

      <DrawerToggle slot="navbar" aria-label="Menu toggle"></DrawerToggle>
      <h2 slot="navbar" className="text-l m-0">
        {currentTitle}
      </h2>

      <Suspense fallback={<Placeholder />}>
        <Outlet />
      </Suspense>
    </AppLayout>
  );
}
