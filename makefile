ESLINT = ./node_modules/.bin/eslint

lint:
	$(ESLINT) ./lib/*.js

test:
	@make lint

.PHONY: lint test
