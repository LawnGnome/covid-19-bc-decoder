import React from "react";

import jws from "jws";
import pako from "pako";
import { R4 } from "@ahryman40k/ts-fhir-types";
import Patient from "./Patient";
import Immunisation from "./Immunisation";

const decodeNumericalCode = (code: string) => {
  let acc: string | undefined = undefined;
  let enc = "";
  for (const c of code) {
    if (acc === undefined) {
      acc = c;
    } else {
      const pair = parseInt(`${acc}${c}`) + 45;
      enc += String.fromCharCode(pair);

      acc = undefined;
    }
  }

  return enc;
};

export interface Props {
  code: string;
}

const Decoder: React.FunctionComponent<Props> = ({ code }) => {
  if (code.startsWith("shc:/")) code = code.substr(5);
  const raw = decodeNumericalCode(code);

  // We can decode the signature using jws.
  //
  // TODO: verify this against the known public key of BC (and other
  // provinces?).
  const sig = jws.decode(raw);

  // Unfortunately, the jws library doesn't handle binary payloads properly, so
  // we'll just decode it by hand.
  const payload = JSON.parse(
    pako.inflateRaw(Buffer.from(raw.split(".")[1], "base64"), {
      to: "string",
    })
  );

  try {
    const maybeBundle = R4.RTTI_Bundle.decode(
      payload.vc.credentialSubject.fhirBundle
    );
    if (maybeBundle._tag !== "Right") {
      throw maybeBundle.left;
    }
    const bundle = maybeBundle.right;

    if (bundle.entry === undefined) {
      throw new Error("no entries found in bundle");
    }

    let patient: R4.IPatient | undefined;
    let immunisations: R4.IImmunization[] = [];
    for (const entry of bundle.entry) {
      const resource = entry.resource;
      if (resource?.resourceType === "Patient") {
        patient = resource;
      } else if (resource?.resourceType === "Immunization") {
        immunisations.push(resource);
      }
    }

    return (
      <>
        {patient && <Patient patient={patient} />}
        {immunisations.length > 0 && (
          <>
            <h2>Vaccinations</h2>
            {immunisations.map((imm) => (
              <Immunisation immunisation={imm} />
            ))}
          </>
        )}
      </>
    );
  } catch (e) {
    return (
      <div>
        The QR code had an unexpected structure, and could not be parsed. Try
        scanning another one?
      </div>
    );
  }
};

export default Decoder;
