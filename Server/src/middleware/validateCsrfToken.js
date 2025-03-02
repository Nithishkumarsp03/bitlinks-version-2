module.exports = (req, res, next) => {
    const csrfToken = req.headers["csrf-token"]; // Get CSRF token from headers
    // console.log(csrfToken)

    if (!csrfToken || csrfToken !== req.session.csrfToken) {
        return res.status(403).json({ error: "You are not authorized to proceed" });
    }

    next();
};
