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
    
Open [mobz:4200](mobz:4200)


# Server

Built with [golang](https://golang.org/) 

Location service uses a modified version of 
[gorilla websocket chat example](https://github.com/gorilla/websocket/tree/master/examples/chat) 

[Simple Golang HTTPS/TLS Server](https://gist.github.com/denji/12b3a568f092ab951456#simple-golang-httpstls-server)

Self signed cert instructions for OSX last updated 2017-06-16,
the procedure for this seems to change a lot with OSX and or Chrome updates

    cd mobz/server
    
    openssl genrsa -out mobz.key 2048
    
    # Common and alt names must be the same, use "mobz" 
    openssl req -x509 -nodes -new -sha256 -days 3650 \
    -key mobz.key \
    -out mobz.crt \
    -subj /CN=mobz \
    -reqexts SAN -extensions SAN \
    -config <(cat /System/Library/OpenSSL/openssl.cnf \
        <(printf '[SAN]\nsubjectAltName=DNS:mobz'))
    
    sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain mobz.crt
    
    # Delete certiciface by common name
    sudo security delete-certificate -c mobz
    
Setup hosts file
    
    sudo vi /etc/hosts
    
    127.0.0.1 mobz

Run the server 

    cd mobz/server
    
    go run *.go
    
    # Run with live reload
    make serve

Open [https://mobz:4100](https://mobz:4100),
web browser should not complain about the self-signed cert

In newer browsers the location services is not available unless proto is https
 
## Test

Unit tests for [gorilla/mux](http://stackoverflow.com/a/34456848/639133)


# Simulation

TODO Use [SimPy](https://simpy.readthedocs.io/en/latest/) to simulate users?


# Proxy

For testing from mobile device

Use [charles](https://www.charlesproxy.com) as reverse proxy

    Proxy > SSL Proxying Settings...
    
    Host    mobz
    Port    4300
    
    Proxy > Port Forwarding...
    
    Start Port      4300
    Remote Host     mobz
    Remote Port     4100

TODO Use [nginx reverse proxy](https://www.nginx.com/resources/glossary/reverse-proxy-server/)

    brew install nginx # if not installed already

Setup iOS to use the proxy

    Wifi > HTTP PROXY > Manual
    
    Server          192.168.1.102 # Use your own local IP
    Port            8888
    Authentication  False

Open [charles cert](http://www.charlesproxy.com/getssl) on iOS 
and install Charles certificate

Open [https://mobz:4300](https://mobz:4300)


# Database

To setup database run `db/*.sql` in date order


# Hosting

## [nginx](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04)

Install 

    sudo apt-get update
    sudo apt-get install nginx
    
Stat

    systemctl status nginx
    
Config
    
    cat /etc/nginx/sites-enabled/default 
    
Reload 
    
    sudo systemctl reload nginx
    
[Virtual host](https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-server-blocks-virtual-hosts-on-ubuntu-16-04)


