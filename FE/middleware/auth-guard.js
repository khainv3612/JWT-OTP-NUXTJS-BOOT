export default async function({
  app, store, route, error, redirect
}) {
  const publicPages = ['/login', '/register', '/logout']
  const authRequired = !publicPages.includes(route.path)
  await app.$auth.fetchUser()
  const loggedIn = app.$auth.loggedIn
  // redirect to login page
  if (authRequired && !loggedIn) {
    redirect('/login')
  } else {
    ((route.path === '/login' || route.path === '/register' || route.path === '/') && loggedIn) ? redirect('/overview') : redirect()
  }
}

