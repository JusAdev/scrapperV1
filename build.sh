#!/usr/bin/env bash
# exit on error
set -o errexit

# Set the environment variable if not already set
export PUPPETEER_CACHE_DIR=${PUPPETEER_CACHE_DIR:-/opt/render/project/puppeteer}
export XDG_CACHE_HOME=${XDG_CACHE_HOME:-/opt/render/.cache}

# Install Node.js dependencies
npm install

# Install Puppeteer browsers
npx puppeteer browsers install

# Ensure the Puppeteer cache directory exists
mkdir -p $PUPPETEER_CACHE_DIR
mkdir -p $XDG_CACHE_HOME/puppeteer

# Store/pull Puppeteer cache with build cache
if [[ ! "$(ls -A $PUPPETEER_CACHE_DIR)" ]]; then 
  echo "...Copying Puppeteer Cache from Build Cache" 
  cp -R $XDG_CACHE_HOME/puppeteer/. $PUPPETEER_CACHE_DIR/
else 
  echo "...Storing Puppeteer Cache in Build Cache" 
  cp -R $PUPPETEER_CACHE_DIR/. $XDG_CACHE_HOME/puppeteer/
fi
