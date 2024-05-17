import React, { useState, useEffect } from "react";


function Annotations({anotations, saveAnotations}) {
  const [annotationsData, setAnnotationsData] = useState(JSON.parse(anotations));
  const [newAnnotation, setNewAnnotation] = useState("");

  useEffect(() => {
    console.log()
  }, []);

  const addAnnotation = () => {
    if (newAnnotation.trim() === "") return;

    const newAnnotationData = {
      id: annotationsData.length ? annotationsData[annotationsData.length - 1].id + 1 : 1,
      text: newAnnotation,
      date_created: new Date().toLocaleString(),
    };

    setAnnotationsData([...annotationsData, newAnnotationData]);
    setNewAnnotation("");
    saveAnotations([...annotationsData, newAnnotationData])
  };

  const deleteAnnotation = (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta anotação?");

    if(confirmDelete) {
    setAnnotationsData(annotationsData.filter(annotation => annotation.id !== id));
    saveAnotations(annotationsData.filter(annotation => annotation.id !== id))
    }
  };

  const handleAnnotationChange = (event) => {
    setNewAnnotation(event.target.value);
  };

  return (
    <div className="annotations-container">
      {annotationsData &&
        annotationsData.length > 0 &&
        annotationsData.map((annotation) => (
          <div key={annotation.id} className="annotation">
            <div className="annotation-header">
              <strong>Nome do usuário do sistema</strong>
              <small>{annotation.date_created}</small>
            </div>
            <div className="annotation-body">{annotation.text}</div>
            <button className="delete-button" onClick={() => deleteAnnotation(annotation.id)}>
              Delete
            </button>
          </div>
        ))}
      <textarea
        className="annotation-textarea"
        onChange={handleAnnotationChange}
        value={newAnnotation}
        rows={3}
        cols={100}
        placeholder="Escreva sua anotação aqui..."
      />
      <button className="add-button" onClick={addAnnotation}>
        Adicionar Anotação
      </button>
    </div>
  );
}

export default Annotations;
