# Setup Backend
- Make sure you're in the `backend` folder of the project
- Open your terminal, write `npm i` to install the dependencies

# Setting up backend connection (if connecting for the first time)
- Create a file called `.env` for your environment variables. This file will hold sensitive information, which is why the `.gitignore` file will ignore all `.env` files so it does not get published to the repository.
- In your `.env` file, write:
```
PORT=4000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.vsgey03.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```
You can change the port number to something else if you'd like, as long as it is not the same port number as the frontend.
- `server.js` will read these values :)

# Running the backend
- In your terminal, run `nodemon server`. This runs `server.js` and will rerun it whenever there are changes detected.
