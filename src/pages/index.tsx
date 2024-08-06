import React, { useRef, useState, useEffect } from 'react';
import Card from '../components/Card';
import './index.css'

export function MemoryGamePage(){
  const letters: string[] = ['🍓','🍉','🍏','🫐','🍒'];
  const pairs: string[] = [...letters, ...letters];

  const [shuffledCards, setShuffledCards] = useState<string[]>(shuffleArray(pairs));
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<[number | null, number | null]>([null, null]);
  const [gameState, setGameState] = useState<"game-over" | "ongoing" | "win">("ongoing")

  const [num, setNum] = useState<number>(30);
  const intervalRef = useRef<NodeJS.Timeout>();
  const decreaseNum = () => {
    setNum((prev) => ( prev - 1 )); 
  };

  useEffect(() => {
    intervalRef.current = setInterval(decreaseNum, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  function shuffleArray(array:any[]){
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    } return array;
  }

  function onCardClick(index: number){
    if(revealedIndices.includes(index)){
      return;
    }
    
    const firstIndex = selectedIndices[0]
    if(firstIndex === null){
      setSelectedIndices([index, null]);
      return;
    }

    const secondIndex = index;
    //index must be second turn, so if equal user clicked on the same card
    if(firstIndex === secondIndex){
      return;
    }
    //if two unmatched values are currently selected, we should stop the user from overriting with a new value
    if(selectedIndices[0] !== null && selectedIndices[1] !== null){
      return;
    }

    setSelectedIndices((prev) => [prev[0], secondIndex])

    const firstLetter = shuffledCards.at(firstIndex);
    const secondLetter = shuffledCards.at(secondIndex);

    if (firstLetter == null || secondLetter == null) {
      throw new Error("FOO")
    }

    if(firstLetter === secondLetter){
      setRevealedIndices((prev) => [...prev, firstIndex, secondIndex]);
      setSelectedIndices([null,null]);
      return;
    } 

    setSelectedIndices([firstIndex, secondIndex]);
  }

  useEffect(() => {
    if(selectedIndices[0] !== null && selectedIndices[1] !== null){
      setTimeout(() => {
        setSelectedIndices([null,null]);
      }, 500);
    }
  }, [selectedIndices])

  useEffect(() => {
    const allIndexesRevealed = shuffledCards.every((letter, index) => revealedIndices.includes(index));
    if(allIndexesRevealed){
      setGameState("win")
      clearInterval(intervalRef.current)
    }
  }, [revealedIndices])

  useEffect(() => {
    if(num===0){
      setGameState("game-over")
      clearInterval(intervalRef.current)
    }
  }, [num]);

  function restartMemory(){
    setShuffledCards(shuffleArray([...pairs]));
    setSelectedIndices([null,null]);
    setRevealedIndices([]);
    setGameState("ongoing");
    setNum(30)
    intervalRef.current = setInterval(decreaseNum, 1000);
  }


  return (
    <div style={{marginRight:'10%', marginLeft:'10%'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3 className='logo'>🩷 Memory</h3>
        <p>Remaining time: {num}</p>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridGap: '5px' }}>
        {shuffledCards.map((letter: string, index: number) => (
          <Card
          key={index} 
          value={letter}
          state={revealedIndices.includes(index) ? 'revealed' : selectedIndices.includes(index) ? 'selected' : 'hidden'}
          onClick={() => { if(gameState !== 'game-over'){
            onCardClick(index)}}}>
          </Card>
        ))}
      </div>
      {gameState === 'win' && 
      <div>
        <h2 style={{color: '#252525'}}>✨ VICTORY ✨</h2>
        <button className='restart-btn' onClick={restartMemory}>Play again</button>
      </div>}
      {gameState === 'game-over' && 
      <div>
        <h2 style={{color: '#252525'}}>💀 GAME OVER 💀</h2>
        <button className='restart-btn' onClick={restartMemory}>Try again</button>
      </div>}
    </div>
  );
}