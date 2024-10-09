

build: get
	@go build -o bin/build ./cmd &&  rm -rf ./bin/frontend && npm --prefix ./client run build 

get: 
	@go mod download && npm --prefix ./client install


runFrontend: get
	@npm --prefix ./client start

run: 
	@./bin/build  

format: get
	@gofmt -w . && npm --prefix ./client run format

dockerImage:
	@docker build -t wharf -f deployment/Dockerfile .


testDockerImage:
	@docker build -t wharf-test -f test/intrument_sample_app/Dockerfile .


test-integration: testDockerImage
	@docker run --rm wharf-test -v /var/run/docker.sock:/var/run/docker.sock -it wharf-test 

runDockerWharf: 
	@docker run -v /var/lib/wharf:/var/lib/wharf -v /var/run/docker.sock:/var/run/docker.sock -dp 9001:9001 wharf --name wharf

test-unit: get
	@go test -v ./pkg/...

help:
	@echo "Available commands:"
	@echo "  make build         - Build the application"
	@echo "  make dockerImage   - Build docker image"
	@echo "  make run           - Run the application"
	@echo "  make runFrontend   - Run the frontend on port 3000"
	@echo "  make get           - Install dependencies"
	@echo "  make format        - Format code"
	@echo "  make test-unit     - Run all unit test"
	@echo "  make help          - Show this help message"



