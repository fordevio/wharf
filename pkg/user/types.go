package user

import "github.com/wharf/wharf/pkg/models"

type CreateUserRequest struct {
	Username   string            `json:"username" validate:"required"`
	Password   string            `json:"password" validate:"required"`
	Permission models.Permission `json:"permission" validate:"required"`
}

type UpdateUserRequest struct {
	Username   string            `json:"username" validate:"required"`
	Password   string            `json:"password" validate:"required"`
	Permission models.Permission `json:"permission" validate:"required"`
}
