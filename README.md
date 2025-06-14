![Wharf](./assets/wharf.png)
# wharf 
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white) ![Github-sponsors](https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#EA4AAA)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)
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

Currently the version 1.0.0 is released.

## ⭐️ Support

If you find this project helpful or interesting, please give it a ⭐️ on [GitHub](https://github.com/fordevio/wharf)! Your support helps the project grow and motivates community to keep improving it.
Also join the [#wharf](https://fordev-io.slack.com/archives/C07NTF2R6KF) slack channel.

## Quickstart

Prerequisite: 
* Install and run [docker](https://docs.docker.com/engine/install/)

```
sudo docker run -v /var/lib/wharf:/var/lib/wharf -v /var/run/docker.sock:/var/run/docker.sock -dp 9001:9001 fordevio/wharf:v1.0.0 --name wharf
```
The application can be acessed by the url `http://localhost:9001` on browser

## Testing
See [TESTING](./docs/TESTING.md)

## Contribution
See [CONTRIBUTION](./docs/CONTRIBUTION.md)


## Acknowledgements
Wharf logo has been created using ChatGPT.