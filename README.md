# aws-summit-stockholm-demo

TODO: description

## Architecture

TODO: add architecture

## Code walkthrough

TODO: add notable points about the code

## Setup

Required: Node.js 14

To install dependencies:

```bash
$ npm install
```

AWS credentials need to be configured in your local environment.

## Commands

### `npm run start`

Starts the local Lambda development environment.

### `npm run test:integration`

Runs the integration tests that test against live AWS services.

### `npm run build`

Build your app and synthesize your stacks.

Generates a `.build/` directory with the compiled files and a `.build/cdk.out/` directory with the synthesized CloudFormation stacks.

### `npm run deploy [stack]`

Deploy all your stacks to AWS. Or optionally deploy a specific stack.

### `npm run remove [stack]`

Remove all your stacks and all of their resources from AWS. Or optionally remove a specific stack.

## About Plain

We’re building the fastest way to provide amazing customer service. A tool that comes with modern defaults, an opinionated workflow and a lightning-fast UI — all backed by our powerful API.

Our vision is to build the go-to customer service infrastructure for the companies of the next decade.

Interested in using Plain or joining us on our mission? Check out [www.plain.com](https://www.plain.com)!

## More Serverless Stack Documentation

Learn more about the Serverless Stack.

- [Docs](https://docs.serverless-stack.com)
- [@serverless-stack/cli](https://docs.serverless-stack.com/packages/cli)
- [@serverless-stack/resources](https://docs.serverless-stack.com/packages/resources)
