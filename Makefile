install:
	npm ci

build:
	npm run build

start:
	npx start-server -s ./dist

develop:
	npx start-server & npm run dev

lint:
	npm run lint

.PHONY: install build start develop lint
