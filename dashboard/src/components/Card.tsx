import React from 'react';

interface CardProps {
  message: string;
}

const Card: React.FC<CardProps> = ({ message }) => {
  return (
    <div className="w-full min-w-[200px] min-h-[400px] max-h-[400px] shadow-md hover:shadow-lg rounded border-2 border-white/50 h-full">
      <img src="/sdff.png" alt="Card" className='h-full w-full' />
    </div>
  );
};

export default Card;
