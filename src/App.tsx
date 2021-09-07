import React, { useCallback, useLayoutEffect, useState } from "react";
import "./App.css";

import { QrReader } from "@blackbox-vision/react-qr-reader";
import Decoder from "./Decoder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

enum AppState {
  SCANNING,
  RESULTS,
  ABOUT,
}

const App: React.FunctionComponent<{}> = () => {
  const [code, setCode] = useState<string | undefined>(undefined);
  const [state, setState] = useState(AppState.SCANNING);

  const onQrCode = useCallback((code: string | undefined) => {
    if (code) {
      setCode(code);
      setState(AppState.RESULTS);
    }
  }, []);

  const onReset = useCallback(() => {
    setCode(undefined);
    setState(AppState.SCANNING);
  }, []);

  useLayoutEffect(() => {
    const getSize = () =>
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight}px`
      );

    getSize();
    window.onresize = getSize;
  });

  return (
    <>
      <div id="nav">
        <nav>
          {state !== AppState.SCANNING && (
            <button onClick={onReset}>
              <FontAwesomeIcon icon={faCamera} />
            </button>
          )}
          <div id="spacer"></div>
          {state !== AppState.ABOUT && (
            <button className="about" onClick={() => setState(AppState.ABOUT)}>
              About
            </button>
          )}
          <a
            id="github"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/LawnGnome/covid-19-bc-decoder"
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </nav>
      </div>
      {state === AppState.ABOUT && (
        <div className="content">
          <h2>About this site</h2>
          <p>
            This is a very quick and dirty site to decode and display the
            information encoded in a BC Vaccine Card.
          </p>
          <p>
            Your QR code and health information are not transmitted anywhere.
            (The coders among you can verify that using the source code below.)
          </p>
          <p>
            The source code for this site is hosted{" "}
            <a href="https://github.com/LawnGnome/covid-19-bc-decoder">
              on GitHub
            </a>
            . Bug reports are welcome.
          </p>
          <p>
            If you want to contact the author, ping{" "}
            <a href="https://twitter.com/LGnome">@LGnome</a> on Twitter.
          </p>
        </div>
      )}
      {state === AppState.SCANNING && (
        <div id="scanner">
          <QrReader
            onResult={(result) => onQrCode(result?.getText())}
            constraints={{ facingMode: "environment" }}
            videoStyle={{
              height: null,
              width: null,
              top: null,
              left: null,
              display: null,
              overflow: null,
              position: null,
            }}
            videoContainerStyle={{
              height: null,
              width: null,
              position: null,
              paddingTop: null,
              overflow: null,
            }}
          />
        </div>
      )}
      {state === AppState.RESULTS && code && (
        <div id="results" className="content">
          <Decoder code={code} />
        </div>
      )}
    </>
  );
};

export default App;
