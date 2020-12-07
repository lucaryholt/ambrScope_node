# ambrScope

### Why?

This webapp is made as a exam project in a Node.JS elective.

It is a website for collectors of amber, where they can share spots where they have found amber.
The inspiration for this idea comes from my little brother, who collects amber and mentioned that he and like minded people wanted such a site (and [app](https://github.com/lucaryholt/ambrScope_android)).

### Technology

The webapp is written in JavaScript and is run with Node.JS.

It uses **Google Firebase** elements such as **Firestore** and **Authentication**. A benefit of this is that the app has live updates of these spots and easy synchronization with its [Android companion app](https://github.com/lucaryholt/ambrScope_android).

To enable the server to push these live updates to the clients, the app makes use of [**socket.io**](https://www.npmjs.com/package/socket.io).

### Running the app

To run the app, you need to have a **Firebase** project and fill in the information in a **.env** file in the project directory (a sample file is included). 
You also need to create a **Google Maps** API key and insert it into the script tags on *addspot.html* and *frontpage.html* in the **public/pages** directory.

Then you simply run `npm run start-prod` to launch the server.