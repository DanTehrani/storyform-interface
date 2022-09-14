# Contributing

Thank you for considering contributing to Storyform!

## We welcome various kinds of contributions

Storyform is an open soruce project and we love to receive contributions from the community. There are many ways to contribute, from working on issues to writing blog posts, improving the documentation or translations.

## Development

Install dependencies:

```
yarn
```

Start development server:

```
yarn dev
```

### About the dev gateway

***TL;DR***

- The gateway pays the fees to upload content to Arweave.
- First, you need to create a form on [storyform.xyz](https://www.notion.so/dantehrani/storyform.xyz).
- Then in your local dev environment, login with the same account you used to create the form.
- There is no way to ***write*** data from your local dev environment. You can read data, and ***only simulate write requests***.

In development mode, the frontend will connect to the gateway at [dev.gateway.storyform.xyz](https://dev.gateway.storyform.xyz/).
The gateway is responsible for uploading data to Arweave and paying the fees through the Bundlr Network.

[The dev gateway](https://dev.gateway.storyform.xyz/) proxies requests to a Bundlr node at devnet.bundlr.network, which is a node in the [Bundlr Devnet](https://docs.bundlr.network/docs/devnet). The Bundlr Devnet is essentially a read-only network; you can simulate write requests, but the content WON'T be uploaded to Arwevae. (The content will be written to the Bundlr Devent, but as of today, there is no way to query the data.)

Therefore you need to create a form in [storyform.xyz](http://storyform.xyz) and refer to that form in your dev environment.
## Finding an issue to work on

- You can go to our [issues page](https://github.com/DanTehrani/storyform-interface/issues) to look for something to work on.
