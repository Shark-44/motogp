// app/Layout.tsx
import { Link, Outlet } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAdminShortcut } from './layout/useAdminShortcut';
import { AdminLoginDialog } from '@/modules/auth/ui/AdminLoginDialog';
import { useAuthAdmin } from '@/modules/auth/ui/useAuthAdmin'; // AJOUT 1

function Layout() {
  const { loginOpen, setLoginOpen, onLoginSuccess } = useAdminShortcut();
  const { login } = useAuthAdmin(); // AJOUT 2

  return (
    <div className="min-h-svh">
      <header>
        <div className="relative w-full h-full">
          <img
            src="/images/Bannière_MotoGP.png"
            alt="Bannière MotoGP"
            className="w-full h-36 md:h-44 object-cover"
          />

          <Link
            to="/"
            className={cn(
              buttonVariants({ variant: 'default' }),
              'absolute right-20 top-10 z-10 bg-red-600 text-black text-xl hover:bg-red-700 font-semibold shadow-lg'
            )}
          >
            Accueil
          </Link>
        </div>

        <div className="mx-auto flex max-w-4xl items-center justify-between ">

        </div>
      </header>

      <Outlet />

      <AdminLoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSuccess={onLoginSuccess}
        onLogin={login} // AJOUT 3
      />
    </div>
  )
}

export default Layout