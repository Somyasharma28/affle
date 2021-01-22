import React from 'react';
import './style.css';
import { Button} from 'reactstrap';

const slot=["10:00 AM","11:00 AM","12:00 PM","13:00 PM","14:00 PM","15:00 PM","16:00 PM","17:00 PM","18:00 PM"];




const Slot = (props) => {
 
const slotSelection=(idx)=>
{
    const time=slot[idx].split("")[0];
    const value=slot[idx];
    props.setMeetingSlot({id:idx, time, value });
}


const showSlots=(selectedSlots)=>{
   let time= new Date().getHours();

   let beforeTime=[];
   slot.forEach((val,idx)=>{
        let slotVal=val.split(":")[0];
         if(parseInt(slotVal)<parseInt(time))
         {
            beforeTime.push(idx);
         }     
   });
   const newSlotArray=[...selectedSlots, ...beforeTime ];
  return slot.map((val,idx)=>{
    return newSlotArray.includes(idx)?<Button className="m-2" outline color="dark" disabled={true}  key={`${val}_`} >{val}</Button> :<Button outline color="danger" className="m-2" onClick={()=>slotSelection(idx)}  key={`${val}_`} >{val}</Button>;
    });

}


   return (<React.Fragment>
       {props.currentDate?
       
       showSlots(props.selectedSlots)    
       :
       slot.map((val,idx)=>{
        return props.selectedSlots.includes(idx)?<Button className="m-2" outline color="dark" disabled={true}  key={`${val}_`} >{val}</Button> :<Button outline color="danger" className="m-2"  onClick={()=>slotSelection(idx)}  key={`${val}_`}  >{val}</Button>;
        })
       }        
    </React.Fragment>);
};

export default Slot;
