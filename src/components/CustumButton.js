import React from 'react'
import { Button, } from 'react-bootstrap';
import { MdScheduleSend } from 'react-icons/md';
const CustumButton = (props) => {
  return (
       <div>
         <Button style={{backgroundColor:"black"}}>
              <MdScheduleSend className="me-2" />
              {props.Name}
            </Button>
    </div>
  )
}

export default CustumButton
