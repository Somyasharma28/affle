import React, { useState } from 'react';
import './style.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import SecondScreen from '../SecondScreen'; 


var gapi = window.gapi;
/* 
  Update with your own Client Id and Api key 
*/
var CLIENT_ID = "";
var API_KEY = "";
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var SCOPES = "https://www.googleapis.com/auth/calendar";

const meetingData = {
    // email:{
    //date : array({meeting details})
    //}
}




const FirstScreen = (props) => {

    const [selectDateSlot, setDateSlot] = useState(false);
    const [meetingRoom, setMeetingRoom] = useState('');
    const [meetingDesc, setMeetingDesc] = useState('');
    const [username, setUserName] = useState('');
    const [userMeetingData, setUserData] = useState(null);
    const [email, setEmail] = useState(null);
    const [submit, setSubmit] = useState(false);
    const [submitDone, setSubmitDone] = useState(false);


    const submitData = (date, slot, present) => {
        const dateValue= date.split("-");
        const hour=slot["value"].split(":")[0];
        const meetingDate= new Date(dateValue[2],dateValue[1],dateValue[0], hour,0,0);
        
        if (present) {
            const slots = meetingData[email][date];
            slots.push({ meetingRoom, meetingDesc,"date":meetingDate, "slot": slot["id"] });
            meetingData[email][date]["slot"] = slots;

        } else {
            meetingData[email][date] = [{ meetingRoom, meetingDesc, "date":meetingDate,"slot": slot["id"] }];
        }
        handleClick(meetingDate);

    }

    const handleClick = (date) => {
        const startDate=date.toISOString();
        
        const endDate=(new Date(date.valueOf()+(60*60*1000))).toISOString();
         
         gapi.load('client:auth2', () => {
          console.log('loaded client')
    
          gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
          })
    
          gapi.client.load('calendar', 'v3', () => console.log('bam!'))
    
          gapi.auth2.getAuthInstance().signIn()
          .then(() => {

            const event = {
                 'summary': `Meeting Room booked by ${username}`,
                 'location': `Affle ${meetingRoom}`,
                'description': `${meetingDesc}`,
                'start': {
                  'dateTime': `${startDate}`,
                  'timeZone': 'Asia/Kolkata'
                },
                'end': {
                  'dateTime': `${endDate}`,
                  'timeZone': 'Asia/Kolkata'
                },
                'recurrence': [
                  'RRULE:FREQ=DAILY;COUNT=1'
                ],
                'reminders': {
                  'useDefault': false,
                  'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},
                    {'method': 'popup', 'minutes': 10}
                  ]
                }
              };

                    
            const request =  gapi.client.calendar.events.insert({
              'calendarId': 'primary',
              'resource': event,
            });
    
            request.execute(events => {
              console.log(events)
              window.open(events.htmlLink)
            })
        }).then(()=>{
            setSubmit(true);
            setSubmitDone(true);
        })
    })
}

   const resetApplication=()=>{
        setDateSlot(false);
       setSubmit(false);
       setMeetingRoom('');
       setMeetingDesc('');
       setUserData(null);
       setUserName('');
       setEmail(null);
       setSubmitDone(false);
   }


    const submitHandler = () => {
        
        if (meetingRoom && meetingDesc && username) {
            let userIndex = null;
            props.userData.forEach((user, idx) => {
                if (user.username === username) {
                    userIndex = idx;
                }
            });
            if (userIndex !== null) {
                const userEmail = props.userData[userIndex].email;
                setEmail(userEmail);
                let meetingDataIndex = null;
                Object.keys(meetingData).forEach((userMeeting, idx) => {
                    if (userMeeting === userEmail) {
                        setUserData(meetingData[userMeeting]);
                        meetingDataIndex = idx;
                        return true;
                    }
                });

                if (meetingDataIndex === null) {

                    meetingData[`${userEmail}`] = {};
                    setUserData({});
                }

                setDateSlot(true);

            } else {
                //console.error("Please enter data correctly");
                alert("Please enter username correctly");

            }

        } else {
            //console.error("Please enter data correctly");
            alert("Please enter data correctly");

        }
    }


    return (<React.Fragment>
        
        {submit ? <> {
            submitDone? <h6>Booking is done!</h6>:<h6>Booking is not done!</h6>
            } 
            <Button outline color="danger" onClick={() => resetApplication()}>Back</Button></>
            : selectDateSlot ? <SecondScreen userData={userMeetingData} submitData={submitData} meetingRoom={meetingRoom} meetingDesc={meetingDesc} meetingData={meetingData} setSubmit={setSubmit} /> :
                <Form onSubmit={submitHandler} method="POST" >
                    <FormGroup>
                        <Label for="meetingRoom">Meeting Room</Label>
                        <Input required type="select" name="meetingRoom" id="meetingRoom" onChange={(e) => setMeetingRoom(e.target.value)}>
                            <option className="text-muted">Select</option>
                            <option>Training Room</option>
                            <option>Conference Room</option>
                            <option>Auditorium</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="username">Name</Label>
                        <Input required="required" type="text" name="username" id="username" placeholder="Enter your name" onChange={(e) => setUserName(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="meetingDescription">Meeting Description</Label>
                        <Input required={true} type="text" name="meetingDescription" id="meetingDescription" placeholder="Enter meeting description" onChange={(e) => setMeetingDesc(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Button type="submit" color="danger" >Book Date and Slot</Button>
                    </FormGroup>
                </Form>
        }
    </React.Fragment>);
};

export default FirstScreen;
