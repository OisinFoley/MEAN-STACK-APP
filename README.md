# Creating a MEAN stack app, the aim being to eventually have it act as a sort of Film & TV social media site.

#### README file 1.4

Once core work is done I will be concerned with:
- Retrieving info pertaining to a series, show, act-or/ress etc using _API calls_
- Allowing users to _create discussion threads_, while also _comment on news articles which are fetched elsewhere_ and presented on the home page.
- Giving the ability for users to have _chat in real-time_

---

Added in previous commits (1.1)

- Have added registration capabilites inc. relevant error checking and handling.
- Incorporated a factory to handle registration calls
- Make use of $location and $timeout services
- Small amount of message styling using ngAnimate

Added in previous commits (1.2)

- Login functionality

Added in previous commits (1.3)

- Use of JSON web tokens (jwt) to set and get user cookies
* Additional functions in authServices.js to handle set/get of cookie
- New factories: AuthToken and AuthInterceptors, the latter being used in conjunction with $httpProvider in our app.js file to ensure all http requests are intercepted and sent to this factory to determine whether a cookie exists, and to attach tot he header if so.
- Referencing $rootScope to ensure code to verify if user is logged in is executed each time the route/view changes.
- Conditional loading of our body(set from mainCtrl.js) to ensure unwanted nav elements aren't temporarily in view when running a slow connection(eg - preventing the display of login when user is logged in.) Also ngCloak to ensure no flickering of elements upon load.
- Logout view for demo
* view and route added to routes.js
- Profile view for demo
* view and route added to routes.js

Since last commit:

- Added Facebook login token using passport.js(de-/serialized user info) . Includes redirecting of window to ensure  no additional tabs are opened. Our routes file also redirects any errors back toward login screen.
- Another call to AuthToken factory for a token, similar to local login, this time venturing out toward facebook for a token then verifying user within our own db.
- 

