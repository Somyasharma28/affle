import React, { useState } from 'react';
import './style.css';
import { Button} from 'reactstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Slot from './meetingSlot';


function tileDisabled({ date, view }) {
    // Disable tiles in month view only
    if (view === 'month') {
      // Check if a date React-Calendar wants to check is on the list of disabled dates
      return date.getDay()===6 || date.getDay()===0;
    }
  }

const dateFormat=(date)=>
{
    let [day,month,year]= [date.getDate(), date.getMonth(),date.getFullYear()];

    day= day<9? `0${day}`: day;
    month= (month)<9? `0${month}`: month;
    return `${day}-${month}-${year}`;
}

const SecondScreen = (props) => {
    
    const [meetingDate, setMeetingDate] = useState(new Date());
    const [currentDate, setCurrentDate]= useState(dateFormat(new Date())===dateFormat(meetingDate));
    const [presentDate, setPresentDate]= useState(false);
    const [presentSlots, setPresentSlots]= useState([]);
    const [meetingSlot, setMeetingSlot]= useState({});
    const [slowslot, setslowSlot]= useState(true);

    

    const showDate=()=>{
        const date= meetingDate;
        const days = ['Sunday','Monday','Tuesday','Wednesday','Thrusday','Friday','Saturday'];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const day= date.getDate();
        let dayPrefix='';
        if(day>3 && day<21)
        {
            dayPrefix='th';
        }else{
            switch(day%10)
            {
                case 1: dayPrefix='st';
                break;
                case 2: dayPrefix='nd';
                break;
                case 3: dayPrefix='rd';
                break;
                default: dayPrefix='th';
            }
        }
        
        return `${days[date.getDay()]}, ${day}${dayPrefix}  ${months[date.getMonth()]}`;
     
     }
     


    const dateChange=(date)=>{
        setMeetingDate(date);
        setCurrentDate(dateFormat(new Date())===dateFormat(date));
        setslowSlot(true);
    }

    const showSlot=()=>{
        let present=false;
        Object.keys(props.userData).forEach((val)=>{
            if(val===dateFormat(meetingDate))
            {
                setPresentDate(true);
                present=true;
            }
         
        });
            if(present)
            {
                const dateArray=props.userData[dateFormat(meetingDate)];
                let slotArray=[];
                dateArray.forEach((val)=>{
                    slotArray.push(val["slot"]);
                })

                Object.keys(props.meetingData).forEach((mVal,idx)=>{
                    Object.keys(props.meetingData[mVal]).forEach((dVal,idx)=>{
                        props.meetingData[mVal][dVal].forEach((sval)=>{
                            console.log(props.meetingData[mVal][dVal][sval]);
                            if(sval["meetingRoom"]===props.meetingRoom && dateFormat( sval["date"])=== dateFormat(meetingDate))
                            {
                                if(!slotArray.includes(sval["slot"]))
                                slotArray.push(sval["slot"]);
                            }
                        })
                    })

                })
                
                setPresentSlots([...slotArray]);
            }else{
                let slotArray=[];
                Object.keys(props.meetingData).forEach((mVal,idx)=>{
                    Object.keys(props.meetingData[mVal]).forEach((dVal,idx)=>{
                        props.meetingData[mVal][dVal].forEach((sval)=>{
                            console.log(props.meetingData[mVal][dVal][sval]);
                            if(sval["meetingRoom"]===props.meetingRoom && dateFormat( sval["date"])=== dateFormat(meetingDate))
                            {
                                slotArray.push(sval["slot"]);
                            }
                        })
                    })

                })

                setPresentSlots([...slotArray]);
            }
        
        if(setslowSlot){
            setslowSlot(false);
        }
        
    }

    const submitData=(date,slot)=>{
       if(date!==null && slot!==null && slot["time"]!==undefined)
       {
           alert(`${slot["value"]} is selected`);
           props.submitData(date,slot,presentDate);     
            setslowSlot(false);
            
       }else{
           alert("Please Select Date and slot for booking");
       }       
    }

    

    return (<React.Fragment>
        <Calendar
        onChange={(date)=>dateChange(date)}
        value={meetingDate}
        minDate={new Date()}
         tileDisabled={tileDisabled}
      />
      <h3>{showDate()}</h3>
      {slowslot? showSlot(): null}
      < div className="rowSlot">
      <Slot selectedSlots={presentSlots}  currentDate={currentDate} setMeetingSlot={setMeetingSlot} ></Slot>
      </div>
      <br/>
      <Button color="danger" className="mr-2" onClick={()=>submitData(dateFormat(meetingDate),meetingSlot)}>Book Appointment</Button>
      <Button color="danger" onClick={()=>props.setSubmit(true)}>Logout</Button>
    </React.Fragment>);
};

export default SecondScreen;
