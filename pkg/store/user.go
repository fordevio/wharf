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

package store

import (
	"encoding/json"
	"log"

	bolt "go.etcd.io/bbolt"

	"github.com/wharf/wharf/pkg/errors"
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

func CreateUser(user *models.User) (*models.User, error) {
	db, err := helpers.OpenStore()
	if err != nil {
		return nil, err
	}
	defer db.Close()
	err = db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("users"))
		if b == nil {
			return errors.ErrBucketNotExists
		}
		id, _ := b.NextSequence()
		user.ID = int(id)
		buf, err := json.Marshal(user)
		if err != nil {
			return err
		}
		return b.Put(helpers.Itob(user.ID), buf)
	})
	return user, err
}

func UpdateUser(user *models.User) (*models.User, error) {
	db, err := helpers.OpenStore()
	if err != nil {
		return nil, err
	}
	defer db.Close()
	err = db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("users"))
		if b == nil {
			return errors.ErrBucketNotExists
		}
		v := b.Get(helpers.Itob(user.ID))
		if v == nil {
			return errors.ErrUserNotFound
		}
		buf, err := json.Marshal(user)
		if err != nil {
			return err
		}
		return b.Put(helpers.Itob(user.ID), buf)

	})
	return user, err
}

func DeleteUser(id int) error {
	db, err := helpers.OpenStore()
	if err != nil {
		return err
	}
	defer db.Close()
	err = db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("users"))
		if b == nil {
			return errors.ErrBucketNotExists
		}
		v := b.Get(helpers.Itob(id))
		if v == nil {
			return errors.ErrUserNotFound
		}

		return b.Delete(helpers.Itob(id))

	})
	return err
}

func GetUserByID(id int) (*models.User, error) {
	db, err := helpers.OpenStore()
	if err != nil {
		return nil, err
	}
	var user models.User
	defer db.Close()
	err = db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("users"))
		if b == nil {
			return errors.ErrBucketNotExists
		}
		v := b.Get(helpers.Itob(id))
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
		return nil, err
	}
	defer db.Close()
	var users []*models.User
	err = db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("users"))
		if b == nil {
			return errors.ErrBucketNotExists
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
		return nil, err
	}
	defer db.Close()
	var adminUser *models.User
	err = db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("users"))
		if b == nil {
			return errors.ErrBucketNotExists
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

func GetUserByUsername(username string) (*models.User, error) {
	db, err := helpers.OpenStore()
	if err != nil {
		return nil, err
	}
	defer db.Close()
	var finUser *models.User
	err = db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("users"))
		if b == nil {
			return errors.ErrBucketNotExists
		}
		err = b.ForEach(func(_, v []byte) error {
			var user models.User
			err = json.Unmarshal(v, &user)
			if err != nil {
				return err
			}
			if *user.Username == username {
				finUser = &user
			}
			return nil
		})
		return err

	})
	return finUser, err

}
