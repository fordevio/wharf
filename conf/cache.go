package conf

import "github.com/wharf/wharf/pkg/cache"

var Cache *cache.LRUCache

func InitCache() {
	Cache = cache.New(10)
}
