import React from 'react';
import './card.css';

interface CardProps {
  value: string;
  state: "hidden" | "selected" | "revealed";
  onClick: () => any;
  children?: React.ReactNode;
}

function Card({ value, state, onClick}: CardProps){
    return (
        <div className='card' 
            style={{backgroundColor: state==='hidden'? "#252525": 'white', 
                border: state==='revealed' ? '3px solid #07c700': '3px solid #252525'}} 
            onClick={onClick}>
            <h2 style={{fontWeight:'bold', color: state==='hidden'? "transparent": "black"}}>{value}</h2>
        </div>
    );
}

export default Card;