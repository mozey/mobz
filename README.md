# mobz

Makes transport social

See [slides](https://docs.google.com/presentation/d/15UZS_MdcvEklibB5Yn_NOAJB_8mPAa-fHs8vFU87ljk/edit) 
prepared for "Access Cape Town: Hack on Open platform for transport data".

And [here is a video](https://www.youtube.com/watch?v=rtW-cYF-tqY) of the event


# User interface

Built with [Angular CLI](https://github.com/angular/angular-cli),
[Bootstrap 4 Components](https://ng-bootstrap.github.io/#/home)
and [Typescript](https://www.typescriptlang.org/)

Clone repos

    git clone http://github.com/mozey/mobz
    
Install dependencies

    cd mobz/web
    
    npm install
    
Run dev server with live reload
    
    ng serve --host 0.0.0.0 --port 4200 --live-reload-port 49153
    
Open [localhost:4200](localhost:4200)


# Server

Built with [golang](https://golang.org/) 

Location service uses a modified version of 
[gorilla websocket chat example](https://github.com/gorilla/websocket/tree/master/examples/chat) 

[Generate key and cert](https://gist.github.com/denji/12b3a568f092ab951456)

    cd mobz/server
    
    openssl genrsa -out server.key 2048
    
    openssl ecparam -genkey -name secp384r1 -out server.key
    
    openssl req -new -x509 -sha256 -key server.key -out server.crt -days 3650
    # Common Name must be "mobz"
    
Setup hosts file
    
    sudo vi /etc/hosts
    
    127.0.0.1 mobz
    
Trust self signed cert on osx

    Keychain Access > System
    
    File > Import Items... > server.crt

Run the server 

    cd mobz/server
    
    go run *.go
    
    # Run with live reload
    make serve

Open [https://mobz:4100](https://mobz:4100),
web browser should not complain about the self-signed cert

In newer browsers the location services is not available unless proto is https 


# Simulation

TODO Use [SimPy](https://simpy.readthedocs.io/en/latest/) to simulate users?

