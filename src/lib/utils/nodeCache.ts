import NodeCache from "node-cache";

declare global {
  // eslint-disable-next-line no-var
  var nodeCacheInstance: NodeCache | undefined;
}

const nodeCache = global.nodeCacheInstance ?? new NodeCache();

if (!global.nodeCacheInstance) {
  global.nodeCacheInstance = nodeCache;
}

export default nodeCache;
