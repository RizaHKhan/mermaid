# Mermaid

## Introduction

[Mermaid](https://mermaid.js.org/) allows users to create diagrams via code. In this case, we are using Docker to spin up an Express server which will allow us to create diagrams.

The hope is to get the infrastructure needed to create these diagrams up and running as quickly as possible.

## Installation

```
git clone git@github.com:RizaHKhan/mermaid.git
cd mermaid
docker compose up
```

## Usage

After the server has started via Docker you can begin creating the diagrams in the `/diagrams` folder. Naming convention matters here so lowercase names are required (ie, `foobar.md`).

This is because you will then visit `http://localhost:8003/foobar` in order to see the diagram in the browser. You can add more files as needed and visit their respective URL.

See the [foobar](./diagrams/foobar.md) example file for syntax. 

## Enhancements

- [ ] HOT reload the diagrams as changed (currently users will have to manually refresh the page).
- [ ] Add tests
