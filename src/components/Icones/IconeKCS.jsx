import React from "react";

export default function Icone() {
  const style = {
    height: '20px',
    width: '20px',
    marginLeft: '5px',
  }

  // const backGroundStye = {
  //   enableBackground: 'new 0 0 32 32'
  // }
  return (
    <div className="icone" style={style} >
      <svg version="1.1" id="Layer_1" x="0px" y="0px"
        viewBox="0 0 32 32"  >
        <g>
          <circle class="st0" fill="#0093DD" cx="16" cy="16" r="16" />
          <path class="st1" fill="#FFFFFF" d="M13.5,16l5.2,5.3L22,18c0.6-0.6,1.5-0.6,2,0c0,0,0,0,0,0c0.6,0.6,0.6,1.6,0,2.2l-4.3,4.4
		c-0.6,0.6-1.5,0.6-2.1,0c0,0,0,0,0,0l-6.2-6.4V22c0,0.8-0.7,1.5-1.5,1.5c-0.8,0-1.5-0.7-1.5-1.5V10c0-0.8,0.7-1.5,1.5-1.5
		c0.8,0,1.5,0.7,1.5,1.5v3.8l6.2-6.4c0.6-0.6,1.5-0.6,2.1,0c0,0,0,0,0,0l4.3,4.4c0.6,0.6,0.6,1.6,0,2.2c-0.6,0.6-1.5,0.6-2,0
		c0,0,0,0,0,0l-3.3-3.4L13.5,16z M18.7,14.5c0.8,0,1.5,0.7,1.5,1.5s-0.7,1.5-1.5,1.5s-1.5-0.7-1.5-1.5
		C17.2,15.2,17.9,14.5,18.7,14.5z"/>
        </g>
      </svg>
    </div >
  )
}

