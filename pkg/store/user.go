package store

import (
	"encoding/json"
	"log"

	bolt "go.etcd.io/bbolt"

	"github.com/wharf/wharf/pkg/helpers"
	"github.com/wharf/wharf/pkg/models"
)

func InitStore() {
	db, err := helpers.OpenStore()
	if err != nil {
		log.Panicln(err)
	}
	defer db.Close()
	err = db.Update(func(tx *bolt.Tx) error {
		_, err := tx.CreateBucketIfNotExists([]byte("users"))
		if err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		log.Panicln(err)
	}
}

func CreateUser(user *models.User) error {
	db, err := helpers.OpenStore()
	if err != nil {
		log.Panicln(err)
	}
	defer db.Close()
	err = db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("users"))
		if b == nil {
			return ErrBucketNotExists
		}
		id, _ := b.NextSequence()
		user.ID = int(id)
		buf, err := json.Marshal(user)
		if err != nil {
			return err
		}
		return b.Put(helpers.Itob(user.ID), buf)
	})
	return err
}

func UpdateUser(user *models.User) error {
	db, err := helpers.OpenStore()
	if err != nil {
		log.Panicln(err)
	}
	defer db.Close()
	err = db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("users"))
		if b == nil {
			return ErrBucketNotExists
		}
		v := b.Get([]byte(helpers.Itob(user.ID)))
		if v == nil {
			return ErrUserNotFound
		}
		buf, err := json.Marshal(user)
		if err != nil {
			return err
		}
		return b.Put(helpers.Itob(user.ID), buf)

	})
	return err
}

func DeleteUser(id int) error {
	db, err := helpers.OpenStore()
	if err != nil {
		log.Panicln(err)
	}
	defer db.Close()
	err = db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("users"))
		if b == nil {
			return ErrBucketNotExists
		}
		v := b.Get([]byte(helpers.Itob(id)))
		if v == nil {
			return ErrUserNotFound
		}

		return b.Delete([]byte(helpers.Itob(id)))

	})
	return err
}

func GetUserById(id int) (*models.User, error) {
	db, err := helpers.OpenStore()
	if err != nil {
		log.Panicln(err)
	}
	var user models.User
	defer db.Close()
	err = db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("users"))
		if b == nil {
			return ErrBucketNotExists
		}
		v := b.Get([]byte(helpers.Itob(id)))
		err = json.Unmarshal(v, &user)
		if err != nil {
			return err
		}
		return nil
	})
	return &user, err
}

func GetAllUsers() ([]*models.User, error) {
	db, err := helpers.OpenStore()
	if err != nil {
		log.Panicln(err)
	}
	var users []*models.User
	err = db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("users"))
		if b == nil {
			return ErrBucketNotExists
		}
		err = b.ForEach(func(_, v []byte) error {
			var user models.User
			err = json.Unmarshal(v, &user)
			if err != nil {
				return err
			}
			users = append(users, &user)
			return nil
		})
		return nil
	})
	return users, err
}

func GetAdminUser() (*models.User, error) {
	db, err := helpers.OpenStore()
	if err != nil {
		log.Panicln(err)
	}
	var adminUser *models.User
	err = db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("users"))
		if b == nil {
			return ErrBucketNotExists
		}

		err = b.ForEach(func(_, v []byte) error {
			var user models.User
			err = json.Unmarshal(v, &user)
			if err != nil {
				return err
			}
			if user.IsAdmin {
				adminUser = &user
			}

			return nil
		})
		return err

	})
	return adminUser, err
}
