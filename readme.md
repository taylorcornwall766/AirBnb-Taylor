npm start will run the /bin/www in nodemon when started in the development environment with the environment variables in the .env file loaded, or in node when started in production.

Now, it's time to finally test your entire set up!

Run npm start in the backend folder to start your server on the port defined in the .env file, which should be 8000.

Navigate to the test route at http://localhost:8000/hello/world. You should see the text Hello World!. Take a look at your cookies in the Application tab of your Chrome DevTools Inspector. Delete all the cookies to make sure there are no lingering cookies from other projects, then refresh the page. You should still see the text Hello World! on the page as well as two cookies, one called _csrf and the other called XSRF-TOKEN in your DevTools.
