![example workflow](https://github.com/ubc-cpsc455-2024S/project-23_moai/actions/workflows/ci.yml/badge.svg)
# Group Moai🗿 - PlatePal

## Project Description

Discover easy cooking with PlatePal, an all-in-one recipe app for aspiring home chefs, foodies, and anyone who wants to cook but only has 5 ingredients in their fridge at a time. Simply input your ingredients and let AI do the rest by generating personalized, allergy-friendly recipes. Don’t like a certain recipe? Downvote it. Love a recipe? Save it! Never run out of inspiration again with our community explore page, where you can see your foodie friends’ favourite recipes and share yours too.

## Project Task Requirements

Minimal Requirements
- User login feature with username and password :white_check_mark:
- Inputting the ingredients via search and select :white_check_mark:
- Button to generate recipe :white_check_mark:
- Viewing the actual recipe instructions :white_check_mark:

Standard Requirements
- Have the AI generate the recipe based on the inputted ingredients :white_check_mark:
- Favouriting recipes and viewing the saved recipes :white_check_mark:
- Modifying saved recipes such as editing the ingredient list or changing an instruction :white_check_mark:
- Sorting for user recipes and filtering functionality for generated recipes :white_check_mark:
- Upvoting/downvoting a recipe? :white_check_mark:
- Regular image upload for recipe (if AI doesn’t work out) :white_check_mark:

Stretch Requirements
- (AI-generated) images of what the dish looks like (instead used image API that is NOT ai generated)
- Create a “Pinterest”-like dashboard for sharing among users :white_check_mark:


## Task Breakdown
User login feature with username and password
- Frontend form for the users to fill in login/registration info
- Backend API to create new user
- Implement JWT for end-to-end user login/registration

Viewing the actual recipe instructions
- Create recipe schema in backend
- Backend API to fetch the generated recipe
- Having a UI page to display the recipe and load the recipe content
- Create frontend recipe component that parses recipe info from backend to user-friendly format


## Team Members

- Brian Chu: Software Development Intern
- Elena Guo: 4th year BUCS student and aspiring product manager 
- Tammie Liang: 3rd year CS student, currently in a work term
- Abby Hong: 4th year CS+STATS student, currently in a SDE intern

## Prototypes

<img src ="images/sketch_main.png" width="400px">
<img src ="images/sketch_canva.png" width="400px">
<img src ="images/sketch_login.png" width="300px">

## Above and beyond

- We created an ad hoc gmail account platepalservice@gmail.com that sends password reset emails. If you forget your password, you can click "forgot password" and it'll send you a temporary password that can be used once and expires in one hour. We chose not to demo this because throaway email services tend to be finicky and none of us wants to screenshare our personal inboxes.
- We used socket.io to have live updating Explore page. If you like, share, or unshare/delete a recipe, all users looking at the Explore page will instantly see the update.
- 

## What we did
- Brian: Wrote sign in/login page and all the backend for it. Account creation, login verification, password reset, etc. Also did the live Explore page for live upvote and new recipe creation using socket.io. Finally, made the CI/CD Discor notification bot.

<!-- ## Images -->

## References



