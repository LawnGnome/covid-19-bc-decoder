#!/bin/bash

set -euxo pipefail

cd "$(dirname "$0")"

download() {
    echo -n 'const keys = '
    curl -L "$1"
    echo -n '; export default keys;'
}

download https://smarthealthcard.phsa.ca/v1/issuer/.well-known/jwks.json >src/keys/bc.ts
