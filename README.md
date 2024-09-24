![Wharf](./assets/wharf.png)
# wharf 

## Overview
Wharf is tool which make organizing your monolithic server easy. The purpose of the project to simplify the server management for the team or organization.

Currently wharf includes following features:
* Managing docker containers on the server.
* Managing docker volumes on the server.
* Managing docker images on the server.
* Managing docker networks on the server.
* Monitoring and logs of the containers.
* Managing users with RBAC.

## Project Status
Currently the first version of the project is in development phase, the api's has been be created, development of some components of user interface is left.

## Quickstart

### Using source code

Prerequisite: 
* Install and configure path of [go1.22](https://go.dev/doc/install)
* Install [make](https://ioflood.com/blog/install-make-command-linux/)
* Install node and npm
* Install [docker](https://docs.docker.com/engine/install/)
* Add docker user to sudo group

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
```

The application can be acessed by the url `http://localhost:9001`

### Using docker

Prerequisite: 
* Install [docker](https://docs.docker.com/engine/install/)
* Add docker user to sudo group

```
## Clone the git repository
git clone https://github.com/fordevio/wharf.git

## Go to the wharf directory
cd wharf

## Make docker image
make dockerImage

## Run docker container
docker run -v /var/lib/wharf:/var/lib/wharf -v /var/run/docker.sock:/var/run/docker.sock -dp 9001:9001 wharf --name wharf

## You can also run docker container using make (skip if done the previous step)
make runDockerWharf
```

The application can be acessed by the url `http://localhost:9001`

## Testing
See [TESTING](./docs/TESTING.md)

## Contribution
See [CONTRIBUTION](./docs/CONTRIBUTION.md)


## Acknowledgements
Wharf logo has been created using ChatGPT.