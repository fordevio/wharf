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

## ⭐️ Support

If you find this project helpful or interesting, please give it a ⭐️ on [GitHub](https://github.com/fordevio/wharf)! Your support helps the project grow and motivates me to keep improving it.
Also join the [#wharf](https://fordev-io.slack.com/archives/C07NTF2R6KF) slack channel.

## Quickstart

Prerequisite: 
* Install [docker](https://docs.docker.com/engine/install/)
* Add docker user to sudo group

```
docker run -v /var/lib/wharf:/var/lib/wharf -v /var/run/docker.sock:/var/run/docker.sock -dp 9001:9001 fordevio/wharf:latest --name wharf
```
The application can be acessed by the url `http://localhost:9001`

## Testing
See [TESTING](./docs/TESTING.md)

## Contribution
See [CONTRIBUTION](./docs/CONTRIBUTION.md)


## Acknowledgements
Wharf logo has been created using ChatGPT.