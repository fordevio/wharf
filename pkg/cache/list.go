package pkg

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

	tail := l.root.prev
	l.isolate(tail)
	return tail
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
