// Copyright 2025 The wharf Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
