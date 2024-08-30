
build:
	@go build -o bin/backend ./cmd && npm --prefix ./pkg/client run build 

buildGo:
	@go build -o bin/backend ./cmd

buildFrontend:
	@npm --prefix ./pkg/client run build

runFrontend:
	@npm --prefix ./pkg/client start

run:
	@./bin/backend  

format:
	@gofmt -w .

help:
	@echo "Available commands:"
	@echo "  make build      - Build the application"
	@echo "  make hotreload  - Run the application in hot reload"
	@echo "  make run        - Run the application"
	@echo "  make test       - Test the application"
	@echo "  make get        - Install dependencies"
	@echo "  make args ARGS=\"<arguments>\" - Build and run the application with arguments"
	@echo "  make help       - Show this help message"
