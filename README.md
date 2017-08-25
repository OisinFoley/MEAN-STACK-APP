# Creating a MEAN stack app, the aim being to eventually have it act as a sort of Film & TV social media site.

#### README file 1.8 

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

- Basic Login functionality, referencing our local db only.

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

Added in previous commits (1.4)

- Added Facebook login token using passport.js(de-/serialized user info). Includes redirecting of window to ensure no additional tabs are opened. Our routes file also redirects any errors back toward login screen. Carried out with OAuth 2.
- Another call to AuthToken factory for a token, similar to local login, this time venturing out toward facebook for a token then verifying user's existence within our own db.

Added in previous commits (1.5)
- Twitter(OAuth 1) and Google+(OAuth 2) login functionality.

Added in previous commits (1.6)
- Prevention of register, login and then the profile views depending on sign-in status.

Added in previous commits (1.7)
- Backend validation through Mongoose and use of Regex

Added in previous commits (1.7.2)
- Frontend form validation(displaying non-null requirement message, as well as specific requirements of each field)
- Adding additional layer of validation to our userCtrl
	* When a form is submitted, normally navigate to userCtrl and call "User.create" function, which itself will call our userServices factory(passing the form data along with it), with the factory then calling a http post in api.js. Back in userCtrl, "User.create" has a callback so we can inform the user of success and perform our usual redirect.
	* With these new changes, we're now checking if the form is valid before we leave our userCtrl, thus adding further frontend validation, as we don't have to wait until reaching the backend post action in order to find out whether there was an null error or not.
	* Note: Username takes underscores, but not hyphens.

Added in previous commits (1.7.3) (an add-on to backend validation)
- Custom directives, initially for use with a confirm password field.
- Check DB for username and email from client onblur(lostfocus).
- Prettify inputs by using load animation onblur, need to throttle connection for full effect.

---

Since last commit:

- Ongoing work on the header
- Footer nav bar with animations created
- Starting to incorporate a socket.io chat feature
- Misc. UI work,
- Adding additional schemas for content(posts, threads) , likes, tags etc.
- Starting to add to the content-feed and discover sections
- We're now using Bower to manage our packages

