package errors

import "errors"

type Error struct {
	Name string
	Err  error
}


var ErrBucketNotExists = errors.New("bucket not exists")

var ErrUserNotFound = errors.New("user not found")



