import React, { useState, useEffect } from "react";
import apiRequest from "../../modules/apiRequest";
import Viewer from "react-viewer";

function Documents({ documents }) {
  const [userDocuments, setUserDocuments] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function getDocuments() {
      documents = documents.join(",").toString();
      const data = await apiRequest("/api/directus/documents", { documents: documents }, "POST");
      setUserDocuments(data);

      var imagesSrc = []

      data.map(doc => {
        var docType = doc.docType
        docType = docType.split("/")[1]
        imagesSrc.push({
          src:"https://database.soucannabis.ong.br/assets/"+doc.docSlug+"/"+doc.docName+"."+docType
        })
      })
      setImages([imagesSrc])
    }



    getDocuments();
  }, []);

  return (
    <div className="container">
      {console.log(images)}
      <div id="imageContainer"></div>
      <Viewer
        visible={true}
        container={document.getElementById("imageContainer")}
        images={[{ src: "https://database.soucannabis.ong.br/assets/84ab2ac4-af2d-4c03-acc9-9384de547ac0.jpeg" }]} // Substitua o src e alt conforme necessário
        noClose={true}
        noToolbar={true}   
        defaultScale={5}
        zoomSpeed={1}
      />
    </div>
  );
}

export default Documents;
