package auth

type AdminUserRequest struct {
	InitPassword string `json:"initPassword" validate:"required"`
	Username     string `json:"username" validate:"required"`
	Password     string `json:"password" validate:"required"`
}

type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type GetAdminPasswordRequest struct {
	InitPassword string `json:"initPassword" validate:"required"`
	Username     string `json:"username" validate:"required"`
}
