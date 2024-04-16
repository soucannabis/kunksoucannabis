import React, { useState, useEffect } from "react";
import apiRequest from "../../modules/apiRequest";

function Documents({ documents }) {
  const [userDocuments, setUserDocuments] = useState([]);

  useEffect(() => {
    async function getDocuments() {
      documents = documents.join(",").toString();
      const data = await apiRequest("/api/directus/documents", { documents: documents }, "POST");
      setUserDocuments(data);
    }

    getDocuments();
  }, []);

  return (
    <div className="container">
      <ul>
        {userDocuments.map((doc, index) => (
          <li>
            <a key={index} target="_blank" href={import.meta.env.VITE_APP_DIRECTUS_API_URL+"/assets/"+doc.docSlug}>
              {doc.docName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Documents;
