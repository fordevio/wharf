FROM golang:1.23-alpine AS buildgo
WORKDIR /app
COPY ../go.mod ../go.sum ./
RUN go mod download
COPY ../ .
RUN  go build -o bin/build ./cmd


FROM node:lts AS builderjs
WORKDIR /app
COPY ../client/package*.json ./client/
RUN mkdir bin
RUN npm install --prefix client
COPY ../client/ ./client/
RUN npm run build --prefix client


FROM alpine:edge
WORKDIR /app
COPY --from=buildgo /app/bin/build ./bin/build
COPY --from=builderjs /app/static ./static
EXPOSE 9001
ENTRYPOINT ["./bin/build"]