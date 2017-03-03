# mobz

Social commuting


# User interface

Built with [Angular CLI](https://github.com/angular/angular-cli),
[Bootstrap 4 Components](https://ng-bootstrap.github.io/#/home)
and [Typescript](https://www.typescriptlang.org/)

Clone repos

    git clone http://github.com/mozey/mobz
    
Install dependencies

    cd mobz/ui
    
    npm install
    
Run dev server with live reload
    
    ng serve --host 0.0.0.0 --port 4200 --live-reload-port 49153
    
Open [localhost:4200](localhost:4200)


# Server

Built with [Go](https://golang.org/)

[Generate key and cert](https://gist.github.com/denji/12b3a568f092ab951456)

    cd mobz/server
    
    openssl genrsa -out server.key 2048
    
    openssl ecparam -genkey -name secp384r1 -out server.key
    
    openssl req -new -x509 -sha256 -key server.key -out server.crt -days 3650

Run the server 

    cd mobz
    
    go run server/*.go
    
Open [localhost:4100](localhost:4100) in multiple browsers,
location is broadcast to all clients


# Simulation

Use [SimPy](https://simpy.readthedocs.io/en/latest/) to simulate clients?

