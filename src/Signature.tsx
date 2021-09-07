import {
  faCheckCircle,
  faExclamationCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo, useState } from "react";
import KeyStore from "./KeyStore";

import styles from "./Signature.module.css";

export interface Props {
  signature: string;
}

enum State {
  VERIFYING,
  VERIFIED,
  FAILED,
}

const Signature: React.FunctionComponent<Props> = ({ signature }) => {
  const [state, setState] = useState(State.VERIFYING);
  const [jurisdiction, setJurisdiction] = useState<string | undefined>(
    undefined
  );

  useMemo(async () => {
    const jurisdiction = await (await KeyStore()).verify(signature);

    if (jurisdiction !== undefined) {
      setJurisdiction(jurisdiction);
      setState(State.VERIFIED);
    } else {
      setJurisdiction(undefined);
      setState(State.FAILED);
    }
  }, [signature]);

  return (
    <div className={styles.signature}>
      {state === State.VERIFYING && (
        <div className={styles.verifying}>
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faSpinner} pulse />
          </div>
          <div>Checking QR code signature&hellip;</div>
        </div>
      )}
      {state === State.VERIFIED && jurisdiction && (
        <div className={styles.success}>
          <FontAwesomeIcon className={styles.icon} icon={faCheckCircle} />
          <div>QR code verified by {jurisdiction}</div>
        </div>
      )}
      {state === State.FAILED && (
        <div className={styles.failure}>
          <FontAwesomeIcon className={styles.icon} icon={faExclamationCircle} />
          <div>QR code could not be verified by a known jurisdiction</div>
        </div>
      )}
    </div>
  );
};

export default Signature;
