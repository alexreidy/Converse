Converse
========

A simple, efficient web chat application

Here's how it works
-------------------

Converse stores the messages it receives in its MySQL database (which is created automatically if it doesn’t exist). Most of the magic happens as clients request the latest messages. When you arrive at the web page, Converse asks the server for the number of messages currently stored in the database. With this information, the browser rapidly requests each currently-stored message individually (in order to prevent unnecessary complexity in the back-end scripts). Once the initialization is done, the client makes a request to the server, sending a count of the current messages (which starts at 1 and increases for each that is received). The server takes this value, adds one to it, and asks the database for the message with this ID. If nothing is returned, the PHP script waits a second then polls the database again (which could be improved by implementing some form of event trigger). All the while, the HTTP request is still open; it only closes if the script manually times out (that is, if it queries the database 25 times) or if it finds a new message. If a message is found, the response is sent back to the client and displayed no matter what the client is busy with — it’s totally concurrent. And that’s what makes the idea behind Comet so cool: Your web browser doesn’t have to incessantly poll the server (or much less refresh entirely). To further improve efficiency, Converse adjusts the frequency at which it polls according to the chat activity. If the script times out, a timeout variable is incremented; when a message is received, the timeout variable is set to 1 (for mathematical reasons, as zero would break the script); and each time the HTTP request ends — whether it be a success or failure — the client starts polling at a new interval which is calculated by multiplying the number of successive timeouts by the semi-arbitrary minimum interval of half a second. So, instead of polling once every second, Converse only makes a HTTP request once every 25-26 seconds at a minimum, but receives new information within a second of its reception.
