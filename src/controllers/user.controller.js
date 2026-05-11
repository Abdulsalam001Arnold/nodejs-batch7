

export const getHome = (req, res) => {
    res.send("This is the home route.")
}

export const postUser = (req, res) => {
    const {username, email, password} = req.body
    console.log(username, email, password)
    res.status(201).json({
        data: {
            username,
            email,
            password
        },
        message: "User created successfully."
    })
}