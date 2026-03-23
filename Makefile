NODE_BIN := $(HOME)/.nvm/versions/node/v20.15.0/bin
export PATH := $(NODE_BIN):$(PATH)

.PHONY: build server

build:
	npx react-scripts build

server:
	BROWSER=none npx react-scripts start
