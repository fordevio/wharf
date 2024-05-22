package cache

func New(size int) *LRUCache {
	return &LRUCache{
		maxSize: size,
		items:   make(map[string]*Node),
		list:    NewList(),
	}
}

func (l *LRUCache) Get(key string) interface{} {
	node := l.get(key)
	if node == nil {
		return nil
	}

	defer func() {
		l.list.MoveFront(node)
	}()

	ele := node.Value.(*KVPair)
	return ele.value
}

func (l *LRUCache) Set(key string, value interface{}) interface{} {
	node := l.get(key)
	if node != nil {
		l.mutex.Lock()
		defer l.mutex.Unlock()
		node.Value.(*KVPair).value = value
		l.list.MoveFront(node)
		return nil
	}

	tail := new(Node)

	if l.list.Length() == l.maxSize {
		tail = l.list.RemoveTail()
		delete(l.items, key)
	}

	l.mutex.Lock()
	defer l.mutex.Unlock()
	node = l.list.Unshift(&KVPair{key, value})
	l.items[key] = node

	if tail.Value == nil {
		return nil
	}

	return tail.Value.(*KVPair).value

}

func (l *LRUCache) Invalidate(key string) {
	l.mutex.Lock()
	defer l.mutex.Unlock()

	node, exists := l.items[key]
	if !exists {
		return
	}
	l.list.Remove(node)
	delete(l.items, key)
}

func (l *LRUCache) get(key string) *Node {
	l.mutex.RLock()
	defer l.mutex.RUnlock()

	node, exists := l.items[key]
	if !exists {
		return nil
	}
	return node
}
