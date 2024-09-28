FROM golang:1.22-alpine
WORKDIR /app
COPY ../../go.mod ../../go.sum ./
RUN go mod download
COPY ../../ .
ENTRYPOINT ["go", "test", "-v", "./test/e2e/..."]
