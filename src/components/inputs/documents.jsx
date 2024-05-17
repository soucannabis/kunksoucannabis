import React, { useState, useEffect } from "react";
import apiRequest from "../../modules/apiRequest";
import Viewer from "react-viewer";

function Documents({ documents }) {
  const [userDocuments, setUserDocuments] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function getDocuments() {
      console.log(documents)
      const docsData = documents.join(",").toString();
      const data = await apiRequest("/api/directus/documents", { documents: docsData }, "POST");
      setUserDocuments(data); 

      const imagesSrc = data.map(doc => {
        const docType = doc.docType.split("/")[1];
        return {
          src: `https://database.soucannabis.ong.br/assets/${doc.docSlug}/${doc.docName}.${docType}`,
        };
      });

      setImages(imagesSrc);
    }

    getDocuments();
  }, [documents]);

  return (
    <div className="container">
      <div id="imageContainer"></div>
      <Viewer
        visible={images.length > 0}
        container={document.getElementById("imageContainer")}
        images={images}
        noClose={true}
        noToolbar={false}
        defaultScale={1}
        zoomSpeed={1}
      />
    </div>
  );
}

export default Documents;
