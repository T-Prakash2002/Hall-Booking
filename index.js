const express = require('express')
const data=require('./data.json')
const bodyParser=require('body-parser');
const { v4: uuidv4 } = require('uuid');


const app = express();

const rooms=[...data.rooms]
const customers=[...data.customer_Details]
const bookingDetails=[...data.booking_Details]

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(`
    <div style="hight:300px;background-color:red;border-radius:6px">
    <h1 
    style="text-align:center"
    >
    Hall-Booking API
    </h1>

    <h4 style="text-align:center">
    <a href="/">
    Back to Home
    </a></h6>
    </div>
    <div>
        <ul>
            <li><b>List All Rooms with Booked data --></b> <br><br>
             <a style="text-decoration:none" href='/rooms'>Show all room details</a>
            </li><br>
            <li><b>List All Customer with Booked data --> </b><br><br>
             <a style="text-decoration:none" href='/booking-details'>Show all Booking details</a>
            </li><br>
            <li><b>Create Room --> </b><br><br>
             <a style="text-decoration:none" href='/create-room'>Create Room<br></a>
             Use Query:seatsAvailable=?&amenities=?&pricePerHour=?
            </li><br>
            <li><b>Booking Room --></b><br><br>
             <a style="text-decoration:none" href='/book-room'>Booking Room<br></a>
             Use Query:customer_name=?&date=?&start_time=?&end_time=?&room_Id=?
            </li><br>
            <li><b>List how many times a customer has booked the rooms --></b><br><br>
             <a style="text-decoration:none" href='/booking-history'>Booking History<br></a>
             Use Query:customer_name=?
            </li>
        </ul>
    </div>
    `)
})

app.get('/rooms',(req,res)=>{
    res.send(`
    <div style="background-color:orange;padding:10px 0px;text-align:center;color:white">
           <h1>Show All Rooms</h1><p><a href="/" style="color:#DAD4E7 ">Back to Home</a></p></div>
           
        
           ${
            rooms.map((item,index) => 
            `<ul type='circle'>
                <h3>${index+1}</h3>
                ${`<li><b>Room Id:</b> ${item.roomId}</li>`}
                ${`<li><b>Room Name:</b> ${item.room_name}</li>`}
                ${`<li><b>Amenities:</b>${item.Amenities}</li>`}
                ${`<li><b>Available Seats:</b> ${item.seats}</li>`}
                ${`<li><b>Price per Hour:</b> ${item.price_per_hour}</li>`}
                ${`<li><b>Booking Status:</b> ${item.booked_status}</li>`}
                ${`<li><b>Booking Confirmation Id:</b> ${item.booking_Confirmation_Id}</li>`}
            
            </ul><hr>`).join('')
        }
            
           
        `)

    }
        
    )


app.get("/booking-details",(req,res)=>{

    res.send(`<div style="background-color:orange;padding:10px 0px;text-align:center;color:white">
    <h1>Show All Booked details</h1><p><a href="/" style="color:#DAD4E7 ">Back to Home</a></p></div>

    ${
        bookingDetails.map((item,index) => 
        `<ul type='circle'>
           <h3>${index+1}</h3>
            ${`<li><b>booking Id: </b>${item.booking_Id}</li>`}
            ${`<li><b>booking Date: </b>${item.date}</li>`}
            ${`<li><b>booking Start time:</b>${item.start_Time}</li>`}
            ${`<li><b>booking End time: </b>${item.end_Time}</li>`}
            ${`<li><b>booking_Confirmation:</b> ${item.booking_Confirmation}</li>`}
            ${`<li><b>Booking room Id:</b> ${item.room_Id}</li>`}
            ${`<li><b>Booking Customer Name:</b> ${item.customer_Name}</li>`}
        
        </ul><hr>`).join('')
    }


    `)
})

app.post('/create-room',(req,res)=>{


    const IdNum=rooms.findLast(room=>room);

    //http://localhost:4000/create-room?seatsAvailable=45&amenities=chair&pricePerHour=300  

    const{seatsAvailable,amenities,pricePerHour}=req.query;
    
    console.log(seatsAvailable,amenities,pricePerHour)


    if(!seatsAvailable||!pricePerHour){
      return res.send({message:'seatsAvailable=?&amenities=?&pricePerHour=?  are required'})
    }

    rooms.push({
        "roomId":IdNum.roomId+1,
        "room_name":"",
        "Amenities":[amenities],
        "seats":seatsAvailable,
        "price_per_hour":pricePerHour,
        "booked_status":false,
        "booking_Confirmation_Id":[]
    });
    res.send(` <div style="background-color:orange;padding:10px 0px;text-align:center;color:white">
        <h1>Room Created successfully!</h1>
        <p>Created room : ${IdNum.roomId+1}</p>
        <p><a href="/" style="color:#DAD4E7 ">Back to Home</a></p>
    </div>`);


  });

app.post('/book-room',(req,res)=>{

    const IdNum=bookingDetails.findLast(item=>item);


    const {customer_name,date,start_time,end_time,room_Id}=req.query;



    if (!room_Id || !customer_name ||!date||!start_time ||!end_time ){
        return  res.send({ message:"RoomId,customerName,date,startTime,endTime are required" });
      }

      const isRoom=rooms.find(item=>item.roomId==room_Id)
      
      if(!isRoom){
        return res.send({message:'Room not Found'})
      }
      const ConfirmationId=uuidv4();

      bookingDetails.push(
        {
            "booking_Id": IdNum.booking_Id+1,
            "bookingDate":new Date(),
            "date": date,
            "start_Time": start_time,
            "end_Time": end_time,
            "booking_Confirmation": ConfirmationId,
            "date": 19072023,
            "room_Id": room_Id,
            "customer_Name":customer_name,
            "bookingStatus":'Confirmed'
       }
    )

    res.send(` <div style="background-color:orange;padding:10px 0px;text-align:center;color:white">
        <h1>Booking room successfully!</h1>
        <p>Allocated room ID: ${room_Id}</p>
        <p><a href="/" style="color:#DAD4E7 ">Back to Home</a></p>
    </div>`);


})



app.get('/booking-history',(req,res)=>{
    const {customer_name}=req.query;
    console.log(customer_name);
    const Booking_History=
      bookingDetails.filter((booking)=>booking.customer_Name == customer_name );
      res.send(`<div style="background-color:orange;padding:10px 0px;text-align:center;color:white">
      <h1>Show " ${customer_name} "Booked Details</h1><p><a href="/" style="color:#DAD4E7 ">Back to Home</a></p></div>
  
      ${
          Booking_History.map((item,index) => 
          `<ul type='circle'>
             <h3>${index+1}</h3>
              ${`<li><b>booking Id: </b>${item.booking_Id}</li>`}
              ${`<li><b>booking Date: </b>${item.date}</li>`}
              ${`<li><b>booking Start time:</b>${item.start_Time}</li>`}
              ${`<li><b>booking End time: </b>${item.end_Time}</li>`}
              ${`<li><b>booking_Confirmation:</b> ${item.booking_Confirmation}</li>`}
              ${`<li><b>Booking room Id:</b> ${item.room_Id}</li>`}
              ${`<li><b>Booking Customer Name:</b> ${item.customer_Name}</li>`}
          
          </ul><hr>`).join('')
      }
  
  
      `)
  });




app.listen(4000, () => {
    console.log("Server Started Port 4000");
})

