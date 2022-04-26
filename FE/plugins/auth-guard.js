export default ({ app, store }) => {
  app.router.beforeEach(async(to, from, next) => {
    const publicPages = ['/login', '/register', '/logout']
    const authRequired = !publicPages.includes(to.path)
    await app.$auth.fetchUser()
    const loggedIn = app.$auth.loggedIn

    if (authRequired && !loggedIn) {
      next('/login')
    } else {
      ((to.path === '/login' || to.path === '/register') && loggedIn) ? next('/') : next()
    }
  })
}
