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

var (
	ErrInvalidIndex = "invalid positional index"
)

func NewList() *DoublyLinkedList {
	l := new(DoublyLinkedList)
	l.root.next = &l.root
	l.root.prev = &l.root
	l.len = 0
	return l
}

func (l *DoublyLinkedList) Length() int {
	return l.len
}

func (l *DoublyLinkedList) Unshift(val interface{}) *Node {
	defer func() { l.len++ }()
	newNode := &Node{
		Value: val,
		next:  l.root.next,
		prev:  &l.root,
	}

	l.root.next = newNode
	newNode.next.prev = newNode
	return newNode
}

func (l *DoublyLinkedList) RemoveTail() *Node {
	return l.Remove(l.root.prev)
}

func (l *DoublyLinkedList) Remove(node *Node) *Node {
	defer func() {
		l.len--
	}()

	l.isolate(node)
	return node
}

func (l *DoublyLinkedList) isolate(node *Node) {
	node.next.prev = node.prev
	node.prev.next = node.next
	node.next, node.prev = nil, nil
}

func (l *DoublyLinkedList) MoveFront(node *Node) {
	currentFront := l.root.next
	node.prev = &l.root
	l.root.next = node
	currentFront.prev = node
	node.next = currentFront
}

func (l *DoublyLinkedList) Head() *Node {
	return l.root.next
}

func (l *DoublyLinkedList) Tail() *Node {
	return l.root.prev
}
