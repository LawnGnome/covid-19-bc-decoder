import { JWK, JWS } from "node-jose";

import BC from "./keys/bc";
import QC from "./keys/qc";

const JURISDICTIONS = {
  Quebec: QC,
  "British Columbia": BC,
};

class KeyStore {
  verifiers: Map<string, JWS.Verifier>;

  constructor() {
    this.verifiers = new Map();
  }

  async load() {
    if (this.verifiers.size === 0) {
      for (const [jurisdiction, raw] of Object.entries(JURISDICTIONS)) {
        this.verifiers.set(
          jurisdiction,
          JWS.createVerify(await JWK.asKeyStore(raw))
        );
      }
    }
  }

  async verify(sig: string): Promise<string | undefined> {
    for (const [jurisdiction, verifier] of this.verifiers) {
      try {
        // The actual result is unnecessary here; if the verifications fails
        // then an exception will be raised, and we'll handle that elsewhere.
        await verifier.verify(sig);
        return jurisdiction;
      } catch (e) {}
    }
  }
}

const store = new KeyStore();
const getStore = async () => {
  await store.load();
  return store;
};

export default getStore;
