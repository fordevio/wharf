# Development Guide

This guide provides instructions for setting up and running the Wharf project locally on different operating systems.

## Table of Contents

- [System Requirements](#system-requirements)
- [Setup by Operating System](#setup-by-operating-system)
  - [Linux](#linux)
    - [Ubuntu/Debian](#ubuntudebian)
    - [CentOS/RHEL/Fedora](#centosrhelfedora)
    - [Arch Linux](#arch-linux)
    - [openSUSE](#opensuse)
    - [Alpine Linux](#alpine-linux)
  - [macOS](#macos)
  - [Windows (WSL)](#windows-wsl)
- [Running from Source Code](#running-from-source-code)
- [Running with Docker](#running-with-docker)
- [Make Commands](#make-commands)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## System Requirements

- **Operating System**: Linux, macOS, or Windows 10/11 with WSL2
- **Go**: Version 1.23 or later
- **Node.js**: Version 16 or later
- **npm**: Latest version
- **Docker**: Latest version
- **Make**: Build automation tool

## Setup by Operating System

### Linux

#### Ubuntu/Debian

##### 1. Install Go 1.23

```bash
# Download and install Go
curl -O https://go.dev/dl/go1.23.0.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.23.0.linux-amd64.tar.gz

# Add to ~/.bashrc or ~/.zshrc
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
echo 'export GOROOT=/usr/local/go' >> ~/.bashrc
echo 'export GOPATH=$HOME/go' >> ~/.bashrc

# Reload shell configuration
source ~/.bashrc

# Verify installation
go version
```

##### 2. Install Make

```bash
sudo apt update
sudo apt install make
```

##### 3. Install Node.js and npm

**Option A: Using apt (Recommended)**
```bash
sudo apt update
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

**Option B: Using NodeSource repository (Latest versions)**
```bash
# Install NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

##### 4. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
```

#### CentOS/RHEL/Fedora

##### 1. Install Go 1.23

```bash
# Download and install Go
curl -O https://go.dev/dl/go1.23.0.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.23.0.linux-amd64.tar.gz

# Add to ~/.bashrc or ~/.zshrc
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
echo 'export GOROOT=/usr/local/go' >> ~/.bashrc
echo 'export GOPATH=$HOME/go' >> ~/.bashrc

# Reload shell configuration
source ~/.bashrc

# Verify installation
go version
```

##### 2. Install Make

**For CentOS/RHEL 8+:**
```bash
sudo dnf install make gcc git
```

**For CentOS/RHEL 7:**
```bash
sudo yum install make gcc git
```

**For Fedora:**
```bash
sudo dnf install make gcc git
```

##### 3. Install Node.js and npm

**For CentOS/RHEL 8+ and Fedora:**
```bash
# Install Node.js and npm
sudo dnf install nodejs npm

# Verify installation
node --version
npm --version
```

**For CentOS/RHEL 7:**
```bash
# Enable EPEL repository
sudo yum install epel-release

# Install Node.js and npm
sudo yum install nodejs npm

# Verify installation
node --version
npm --version
```

**Alternative: Using NodeSource repository**
```bash
# For RHEL/CentOS/Fedora
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install nodejs  # For dnf-based systems
# OR
sudo yum install nodejs  # For yum-based systems
```

##### 4. Install Docker

**For CentOS/RHEL 8+ and Fedora:**
```bash
# Install Docker
sudo dnf remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-selinux docker-engine-selinux docker-engine

# Install Docker CE
sudo dnf install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install docker-ce docker-ce-cli containerd.io

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

**For CentOS/RHEL 7:**
```bash
# Install Docker
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

#### Arch Linux

##### 1. Install Go 1.23

**Option A: Using pacman**
```bash
# Update package database
sudo pacman -Syu

# Install Go
sudo pacman -S go

# Add to ~/.bashrc or ~/.zshrc
echo 'export GOPATH=$HOME/go' >> ~/.bashrc
echo 'export PATH=$PATH:$GOPATH/bin' >> ~/.bashrc

# Reload shell configuration
source ~/.bashrc
```

**Option B: Manual installation**
```bash
# Download and install Go
curl -O https://go.dev/dl/go1.23.0.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.23.0.linux-amd64.tar.gz

# Add to ~/.bashrc or ~/.zshrc
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
echo 'export GOROOT=/usr/local/go' >> ~/.bashrc
echo 'export GOPATH=$HOME/go' >> ~/.bashrc

source ~/.bashrc
```

##### 2. Install Make

```bash
sudo pacman -S make base-devel
```

##### 3. Install Node.js and npm

```bash
# Install Node.js and npm
sudo pacman -S nodejs npm

# Verify installation
node --version
npm --version
```

##### 4. Install Docker

```bash
# Install Docker
sudo pacman -S docker

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

#### openSUSE

##### 1. Install Go 1.23

```bash
# Download and install Go
curl -O https://go.dev/dl/go1.23.0.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.23.0.linux-amd64.tar.gz

# Add to ~/.bashrc or ~/.zshrc
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
echo 'export GOROOT=/usr/local/go' >> ~/.bashrc
echo 'export GOPATH=$HOME/go' >> ~/.bashrc

# Reload shell configuration
source ~/.bashrc

# Verify installation
go version
```

##### 2. Install Make

**For openSUSE Leap/Tumbleweed:**
```bash
sudo zypper install make gcc git
```

##### 3. Install Node.js and npm

```bash
# Install Node.js and npm
sudo zypper install nodejs npm

# Verify installation
node --version
npm --version
```

##### 4. Install Docker

```bash
# Install Docker
sudo zypper install docker

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

#### Alpine Linux

##### 1. Install Go 1.23

```bash
# Update package index
sudo apk update

# Install Go
sudo apk add go

# Add to ~/.ashrc or ~/.bashrc
echo 'export GOPATH=$HOME/go' >> ~/.ashrc
echo 'export PATH=$PATH:$GOPATH/bin' >> ~/.ashrc

# Reload shell configuration
source ~/.ashrc
```

##### 2. Install Make

```bash
sudo apk add make build-base git
```

##### 3. Install Node.js and npm

```bash
# Install Node.js and npm
sudo apk add nodejs npm

# Verify installation
node --version
npm --version
```

##### 4. Install Docker

```bash
# Install Docker
sudo apk add docker

# Add Docker service
sudo rc-update add docker boot

# Start Docker
sudo service docker start

# Add user to docker group
sudo addgroup $USER docker
newgrp docker
```

### macOS

#### 1. Install Go 1.23

**Option A: Using Homebrew (Recommended)**
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Go
brew install go@1.23

# Add to ~/.zshrc or ~/.bash_profile
echo 'export GOPATH=$HOME/go' >> ~/.zshrc
echo 'export PATH=$PATH:$(go env GOPATH)/bin' >> ~/.zshrc

# Reload shell configuration
source ~/.zshrc
```

**Option B: Manual Installation**
```bash
# Download and install Go
curl -O https://go.dev/dl/go1.23.0.darwin-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.23.0.darwin-amd64.tar.gz

# Add to ~/.zshrc or ~/.bash_profile
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.zshrc
echo 'export GOROOT=/usr/local/go' >> ~/.zshrc
echo 'export GOPATH=$HOME/go' >> ~/.zshrc

# Reload shell configuration
source ~/.zshrc

# Verify installation
go version
```

#### 2. Install Make

Make is typically pre-installed on macOS. If not available:

```bash
# Using Homebrew
brew install make

# Or install Xcode Command Line Tools
xcode-select --install
```

#### 3. Install Node.js and npm

**Option A: Using Homebrew**
```bash
brew install node npm
```

**Option B: Using Node Version Manager (nvm)**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.zshrc

# Install latest Node.js
nvm install node
nvm use node
```

#### 4. Install Docker

**Option A: Docker Desktop (Recommended)**
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
2. Install the downloaded .dmg file
3. Start Docker Desktop from Applications

**Option B: Using Homebrew**
```bash
brew install --cask docker
```

### Windows (WSL)

#### 1. Install WSL2 with Ubuntu 24.04

```powershell
# Run in PowerShell as Administrator
wsl --install -d Ubuntu-24.04

# Restart your computer when prompted
# Set up Ubuntu username and password after restart
```

#### 2. Configure WSL and Install Dependencies

Open Ubuntu terminal and run:

```bash
# Update package lists
sudo apt update && sudo apt upgrade -y

# Install essential build tools
sudo apt install build-essential curl wget git -y
```

#### 3. Install Go 1.23

```bash
# Download and install Go
curl -O https://go.dev/dl/go1.23.0.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.23.0.linux-amd64.tar.gz

# Add to ~/.bashrc
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
echo 'export GOROOT=/usr/local/go' >> ~/.bashrc
echo 'export GOPATH=$HOME/go' >> ~/.bashrc

# Reload shell configuration
source ~/.bashrc

# Verify installation
go version
```

#### 4. Install Make

```bash
sudo apt install make
```

#### 5. Install Node.js and npm

```bash
# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

#### 6. Install Docker

**Option A: Docker Desktop for Windows (Recommended)**
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
2. Install Docker Desktop with WSL2 backend enabled
3. Ensure WSL integration is enabled in Docker Desktop settings

**Option B: Docker Engine in WSL**
```bash
# Install Docker in WSL
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker

# Start Docker service (if not using Docker Desktop)
sudo service docker start
```

## Running from Source Code

### 1. Clone the Repository

```bash
# Create Go workspace directory
mkdir -p $GOPATH/src/github.com/fordevio
cd $GOPATH/src/github.com/fordevio

# Clone the repository
git clone https://github.com/fordevio/wharf.git
cd wharf
```

### 2. Install Dependencies and Build

```bash
# Install Go dependencies
make get

# Build the application
make

# Run the application (requires root privileges)
sudo make run
```

### 3. Run Frontend Separately

In a new terminal:

```bash
cd $GOPATH/src/github.com/fordevio/wharf
make runFrontend
```

The application will be accessible at: `http://localhost:9001`

## Running with Docker

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/fordevio/wharf.git
cd wharf
```

### 2. Build and Run Docker Container

```bash
# Build Docker image
make dockerImage

# Run Docker container
make runDockerWharf
```

If your are using macos, the init password can be found by ssh into the wharf container and see the contents of /var/lib/wharf/wharf.txt

```bash
# Get password from running Wharf container
docker exec $(docker ps -q --filter ancestor=wharf) cat /var/lib/wharf/wharf.txt

# Or if you know the container name
docker exec wharf cat /var/lib/wharf/wharf.txt
```

The application will be accessible at: `http://localhost:9001`

## Make Commands

To see all available make commands:

```bash
make help
```

Common commands include:
- `make get` - Install dependencies
- `make` - Build the application
- `make run` - Run the application
- `make runFrontend` - Run frontend separately
- `make dockerImage` - Build Docker image
- `make runDockerWharf` - Run Docker container
- `make clean` - Clean build artifacts
- `make test` - Run tests

## API Documentation

After running the project, API documentation is available at:
`http://localhost:9001/docs/api`

## Troubleshooting

### Common Issues

#### Go Command Not Found
- Ensure Go is properly installed and PATH is configured
- Restart your terminal after modifying shell configuration files
- **Ubuntu/Debian**: Check if Go is in repositories: `apt list --installed | grep golang`
- **CentOS/RHEL/Fedora**: Verify installation: `which go` or `go version`
- **Arch Linux**: Check package: `pacman -Q go`
- **openSUSE**: Verify installation: `zypper se --installed-only go`
- **Alpine Linux**: Check package: `apk info go`
- Verify with `go version`

#### Permission Denied (Docker)
- **Ubuntu/Debian**: Ensure your user is added to the docker group: `sudo usermod -aG docker $USER`
- **CentOS/RHEL/Fedora**: Same as above, plus ensure Docker service is running: `sudo systemctl start docker`
- **Arch Linux**: Check Docker service status: `sudo systemctl status docker`
- **openSUSE**: Verify Docker service: `sudo systemctl status docker`
- **Alpine Linux**: Start Docker service: `sudo service docker start`
- Log out and log back in, or run `newgrp docker`
- On Windows, ensure Docker Desktop is running

#### Package Manager Issues
- **Ubuntu/Debian**: Update package lists: `sudo apt update`
- **CentOS/RHEL 7**: Enable EPEL repository: `sudo yum install epel-release`
- **CentOS/RHEL 8+/Fedora**: Update packages: `sudo dnf update`
- **Arch Linux**: Update system: `sudo pacman -Syu`
- **openSUSE**: Refresh repositories: `sudo zypper refresh`
- **Alpine Linux**: Update package index: `sudo apk update`

#### Port Already in Use
- Check if another application is using port 9001:
  - **Linux**: `lsof -i :9001` or `netstat -tlnp | grep :9001`
  - **macOS**: `lsof -i :9001`
  - **Windows**: `netstat -ano | findstr :9001`
- Kill the process or change the port in configuration
- **Alternative ports**: Try using different ports like 9002, 9003, etc.

#### WSL Issues on Windows
- Ensure WSL2 is installed and set as default: `wsl --set-default-version 2`
- Update WSL: `wsl --update`
- Restart WSL: `wsl --shutdown` then reopen terminal

#### Node.js/npm Issues
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### Development Tips

- Use `make help` to discover available commands

## Contributing

Visit [CONTRIBUTION.md](./CONTRIBUTION.md)

## Testing

Visit [TRSTING.md](./TESTING.md)