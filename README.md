# SE-II---Queue-Management-

React Client Application Routes


Route: '/login'  This route is used for user authentication, typically by office staff or administrators.

Route: '/request-ticket' his route allows clients to request a ticket for a specific service type. 
Clients provide their desired service type in the request, and the system generates a unique ticket code, 
adds the client to the appropriate queue, and returns the ticket information.

Route: '/counter'
Counter officers use this route to indicate that they are ready to serve the next client. 
They may specify the service type they are prepared to handle. 
The system then selects the next ticket to serve based on the defined rules and informs the counter officer.

Route: '/queue'
This route provides information about the current queue status. 
Clients and officers can access this route to monitor the queue lengths, 
see the number of people waiting in each queue, and obtain estimated wait times.

Route: '/notifications'
This route can be used to push real-time notifications to clients and officers,
signal a customer has been served So that proper statistics can be gathered


API Server

Autenticazione

POST /api/session
request parameters and request body content
response body content

DELETE
GET /api/session/current ... decidere qui quali informazioni ritornare EVENTUALMENTE oltre alle info dell'utente

Altre

GET /api/getticket

GET /api/nextcustomer





Database Tables

Table counter  : (id,name)

Table  user: (id,email,username,name,surname,salt,passwword,role)

Table service : (id,text,name,current numeric,last numeric,averaage time)

Table servicebycounter : (id,counter,ervice,office_id)

Table counterstats :(id,service,counter,date,number)

Table servicestats:(id,service,data,number)
