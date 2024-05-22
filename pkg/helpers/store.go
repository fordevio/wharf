package helpers

import (
	"encoding/binary"
	"time"

	bolt "go.etcd.io/bbolt"
)

const dbPath = "/var/lib/wharf/.db"
func Itob(v int)[]byte {
	b := make([]byte , 8)
	binary.BigEndian.PutUint64(b, uint64(v))
	return b
}

func OpenStore() (*bolt.DB,error) {
    db,err := bolt.Open(dbPath, 0600, &bolt.Options{Timeout: 1 * time.Second})
	if err != nil{
		return nil, err
	}
	return db, nil
}