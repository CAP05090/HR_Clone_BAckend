const cookieRouter = require("express").Router()

cookieRouter.get("/set-cookie", (req, res)=>{
    res.cookie('user', 'John Doe', { maxAge: 900000, httpOnly: true });
    res.send('Cookie has been set.');
})

cookieRouter.get("/get-cookies", (req, res)=>{
    const user = req.cookies['user'];
    if (user) {
        res.send(`Cookie retrieved: ${user}`);
    } else {
        res.send('No cookie found');
    }
})

cookieRouter.get("/delete-cookies", (req, res)=>{
    res.clearCookie('user');
    res.send('Cookie has been deleted.');
})