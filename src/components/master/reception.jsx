import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Board, { moveCard } from "@asseinfo/react-kanban";
import CustomCard from "../inputs/customCard";
import "@asseinfo/react-kanban/dist/styles.css";
import apiRequest from "../../modules/apiRequest";

function Kanban() {
  const [board, setBoard] = useState([]);
  
  useEffect(() => {
    async function reception() {
      const data = await apiRequest("/api/directus/reception", "", "GET");
      console.log(data);

      const phases = ["Entrada", "1 Boas Vindas", "2 Saiba mais", "Despedida"];
      var arrayPhases = [];
      phases.map((phase, i) => {
        arrayPhases.push({
          id: i,
          title: phase,
          cards: data
            .filter((item) => item.reception_phase == i)
            .map((item, t) => ({
              id: item.id,
              title: item.name + " " + item.lastname,
              email: item.email,
              phone: item.phone,
              date: item.date_created,
              isAssociate: item.isAssociate,
              option1: item.option1,
              option2: item.option2,
              message: item.message,
              code: item.code,
            })),
        });
      });

      console.log(arrayPhases);

      setBoard({ columns: arrayPhases });
    }
    reception();
  }, []);

  function ControlledBoard() {
    // You need to control the state yourself.
    const [controlledBoard, setBoard] = useState(board);

    async function handleCardMove(_card, source, destination) {
      const updatedBoard = moveCard(controlledBoard, source, destination);
      setBoard(updatedBoard);
      await apiRequest("/api/directus/reception?id="+_card.id, {columnId:destination.toColumnId}, "POST");
    }

    return (
      <Board onCardDragEnd={handleCardMove} renderCard={(card) => <CustomCard card={card} />}>
        {controlledBoard}
      </Board>    
    );
  }

  function App() {
    return (
      <>
        <ControlledBoard />
      </>
    );
  }

  const rootElement = document.getElementById("root");
  ReactDOM.render(<App />, rootElement);
}

export default Kanban;
