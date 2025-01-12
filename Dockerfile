# syntax=docker/dockerfile:1
# check=error=true

# For a containerized dev environment, see Dev Containers: https://guides.rubyonrails.org/getting_started_with_devcontainer.html


# FROM node:22-slim AS node
# WORKDIR /node
# COPY package.json yarn.lock .
# RUN yarn install


FROM ruby:3.3.6-slim AS base

# Rails app lives here
WORKDIR /myapp

# Install base packages
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libjemalloc2 libvips sqlite3 && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build gems
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential git pkg-config && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Install application gems
ENV BUNDLE_PATH=vendor/bundle
COPY Gemfile Gemfile.lock ./
RUN bundle config set path ${BUNDLE_PATH} && \
    bundle install && \
    rm -rf ~/.bundle/ ${BUNDLE_PATH}/ruby/*/cache ${BUNDLE_PATH}/ruby/*/bundler/gems/*/.git

# Install nodejs
ENV NVM_DIR=/usr/local/nvm
ENV NODE_VERSION=22.13.0
RUN mkdir ${NVM_DIR} && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash && \
    . ${NVM_DIR}/nvm.sh && \
    nvm install ${NODE_VERSION} && \
    nvm alias default ${NODE_VERSION} && \
    nvm use default && \
    npm i -g yarn && \
    yarn install
ENV PATH=${PATH}:${NVM_DIR}/versions/node/v${NODE_VERSION}/bin

# Copy application code
COPY . .

# Start server via Thruster by default, this can be overwritten at runtime
EXPOSE 8080
EXPOSE 8081
