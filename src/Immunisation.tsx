import React from "react";

import { R4 } from "@ahryman40k/ts-fhir-types";
import ListItem from "./ListItem";

const decodeVaccineCodes = (coding?: R4.ICoding[]) => {
  if (coding) {
    for (const code of coding) {
      if (code.system === "http://hl7.org/fhir/sid/cvx") {
        switch (code.code) {
          case "510":
            return "Sinopharm";
          case "511":
            return "Sinovac";
          case "502":
            return "COVAXIN";
          case "501":
            return "QAZCOVID-IN";
          case "503":
            return "COVIVAC";
          case "500":
            return "Unknown COVID-19 vaccine";
          case "507":
            return "Anhui Zhifei Longcom Biopharm";
          case "509":
            return "EpiVacCorona";
          case "508":
            return "Jiangsu";
          case "211":
            return "Novavax";
          case "212":
            return "Janssen";
          case "210":
            return "AstraZeneca";
          case "506":
            return "CanSino";
          case "504":
            return "Sputnik Light";
          case "505":
            return "Sputnik V";
          case "207":
            return "Moderna";
          case "208":
            return "Pfizer";
        }
      }
    }
  }
};

export interface Props {
  immunisation: R4.IImmunization;
}

const Immunisation: React.FunctionComponent<Props> = ({ immunisation }) => {
  return (
    <dl>
      <ListItem label="Date" value={immunisation.occurrenceDateTime} />
      <ListItem
        label="Type"
        value={decodeVaccineCodes(immunisation.vaccineCode.coding)}
      />
      <ListItem label="Lot number" value={immunisation.lotNumber} />
      <ListItem
        label="Location"
        value={immunisation.performer
          ?.map((performer) => performer.actor.display)
          .filter((performer) => performer !== undefined)
          .join("; ")}
      />
    </dl>
  );
};

export default Immunisation;
