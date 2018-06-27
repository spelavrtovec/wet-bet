const ensureLoggedIn = (redirectTo) => (req, res, next) => {
  if (req.session.currentUser) {
    console.log(`ACCESS GRANTED to user ${req.session.currentUser.username}`);
    next();
  } else {
    console.log(`ACCESS DENIED. No user, redirect!`);
    res.redirect(redirectTo);
  }
};

module.exports = ensureLoggedIn;