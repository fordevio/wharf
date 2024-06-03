package auth

import (
	"regexp"

	"github.com/go-playground/validator/v10"
)

func PasswordValidation(fl validator.FieldLevel) bool {
	password := fl.Field().String()

	// Check length
	if len(password) < 8 || len(password) > 20 {
		return false
	}

	// Check if contains at least one letter and one number
	letter := regexp.MustCompile(`[a-zA-Z]`).MatchString
	number := regexp.MustCompile(`[0-9]`).MatchString

	return letter(password) && number(password)
}
