# Copied from
# https://gist.github.com/lantins/e83477d8bccab83f078d

# binary name to kill/restart
PROG = server
#BINDATA_PATHS = tmpl/... assets/...

# targets not associated with files
.PHONY: dependencies default build test coverage clean kill restart serve

# check we have a couple of dependencies
dependencies:
	@command -v fswatch --version >/dev/null 2>&1 || { printf >&2 "fswatch is not installed, please run: brew install fswatch\n"; exit 1; }
	@command -v go-bindata >/dev/null 2>&1 || { printf >&2 "go-bindata is not installed, please run: go get github.com/jteeuwen/go-bindata/...\n"; exit 1; }

# default targets to run when only running `make`
default: dependencies test

# clean up
clean:
	go clean

# run formatting tool and build
build: dependencies clean
#	go-bindata $(BINDATA_PATHS)
#	go fmt
	go build

# run unit tests with code coverage
test: dependencies
	go test -cover

# generate code coverage report
coverage: test
	go test -coverprofile=.coverage.out
	go tool cover -html=.coverage.out

# attempt to kill running server
kill:
	-@killall -9 $(PROG) 2>/dev/null || true

# attempt to build and start server
restart:
	@make kill
	@make build; (if [ "$$?" -eq 0 ]; then (./${PROG} &); fi)

# watch .go files for changes then recompile & try to start server
# will also kill server after ctrl+c
serve: dependencies
	@make restart
#	@fswatch -o --exclude=bindata.go ./*.go tmpl/* | xargs -n1 -I{} make restart || make kill
	@fswatch -o --exclude=bindata.go ./*.go | xargs -n1 -I{} make restart || make kill
