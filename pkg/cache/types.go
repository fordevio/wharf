package cache

import "sync"

type LRUCache struct {
	list    *DoublyLinkedList
	items   map[string]*Node
	maxSize int
	mutex   sync.RWMutex
}

type KVPair struct {
	key   string
	value interface{}
}

type DoublyLinkedList struct {
	len  int
	root Node
}

type Node struct {
	prev  *Node
	next  *Node
	Value interface{}
}
