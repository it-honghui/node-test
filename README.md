# node-test

- address-generation
- coin-wallet
- ecrecover
- graphql
- graphql-express
- merkletreejs-solidity
- metacoin
- subgraph
  - nft-market
  - opensea
- truffle-init
- vue-test
- vue-test2
- web3-test

---

> 配置和取消配置git代理
```shell
git config --global http.proxy 'http://127.0.0.1:7890'
git config --global https.proxy 'https://127.0.0.1:7890'

git config --global http.proxy 'socks5://127.0.0.1:7891'
git config --global https.proxy 'socks5://127.0.0.1:7891'

git config -l --global

git config --global --unset http.proxy
git config --global --unset https.proxy

```

> npm和yarn的源、代理设置和代理取消
```shell
npm config set registry http://registry.npm.taobao.org/
npm config set registry https://registry.npmjs.org/

yarn config set registry http://registry.npm.taobao.org/
yarn config set registry https://registry.npmjs.org/

npm config set proxy http://127.0.0.1:7890
npm config set https-proxy http://127.0.0.1:7890

npm config delete proxy
npm config delete https-proxy

yarn config set proxy http://127.0.0.1:7890
yarn config set https-proxy http://127.0.0.1:7890

yarn config delete proxy
yarn config delete https-proxy

```