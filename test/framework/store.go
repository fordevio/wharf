package framework

import (
	"github.com/wharf/wharf/conf"
	"github.com/wharf/wharf/pkg/models"
	"github.com/wharf/wharf/pkg/store"
	"k8s.io/utils/ptr"
)

func InitAdminUser() {
	conf.InitDir()
	conf.InitPassword()
	_, _ = store.CreateUser(&models.User{
		Username:   ptr.To("admin"),
		Password:   ptr.To("1234Admin"),
		IsAdmin:    true,
		Permission: models.Execute,
	})
}
