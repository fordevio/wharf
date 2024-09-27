# Running locally

### Using source code

Prerequisite:
* Operating system: Linux or macos, for windows install [wsl](https://learn.microsoft.com/en-us/windows/wsl/install)  with ubuntu-24.04
* Install and configure path of [go1.22](https://go.dev/doc/install)
```
## commands only for linux os and wsl
curl -o https://go.dev/dl/go1.22.0.linux-amd64.tar.gz
rm -rf /usr/local/go && tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz

## Add following line to ~/.bashrc
export PATH=$PATH:/usr/local/go/bin
export GOROOT=/usr/local/go
export GOPATH=$HOME/go

```

* Install [make](https://ioflood.com/blog/install-make-command-linux/)
```
## Commands only for ubuntu
sudo apt install make
```
* Install node and npm
```
## Commands only for ubuntu
sudo apt update
sudo apt install nodejs
sudo apt install npm
```
* Install and run [docker](https://docs.docker.com/engine/install/)
```
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```
* Add docker user to sudo group
```
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

Set up the project: 
```
cd $GOPATH/src/github.com/fordevio

## Clone the git repository
git clone https://github.com/fordevio/wharf.git

## Go to the wharf directory
cd wharf

## Install dependencies
make get

## Build application
make 

## Run the application with root privileges
sudo make run

## Run frontend seperately on port 3000
make runFrontend
```

The application can be acessed by the url `http://localhost:9001`

### Using docker

Prerequisite:
* Operating system: Linux or macos, for windows install [wsl](https://learn.microsoft.com/en-us/windows/wsl/install)  with ubuntu-24.04

* Install [make](https://ioflood.com/blog/install-make-command-linux/)
```
## Commands only for ubuntu
sudo apt install make
```
* Install and run [docker](https://docs.docker.com/engine/install/)
```
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```
* Add docker user to sudo group
```
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

Set up the project:
```
## Clone the git repository
git clone https://github.com/fordevio/wharf.git

## Go to the wharf directory
cd wharf

## Make docker image
make dockerImage

## Run docker container
make runDockerWharf
```

The application can be acessed by the url `http://localhost:9001`

### Make commands
Run `make help` to get all the make commands.

## API Refs:
Api reference can be found in `http://localhost:9001/docs/api` after running the project.