import React from "react";

import { R4 } from "@ahryman40k/ts-fhir-types";
import ListItem from "./ListItem";

export interface Props {
  patient: R4.IPatient;
}

const Patient: React.FunctionComponent<Props> = ({ patient }) => {
  return (
    <>
      <h2>Personal information</h2>
      <dl>
        {patient.name?.map((name) => {
          return (
            <>
              <ListItem label="Family name" value={name.family} />
              <ListItem
                label="Given names"
                value={
                  name.given && name.given.length > 0
                    ? name.given.join(" ")
                    : undefined
                }
              />
            </>
          );
        })}
        <ListItem label="Date of birth" value={patient.birthDate} />
      </dl>
    </>
  );
};

export default Patient;
