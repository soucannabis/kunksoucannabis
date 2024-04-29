import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Menu from "../menuPartner"
import PartnerForm from "../forms/partnerForm"
import apiRequest from "../../modules/apiRequest";

function Partners() {
  const {code} = useParams()
  const [partnerData, setPartnerData] = useState([]);

  useEffect(() => {
    async function partnerData() {
      console.log(code)
      const data = await apiRequest("/api/directus/partner?code="+code, "", "GET");
      setPartnerData(data);
    }

    partnerData();
  }, []);

  return (
    <div>
      <Menu />
      <div class="nav-scroller bg-white box-shadow">
      </div>
      <div style={{padding:"50px 200px"}} className="container">    
         <PartnerForm data={partnerData} hiddenFields={["commission_value", "pass_account"]}/>
      </div>
    </div>
  );
}

export default Partners;
