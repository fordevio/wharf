package types

type Error struct {
	Name string 
	Err error 
	Panic bool
}