# subgraph

## 一、概念
- indexer-索引人：提供服务器、数据库（PostgreSQL/Postgres）用来运行开发者开发的子图（爬虫程序，通过和主链交互，通过监听区块链的event事件、call调用，爬取特定合约的交易数据然后保存到本地供用户查询）。消费者需要向indexer支付相应的查询费用，以token (GRT)支付，另外还每年会有3%的通胀平均分配给indexer，如果查询的数据不真实，indexer质押的GRT会被扣除一部分作为惩罚（法官的角色来判断）。类似以太坊（POS）中以后的一个个节点。成为indexer节点需要质押10W GRT （可以获得收益，可以自定义私有链RPC）。
- delegate-委托人：类似以太坊中，有以太币，不想运行节点，但是想获得运行节点的收益，就可以把你的以太币质押给以太坊的节点的这样一种角色。买了GRT并进行质押给indexer的用户。
- Curator-策展人：判断相应子图质量的高低，可以对感兴趣的子图进行质押，之后该子图才能被indexer索引到开始扫描。
- 开发者：开发子图（绑定合约），部署到IFPS（需要上链）。存入GRT，成为策展人、委托人，拿到 key，请求API。

## 二、子图工作室
> 只支持以太主网和rinkeby测试网，发布子图需要上链消耗ETH，通过质押GRT，可以将自己发布的子图被indexer（扫快服务）索引到。提供测试API，测试完毕后发布子图子图浏览器，可以通过颁发key（用于计费）提供他人查询，可以得到GRT token代币奖励。
1. 安装 Graph CLI
```shell
# NPM
npm install -g @graphprotocol/graph-cli
# Yarn
yarn global add @graphprotocol/graph-cli
```
2. 初始化你的子图（获取abi失败，手动添加abi文件路径）
```shell
graph init --studio opensea-subgraph

graph init \
  --product subgraph-studio
  --from-contract <CONTRACT_ADDRESS> \
  [--network <ETHEREUM_NETWORK>] \
  [--abi <FILE>] \
  <SUBGRAPH_SLUG> [<DIRECTORY>]
```
3. 编写你的子图
- 清单（subgraph.yaml）--清单定义了您的子图将索引哪些数据源。
- 模式（schema.graphql）--GraphQL 模式定义了你希望从子图中获取哪些数据。
- AssemblyScript 映射（mapping.ts）--这是将数据源中的数据转换为模式中定义的实体的代码。
4. 部署到子图工作室
```shell
graph codegen
graph build
```
5. 认证并部署你的子图。部署密钥可以在 Subgraph Studio 的 Subgraph 页面上找到
```shell
graph auth --studio <DEPLOY_KEY>
graph deploy --studio <SUBGRAPH_SLUG>
```
> 你将被要求提供一个版本标签。强烈建议使用以下惯例来命名你的版本。例如：0.0.1, v1, version1

6.检查你的日志

## 三、托管服务(hosted service)
> 支持更多的网络：mainnet、kovan、rinkeby、ropsten、goerli、poa-core、poa-sokol、xdai、near-mainnet、near-testnet、matic、mumbai、fantom、bnb、chapel、clover、avalanche、fuji、celo、celo-alfajores、fuse、moonriver、mbase、arbitrum-one、arbitrum-rinkeby、optimism、optimism-kovan、aurora、aurora-testnet

> 缺点：需要定期查询，否则30天会被删除，必须重新部署子图才能重新被索引到。(pancakeswap 用的是托管服务)

> pancakeswap: https://github.com/pancakeswap/pancake-subgraph 
> https://thegraph.com/hosted-service/subgraph/pancakeswap/nft-market
> https://api.thegraph.com/subgraphs/name/pancakeswap/nft-market/graphql
1. 安装 Graph CLI
```shell
# NPM
npm install -g @graphprotocol/graph-cli
# Yarn
yarn global add @graphprotocol/graph-cli
```
yarn install 如果报错失败 配置git代理
```shell
git config --global http.proxy 'http://127.0.0.1:7890'
git config --global https.proxy 'https://127.0.0.1:7890'
git config -l --global
```
2.初始化你的子图
```shell
graph init --product hosted-service --from-contract <Address>
graph init --product hosted-service --from-example
```
> 你会被要求提供一个子图的名称。其格式为 <Github>/<Subgraph Name>. 例如: graphprotocol/examplesubgraph

3. 编写你的子图
- 清单（subgraph.yaml）--清单定义了您的子图将索引哪些数据源。
- 模式（schema.graphql）--GraphQL 模式定义了你希望从子图中获取哪些数据。
- AssemblyScript 映射（mapping.ts）--这是将数据源中的数据转换为模式中定义的实体的代码。
4. 部署你的子图
- 使用你的 github 账户登录 托管服务
- 点击添加子图，并填写所需信息。使用与第 2 步中相同的子图名称。
- 在子图文件夹中运行 codegen
```shell
npm run codegen
# Yarn
yarn codegen
```
5.添加你的访问令牌并部署你的子图。访问令牌可以在你的仪表板上的托管服务中找到
```shell
graph auth --product hosted-service <ACCESS_TOKEN>
graph deploy --product hosted-service <GITHUB_USER>/<SUBGRAPH NAME>
```
6.检查你的日志
7.查询你的子图

## 四、Graph Node 本地搭建
> 可以通过搭建 Graph Node 节点来索引，扫描自定义的私链或公链，然后将开发的子图部署到私有 Graph Node 节点即可

1. 搭建 graph-node
   出于便捷的考虑，我们使用官方提供的 docker compose 来进行节点、数据库、IPFS 的部署。
- 克隆 graph node( https://github.com/graphprotocol/graph-node/ )代码
- 进入 docker 目录
- 将 docker-compose.yml 中 ethereum 字段的值改为需要连接链的节点连接信息。

```yaml
version: '3'
services:
   graph-node:
      image: graphprotocol/graph-node
      ports:
         - '8000:8000'
         - '8001:8001'
         - '8020:8020'
         - '8030:8030'
         - '8040:8040'
      depends_on:
         - ipfs
         - postgres
      environment:
         postgres_host: postgres
         postgres_user: graph-node
         postgres_pass: let-me-in
         postgres_db: graph-node
         ipfs: 'ipfs:5001'
         ethereum: 'bsc:https://bsc-dataseed1.binance.org'
         RUST_LOG: info
         GRAPH_LOG: info
   ipfs:
      image: ipfs/go-ipfs:v0.4.23
      ports:
         - '5001:5001'
      volumes:
         - ./data/ipfs:/data/ipfs
   postgres:
      image: postgres
      ports:
         - '5432:5432'
      command: ["postgres", "-cshared_preload_libraries=pg_stat_statements"]
      environment:
         POSTGRES_USER: graph-node
         POSTGRES_PASSWORD: let-me-in
         POSTGRES_DB: graph-node
      volumes:
         - ./data/postgres:/var/lib/postgresql/data

```

> 注意： graph-node 连接的节点需要开启 archive 模式（启动节点时，添加 flag --syncmode full --gcmode archive）。

2. graph-node 启动

直接使用 docker compose 来进行启动

```bash
docker-compose -f docker-compose.yml up -d
```

3. 部署开发的子图
```bash
graph deploy --node http://localhost:8020/ --ipfs http://localhost:5001 it-wwh/nft-market
```

---
[参考文档](https://thegraph.com/docs/zh/)