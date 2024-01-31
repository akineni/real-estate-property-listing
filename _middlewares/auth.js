module.exports = {
    isLoggedIn: (req, res, next) => {
        if(req.session.UID) return res.redirect('/dashboard')
        next()
    },
    isLoggedOut: (req, res, next) => {
        if(!req.session.UID) return res.redirect('/login')
        next()
    }
}