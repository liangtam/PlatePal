# Setup Backend
- Make sure you're in the `backend` folder of the project. If not, `cd` into it :)
- Open your terminal, write `npm i` to install the dependencies

# Setting up backend connection (if connecting for the first time)
**Precondition**: You need to be added as an admin to the database first.
- Login to MongoDB Atlas. Add yourself as a database user in the **Database access** side bar.
![image](https://github.com/ubc-cpsc455-2024S/project-23_moai/assets/63375678/49d26ae4-0e33-40cb-bd6d-3ba9dc477c22)

- Back to the code--create a file called `.env` for your **env**ironment variables. This file will hold sensitive information, which is why the `.gitignore` file will ignore all `.env` files so it does not get published to the repository.
- In your `.env` file, write:
```
PORT=4000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.vsgey03.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```
To easily retrieve the mongo URI link, go to mongo atlas. In the Overview, click the connect button, and choose the 'Driver' option. You can then copy and paste the mongo URI from there. ![image](https://github.com/ubc-cpsc455-2024S/project-23_moai/assets/63375678/9713c8c7-7442-468c-a9db-4e5e1ce22982)

You can change the port number to something else if you'd like, as long as it is not the same port number as the frontend.
- `server.js` will read these `.env` values :)

# Running the backend
- In your terminal, run `nodemon server`. This runs `server.js` and will rerun it whenever there are changes detected.
