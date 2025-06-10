# DevConnect
- Create a vite+react application.
- Remove unecessary code and create a Welcome message!.
- Install TailwindCSS.
- Install Daisy UI
- configure tailwind.config.js < 
      import daisyui from "daisyui";
        plugins: 
        [
              daisyui,
        ]
        >
- create NavBar.jsx component
- install react-router-dom
- Create BrowserRouter with basename > Routes>Route for body and >RouteChildren
- create an Outlet in body component.
- Footer component created
- Create a login page
- install axios
- cors- install cors in backend ==> add middleware to with configurations: orgin, credentials:true,
- whenever you're making API call so pass axios ==> { withCredentials:true}
- Install redux toolkit 
- install react-redux and @reduxjs/toolkit => configure store=> wrapped app.jsx into Provider and pass store as appStore => create slice => add reducer to appStore.
- Add redux devtools in chrome
- Login and see if data is coming properly in store
- navbar should update as soon as user login
- folder structure cleaner with constant.js 
- we are not able to access other route without login
- if token is not present then it will redirect to login page
- Reduced the api call again and again by checking the user present in store or not before fetching loggedIn user.





