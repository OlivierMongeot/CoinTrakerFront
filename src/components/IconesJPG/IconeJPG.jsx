import React from "react";
import solana from './solana.png'

export default function IconeJPG() {

  const style = {
    height: '20px',
    width: '20px',
    marginLeft: '5px',
  }
  return (
    <div className="icone-usd" style={style} >
      <img src={solana} alt="icone" />
    </div >
  )
}

